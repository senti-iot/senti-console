import React, { Component, Fragment } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import { userStyles } from 'assets/jss/components/users/userStyles';
import {
	withStyles, /* , Typography, Grid, Hidden */
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Snackbar,
} from '@material-ui/core';
import { getOrg } from 'variables/dataUsers';
import OrgDetails from './OrgCards/OrgDetails';
// var moment = require("moment")
import { connect } from 'react-redux'
import { deleteOrg } from '../../variables/dataOrgs';

class Org extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			loading: true,
			openDelete: false,
			openSnackbar: 0
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.componentDidMount()
		}
	}

	componentDidMount = () => {
		if (this.props.match)
			if (this.props.match.params.id) {
				this.timer = setTimeout(async () => await getOrg(this.props.match.params.id).then(async rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.props.setHeader(`${rs.name}`, true, '/orgs', "users")
						this.setState({ org: rs, loading: false })
					}
				}))
			}
	}
	handleDeleteOrg = async () => {
		await deleteOrg(this.state.org.id).then(rs => {
			this.setState({
				openSnackbar: 1,
				openDelete: false
			})
		})
	}
	redirect = () => {
		setTimeout(() => {
			this.setState({ openSnackbar: 3 })
			setTimeout(() => this.props.history.push('/orgs'), 1e3)
		}, 2e3)

	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	closeSnackBar = () => {
		if (this.state.openSnackbar === 1) {
			this.setState({ openSnackbar: 0 }, () => this.redirect())
		}
		else
			this.setState({ openSnackbar: 0 })
	}

	renderDeleteDialog = () => {
		const { openDelete } = this.state
		const { t } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("projects.projectDelete")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("orgs.orgDeleteConfirm", { org: this.state.org.name }) + "?"}
				</DialogContentText>

			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color="primary">
					{t("actions.cancel")}
				</Button>
				<Button onClick={this.handleDeleteOrg} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}
	snackBarMessages = () => {
		const { t } = this.props
		let msg = this.state.openSnackbar
		switch (msg) {
			case 1:
				return t("snackbars.orgDeleted")
			case 3:
				return t("snackbars.redirect")
			default:
				break
		}
	}
	renderSnackBar = () => <Snackbar
		autoHideDuration={3000}
		anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		open={this.state.openSnackbar !== 0 ? true : false}
		onClose={() => {
			if (this.state.openSnackbar === 1)
				this.closeSnackBar()
			else
				this.setState({ openSnackbar: 0 })
		}}
		message={
			<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
				{this.snackBarMessages()}
			</ItemGrid>
		}
	/>
	render() {
		const { classes, t, history, match, language } = this.props
		const { org, loading } = this.state
		return (
			loading ? <CircularLoader /> : <Fragment>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} noMargin>
						<OrgDetails
							deleteOrg={this.handleOpenDeleteDialog}
							match={match}
							history={history}
							classes={classes}
							t={t}
							org={org}
							language={language}
							accessLevel={this.props.accessLevel}/>
					</ItemGrid>
				</GridContainer>
				{this.renderSnackBar()}
				{this.renderDeleteDialog()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	language: state.localization.language,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(userStyles)(Org))
