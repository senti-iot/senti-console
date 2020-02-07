import { withStyles } from '@material-ui/core'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import React, { useState, useEffect } from 'react'
import { createProject } from 'variables/dataProjects'
import { Danger } from 'components'
import { getAllOrgs } from 'variables/dataOrgs';
import { getAvailableDevices } from 'variables/dataDevices';
import { getCreateProject } from 'variables/dataProjects'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment';
import CreateProjectForm from './CreateProjectForm';
import { getAllUsers } from 'variables/dataUsers';
import { getProjects, setUsers } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks'

// const mapStateToProps = (state) => ({
// 	userOrg: state.settings.user.org,
// 	user: state.settings.user
// })

// const mapDispatchToProps = dispatch => ({
// 	getProjects: reload => dispatch(getProjects(reload))
// })

// @Andrei
// view lines 230 and 242
const CreateProject = props => {

	props.setHeader('menus.create.project', true, '/projects/list', 'projects')
	props.setBC('createproject')
	props.setTabs({
		id: "createProject",
		tabs: []
	})

	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const userOrg = useSelector(state => state.settings.user.org)
	const user = useSelector(state => state.settings.user)

	const [/* id */, setId] = useState(null) // added
	const [title, /* setTitle */] = useState('')
	const [description, /* setDescription */] = useState('')
	const [startDate, /* setStartDate */] = useState(null)
	const [endDate, /* setEndDate */] = useState(null)
	const [/* devices */, setDevices] = useState([])
	const [orgs, setOrgs] = useState([])
	// const [selectedOrg, setSelectedOrg] = useState('')
	const [openOrg, setOpenOrg] = useState(false)
	const [openUser, setOpenUser] = useState(false)
	const [/* availableDevices */, setAvailableDevices] = useState(null)
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)
	// const [openSnackBar, setOpenSnackBar] = useState(false)
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [org, setOrg] = useState({
		name: "",
		id: -1
	})
	const [stateUser, setStateUser] = useState({
		firstName: "",
		lastName: "",
		id: -1
	})
	const [stateUsers, /* setStateUsers */] = useState([]) // added
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		title: '',
	// 		description: '',
	// 		startDate: null,
	// 		endDate: null,
	// 		devices: [],
	// 		orgs: [],
	// 		selectedOrg: '',
	// 		openOrg: false,
	// 		openUser: false,
	// 		availableDevices: null,
	// 		creating: false,
	// 		created: false,
	// 		openSnackBar: false,
	// 		error: false,
	// 		errorMessage: '',
	// 		org: {
	// 			name: "",
	// 			id: -1
	// 		},
	// 		user: {
	// 			firstName: "",
	// 			lastName: "",
	// 			id: -1
	// 		}
	// 	}
	// 	props.setHeader('menus.create.project', true, '/projects/list', 'projects')
	// 	props.setBC('createproject')
	// 	props.setTabs({
	// 		id: "createProject",
	// 		tabs: []
	// 	})
	// }
	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToProject()
		}
	}

	useEffect(() => {
		const asyncFunc = async () => {
			window.addEventListener('keydown', keyHandler, false)

			getAllUsers().then(async rs => {
				setUsers(rs)
				setStateUser(user)
			})

			getAllOrgs().then(async rs => {
				if (rs.length === 1) {
					setOrgs(rs)
					setOrg(rs[0])
				} else {
					const devicess = await getAvailableDevices(userOrg.id).then(rs => rs)
					setAvailableDevices(devicess ? devicess : null)
					setDevices([])
					setOrgs(rs)
					setOrg({
						id: userOrg.id,
						name: userOrg.name
					})
				}
			})
		}
		asyncFunc()

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = () => {
	// 	this._isMounted = 1
	// 	window.addEventListener('keydown', this.keyHandler, false)
	// 	getAllUsers().then(async rs => {
	// 		if (this._isMounted) {
	// 			this.setState({
	// 				users: rs,
	// 				user: this.props.user
	// 			})
	// 		}
	// 	})
	// 	getAllOrgs().then(async rs => {
	// 		if (this._isMounted) {
	// 			if (rs.length === 1)
	// 				this.setState({
	// 					orgs: rs,
	// 					org: rs[0]
	// 				})
	// 			else {
	// 				var devices = await getAvailableDevices(this.props.userOrg.id).then(rs => rs)
	// 				this.setState({
	// 					availableDevices: devices ? devices : null,
	// 					devices: [],
	// 					orgs: rs,
	// 					org: {
	// 						id: this.props.userOrg.id,
	// 						name: this.props.userOrg.name
	// 					}
	// 				})
	// 			}
	// 		}
	// 	})
	// }

	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)
	// 	this._isMounted = 0
	// }
	const handleValidation = () => {
		let errorCode = [];
		// const { title, startDate, endDate } = this.state
		if (title === '') {
			errorCode.push(1)
		}
		if (!moment(startDate).isValid()) {
			errorCode.push(2)
		}
		if (!moment(endDate).isValid()) {
			errorCode.push(3)
		}
		if (moment(startDate).isAfter(endDate)) {
			errorCode.push(4)
		}
		setErrorMessage(errorCode.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))
		// this.setState({
		// 	errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>)
		// })
		if (errorCode.length === 0)
			return true
		else
			return false
	}
	const errorMessages = code => {
		// const { t } = this.props
		switch (code) {
			case 1:
				return t('projects.validation.noTitle')
			case 2:
				return t('projects.validation.noStartDate')
			case 3:
				return t('projects.validation.noEndDate')
			case 4:
				return t('projects.validation.startDateBiggerThanEndDate')
			default:
				return ''
		}

	}
	// const handleDeviceChange = event => {
	// 	setDevices(event.target.value)
	// 	// this.setState({ devices: event.target.value })
	// }
	// const handleSelectedOrgs = e => {
	// 	setSelectedOrg(e.target.value)
	// 	// this.setState({ selectedOrg: e.target.value })
	// }
	const handleDateChange = id => value => {
		setError(false)
		// TODO
		// how to set the [id] ?

		// this.setState({
		// 	error: false,
		// 	[id]: moment(value).local().format('YYYY-MM-DDTHH:ss') <-- this
		// })
	}

	const handleChange = (id) => e => {
		e.preventDefault()
		setError(false)
		// TODO
		// how to set the [id] ?

		// this.setState({
		// 	error: false,
		// 	[id]: e.target.value
		// })
	}
	const handleFinishCreateProject = (rs) => {
		dispatch(getProjects(true))
		// this.props.getProjects(true)
		setCreated(true)
		setId(rs.id)
		// this.setState({ created: true, id: rs.id })
		s('snackbars.projectCreated', { project: title })
		props.history.push(`/project/${rs.id}`)
	}
	const handleCreateProject = async () => {
		// const { title, description, startDate, endDate, org, user } = this.state
		setCreating(true)
		// this.setState({ creating: true })
		if (handleValidation()) {
			await getCreateProject().then(async rs => {
				let newProject = {
					...rs,
					title,
					description,
					startDate,
					endDate,
					org,
					user
				}
				await createProject(newProject).then(rs => {
					if (rs) {
						handleFinishCreateProject(rs)
					} else {
						setCreated(false)
						setCreating(false)
						setId(0)
					}
				})
			})
		}
		else {
			setCreating(false)
			setError(true)
			// this.setState({
			// 	creating: false,
			// 	error: true,
			// })
		}
	}
	const handleOpenOrg = () => {
		setOpenOrg(true)
		// this.setState({
		// 	openOrg: true
		// })
	}
	const handleCloseOrg = () => {
		setOpenOrg(false)
		// this.setState({
		// 	openOrg: false
		// })
	}
	const handleChangeOrg = (o) => () => {
		setOrg(o)
		setOpenOrg(false)
		// this.setState({
		// 	org: o,
		// 	openOrg: false
		// })
	}
	const handleOpenUser = () => {
		setOpenUser(true)
		// this.setState({
		// 	openUser: true
		// })
	}
	const handleCloseUser = () => {
		setOpenUser(false)
		// this.setState({
		// 	openUser: false
		// })
	}
	const handleChangeUser = (o) => () => {
		setStateUser(o)
		setOpenUser(false)
		setOrg(org.id === o.org.id ? org : o.org)
		// this.setState({
		// 	user: o,
		// 	openUser: false,
		// 	org: this.state.org.id === o.org.id ? this.state.org : o.org
		// })
	}

	const goToProject = () => props.history.push('/projects')

	// const { created, orgs, org, error,
	// 	title, description, creating, startDate, endDate, openOrg,
	// 	users, user, openUser } = this.state

	return (
		<CreateProjectForm
			error={error}
			created={created}
			creating={creating}
			errorMessage={errorMessage}
			title={title}
			handleChange={handleChange}
			handleDateChange={handleDateChange}
			description={description}
			startDate={startDate}
			endDate={endDate}
			orgs={orgs}
			org={org}
			handleOpenOrg={handleOpenOrg}
			handleCloseOrg={handleCloseOrg}
			handleChangeOrg={handleChangeOrg}
			openOrg={openOrg}
			users={stateUsers}
			user={stateUser}
			goToProject={goToProject}
			handleOpenUser={handleOpenUser}
			handleCloseUser={handleCloseUser}
			handleChangeUser={handleChangeUser}
			openUser={openUser}
			handleCreateProject={handleCreateProject}
		/>
	)
}

export default withStyles(createprojectStyles, { withTheme: true })(CreateProject)