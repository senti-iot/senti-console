import React, { useCallback, useEffect, useState } from 'react'
import { GridContainer, ItemGrid, CircularLoader, ItemG, TextF, Danger } from 'components'
import UserContact from './UserCards/UserContact'
import { UserLog } from './UserCards/UserLog'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Fade
} from '@material-ui/core'
import { deleteUser, /*  resendConfirmEmail, confirmUser */ } from 'variables/dataUsers'
import { useDispatch, useSelector } from 'react-redux'
import { setPassword } from 'variables/dataLogin'
import userStyles from 'assets/jss/components/users/userStyles'
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites'
import { Person, FolderShared } from 'variables/icons'
import { scrollToAnchor } from 'variables/functions'
import { getUserLS } from 'redux/data'
import { useMatch, useLocalization, useSnackbar, useLocation, useHistory, useAuth } from 'hooks'
import { Redirect } from 'react-router-dom'


const User = props => {
	//Hooks
	const match = useMatch()
	const t = useLocalization()
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const location = useLocation()
	const history = useHistory()
	const classes = userStyles()
	const Auth = useAuth()
	const hasAccess = Auth.hasAccess

	//Redux
	// const accessLevel = useSelector(s => s.settings.user.privileges)
	const saved = useSelector(s => s.favorites.saved)
	const user = useSelector(s => s.data.user)
	const loading = useSelector(s => !s.data.gotUser)

	//State
	// const [openConfirm, setOpenConfirm] = useState(false)
	const [openResend, setOpenResend] = useState(false)
	const [openChangePassword, setOpenChangePassword] = useState(false)
	const [pw, setPw] = useState({
		current: '',
		newP: '',
		confirm: ''
	})
	const [pwError, setPwError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [openDelete, setOpenDelete] = useState(false)

	//Const
	const { setBC, setHeader, setTabs } = props

	//useCallbacks
	const isFavorite = useCallback(id => dispatch(isFav({ id: user.uuid, type: 'user' })), [dispatch, user])

	const getUser = useCallback(async id => {
		await dispatch(await getUserLS(id))
	}, [dispatch])
	//useEffects

	useEffect(() => {
		if (saved === true) {
			if (isFavorite()) {
				s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
				finishedSaving()
			}
			if (!isFavorite()) {
				s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
				finishedSaving()
			}
		}
	}, [isFavorite, s, saved, t, user])

	useEffect(() => {
		if (user) {
			const tabs = [
				{ id: 0, title: t('tabs.details'), label: <Person />, url: `#contact` },
				{ id: 1, title: t('tabs.userHistory'), label: <FolderShared />, url: `#log` },
			]

			let name = user.firstName + ' ' + user.lastName
			setBC('user', name ? name : "")
			let prevURL = location.prevURL ? location.prevURL : '/management/users'
			setHeader("users.user", true, prevURL, 'users')
			setTabs({
				id: 'user',
				tabs: tabs,
				route: 0
			})
			if (location.hash !== '') {
				scrollToAnchor(location.hash)
			}
		}
	}, [location, setBC, setHeader, setTabs, user, t])

	useEffect(() => {
		const gUser = async () => {
			if (match.params) {
				let id = match.params.id
				if (id) {
					await getUser(id)
				}
			}
		}
		gUser()
		//eslint-disable-next-line
	}, [])

	//Handlers
	const snackBarMessages = (msg) => {
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
	const addToFavorites = () => {
		let favObj = {
			id: user.uuid,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: user.uuid,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: props.match.url
		}
		dispatch(removeFromFav(favObj))
	}

	const resendConfirmEmail = async () => {
		let userId = {
			id: user.uuid
		}
		await resendConfirmEmail(userId).then(rs => rs)
		handleCloseResend()
	}
	const handleOpenResend = () => setOpenResend(true)

	const handleCloseResend = () => setOpenResend(false)

	const handleOpenDeleteDialog = () => setOpenDelete(true)

	const handleCloseDeleteDialog = () => setOpenDelete(false)

	// const handleOpenConfirmDialog = () => setOpenConfirm(true)

	// const handleCloseConfirmDialog = () => setOpenConfirm(false)

	// const handleConfirmUser = async () => {
	// 	await confirmUser(user)
	// 	handleCloseConfirmDialog()
	// }
	const handleClose = (rs) => {
		setOpenDelete(false)
		snackBarMessages(1)
		history.push('/management/users')
	}
	const handleDeleteUser = async () => {
		await deleteUser(user.uuid).then(rs => {
			if (rs) {
				let favObj = {
					id: user.uuid,
					type: 'user'
				}
				if (dispatch(isFav(favObj))) {
					removeFromFav()
				}
				handleClose(rs)
			}
		}
		)
	}



	const handleOpenChangePassword = () => {
		setOpenChangePassword(true)
	}

	const handleCloseChangePassword = success => e => {
		if (e) {
			e.preventDefault()
		}
		if (success === true) {
			snackBarMessages(2)
		}
		setOpenChangePassword(false)
	}

	const handleInputChange = e => {
		if (pwError) {
			setPwError(false)
			setErrorMessage(false)
		}
		setPw({
			...pw,
			[e.target.id]: e.target.value
		})
	}

	const handleChangePassword = async () => {
		const { confirm, newP } = pw
		if (confirm === newP) {
			let newPassObj = {
				id: user.uuid,
				oldPassword: pw.current,
				newPassword: pw.newP
			}
			let success = await setPassword(newPassObj).then(rs => rs)
			if (success) {
				handleCloseChangePassword(success)()
			}
			else {
				setPwError(true)
				setErrorMessage(t('confirmUser.networkError'))
			}
		}
		else {
			setPwError(true)
			setErrorMessage(t('confirmUser.validation.passwordMismatch'))
		}
	}
	const renderChangePassword = () => {

		return <Dialog
			open={openChangePassword}
			onClose={handleCloseChangePassword()}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('menus.changePassword')}</DialogTitle>
			<DialogContent>
				<Danger> {errorMessage} </Danger>
				{hasAccess(user.uuid, 'user.modify') ? null : <ItemG>
					<TextF
						id={'current'}
						label={t('users.fields.currentPass')}
						type={'password'}
						onChange={handleInputChange}
						value={pw.current}
					/>
				</ItemG>}
				<ItemG>
					<TextF
						id={'newP'}
						label={t('users.fields.newPass')}
						type={'password'}
						onChange={handleInputChange}
						value={pw.newP}
					/>
				</ItemG>
				<ItemG>
					<TextF
						id={'confirm'}
						label={t('users.fields.confirmPass')}
						type={'password'}
						onChange={handleInputChange}
						value={pw.confirm}
					/>
				</ItemG>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseChangePassword(false)} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={handleChangePassword} color='primary' autoFocus>
					{t('menus.changePassword')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	// const renderConfirmUser = () => {
	// 	return <Dialog
	// 		open={openConfirm}
	// 		onClose={handleCloseConfirmDialog}
	// 		aria-labelledby='alert-dialog-title'
	// 		aria-describedby='alert-dialog-description'
	// 	>
	// 		<DialogTitle disableTypography id='alert-dialog-title'>{t('users.userResendEmail')}</DialogTitle>
	// 		<DialogContent>
	// 			<DialogContentText id='alert-dialog-description'>
	// 				{t('users.userResendConfirm', { user: (user.firstName + ' ' + user.lastName) }) + '?'}
	// 			</DialogContentText>

	// 		</DialogContent>
	// 		<DialogActions>
	// 			<Button onClick={handleCloseConfirmDialog} color='primary'>
	// 				{t('actions.cancel')}
	// 			</Button>
	// 			<Button onClick={handleConfirmUser} color='primary' autoFocus>
	// 				{t('actions.yes')}
	// 			</Button>
	// 		</DialogActions>
	// 	</Dialog>
	// }

	const renderConfirmEmail = () => {
		return <Dialog
			open={openResend}
			onClose={handleCloseResend}
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
				<Button onClick={handleCloseResend} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={resendConfirmEmail} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	const renderDeleteDialog = () => {
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
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
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={handleDeleteUser} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	return (
		loading ? <CircularLoader /> : user ? <Fade in={true}>
			<GridContainer justify={'center'} alignContent={'space-between'}>
				<ItemGrid xs={12} noMargin id={'contact'}>
					<UserContact
						isFav={isFavorite()}
						addToFav={addToFavorites}
						removeFromFav={removeFromFavorites}
						t={t}
						user={user}
						classes={classes}
						deleteUser={handleOpenDeleteDialog}
						changePass={handleOpenChangePassword}
						resendConfirmEmail={handleOpenResend}
					// handleOpenConfirmDialog={handleOpenConfirmDialog}
					/>
				</ItemGrid>
				<ItemGrid xs={12} noMargin id={'log'}>
					<UserLog t={t} user={user} />
				</ItemGrid>
				{renderDeleteDialog()}
				{renderConfirmEmail()}
				{renderChangePassword()}
				{/* {renderConfirmUser()} */}
			</GridContainer>
		</Fade> : <Redirect to={'/404'} />

	)
}



export default User
