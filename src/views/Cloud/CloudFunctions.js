import { Paper, withStyles, Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TableToolbar from 'components/Table/TableToolbar';
// import Toolbar from 'components/Toolbar/Toolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
// import { deleteFunction, unassignDeviceFromFunction, getFunction } from 'variables/dataFunctions';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Delete, Edit, PictureAsPdf, ViewList, ViewModule, DeviceHub, LibraryBooks, Add, LayersClear, Star, StarBorder } from 'variables/icons';
import { GridContainer, CircularLoader, AssignProject, /* T */ } from 'components'
// import FunctionsCards from './FunctionsCards';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getFunctions, setFunctions, sortData } from 'redux/data';
import FunctionTable from 'components/Cloud/FunctionTable';
// import { setFunctions, getFunctions, sortData } from 'redux/data';

class Functions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			openAssignDevice: false,
			openAssignProject: false,
			openUnassignDevice: false,
			openDelete: false,
			route: 0,
			order: 'asc',
			orderBy: 'id',
			filters: {
				keyword: '',
			}
		}
		props.setHeader('cloudfunctions.pageTitle', false, '', 'manage.functions')
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
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
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
			type: 'collection',
			path: `/collection/${collection.id}`
		}
		let isFavorite = isFav(favObj)
		let allOptions = [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: t('menus.assign.collectionToProject'), func: this.handleOpenAssignProject, single: true, icon: LibraryBooks },
			{ label: t('menus.assign.deviceToFunction'), func: this.handleOpenAssignDevice, single: true, icon: DeviceHub },
			{ label: t('menus.unassign.deviceFromFunction'), func: this.handleOpenUnassignDevice, single: true, icon: LayersClear, dontShow: functions[functions.findIndex(c => c.id === selected[0])].activeDeviceStats ? false : true },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) }
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle
	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		this.getData()

	}

	componentDidUpdate = (prevProps, prevState) => {
		const { t, saved, s, isFav, finishedSaving } = this.props
		if (saved === true) {
			const { functions } = this.props
			const { selected } = this.state
			let collection = functions[functions.findIndex(d => d.id === selected[0])]
			if (collection) {
				if (isFav({ id: collection.id, type: 'collection' })) {
					s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.collection') })
					finishedSaving()
					this.setState({ selected: [] })
				}
				if (!isFav({ id: collection.id, type: 'collection' })) {
					s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.collection') })
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
		let favs = favorites.filter(f => f.type === 'collection')
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
	handleDeleteFunctions = async () => {
		// const { selected } = this.state
		// Promise.all([selected.map(u => {
		// 	return deleteFunction(u)
		// })]).then(async () => {
		// 	this.setState({ openDelete: false, anchorElMenu: null, selected: [] })
		// 	await this.getData(true).then(
		// 		() => this.snackBarMessages(1)
		// 	)
		// })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.functions.map(n => n.id) })
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

	handleOpenAssignDevice = () => {
		this.setState({ openAssignDevice: true, anchorElMenu: null })
	}

	handleCancelAssignDevice = () => {
		this.setState({ openAssignDevice: false })
	}

	handleCloseAssignDevice = async (reload, display) => {
		if (reload) {
			this.setState({ openAssignDevice: false })
			await this.getData(true).then(rs => {
				this.snackBarMessages(6, display)
				this.setState({ selected: [] })
			})
		}
	}
	handleOpenAssignProject = () => {
		this.setState({ openAssignProject: true, anchorElMenu: null })
	}

	handleCancelAssignProject = () => {
		this.setState({ openAssignProject: false })
	}

	handleCloseAssignProject = async (reload) => {
		if (reload) {
			this.setState({ openAssignProject: false })
			await this.getData(true).then(rs => {
				this.snackBarMessages(6)
			})
		}
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleOpenUnassignDevice = () => {
		this.setState({
			openUnassignDevice: true
		})
	}

	handleCloseUnassignDevice = () => {
		this.setState({
			openUnassignDevice: false, anchorEl: null
		})
	}

	handleUnassignDevice = async () => {
		// const { selected } = this.state
		// let collection = await getFunction(selected[0])
		// if (collection.activeDeviceStats)
		// 	await unassignDeviceFromFunction({
		// 		id: collection.id,
		// 		deviceId: collection.activeDeviceStats.id
		// 	}).then(async rs => {
		// 		if (rs) {
		// 			this.handleCloseUnassignDevice()
		// 			this.snackBarMessages(1)
		// 			await this.getFunction(this.state.collection.id)
		// 		}
		// 	})
		// else {
		// 	//The Function doesn't have a device assigned to it...
		// 	this.handleCloseUnassignDevice()
		// }
	}
	//#endregion

	renderDeviceUnassign = () => {
		// const { t, functions } = this.props
		// const { selected } = this.state
		// let collection = functions[functions.findIndex(c => c.id === selected[0])]
		// if (collection.activeDeviceStats === null)
		// 	return null
		// return <Dialog
		// 	open={this.state.openUnassignDevice}
		// 	onClose={this.handleCloseUnassignDevice}
		// 	aria-labelledby='alert-dialog-title'
		// 	aria-describedby='alert-dialog-description'
		// >
		// 	<DialogTitle disableTypography id='alert-dialog-title'><T reversed variant={'h6'}>{t('dialogs.unassign.title.devicesFromFunction')}</T></DialogTitle>
		// 	<DialogContent>
		// 		<DialogContentText id='alert-dialog-description'>
		// 			{t('dialogs.unassign.message.deviceFromFunction', { collection: collection.name, device: collection.activeDeviceStats.id })}
		// 		</DialogContentText>
		// 	</DialogContent>
		// 	<DialogActions>
		// 		<Button onClick={this.handleCloseUnassignDevice} color='primary'>
		// 			{t('actions.no')}
		// 		</Button>
		// 		<Button onClick={this.handleUnassignDevice} color='primary' autoFocus>
		// 			{t('actions.yes')}
		// 		</Button>
		// 	</DialogActions>
		// </Dialog>
	}
	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { t, classes, functions } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.functions')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.functions')}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={functions[functions.findIndex(d => d.id === s)].name} /></ListItem>)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteFunctions} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
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

	renderAssignProject = () => {
		const { selected, openAssignProject } = this.state
		const { t } = this.props
		return <AssignProject
			// multiple
			collectionId={selected ? selected : []}
			handleCancel={this.handleCancelAssignProject}
			handleClose={this.handleCloseAssignProject}
			open={openAssignProject}
			t={t}
		/>
	}

	renderAssignDevice = () => {
		// const { selected, openAssignDevice } = this.state
		// const { t, functions } = this.props
		// let collectionOrg = functions.find(r => r.id === selected[0])
		// return <AssignDevice
		// 	collectionId={selected[0] ? selected[0] : 0}
		// 	orgId={collectionOrg ? collectionOrg.org.id : 0}
		// 	handleCancel={this.handleCancelAssignDevice}
		// 	handleClose={this.handleCloseAssignDevice}
		// 	open={openAssignDevice}
		// 	t={t}
		// />
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
		const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderAssignProject()}
				{this.renderAssignDevice()}
				{selected.length > 0 ? this.renderDeviceUnassign() : null}
				{this.renderTableToolBar()}
				{this.renderTable(this.getFavs(), this.handleFavClick, 'favorites')}
				{this.renderConfirmDelete()}
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
				{this.renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	render() {
		// const { functions, route, filters } = this.state
		const { /* history,  */match } = this.props
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