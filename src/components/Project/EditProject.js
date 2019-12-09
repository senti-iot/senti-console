import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Fade, Collapse, Button } from '@material-ui/core';
import cx from 'classnames'
import Gravatar from 'react-gravatar'
import { Check, Close } from 'variables/icons';
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { updateProject, } from 'variables/dataProjects';
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning, ItemG, DatePicker, SlideT } from 'components'
import { isFav, updateFav } from 'redux/favorites';
import { connect } from 'react-redux'
import { Dialog, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Divider, Hidden, IconButton } from '@material-ui/core';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { getProjectLS, getProjects, setUsers } from 'redux/data';

var moment = require('moment')

class EditProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			project: null,
			availableDevices: [],
			selectedDevices: [],
			allDevices: [],
			creating: false,
			created: false,
			filters: {
				keyword: ''
			},
			user: {
				firstName: "",
				lastName: "",
				id: -1
			},
			openUser: false
		}
		props.setTabs({
			id: "editProject",
			tabs: []
		})
	}

	handleValidation = () => {
		let errorCode = [];
		const { title, startDate, endDate } = this.state.project
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
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>)
		})
		if (errorCode.length === 0)
			return true
		else
			return false
	}
	errorMessages = code => {
		const { t } = this.props
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

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToProject()
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { project } = this.props
		if ((!prevProps.project && project !== prevProps.project && project) || (this.state.project === null && project)) {
			this.props.setBC('editproject', project.title, project.id)

			this.setState({
				project: project,
				user: project.user,
			})
		}
	}

	componentDidMount = async () => {
		window.addEventListener('keydown', this.keyHandler, false)
		this._isMounted = 1
		let id = this.props.match.params.id
		const { location, getProject } = this.props
		await getProject(id)
		this.props.getUsers()
		let prevURL = location.prevURL ? location.prevURL : '/projects/list'
		this.props.setHeader('projects.updateProject', true, prevURL, 'projects')
	}

	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)

		this._isMounted = 0
		clearTimeout(this.timer)
	}

	handleDeviceChange = event => {
		this.setState({ selectedDevices: event.target.value.map(d => ({ id: d })) });
	};

	handleDateChange = id => value => {
		this.setState({
			error: false,
			project: {
				...this.state.project,
				[id]: moment(value).local().format('YYYY-MM-DDTHH:ss')
			}
		})
	}
	handleChange = (id) => e => {
		e.preventDefault()
		this.setState({
			error: false,
			project: {
				...this.state.project,
				[id]: e.target.value
			}
		})
	}
	handleUpdateProject = () => {

		let newProject = {
			...this.state.project,
			devices: this.state.selectedDevices,
			user: this.state.user
		}
		this.setState({ creating: true })
		if (this.handleValidation())
			return updateProject(newProject).then(rs => rs ?
				this.close() :
				this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t('projects.validation.networkError') })
			)
		else {
			this.setState({
				creating: false,
				error: true,
			})
		}
	}
	handleOpenUser = () => {
		this.setState({
			openUser: true
		})
	}
	handleCloseUser = () => {
		this.setState({
			openUser: false
		})
	}
	handleChangeUser = (o) => () => {
		this.setState({
			user: o,
			openUser: false,
		})
	}
	goToProject = () => {
		const { history, location } = this.props
		history.push(location.prevURL ? location.prevURL : '/project/' + this.props.match.params.id)
	}
	close = () => {
		const { isFav, updateFav } = this.props
		const { project } = this.state
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
		}
		if (isFav(favObj)) {
			updateFav(favObj)
		}
		this.setState({ created: true, creating: false })
		const { s, history } = this.props
		this.props.getProjects(true)
		this.props.getProject(project.id)
		s('snackbars.projectUpdated', { project: this.state.project.title })
		history.push('/project/' + this.props.match.params.id)
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				keyword: value
			}
		})
	}
	renderSelectUser = () => {
		const { t, classes, users } = this.props
		const { openUser, filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openUser}
			onClose={this.handleCloseUser}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={this.handleCloseUser} aria-label='Close'>
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
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={this.handleCloseUser} aria-label='Close'>
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
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{users ? filterItems(users, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={this.handleChangeUser(o)}>
							<Gravatar default='mp' email={o.email} className={classes.img} />
							<ListItemText primary={`${o.firstName} ${o.lastName}`} secondary={o.org.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}

	render() {
		const { classes, t, loading } = this.props
		const { created, error, project, user } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})

		return (
			!loading && project ?
				<GridContainer justify={'center'}>
					<Fade in={true}>
						<Paper className={classes.paper}>
							<form className={classes.form}>
								<ItemGrid xs={12}>
									<Collapse in={this.state.error}>
										<Warning>
											<Danger>
												{this.state.errorMessage}
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
										onChange={this.handleChange('title')}
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
										onChange={this.handleChange('description')}
										margin='normal'

										error={error}
									/>
								</ItemGrid>
								<ItemGrid xs={12} md={6}>
									<DatePicker
										label={t('projects.fields.endDate')}
										value={project.startDate}
										onChange={this.handleDateChange('startDate')}
										error={error}
									/>
								</ItemGrid>
								<ItemGrid xs={12} md={6}>
									<DatePicker
										label={t('projects.fields.endDate')}
										value={project.endDate}
										onChange={this.handleDateChange('endDate')}
										error={error}
									/>
								</ItemGrid>
								<ItemGrid xs={12}>
									{this.renderSelectUser()}
									<TextF
										id={'contactPerson'}
										label={t('projects.contact.title')}
										value={`${user.firstName} ${user.lastName}`}
										handleClick={this.handleOpenUser}
										onChange={() => { }}
										InputProps={{
											onChange: this.handleOpenUser,
											readOnly: true
										}}
									/>
								</ItemGrid>
							</form>
							<ItemGrid xs={12} container justify={'center'}>
								<Collapse in={this.state.creating} timeout='auto' unmountOnExit>
									<CircularLoader fill />
								</Collapse>
							</ItemGrid>
							<ItemGrid container style={{ margin: 16 }}>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										// color={'danger'}
										onClick={this.goToProject}
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
										disabled={this.state.creating || this.state.created}
										onClick={this.handleUpdateProject}>
										{this.state.created ?
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
}
const mapStateToProps = (state) => ({
	project: state.data.project,
	users: state.data.users,
	loading: !state.data.gotProject
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getProject: async id => dispatch(await getProjectLS(id)),
	getProjects: reload => dispatch(getProjects()),
	getUsers: reload => dispatch(setUsers())

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(EditProject))
