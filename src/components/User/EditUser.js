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
	const [selectedGroup, setSelectedGroup] = useState(136550100000225)
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)

	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)
	const [openOrg, setOpenOrg] = useState(false)

	//Const
	const { setBC, setTabs, setHeader } = props
	const groups = [
		{
			id: '136550100000211',
			appId: '1220',
			name: t('users.groups.accountManager'),
			show: accessLevel.apiorg.editusers ? true : false
		},
		{
			id: '136550100000143',
			appId: '1220',
			name: t('users.groups.superUser'),
			show: accessLevel.apisuperuser ? true : false

		},
		{
			id: '136550100000225',
			appId: '1220',
			name: t('users.groups.user'),
			show: true
		}
	]
	const languages = [
		{ value: 'en', label: t('settings.languages.en') },
		{ value: 'da', label: t('settings.languages.da') }
	]

	//useCallbacks
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
			let g = 0
			let userGroups = Object.keys(eUser.groups)
			userGroups.sort((a, b) => a > b ? 1 : -1)
			if (userGroups.find(x => x === '136550100000211'))
				g = '136550100000211'
			if (userGroups.find(x => x === '136550100000225'))
				g = '136550100000225'
			if (userGroups.find(x => x === '136550100000143'))
				g = '136550100000143'

			setSelectedGroup(g)
			setUser({
				...eUser,
				groups: Object.keys(eUser.groups).map(g => ({ id: g, name: eUser.groups[g].name, appId: eUser.groups[g].appId }))
			})
			setExtended(
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
					{ ...extended })
		}
	}, [eUser, extended, user])

	useEffect(() => {
		if (eUser) {
			let prevURL = location.prevURL ? location.prevURL : '/management/users'
			setBC('edituser', eUser.firstName + ' ' + eUser.lastName, eUser.id)
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
		if (org.id === 0) {
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
			path: `/management/user/${user.id}`
		}
		// await dispatch(getSettings())
		if (dispatch(isFav(favObj))) {
			dispatch(updateFav(favObj))
		}
		setCreated(true)
		setCreating(false)
		s('snackbars.userUpdated', { user: `${user.firstName} ${user.lastName}` })
		history.push(`/management/user/${user.id}`)
	}
	const handleEditUser = async () => {
		let groups = {}
		console.log(user.groups)
		user.groups.forEach(x => {
			groups[x.id] = {
				...x
			}
		})
		let newUser = {
			...user,
			userName: user.email,
			groups: groups
		}
		if (openExtended) {
			newUser.aux.senti.extendedProfile = extended
		}
		if (handleValidation()) {
			await editUser(newUser).then(rs => rs ?
				close() : () => {
					setCreated(false)
					setCreating(false)
					setError(true)
					setErrorMessage(errorMessages(rs))
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
	const handleLangChange = e => {
		setUser({
			...user,
			aux: {
				...user.aux,
				odeum: {
					...user.aux.odeum,
					language: e.target.value
				}
			}
		})
	}

	//#endregion

	//#region Groups
	const handleGroupChange = e => {
		let uGroups = user.groups
		console.log(groups)
		uGroups = uGroups.filter(x => !groups.some(y => x.id === y.id))
		let g = groups[groups.findIndex(x => x.id === e.target.value)]
		uGroups.push(g)
		console.log(groups, e.target.value)
		setSelectedGroup(e.target.value)
		setUser({
			...user,
			groups: uGroups
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
					/* Language */
					handleLangChange={handleLangChange}
					languages={languages}
					/* Groups */
					groups={groups}
					selectedGroup={selectedGroup}
					handleGroupChange={handleGroupChange}
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
