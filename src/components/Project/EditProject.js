import React, { useState, useEffect, Fragment } from 'react'
import { Paper, withStyles, Fade, Collapse, Button } from '@material-ui/core';
import cx from 'classnames'
import Gravatar from 'react-gravatar'
import { Check, Close } from 'variables/icons';
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { updateProject, } from 'variables/dataProjects';
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning, ItemG, DatePicker, SlideT } from 'components'
import { isFav, updateFav } from 'redux/favorites';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Divider, Hidden, IconButton } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { getProjectLS, getProjects, setUsers } from 'redux/data';
import { useLocalization, useMatch, useLocation, useHistory, useSnackbar } from 'hooks'

var moment = require('moment')

// const mapStateToProps = (state) => ({
// 	project: state.data.project,
// 	users: state.data.users,
// 	loading: !state.data.gotProject
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	updateFav: (favObj) => dispatch(updateFav(favObj)),
// 	getProject: async id => dispatch(await getProjectLS(id)),
// 	getProjects: reload => dispatch(getProjects()),
// 	getUsers: reload => dispatch(setUsers())
// })

// @Andrei
const EditProject = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const match = useMatch()
	const location = useLocation()
	const history = useHistory()

	const dispatch = useDispatch()
	const project = useSelector(state => state.data.project)
	const users = useSelector(state => state.data.users)
	const loading = useSelector(state => !state.data.gotProject)

	const [stateProject, setStateProject] = useState(null)
	// const [availableDevices, setAvailableDevices] = useState([])
	const [selectedDevices, /* setSelectedDevices */] = useState([])
	// const [allDevices, setAllDevices] = useState([])
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)
	const [filters, setFilters] = useState({ keyword: '' })
	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		id: -1
	})
	const [openUser, setOpenUser] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null) // added
	const [error, setError] = useState(null) // added

	props.setTabs({
		id: "editProject",
		tabs: []
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		project: null,
	// 		availableDevices: [],
	// 		selectedDevices: [],
	// 		allDevices: [],
	// 		creating: false,
	// 		created: false,
	// 		filters: {
	// 			keyword: ''
	// 		},
	// 		user: {
	// 			firstName: "",
	// 			lastName: "",
	// 			id: -1
	// 		},
	// 		openUser: false
	// 	}
	// 	props.setTabs({
	// 		id: "editProject",
	// 		tabs: []
	// 	})
	// }

	const handleValidation = () => {
		let errorCode = [];
		const { title, startDate, endDate } = stateProject
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

	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToProject()
		}
	}

	useEffect(() => {
		if (stateProject === null && project) {
			props.setBC('editproject', project.title, project.id)
			setStateProject(project)
			setUser(project.user)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project, stateProject])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	const { project } = this.props
	// 	if ((!prevProps.project && project !== prevProps.project && project) || (this.state.project === null && project)) {
	// 		this.props.setBC('editproject', project.title, project.id)

	// 		this.setState({
	// 			project: project,
	// 			user: project.user,
	// 		})
	// 	}
	// }
	useEffect(() => {
		const asyncFunc = async () => {
			window.addEventListener('keydown', keyHandler, false)
			let id = match.params.id
			dispatch(await getProjectLS(id))
			dispatch(setUsers())
			let prevURL = location.prevURL ? location.prevURL : '/projects/list'
			props.setHeader('projects.updateProject', true, prevURL, 'projects')
		}
		asyncFunc()

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
			// clearTimeout(timer)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	window.addEventListener('keydown', this.keyHandler, false)
	// 	this._isMounted = 1
	// 	let id = this.props.match.params.id
	// 	const { location, getProject } = this.props
	// 	await getProject(id)
	// 	this.props.getUsers()
	// 	let prevURL = location.prevURL ? location.prevURL : '/projects/list'
	// 	this.props.setHeader('projects.updateProject', true, prevURL, 'projects')
	// }

	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)

	// 	this._isMounted = 0
	// 	clearTimeout(this.timer)
	// }

	// const handleDeviceChange = event => {
	// 	setSelectedDevices(event.target.value.map(d => ({ id: d })))
	// 	// this.setState({ selectedDevices: event.target.value.map(d => ({ id: d })) });
	// };

	const handleDateChange = id => value => {
		setError(false)
		setStateProject({ ...stateProject, [id]: moment(value).local().format('YYYY-MM-DDTHH:ss') })
		// this.setState({
		// 	error: false,
		// 	project: {
		// 		...this.state.project,
		// 		[id]: moment(value).local().format('YYYY-MM-DDTHH:ss')
		// 	}
		// })
	}
	const handleChange = (id) => e => {
		e.preventDefault()
		setError(false)
		setStateProject({ ...stateProject, [id]: e.target.value })
		// this.setState({
		// 	error: false,
		// 	project: {
		// 		...this.state.project,
		// 		[id]: e.target.value
		// 	}
		// })
	}
	const handleUpdateProject = () => {
		let newProject = {
			...stateProject,
			devices: selectedDevices,
			user: user
		}
		setCreating(true)
		// this.setState({ creating: true })
		if (handleValidation())
			return updateProject(newProject).then(rs => {
				if (rs) {
					close()
				} else {
					setCreated(false)
					setCreating(false)
					setError(true)
					setErrorMessage(t('projects.validation.networkError'))
				}
			})
		// rs ?
		// 	close() :
		// 	this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t('projects.validation.networkError') })
		// )
		else {
			setCreating(false)
			setError(true)
			// this.setState({
			// 	creating: false,
			// 	error: true,
			// })
		}
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
		setUser(o)
		setOpenUser(false)
		// this.setState({
		// 	user: o,
		// 	openUser: false,
		// })
	}
	const goToProject = () => {
		// const { history, location } = this.props
		history.push(location.prevURL ? location.prevURL : '/project/' + match.params.id)
	}
	const close = async () => {
		// const { isFav, updateFav } = this.props
		// const { project } = this.state
		let favObj = {
			id: stateProject.id,
			name: stateProject.title,
			type: 'project',
			path: `/project/${stateProject.id}`
		}
		if (dispatch(isFav(favObj))) {
			dispatch(updateFav(favObj))
		}
		setCreated(true)
		setCreating(false)
		// this.setState({ created: true, creating: false })
		// const { s, history } = this.props
		dispatch(getProjects(true))
		dispatch(await getProjectLS(stateProject.id))
		// this.props.getProject(project.id)
		s('snackbars.projectUpdated', { project: stateProject.title })
		history.push('/project/' + match.params.id)
	}
	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		keyword: value
		// 	}
		// })
	}
	const renderSelectUser = () => {
		const { classes } = props
		// const { openUser, filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openUser}
			onClose={handleCloseUser}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseUser} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('users.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={users ? suggestionGen(users) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseUser} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('users.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={users ? suggestionGen(users) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{users ? filterItems(users, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeUser(o)}>
							<Gravatar default='mp' email={o.email} className={classes.img} />
							<ListItemText primary={`${o.firstName} ${o.lastName}`} secondary={o.org.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}

	const { classes } = props
	// const { created, error, project, user } = this.state
	const buttonClassname = classNames({
		[classes.buttonSuccess]: created,
	})

	return (
		!loading && stateProject ?
			<GridContainer justify={'center'}>
				<Fade in={true}>
					<Paper className={classes.paper}>
						<form className={classes.form}>
							<ItemGrid xs={12}>
								<Collapse in={error}>
									<Warning>
										<Danger>
											{errorMessage}
										</Danger>
									</Warning>
								</Collapse>
							</ItemGrid>
							<ItemGrid container xs={12} md={6}>
								<TextF
									autoFocus
									id={'title'}
									label={t('projects.fields.name')}
									value={project.title}
									className={classes.textField}
									onChange={handleChange('title')}
									margin='normal'

									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12} md={6} sm={12}>
								<TextF
									id={'multiline-flexible'}
									label={t('projects.fields.description')}
									multiline
									rows={4}
									color={'secondary'}
									className={classes.textField}
									value={project.description}
									onChange={handleChange('description')}
									margin='normal'

									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12} md={6}>
								<DatePicker
									label={t('projects.fields.endDate')}
									value={project.startDate}
									onChange={handleDateChange('startDate')}
									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12} md={6}>
								<DatePicker
									label={t('projects.fields.endDate')}
									value={project.endDate}
									onChange={handleDateChange('endDate')}
									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{renderSelectUser()}
								<TextF
									id={'contactPerson'}
									label={t('projects.contact.title')}
									value={`${user.firstName} ${user.lastName}`}
									onClick={handleOpenUser}
									onChange={() => { }}
									InputProps={{
										onChange: handleOpenUser,
										readOnly: true
									}}
								/>
							</ItemGrid>
						</form>
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
									onClick={goToProject}
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
									onClick={handleUpdateProject}>
									{created ?
										<Fragment><Check className={classes.leftIcon} />{t('snackbars.redirect')}</Fragment>
										: t('actions.save')}
								</Button>
							</div>
						</ItemGrid>
					</Paper>
				</Fade>
			</GridContainer>
			: <CircularLoader />
	)
}

export default withStyles(createprojectStyles)(EditProject)
