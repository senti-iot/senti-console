import { IconButton, Paper, withStyles } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import GridContainer from 'components/Grid/GridContainer';
import CircularLoader from 'components/Loader/CircularLoader';
import ProjectCards from 'components/Project/ProjectCards';
import ProjectTable from 'components/Project/ProjectTable';
import EnhancedTableToolbar from 'components/Table/TableToolbar';
import Toolbar from 'components/Toolbar/Toolbar';
import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { deleteProject, getAllProjects } from 'variables/dataProjects';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Add, Delete, Edit, PictureAsPdf, ViewList, ViewModule, DataUsage, Star, StarBorder } from 'variables/icons';
import AssignDCs from 'components/AssignComponents/AssignDCs';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { connect } from 'react-redux'
import { customFilterItems } from 'variables/Filters';

class Projects extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			projects: [],
			projectHeader: [],
			anchorElMenu: null,
			openDelete: false,
			loading: true,
			route: 0,
			order: 'desc',
			orderBy: 'title',
			openAssignDC: false,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false,
				custom: []
			}
		}
		props.setHeader('projects.pageTitle', false, '', 'projects')
	}
	options = () => {
		const { t, isFav } = this.props
		const { selected, projects } = this.state
		let project = projects[projects.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
		}
		let isFavorite = isFav(favObj)
		return [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: t('menus.assign.collectionsToProject'), func: this.handleOpenAssignCollection, single: true, icon: DataUsage },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete }
		]
	}
	
	tabs = [
		{ id: 0, title: this.props.t('projects.tabs.listView'), label: <ViewList />, url: `${this.props.match.path}/list` },
		{ id: 1, title: this.props.t('projects.tabs.cardView'), label: <ViewModule />, url: `${this.props.match.path}/grid` },
		{ id: 2, title: "", label: <Star />, url: `${this.props.match.path}/favorites` },
	]
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	getData = async () => {
		const { t } = this.props
		await getAllProjects().then(rs => this._isMounted ? this.setState({
			projects: rs ? rs : [],
			projectHeader: [
				{ id: 'title', label: t('projects.fields.title'), },
				// { id: 'description', label: t('projects.fields.description'), },
				{ id: 'startDate', label: t('projects.fields.startDate'), },
				{ id: 'endDate', label: t('projects.fields.endDate'), },
				{ id: 'created', label: t('projects.fields.created'), },
				{ id: 'modified', label: t('projects.fields.lastUpdate'), },
			],
			loading: false
		}, () => this.handleRequestSort(null, 'title')) : null)
	}

	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		await this.getData()
	}

	handleTabs = () => {
		if (this.props.location.pathname.includes('grid')) {
			this.setState({ route: 1 })
			return 1
		}
		else {
			if (this.props.location.pathname.includes('favorites')) {
				this.setState({ route: 2 })
				return 2
			}
			else {
				this.setState({ route: 0 })
				return 0
			}
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.handleTabs()
		}
		if (this.props.saved === true) {
			const { projects, selected } = this.state
			let project = projects[projects.findIndex(d => d.id === selected[0])]
			if (this.props.isFav({ id: project.id, type: 'project' })) {
				this.props.s('snackbars.favorite.saved', { name: project.title, type: this.props.t('favorites.types.project') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
			if (!this.props.isFav({ id: project.id, type: 'project' })) {
				this.props.s('snackbars.favorite.removed', { name: project.title, type: this.props.t('favorites.types.project') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	filterItems = (data) => {
		let { filters } = this.state
		return customFilterItems(filterItems(data, filters), filters.custom)
	}

	handleEdit = () => {
		this.props.history.push(`/project/${this.state.selected[0]}/edit`)
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	handleOpenAssignCollection = () => {
		this.setState({ openAssignDC: true, anchorElMenu: null })
	}

	handleCloseAssignCollection = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignDC: false })
			await this.getData().then(rs => {
				this.snackBarMessages(3)
			})
		}
		else {
			this.setState({ openAssignDC: false })
		}
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.projects)
		this.setState({ projects: newData, order, orderBy: property })
	}

	handleFilterStartDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				startDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}

	handleFilterEndDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				endDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}

	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.state.projects.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
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

		this.setState({ selected: newSelected })
	}

	snackBarMessages = (msg) => {
		const { s } = this.props
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
	
	deleteProjects = async (projects) => {
		await deleteProject(projects).then(() => {
			this.snackBarMessages(1)
			this.getData()
			this.setState({
				selected: [],
				anchorElMenu: null,
				openDelete: false
			})
		})
	}
	
	AddNewProject = () => this.props.history.push('/projects/new')
	
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}
	
	renderTableToolBarContent = () => {
		return <Fragment>
			<IconButton aria-label='Add new project' onClick={this.AddNewProject}>
				<Add />
			</IconButton>
		</Fragment>
	}
	addFilter = (f) => {
		let cFilters = this.state.filters.custom
		let id = cFilters.length
		cFilters.push({ value: f.value, id: id, key: f.key })
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
		return id
	}
	removeFilter = (fId) => {
		let cFilters = this.state.filters.custom
		cFilters = cFilters.reduce((newFilters, f) => { 
			if (f.id !== fId) {
				newFilters.push(f)
			}
			return newFilters
		}, [])
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
	}
	ft = () => {
		const { t } = this.props
		return [{ key: 'title', name: t('projects.fields.name'), type: 'text' },
			{ key: 'startDate', name: t('projects.fields.startDate'), type: 'date' }
		]

	}
	getFavs = () => {
		let favorites = this.props.favorites.filter(f => f.type === 'project')
		let favProjects = favorites.map(f => {
			return this.state.projects[this.state.projects.findIndex(d => d.id === f.id)]
		})
		return favProjects
	}
	renderFavTable = () => {
		const { t, classes } = this.props
		const { openDelete, openAssignDC, loading, order, orderBy, projectHeader, filters, selected } = this.state
		return loading ? <CircularLoader /> :
			<Paper className={classes.root}>
				{selected[0] ? <AssignDCs
					open={openAssignDC}
					handleClose={this.handleCloseAssignCollection}
					project={selected[0]}
					t={t}
				/> : null}
				<EnhancedTableToolbar
					ft={this.ft()}//filters List
					addFilter={this.addFilter}
					removeFilter={this.removeFilter}
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/><ProjectTable
					openDelete={openDelete}
					handleOpenDeleteDialog={this.handleOpenDeleteDialog}
					handleCloseDeleteDialog={this.handleCloseDeleteDialog}
					selected={selected}
					filter={this.filter}
					data={this.filterItems(this.getFavs())}
					handleSelectAllClick={this.handleSelectAllClick}
					tableHead={projectHeader}
					handleFilterEndDate={this.handleFilterEndDate}
					handleFilterKeyword={this.handleFilterKeyword}
					handleFilterStartDate={this.handleFilterStartDate}
					handleRequestSort={this.handleRequestSort}
					handleClick={this.handleClick}
					handleCheckboxClick={this.handleCheckboxClick}
					order={order}
					orderBy={orderBy}
					filters={filters}
					deleteProjects={this.deleteProjects}
					t={t}
				/>
			</Paper>
	}
	renderAllProjects = () => {
		const { t, classes } = this.props
		const { openDelete, openAssignDC, loading, order, orderBy, projects, projectHeader, filters, selected } = this.state
		return loading ? <CircularLoader /> :
			<Paper className={classes.root}>
				{selected[0] ? <AssignDCs
					open={openAssignDC}
					handleClose={this.handleCloseAssignCollection}
					project={selected[0]}
					t={t}
				/> : null}
				<EnhancedTableToolbar
					ft={this.ft()}
					addFilter={this.addFilter}
					removeFilter={this.removeFilter}
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/><ProjectTable
					openDelete={openDelete}
					handleOpenDeleteDialog={this.handleOpenDeleteDialog}
					handleCloseDeleteDialog={this.handleCloseDeleteDialog}
					selected={selected}
					filter={this.filter}
					data={this.filterItems(projects)}
					handleSelectAllClick={this.handleSelectAllClick}
					tableHead={projectHeader}
					handleFilterEndDate={this.handleFilterEndDate}
					handleFilterKeyword={this.handleFilterKeyword}
					handleFilterStartDate={this.handleFilterStartDate}
					handleRequestSort={this.handleRequestSort}
					handleClick={this.handleClick}
					handleCheckboxClick={this.handleCheckboxClick}
					order={order}
					orderBy={orderBy}
					filters={filters}
					deleteProjects={this.deleteProjects}
					t={t}
				/>
			</Paper>
	}
	
	renderList = () => {
		return <GridContainer justify={'center'}>
			{this.renderAllProjects()}
		</GridContainer>
	}
	renderFavorites = () => {
		const { loading } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : this.renderFavTable()}
		</GridContainer>
	}
	renderCards = () => {
		const { loading } = this.state
		const { t } = this.props
		return loading ? <CircularLoader /> :
			<ProjectCards t={t} projects={this.filterItems(this.state.projects)} />
		
	}
	render() {
		const { projects, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					route={this.state.route}
					data={projects}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
				/>
				<Switch>
					<Route path={`${this.props.match.path}/grid`} render={() => this.renderCards()} />
					<Route path={`${this.props.match.path}/list`} render={() => this.renderList()} />
					<Route path={`${this.props.match.path}/favorites`} render={() => this.renderFavorites()}/>
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	favorites: state.favorites.favorites,
	saved: state.favorites.saved
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Projects))