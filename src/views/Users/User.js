import React, { Component, Fragment } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import UserContact from './UserCards/UserContact';
import { UserLog } from './UserCards/UserLog';
import { userStyles } from 'assets/jss/components/users/userStyles';
import { withStyles, /* , Typography, Grid, Hidden */ 
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button, 
	Snackbar } from '@material-ui/core';
import { getUser, deleteUser } from 'variables/dataUsers';
// var moment = require("moment")

class User extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
			user: null,
			loading: true,
			openSnackbar: 0,
			openDelete: false
	  }
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.match && this.props.match.params)
			if (prevProps.match.params.id !== this.props.match.params.id)
			  	{this.setState({ loading: true })
				this.componentDidMount()}
	}
	
	componentDidMount = () => {
		if (this.props.match)
		{	if (this.props.match.params.id) {
			this.timer = setTimeout(async () => await getUser(this.props.match.params.id).then(async rs => {
				if (rs.id === null)
					this.props.history.push('/404')
				else {
					this.props.setHeader(`${rs.firstName} ${rs.lastName}`, true, '/users', "users")
					this.setState({ user: rs, loading: false })
				}
			}))
		}}
		else {
			this.props.history.push('/404')
		}
	}
	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleDeleteUser = async () => {
		await deleteUser(this.state.user.id).then(rs => {
			return rs ? this.setState({ openSnackbar: 1, openDelete: false }) : null;
		})
	}
	snackBarMessages = () => {
		const { t } = this.props
		let msg = this.state.openSnackbar
		switch (msg) {
			case 1:
				return t("snackbars.userDeleted", { user: this.state.user.firstName + " " + this.state.user.lastName })
			default:
				break
		}
	}
	closeSnackBar = () => {
		if (this.state.openSnackbar === 1) {
			this.setState({ openSnackbar: 0 }, () => this.redirect())
		}
		else
			this.setState({ openSnackbar: 0 })
	}
	redirect = () => {
		setTimeout(() => this.props.history.push('/users'), 1000)
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
			<DialogTitle id="alert-dialog-title">{t("users.userDelete")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("users.userDeleteConfirm", { user: (this.state.user.firstName + " " + this.state.user.lastName) }) + "?"}
				</DialogContentText>

			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color="primary">
					{t("actions.cancel")}
				</Button>
				<Button onClick={this.handleDeleteUser} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}

	render() {
		const { classes, t } = this.props
		const { user, loading } = this.state
		const rp = { history: this.props.history, match: this.props.match }
		return (
			loading ? <CircularLoader /> : <Fragment>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} noMargin>
						<UserContact
							t={t}
							user={user}
							classes={classes}
							deleteUser={this.handleOpenDeleteDialog}
							{...rp} />
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<UserLog t={t} user={user}/>	
					</ItemGrid>
				</GridContainer>
				{this.renderDeleteDialog()}
				<Snackbar
					autoHideDuration={1000}
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					open={this.state.openSnackbar !== 0 ? true : false}
					onClose={this.closeSnackBar}
					message={
						<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
							{this.snackBarMessages()}
						</ItemGrid>
					}
				/>
			</Fragment>
		)
	}
}

export default withStyles(userStyles)(User)
