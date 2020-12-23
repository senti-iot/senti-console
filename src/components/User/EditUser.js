import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { editUser } from 'variables/dataUsers'
import { GridContainer, ItemGrid, Danger, CircularLoader } from 'components'
import { Paper, Collapse, Button } from '@material-ui/core'
import classNames from 'classnames'
import { isFav, updateFav } from 'redux/favorites'
import { getUserLS, getUsers } from 'redux/data'
import createUserStyles from 'assets/jss/components/users/createUserStyles'
import { useSnackbar, useHistory, useLocalization, useEventListener, useLocation, useParams } from 'hooks'
import CreateUserForm from 'components/User/CreateUserForm'
import { getRoles } from 'variables/dataRoles'



const EditUser = props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const location = useLocation()
	const params = useParams()
	const classes = createUserStyles()
	//Redux
	const eUser = useSelector(s => s.data.user)
	const accessLevel = useSelector(s => s.settings.user.privileges)
	const loading = useSelector(s => !s.data.gotUser)
	//State
	const [user, setUser] = useState(null)
	const [roles, setRoles] = useState([])
	const [openExtended, setOpenExtended] = useState(false)
	const [extended, setExtended] = useState({
		bio: "",
		position: "",
		location: "",
		recoveryEmail: "",
		linkedInURL: "",
		twitterURL: "",
		birthday: null,
		newsletter: true,

	})
	const [selectedRole, setSelectedRole] = useState()
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)

	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)
	const [openOrg, setOpenOrg] = useState(false)

	//Const
	const { setBC, setTabs, setHeader } = props


	//useCallbacks
	const getUserRole = useCallback(
		async () => {
			if (eUser)
				await getRoles().then(rs => {
					if (rs) {
						setRoles(rs)
					}
				})
		},
		[eUser],
	)
	const getUser = useCallback(async () => {
		let id = params.id
		if (id) {
			await dispatch(await getUserLS(id))
		}
	}, [dispatch, params])

	const goToUser = useCallback(() => history.push(location.prevURL ? location.prevURL : `/management/user/${eUser.id}`), [history, location.prevURL, eUser])

	const keyHandler = useCallback((e) => {
		if (e.key === 'Escape') {
			goToUser()
		}
	}, [goToUser])

	//useEventListeners
	useEventListener('keydown', keyHandler)

	//useEffects
	useEffect(() => {
		let gUser = async () => await getUser()
		gUser()
		return () => {
			dispatch(getUsers(true))
		}
		//eslint-disable-next-line
	}, [])
	useEffect(() => {
		if (eUser && !user) {
			let gRoles = async () => await getUserRole()
			gRoles()
			setSelectedRole(eUser.role.uuid)
			console.log(eUser)
			setUser({
				...eUser,
			})
			setExtended(
				eUser.aux?.senti?.extendedProfile ? {
					bio: "",
					position: "",
					location: "",
					recoveryEmail: "",
					linkedInURL: "",
					twitterURL: "",
					birthday: null,
					newsletter: true,
					...eUser.aux.senti.extendedProfile
				} : { ...extended }
			/* 	eUser.aux ?
					eUser.aux.senti ?
						eUser.aux.senti.extendedProfile ?
							{
								bio: "",
								position: "",
								location: "",
								recoveryEmail: "",
								linkedInURL: "",
								twitterURL: "",
								birthday: null,
								newsletter: true,
								...eUser.aux.senti.extendedProfile
							} :
							{ ...extended } :
						{ ...extended } : */ )

		}
	}, [eUser, extended, user, getUserRole])

	useEffect(() => {
		if (eUser) {
			let prevURL = location.prevURL ? location.prevURL : '/management/users'
			setBC('edituser', eUser.firstName + ' ' + eUser.lastName, eUser.uuid)
			setTabs({
				id: "editUser",
				tabs: []
			})
			setHeader('users.editUser', true, prevURL, 'users')
		}

	}, [eUser, setBC, setTabs, setHeader, location.prevURL])
	//Handlers
	const errorMessages = code => {
		switch (code) {
			case 0:
				return t('users.validation.noUserName')
			case 1:
				return t('users.validation.noFirstName')
			case 2:
				return t('users.validation.noLastName')
			case 3:
				return t('users.validation.noPhone')
			case 4:
				return t('users.validation.noEmail')
			case 5:
				return t('users.validation.noOrg')
			case 6:
				return t('users.validation.noGroup')
			case 400:
				return t('users.validation.userAlreadyExists')
			default:
				return ''
		}
	}
	const handleValidation = () => {
		let errorCode = []
		const { email, org } = user
		if (email === '') {
			errorCode.push(4)
		}
		if (org.uuid === '') {
			errorCode.push(5)
		}
		setErrorMessage(errorCode.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))

		if (errorCode.length === 0)
			return true
		else
			setError(true)
		return false
	}

	const close = async () => {
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.uuid}`
		}
		// await dispatch(getSettings())
		if (dispatch(isFav(favObj))) {
			dispatch(updateFav(favObj))
		}
		setCreated(true)
		setCreating(false)
		s('snackbars.userUpdated', { user: `${user.firstName} ${user.lastName}` })
		history.push(`/management/user/${user.uuid}`)
	}
	const handleEditUser = async () => {
		let newUser = {
			...user,
			userName: user.email,
		}
		if (openExtended) {
			newUser.aux = newUser.aux ? newUser.aux : { }
			newUser.aux.senti = newUser.aux.senti ? newUser.aux.senti : {}
			newUser.aux.senti.extendedProfile = extended

		}
		if (handleValidation()) {
			await editUser(newUser).then(rs => {
				if (rs) {
					close()
				}
				else {
					setCreated(false)
					setCreating(false)
					setError(true)
					setErrorMessage(errorMessages(rs))
				}

			}
			)
		}
	}

	//#region Users

	const handleChange = prop => e => {
		if (error) {
			setError(false)
			setErrorMessage([])
		}
		setUser({
			...user,
			[prop]: e.target.value
		})

	}
	//#endregion

	//#region Language


	//#endregion

	//#region Groups
	const handleRoleChange = e => {
		let g = roles[roles.findIndex(x => x.uuid === e.target.value)]
		setSelectedRole(e.target.value)
		setUser({
			...user,
			role: g
		})
	}
	//#endregion

	//#region Orgs
	const handleOpenOrg = () => setOpenOrg(true)
	const handleCloseOrg = () => setOpenOrg(false)

	const handleOrgChange = org => {
		setUser({
			...user,
			org: org
		})
		handleCloseOrg()
	}

	//#endregion

	//#region Extended Profile
	const handleExtendedBirthdayChange = prop => date => {
		if (error) {
			setError(false)
			setErrorMessage([])
		}

		setExtended({
			...extended,
			[prop]: date
		})
	}
	const handleExtendedChange = prop => e => {
		if (error) {
			setError(false)
			setErrorMessage([])
		}
		setExtended({
			...extended,
			[prop]: e.target.value
		})
	}

	const handleChangeExtended = () => setOpenExtended(!openExtended)

	//#endregion


	const buttonClassname = classNames({
		[classes.buttonSuccess]: created,
	})

	return !loading && user ?
		<GridContainer justify={'center'}>
			<Paper className={classes.paper}>
				<CreateUserForm
					/* Error */
					error={error}
					errorMessage={errorMessage}
					/* User */
					user={user}
					accessLevel={accessLevel}
					handleChange={handleChange}
					/* AssignOrg */
					openOrg={openOrg}
					handleOrgChange={handleOrgChange}
					handleOpenOrg={handleOpenOrg}
					handleCloseOrg={handleCloseOrg}
					/* Groups */
					roles={roles}
					selectedRole={selectedRole}
					handleRoleChange={handleRoleChange}
					/* Extended Profile */
					extended={extended}
					openExtended={openExtended}
					handleChangeExtended={handleChangeExtended}
					handleExtendedChange={handleExtendedChange}
					handleExtendedBirthdayChange={handleExtendedBirthdayChange}
					/* Hooks */
					t={t}
				/>
				<ItemGrid xs={12} container justify={'center'}>
					<Collapse in={creating} timeout='auto' unmountOnExit>
						<CircularLoader fill />
					</Collapse>
				</ItemGrid>
				<ItemGrid container style={{ margin: 16 }}>
					<div className={classes.wrapper}>
						<Button
							variant='outlined'
							// color={'danger'}
							onClick={goToUser}
							className={classes.redButton}
						>
							{t('actions.cancel')}
						</Button>
					</div>
					<div className={classes.wrapper}>
						<Button
							variant='outlined'
							color='primary'
							className={buttonClassname}
							disabled={creating || created}
							onClick={handleEditUser}>
							{created ?
								<Fragment>{t('snackbars.redirect')}</Fragment>
								: <Fragment>{t('actions.save')}</Fragment>}
						</Button>
					</div>
				</ItemGrid>
			</Paper>

		</GridContainer> : <CircularLoader />

}




export default EditUser
