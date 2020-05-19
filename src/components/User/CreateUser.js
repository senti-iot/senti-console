import React, { Fragment, useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUser } from 'variables/dataUsers'
import { GridContainer, ItemGrid, Danger, CircularLoader } from 'components'
import { Paper, Collapse, Button } from '@material-ui/core'
import classNames from 'classnames'
import { getUsers } from 'redux/data'
import { useEventListener, useLocalization, useHistory, useSnackbar, useAuth } from 'hooks'
import createUserStyles from 'assets/jss/components/users/createUserStyles'
import CreateUserForm from './CreateUserForm'
import { getRoles } from 'variables/dataRoles'
import { Redirect } from 'react-router-dom'

const CreateUser = props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const classes = createUserStyles()
	const hasAccess = useAuth().hasAccess

	//Redux
	const rUser = useSelector(s => s.settings.user)

	//State
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState({
		userName: '',
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		internal: {},
		aux: {
			senti: {
				extendedProfile: {
					newsletter: true,
				}
			}
		},
		state: 2,
		org: rUser.org,
		role: {}
	})

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

	const languages = [
		{ value: 'en', label: t('settings.languages.en') },
		{ value: 'da', label: t('settings.languages.da') }
	]
	//useCallbacks

	// const getOrgs = useCallback(async () => {
	// 	let orgs = await getAllOrgs().then(rs => rs)
	// 	setOrgs(orgs)
	// 	setUser({
	// 		...user,
	// 		org: {
	// 			...rUser.org //For selector
	// 		}
	// 	})
	// 	setLoading(false)
	// 	//eslint-disable-next-line
	// }, [])

	const goToUser = useCallback(() => history.push('/management/users'), [history])

	const keyHandler = useCallback((e) => {
		if (e.key === 'Escape') {
			goToUser()
		}
	}, [goToUser])

	//useEventListeners
	useEventListener('keydown', keyHandler)

	//useEffects
	useEffect(() => {
		//GetRoles
		const getR = async () => {
			let roles = await getRoles()
			setRoles(roles)
			setSelectedRole(roles[0].uuid)
			setLoading(false)
		}
		getR()
	}, [])

	useEffect(() => {
		setBC('createuser')
		setTabs({
			id: 'createUser',
			tabs: []
		})
		setHeader('menus.create.user', true, '/management/users', 'users')

	}, [setBC, setHeader, setTabs])


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
			case 409:
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

	const handleCreateUser = async () => {
		let newUser = {
			...user,
			userName: user.email
		}
		if (openExtended)
			newUser.aux.senti.extendedProfile = extended
		if (handleValidation()) {
			await createUser(newUser).then(rs => {
				if (rs.ok)
					close(rs.data)
				else {
					setCreated(false)
					setCreating(false)
					setError(true)
					setErrorMessage(errorMessages(rs.status))
					s(errorMessages(rs.status))
				}
			})
		}
	}
	const close = (rs) => {
		setCreating(false)
		setCreated(true)
		s('snackbars.userCreated', { user: `${rs.firstName} ${rs.lastName}` })
		dispatch(getUsers(true))
		history.push(`/management/user/${rs.uuid}`)

	}
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
	const handleRoleChange = e => {
		setSelectedRole(e.target.value)
		setUser({
			...user,
			role: {
				uuid: e.target.value
			}
		})
	}
	const handleOrgChange = org => {
		setUser({
			...user,
			org: org
		})
		handleCloseOrg()
	}
	const handleChangeExtended = () => setOpenExtended(!openExtended)
	const handleOpenOrg = () => setOpenOrg(true)
	const handleCloseOrg = () => setOpenOrg(false)


	const buttonClassname = classNames({
		[classes.buttonSuccess]: created,
	})
	return (
		hasAccess(rUser.uuid, 'users.create') ? <GridContainer justify={'center'}>
			<Paper className={classes.paper}>
				{loading ? <CircularLoader /> : <CreateUserForm
					/* Error */
					error={error}
					errorMessage={errorMessage}
					/* User */
					user={user}
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
				/>}
				<ItemGrid xs={12} container justify={'center'}>
					<Collapse in={creating} timeout='auto' unmountOnExit>
						<CircularLoader fill />
					</Collapse>
				</ItemGrid>
				<ItemGrid container style={{ margin: 16 }}>
					<div className={classes.wrapper}>
						<Button
							variant='outlined'
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
							onClick={handleCreateUser}>
							{created ?
								<Fragment>{t('snackbars.redirect')}</Fragment>
								: <Fragment>{t('actions.save')}</Fragment>}
						</Button>
					</div>
				</ItemGrid>
			</Paper>
		</GridContainer> : <Redirect to={'/'} />
	)
}



export default CreateUser
