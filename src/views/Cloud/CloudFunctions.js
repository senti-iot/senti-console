import { Paper, withStyles, IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort } from 'variables/functions';
import { /* Delete, PictureAsPdf, DeviceHub, LibraryBooks,  LayersClear, ViewModule, */ Edit, ViewList, Add, Star, StarBorder, CloudDownload, Delete } from 'variables/icons';
import { GridContainer, CircularLoader, DeleteDialog } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getFunctions, setFunctions, sortData } from 'redux/data';
import FunctionTable from 'components/Cloud/FunctionTable';
import { deleteCFunction } from 'variables/dataFunctions';

class Functions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			openDelete: false,
			route: 0,
			order: 'asc',
			orderBy: 'id',
			filters: {
				keyword: '',
			}
		}
		props.setHeader('cloudfunctions.pageTitle', false, '', 'manage.cloudfunctions')
		props.setBC('cloudfunctions')
		props.setTabs({
			id: 'functions',
			tabs: this.tabs(),
			route: this.handleTabs()
		})
	}
	//#region Constants
	tabs = () => {
		const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			// { id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}
	dTypes = () => {
		const { t } = this.props
		return [
			{ value: 0, label: t("cloudfunctions.fields.types.function") },
			{ value: 1, label: t("cloudfunctions.fields.types.external") },
		]
	}
	ft = () => {
		const { t } = this.props
		return [
			{ key: 'name', name: t('cloudfunctions.fields.name'), type: 'string' },
			// { key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			// { key: 'devices[0].start', name: t('cloudfunctions.fields.activeDeviceStartDate'), type: 'date' },
			// { key: 'created', name: t('cloudfunctions.fields.created'), type: 'date' },
			{ key: 'type', name: t('cloudfunctions.fields.type'), type: 'dropDown', options: this.dTypes() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	functionsHeader = () => {
		const { t } = this.props
		return [
			// { id: 'id', label: t('functions.fields.id') },
			{ id: 'name', label: t('cloudfunctions.fields.name') },
			{ id: 'type', label: t('cloudfunctions.fields.type') },
		]
	}
	options = () => {
		const { t, isFav, functions } = this.props
		const { selected } = this.state
		let collection = functions[functions.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'function',
			path: `/function/${collection.id}`
		}
		let isFavorite = isFav(favObj)
		let allOptions = [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			// { label: t('menus.assign.collectionToProject'), func: this.handleOpenAssignProject, single: true, icon: LibraryBooks },
			// { label: t('menus.assign.deviceToFunction'), func: this.handleOpenAssignDevice, single: true, icon: DeviceHub },
			// { label: t('menus.unassign.deviceFromFunction'), func: this.handleOpenUnassignDevice, single: true, icon: LayersClear, dontShow: functions[functions.findIndex(c => c.id === selected[0])].activeDeviceStats ? false : true },
			// { label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete },
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle
	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		if (this.props.user && this.props.accessLevel) {
			this.getData(true)
		}

	}

	componentDidUpdate = () => {
		const { t, saved, s, isFav, finishedSaving } = this.props
		if (saved === true) {
			const { functions } = this.props
			const { selected } = this.state
			let collection = functions[functions.findIndex(d => d.id === selected[0])]
			if (collection) {
				if (isFav({ id: collection.id, type: 'function' })) {
					s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.cloudfunction') })
					finishedSaving()
					this.setState({ selected: [] })
				}
				if (!isFav({ id: collection.id, type: 'function' })) {
					s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.cloudfunction') })
					finishedSaving()
					this.setState({ selected: [] })
				}
			}
		}
	}
	componentWillUnmount = () => {
		// this._isMounted = 0
	}
	//#endregion

	//#region Functions
	addNewFunction = () => this.props.history.push({ pathname: `/functions/new`, prevURL: '/functions/list' })

	getFavs = () => {
		const { order, orderBy } = this.state
		const { favorites, functions } = this.props
		let favs = favorites.filter(f => f.type === 'function')
		let favFunctions = favs.map(f => {
			return functions[functions.findIndex(d => d.id === f.id)]
		})
		favFunctions = handleRequestSort(orderBy, order, favFunctions)
		return favFunctions
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	filterItems = (data) => {
		const rFilters = this.props.filters
		const { filters } = this.state
		return customFilterItems(filterItems(data, filters), rFilters)
	}
	snackBarMessages = (msg, display) => {
		const { functions, s } = this.props
		const { selected } = this.state
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.deviceToFunction', { collection: ``, what: 'Device' })
				break;
			case 6:
				s('snackbars.assign.deviceToFunction', { collection: `${functions[functions.findIndex(c => c.id === selected[0])].name}`, device: display })
				break
			default:
				break;
		}
	}
	reload = async () => {
		await this.getData(true)
	}
	getData = async (reload) => {
		const { getFunctions, /* setFunctions, */ accessLevel, user } = this.props
		// setFunctions()
		if (accessLevel || user) {
			if (reload)
				getFunctions(true, user.org.id, accessLevel.apisuperuser ? true : false)
		}
	}
	//#endregion

	//#region Handlers

	handleEdit = () => {
		const { selected } = this.state
		this.props.history.push({ pathname: `/function/${selected[0]}/edit`, prevURL: `/functions/list` })
	}

	handleTabs = () => {
		const { location } = this.props
		if (location.pathname.includes('grid'))
			// this.setState({ route: 1 })
			return 1
		else {
			if (location.pathname.includes('favorites'))
				// this.setState({ route: 2 })
				return 2
			else {
				// this.setState({ route: 0 })
				return 0
			}
		}
	}
	handleRequestSort = key => (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		this.props.sortData(key, property, order)
		this.setState({ order, orderBy: property })
	}
	handleFunctionClick = id => e => {
		e.stopPropagation()
		this.props.history.push('/function/' + id)
	}

	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/function/' + id, prevURL: '/functions/favorites' })
	}
	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}

	handleSelectAllClick = (arr, checked) => {
		if (checked) {
			this.setState({ selected: arr })
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


	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}


	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	handleDeleteCloudFunctions = () => {
		const { selected } = this.state
		Promise.all([selected.map(u => {
			return deleteCFunction(u)
		})]).then(async () => {
			this.setState({ openDelete: false, anchorElMenu: null, selected: [] })
			await this.getData(true).then(
				() => this.snackBarMessages(1)
			)
		})
	}

	renderDeleteDialog = () => {
		const { openDelete, selected } = this.state
		const { t, functions } = this.props
		let data = selected.map(s => functions[functions.findIndex(d => d.id === s)])
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.cloudfunctions'}
			message={'dialogs.delete.message.cloudfunctions'}
			open={openDelete}
			icon={<CloudDownload />}
			handleCloseDeleteDialog={this.handleCloseDeleteDialog}
			handleDelete={this.handleDeleteCloudFunctions}
			data={data}
			dataKey={'name'}
		/>
	}

	renderTableToolBarContent = () => {
		const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.cloudfunction')}>
				<IconButton aria-label='Add new cloud function' onClick={this.addNewFunction}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	renderTableToolBar = () => {
		const { t } = this.props
		const { selected } = this.state
		return <TableToolbar
			ft={this.ft()}
			reduxKey={'functions'}
			numSelected={selected.length}
			options={this.options}
			t={t}
			content={this.renderTableToolBarContent()}
		/>
	}

	renderTable = (items, handleClick, key) => {
		const { t } = this.props
		const { order, orderBy, selected } = this.state
		return <FunctionTable
			data={this.filterItems(items)}
			handleCheckboxClick={this.handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={this.handleRequestSort(key)}
			handleSelectAllClick={this.handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={this.functionsHeader()}
		/>
	}

	renderCards = () => {
		const { /* t, history, functions, */ loading } = this.props
		return loading ? <CircularLoader /> :
			// <FunctionsCards functions={this.filterItems(functions)} t={t} history={history} />
			null
	}

	renderFavorites = () => {
		const { classes, loading } = this.props
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable(this.getFavs(), this.handleFavClick, 'favorites')}
				{this.renderDeleteDialog()}
			</Paper>
			}
		</GridContainer>
	}

	renderFunctions = () => {
		const { classes, functions, loading } = this.props
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable(functions, this.handleFunctionClick, 'functions')}
				{this.renderDeleteDialog()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	render() {
		const { match } = this.props
		return (
			<Fragment>
				<Switch>
					<Route path={`${match.path}/list`} render={() => this.renderFunctions()} />
					<Route path={`${match.path}/grid`} render={() => this.renderCards()} />
					<Route path={`${match.path}/favorites`} render={() => this.renderFavorites()} />
					<Redirect path={`${match.path}`} to={`${match.path}/list`} />
				</Switch>

			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	favorites: state.data.favorites,
	saved: state.favorites.saved,
	functions: state.data.functions,
	loading: false, //!state.data.gotfunctions,
	filters: state.appState.filters.functions,
	user: state.settings.user
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getFunctions: (reload, customerID, ua) => dispatch(getFunctions(reload, customerID, ua)),
	setFunctions: () => dispatch(setFunctions()),
	sortData: (key, property, order) => dispatch(sortData(key, property, order))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Functions))