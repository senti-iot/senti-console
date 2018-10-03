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
} from '@material-ui/core';
import { getOrg, getOrgUsers } from 'variables/dataOrgs';
import OrgDetails from './OrgCards/OrgDetails';
// var moment = require("moment")
import { connect } from 'react-redux'
import { deleteOrg } from '../../variables/dataOrgs';
import OrgUsers from 'views/Orgs/OrgCards/OrgUsers';

class Org extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			users: [],
			loading: true,
			loadingUsers: true,
			openDelete: false,
			openSnackbar: 0
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.componentDidMount()
		}
	}

	componentDidMount = async () => {
		if (this.props.match)
			if (this.props.match.params.id) {
				await getOrg(this.props.match.params.id).then(async rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.props.setHeader(`${rs.name}`, true, '/orgs', "users")
						this.setState({ org: rs, loading: false })
					}
				})
				await getOrgUsers(this.props.match.params.id).then(rs => {
					this.setState({ users: rs, loadingUsers: false })
				})
			}
	}
	handleDeleteOrg = async () => {
		await deleteOrg(this.state.org.id).then(rs => {
			this.setState({
				openSnackbar: 1,
				openDelete: false
			}, () => this.props.history.push('/orgs'))
			
		})
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
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
			<DialogTitle id="alert-dialog-title">{t("orgs.orgDelete")}</DialogTitle>
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
		const { s } = this.props
		let msg = this.state.openSnackbar
		switch (msg) {
			case 1:
				s("snackbars.orgDeleted")
				break
			default:
				break
		}
	}

	render() {
		const { classes, t, history, match, language } = this.props
		const { org, loading, loadingUsers } = this.state
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
							accessLevel={this.props.accessLevel} />
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						{!loadingUsers ? <OrgUsers
							t={t}
							users={this.state.users ? this.state.user : []}
							history={history}
						/> :
							<CircularLoader notCentered />}
					</ItemGrid>
				</GridContainer>
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
