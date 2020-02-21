import {
	IconButton, Paper, makeStyles, DialogTitle, Dialog, DialogContent,
	DialogContentText, DialogActions, Button, List, ListItem, ListItemIcon, ListItemText, Fade, Tooltip
} from '@material-ui/core';
// import projectStyles from 'assets/jss/views/projects';
import GridContainer from 'components/Grid/GridContainer';
import CircularLoader from 'components/Loader/CircularLoader';
import ProjectCards from 'components/Project/ProjectCards';
import ProjectTable from 'components/Project/ProjectTable';
import TableToolbar from 'components/Table/TableToolbar';
// import Toolbar from 'components/Toolbar/Toolbar';
import React, { useState, useEffect, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { deleteProject, /* getAllProjects */ } from 'variables/dataProjects';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Add, Delete, Edit, PictureAsPdf, ViewList, ViewModule, DataUsage, Star, StarBorder } from 'variables/icons';
import AssignDCs from 'components/AssignComponents/AssignDCs';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { useSelector, useDispatch } from 'react-redux'
import { customFilterItems } from 'variables/Filters';
// import { makeCancelable } from 'variables/data';
import { getProjects, setProjects, sortData } from 'redux/data';
// import FilterToolbar from 'components/Table/FilterToolbar';
import { useLocalization, useMatch, useSnackbar, useLocation, useHistory } from 'hooks'

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	projects: state.data.projects,
// 	loadingProjects: !state.data.gotprojects,
// 	filters: state.appState.filters.projects
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getProjects: (reload) => dispatch(getProjects(reload)),
// 	setProjects: () => dispatch(setProjects()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		margin: theme.spacing(1),
		borderRadius: "3px",
	}
}))

// @Andrei
// only classes.root is being used, so I commented out the stylesheet and put the class here
const Projects = props => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const t = useLocalization()
	const match = useMatch()
	const history = useHistory()
	const location = useLocation()

	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const projects = useSelector(state => state.data.projects)
	const loadingProjects = useSelector(state => !state.data.gotprojects)
	const filters = useSelector(state => state.appState.filters.projects)

	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	// const [route, setRoute] = useState(0)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('title')
	const [openAssignDC, setOpenAssignDC] = useState(false)
	const [stateFilters, setStateFilters] = useState({ keyword: '' })
	const [/* anchorElMenu */, setAnchorElMenu] = useState(null) // added

	props.setHeader('projects.pageTitle', false, '', 'projects')
	props.setBC('projects')

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		selected: [],
	// 		openDelete: false,
	// 		route: 0,
	// 		order: 'asc',
	// 		orderBy: 'title',
	// 		openAssignDC: false,
	// 		filters: {
	// 			keyword: '',
	// 		}
	// 	}
	// 	props.setHeader('projects.pageTitle', false, '', 'projects')
	// 	props.setBC('projects')
	// }
	const options = () => {
		// const { t, isFav, projects } = this.props
		// const { selected } = this.state
		let project = projects[projects.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		return [
			{ label: t('menus.edit'), func: handleEditProject, single: true, icon: Edit },
			{ label: t('menus.assign.collectionsToProject'), func: handleOpenAssignCollection, single: true, icon: DataUsage },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj) },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete }
		]
	}

	const tabs = () => {
		// const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.path}/list` },
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.path}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.path}/favorites` },
		]
	}
	const ft = () => {
		// const { t } = this.props
		return [
			{ key: 'title', name: t('projects.fields.name'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'startDate', name: t('projects.fields.startDate'), type: 'date' },
			{ key: 'endDate', name: t('projects.fields.endDate'), type: 'date' },
			{ key: 'created', name: t('projects.fields.created'), type: 'date' },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]

	}
	const projectHeader = () => {
		// const { t } = this.props
		return [
			{ id: 'title', label: t('projects.fields.title'), },
			{ id: 'startDate', label: t('projects.fields.startDate'), },
			{ id: 'endDate', label: t('projects.fields.endDate'), },
			{ id: 'created', label: t('projects.fields.created'), },
			{ id: 'modified', label: t('projects.fields.lastUpdate'), },
		]
	}
	//#endregion

	//#region Functions

	const getFavs = () => {
		// const { order, orderBy } = this.state
		let favoritess = favorites.filter(f => f.type === 'project')
		let favProjects = favoritess.map(f => {
			return projects[projects.findIndex(d => d.id === f.id)]
		})
		favProjects = handleRequestSort(orderBy, order, favProjects)
		return favProjects
	}

	const addToFavorites = (favObj) => {
		dispatch(addToFav(favObj))
		setAnchorElMenu(null)
		// this.setState({ anchorElMenu: null })
	}

	const removeFromFavorites = (favObj) => {
		dispatch(removeFromFav(favObj))
		setAnchorElMenu(null)
		// this.setState({ anchorElMenu: null })
	}

	const getData = async (reload) => {
		// const { getProjects, setProjects } = this.props
		dispatch(setProjects())
		if (reload)
			dispatch(getProjects(true))
	}

	const filterItemsFunc = (data) => {
		// let { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), filters)
	}

	const snackBarMessages = (msg) => {
		// const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.collectionsToProject')
				break
			default:
				break;
		}
	}

	const deleteProjects = async (projects) => {
		// const { selected } = this.state
		Promise.all([selected.map(s => {
			// this.removeFromFav({ id: s })
			return deleteProject(s)
		})]).then(async () => {
			setOpenDelete(false)
			setSelected([])
			// this.setState({ openDelete: false, selected: [] })
			snackBarMessages(1)
			await getData()
		})
	}

	//#endregion

	//#region Life Cycle

	useEffect(() => {
		const asyncFunc = async () => {
			handleTabs()
			getData()
			props.setTabs({
				id: 'projects',
				route: handleTabs(),
				tabs: tabs()
			})
		}
		asyncFunc()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	this.handleTabs()
	// 	this.getData()
	// 	this.props.setTabs({
	// 		id: 'projects',
	// 		route: this.handleTabs(),
	// 		tabs: this.tabs()
	// 	})
	// }

	useEffect(() => {
		handleTabs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname])

	useEffect(() => {
		props.setTabs({
			id: 'projects',
			route: handleTabs(),
			// data: projects,
			// filters: filters,
			handleFilterKeyword: handleFilterKeyword,
			tabs: tabs()
		})

		if (saved === true) {
			// const { projects } = this.props
			// const { selected } = this.state
			let project = projects[projects.findIndex(d => d.id === selected[0])]
			if (project) {
				if (dispatch(isFav({ id: project.id, type: 'project' }))) {
					s('snackbars.favorite.saved', { name: project.title, type: t('favorites.types.project') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
				if (!dispatch(isFav({ id: project.id, type: 'project' }))) {
					s('snackbars.favorite.removed', { name: project.title, type: t('favorites.types.project') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saved])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (this.props.location.pathname !== prevProps.location.pathname) {
	// 		this.handleTabs()
	// 	}
	// 	this.props.setTabs({
	// 		id: 'projects',
	// 		route: this.handleTabs(),
	// 		// data: projects,
	// 		// filters: filters,
	// 		handleFilterKeyword: this.handleFilterKeyword,
	// 		tabs: this.tabs()
	// 	})
	// 	if (this.props.saved === true) {
	// 		const { projects } = this.props
	// 		const { selected } = this.state
	// 		let project = projects[projects.findIndex(d => d.id === selected[0])]
	// 		if (project) {
	// 			if (this.props.isFav({ id: project.id, type: 'project' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: project.title, type: this.props.t('favorites.types.project') })
	// 				this.props.finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 			if (!this.props.isFav({ id: project.id, type: 'project' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: project.title, type: this.props.t('favorites.types.project') })
	// 				this.props.finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 		}
	// 	}
	// }
	// componentWillUnmount = () => {
	// 	// this.getProjects.cancel()
	// 	// this._isMounted = 0
	// }

	//#endregion

	//#region Handlers
	const handleProjectClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: `/project/${id}`, prevURL: '/projects' })
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: `/project/${id}`, prevURL: '/projects/favorites' })
	}

	const handleTabs = () => {
		if (location.pathname.includes('grid')) {
			// this.setState({ route: 1 })

			return 1
		}
		else {
			if (location.pathname.includes('favorites')) {
				// this.setState({ route: 2 })
				return 2
			}
			else {
				// this.setState({ route: 0 })
				return 0
			}
		}
	}
	const handleAddProject = () => history.push('/projects/new')

	const handleEditProject = () => history.push(`/project/${selected[0]}/edit`)

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
		setAnchorElMenu(null)
		// this.setState({ openDelete: true, anchorElMenu: null })
	}

	const handleCloseDeleteDialogFunc = () => {
		setOpenDelete(false)
		// this.setState({ openDelete: false })
	}

	const handleOpenAssignCollection = () => {
		setOpenAssignDC(true)
		setAnchorElMenu(null)
		// this.setState({ openAssignDC: true, anchorElMenu: null })
	}

	const handleCloseAssignCollection = async (reload) => {
		if (reload) {
			setOpenAssignDC(false)
			// this.setState({ openAssignDC: false })
			await getData(reload).then(rs => {
				snackBarMessages(3)
			})
		}
		else {
			setOpenAssignDC(false)
			// this.setState({ openAssignDC: false })
		}
	}

	const handleRequestSortFunc = key => (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		dispatch(sortData(key, property, order))
		// handleRequestSort(property, order, this.props.projects)
		setOrder(newOrder)
		setOrderBy(property)
		// this.setState({ order, orderBy: property })
	}

	const handleFilterKeyword = (value) => {
		setStateFilters({ ...stateFilters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		keyword: value
		// 	}
		// })
	}

	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected(projects.map(n => n.id))
			// this.setState({ selected: projects.map(n => n.id) })
			return;
		}
		setSelected([])
		// this.setState({ selected: [] })
	}

	const handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		// const { selected } = this.state;
		const selectedIndex = selected.indexOf(id)
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		setSelected(newSelected)
		// this.setState({ selected: newSelected })
	}

	//#endregion

	//#region Render
	const renderConfirmDelete = () => {
		// const { selected, openDelete } = this.state
		const { handleCloseDeleteDialog } = props
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialogFunc}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.projects')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.projects')}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={projects[projects.findIndex(d => d.id === s)].title} /></ListItem>)}

				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={deleteProjects} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	const renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Tooltip title={t('menus.create.project')}>
			<IconButton aria-label='Add new project' onClick={handleAddProject}>
				<Add />
			</IconButton>
		</Tooltip>
	}
	const renderTable = (items, handleClick, key) => {
		// const { t } = this.props
		// const { order, orderBy, selected } = this.state
		return <ProjectTable
			selected={selected}
			data={filterItemsFunc(items)}
			handleSelectAllClick={handleSelectAllClick}
			tableHead={projectHeader()}
			handleClick={handleClick}
			handleRequestSort={handleRequestSortFunc(key)}
			handleCheckboxClick={handleCheckboxClick}
			order={order}
			orderBy={orderBy}
			t={t}
		/>
	}
	const renderAssignDCs = () => {
		// const { selected, openAssignDC } = this.state
		// const { t } = this.props
		return selected[0] ? <AssignDCs
			open={openAssignDC}
			handleClose={handleCloseAssignCollection}
			project={selected[0]}
			t={t}
		/> : null
	}
	const renderTableToolbar = () => {
		// const { selected } = this.state
		// const { t } = this.props
		return <TableToolbar
			ft={ft()}
			reduxKey={'projects'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}
	// const renderToolbar = () => {
	// 	return <FilterToolbar
	// 		reduxKey={'projects'}
	// 		// filters={props.ft}
	// 		t={t}
	// 	/>
	// }
	const renderAllProjects = () => {
		// const { classes } = props
		return loadingProjects ? <CircularLoader /> :
			<Fade in={true}><Paper className={classes.root}>
				{renderConfirmDelete()}
				{renderAssignDCs()}
				{renderTableToolbar()}
				{renderTable(projects, handleProjectClick, 'projects')}
			</Paper></Fade>
	}

	const renderList = () => {
		return <GridContainer justify={'center'}>
			{renderAllProjects()}
		</GridContainer>
	}
	const renderFavorites = () => {
		// const { classes } = props
		return <GridContainer justify={'center'}>
			{loadingProjects ? <CircularLoader /> : <Fade in={true}>
				<Paper className={classes.root}>
					{renderConfirmDelete()}
					{renderAssignDCs()}
					{renderTableToolbar()}
					{renderTable(getFavs(), handleFavClick, 'favorites')}
				</Paper>
			</Fade>}
		</GridContainer>
	}
	const renderCards = () => {
		// const { t, loadingProjects, projects } = this.props
		return loadingProjects ? <CircularLoader /> :
			<Fade in={true}><ProjectCards t={t} projects={filterItemsFunc(projects)} /></Fade>
	}

	// const { match } = this.props
	return (
		<Fragment>
			{/* {this.renderToolbar()} */}
			<Switch>
				<Route path={`${match.path}/grid`} render={() => renderCards()} />
				<Route path={`${match.path}/list`} render={() => renderList()} />
				<Route path={`${match.path}/favorites`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>
		</Fragment>
	)
}

export default Projects