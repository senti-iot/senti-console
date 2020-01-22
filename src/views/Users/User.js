import React, { Component } from 'react'
import { GridContainer, ItemGrid, CircularLoader, ItemG, TextF, Danger } from 'components';
import UserContact from './UserCards/UserContact';
import { UserLog } from './UserCards/UserLog';
import {
	withStyles, /* , Typography, Grid, Hidden */
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Fade
} from '@material-ui/core';
import { deleteUser, resendConfirmEmail, confirmUser } from 'variables/dataUsers';
import { connect } from 'react-redux'
import { setPassword } from 'variables/dataLogin';
import { userStyles } from 'assets/jss/components/users/userStyles';
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites';
import { Person, FolderShared } from 'variables/icons';
import { scrollToAnchor } from 'variables/functions';
import { getUserLS } from 'redux/data';

class User extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openSnackbar: 0,
			openDelete: false,
			openConfirm: false,
			openChangePassword: false,
			openResendConfirm: false,
			pw: {
				current: '',
				newP: '',
				confirm: ''
			},
			changePasswordError: false,
			errorMessage: ''
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.match && this.props.match.params) {
			if (prevProps.match.params.id !== this.props.match.params.id) {
				this.componentDidMount()
			}
		}
		if (this.props.saved === true) {
			const { user } = this.props
			if (this.props.isFav({ id: user.id, type: 'user' })) {
				this.props.s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: user.id, type: 'user' })) {
				this.props.s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
				this.props.finishedSaving()
			}
		}
	}
	addToFav = () => {
		const { user } = this.props
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { user } = this.props
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}
	tabs = () => {
		const { t } = this.props
		return [
			{ id: 0, title: t('tabs.details'), label: <Person />, url: `#contact` },
			{ id: 1, title: t('tabs.userHistory'), label: <FolderShared />, url: `#log` },
		]
	}
	getUser = async id => {
		const { getUser } = this.props
		await getUser(id)
	}
	componentDidMount = async () => {
		const { match, setHeader, history, location, setBC, setTabs } = this.props
		if (match) {
			if (match.params.id) {
				await this.getUser(match.params.id).then(() => {
					let name = this.props.user.firstName + ' ' + this.props.user.lastName
					setBC('user', name ? name : "")

				})
				let prevURL = location.prevURL ? location.prevURL : '/management/users'
				setHeader("users.user", true, prevURL, 'users')
				setTabs({
					id: 'user',
					tabs: this.tabs(),
					route: 0
				})
				if (this.props.location.hash !== '') {
					scrollToAnchor(this.props.location.hash)
				}
			}


		}
		else {
			history.push({
				pathname: '/404',
				prevURL: window.location.pathname
			})
		}
	}
	resendConfirmEmail = async () => {
		const { user } = this.props
		let userId = {
			id: user.id
		}
		await resendConfirmEmail(userId).then(rs => rs)
		this.setState({ openResendConfirm: false })

	}
	handleOpenResend = () => {
		this.setState({ openResendConfirm: true })
	}

	handleCloseResend = () => {
		this.setState({ openResendConfirm: false })
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleOpenConfirmDialog = () => {
		this.setState({ openConfirm: true })
	}
	handleCloseConfirmDialog = () => {
		this.setState({ openConfirm: false })
	}
	handleConfirmUser = async () => {
		const { user } = this.props
		await confirmUser(user)
		this.handleCloseConfirmDialog()
	}
	handleDeleteUser = async () => {
		const { user } = this.props
		await deleteUser(user.id).then(rs => rs ? () => {
			let favObj = {
				id: user.id,
				type: 'user'
			}
			if (this.props.isFav(favObj)) {
				this.removeFromFav()
			}
			this.close()
		} : null)
	}
	close = (rs) => {
		this.setState({ openDelete: false })
		this.snackBarMessages(1)
		this.props.history.push('/management/users')
	}
	snackBarMessages = (msg) => {
		const { s, user } = this.props
		switch (msg) {
			case 1:
				s('snackbars.userDeleted', { user: user.firstName + ' ' + user.lastName })
				break
			case 2:
				s('snackbars.userPasswordChanged')
				break
			default:
				break
		}
	}

	handleOpenChangePassword = () => {
		this.setState({ openChangePassword: true })
	}

	handleCloseChangePassword = success => e => {
		if (e) {
			e.preventDefault()
		}
		if (success === true) {
			this.snackBarMessages(2)
		} //userPasswordChanged
		this.setState({ openChangePassword: false })
	}

	handleInputChange = e => {
		const { changePasswordError, pw } = this.state
		if (changePasswordError)
			this.setState({
				errorMessage: false,
				changePasswordError: false
			})
		this.setState({
			pw: {
				...pw,
				[e.target.id]: e.target.value
			}
		})
	}
	handleChangePassword = async () => {
		const { t, user } = this.props
		const { pw } = this.state
		const { confirm, newP } = pw
		if (confirm === newP) {
			let newPassObj = {
				id: user.id,
				oldPassword: pw.current,
				newPassword: pw.newP
			}
			let success = await setPassword(newPassObj).then(rs => rs)
			if (success)
				this.handleCloseChangePassword(success)()
			else {
				this.setState({ changePasswordError: true, errorMessage: t('confirmUser.networkError') })
			}
		}
		else {
			this.setState({ changePasswordError: true, errorMessage: t('confirmUser.validation.passwordMismatch') })
		}
	}
	renderChangePassword = () => {
		const { openChangePassword, errorMessage, pw } = this.state
		const { t, accessLevel } = this.props
		return <Dialog
			open={openChangePassword}
			onClose={this.handleCloseChangePassword()}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('menus.changePassword')}</DialogTitle>
			<DialogContent>
				<Danger> {errorMessage} </Danger>
				{accessLevel.apiorg.editusers ? null : <ItemG>
					<TextF
						id={'current'}
						label={t('users.fields.currentPass')}
						type={'password'}
						onChange={this.handleInputChange}
						value={pw.current}
					/>
				</ItemG>}
				<ItemG>
					<TextF
						id={'newP'}
						label={t('users.fields.newPass')}
						type={'password'}
						onChange={this.handleInputChange}
						value={pw.newP}
					/>
				</ItemG>
				<ItemG>
					<TextF
						id={'confirm'}
						label={t('users.fields.confirmPass')}
						type={'password'}
						onChange={this.handleInputChange}
						value={pw.confirm}
					/>
				</ItemG>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseChangePassword(false)} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={this.handleChangePassword} color='primary' autoFocus>
					{t('menus.changePassword')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderConfirmUser = () => {
		const { openConfirm } = this.state
		const { t, user } = this.props
		return <Dialog
			open={openConfirm}
			onClose={this.handleCloseConfirmDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('users.userResendEmail')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('users.userResendConfirm', { user: (user.firstName + ' ' + user.lastName) }) + '?'}
				</DialogContentText>

			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseConfirmDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={this.handleConfirmUser} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderConfirmEmail = () => {
		const { openResendConfirm } = this.state
		const { t, user } = this.props
		return <Dialog
			open={openResendConfirm}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('users.userResendEmail')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('users.userResendConfirm', { user: (user.firstName + ' ' + user.lastName) }) + '?'}
				</DialogContentText>

			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={this.resendConfirmEmail} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderDeleteDialog = () => {
		const { openDelete } = this.state
		const { t, user } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.user')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.user', { user: (user.firstName + ' ' + user.lastName) })}
				</DialogContentText>

			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={this.handleDeleteUser} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	render() {
		const { classes, t, user, loading } = this.props
		const rp = { history: this.props.history, match: this.props.match }

		return (
			loading ? <CircularLoader /> : <Fade in={true}>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} noMargin id={'contact'}>
						<UserContact
							isFav={this.props.isFav({ id: user.id, type: 'user' })}
							addToFav={this.addToFav}
							removeFromFav={this.removeFromFav}
							t={t}
							user={user}
							classes={classes}
							deleteUser={this.handleOpenDeleteDialog}
							changePass={this.handleOpenChangePassword}
							resendConfirmEmail={this.handleOpenResend}
							handleOpenConfirmDialog={this.handleOpenConfirmDialog}
							{...rp} />
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'log'}>
						<UserLog t={t} user={user} />
					</ItemGrid>
					{this.renderDeleteDialog()}
					{this.renderConfirmEmail()}
					{this.renderChangePassword()}
					{/* {this.renderConfirmUser()} */}
				</GridContainer>
			</Fade>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	saved: state.favorites.saved,
	user: state.data.user,
	loading: !state.data.gotUser
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getUser: async (id) => dispatch(await getUserLS(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(userStyles)(User))
