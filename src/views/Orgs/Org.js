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
// var moment = require('moment')
import { connect } from 'react-redux'
import { deleteOrg } from 'variables/dataOrgs';
import OrgUsers from 'views/Orgs/OrgCards/OrgUsers';
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites';
class Org extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			users: [],
			loading: true,
			loadingUsers: true,
			openDelete: false
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.componentDidMount()
		}
		if (this.props.saved === true) {
			const { org } = this.state
			if (this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.saved', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.removed', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
			}
		}
	}

	componentDidMount = async () => {
		const { match, setHeader, location, history } = this.props
		if (match)
			if (match.params.id) {
				await getOrg(match.params.id).then(async rs => {
					if (rs === null)
						history.push('/404')
					else {
						let prevURL = location.prevURL ? location.prevURL : '/management/orgs'
						setHeader('orgs.organisation', true, prevURL, 'users')
						this.setState({ org: rs, loading: false })
					}
				})
				await getOrgUsers(this.props.match.params.id).then(rs => {
					this.setState({ users: rs, loadingUsers: false })
				})
			}
	}
	addToFav = () => {
		const { org } = this.state
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: this.props.match.url }
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { org } = this.state
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: this.props.match.url }
		this.props.removeFromFav(favObj)
	}
	close = () => {
		this.snackBarMessages(1)
		this.props.history.push('/management/orgs')
	}
	handleDeleteOrg = async () => {
		await deleteOrg(this.state.org.id).then(rs => {
			this.setState({
				openDelete: false
			})
			this.close()
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
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.delete.title.org')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.org')}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={this.handleDeleteOrg} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.orgDeleted')
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
							isFav={this.props.isFav({ id: org.id, type: 'org' })}
							addToFav={this.addToFav}
							removeFromFav={this.removeFromFav}
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
							org={org}
							users={this.state.users ? this.state.users : []}
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
	accessLevel: state.settings.user.privileges,
	saved: state.favorites.saved
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(userStyles)(Org))
