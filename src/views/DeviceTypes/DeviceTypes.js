import { Paper, withStyles, /* Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, */ IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TableToolbar from 'components/Table/TableToolbar';
// import Toolbar from 'components/Toolbar/Toolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
// import { deleteDeviceType, unassignDeviceFromDeviceType, getDeviceType } from 'variables/dataDeviceTypes';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Delete, Edit, PictureAsPdf, ViewList, ViewModule, DeviceHub, LibraryBooks, Add, LayersClear, Star, StarBorder, SignalWifi2Bar } from 'variables/icons';
import { GridContainer, CircularLoader, AssignProject } from 'components'
// import DeviceTypesCards from './DeviceTypesCards';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getDeviceTypes, setDeviceTypes, sortData } from 'redux/data';
import DeviceTypeTable from 'components/DeviceTypes/DeviceTypeTable';
// import { setDeviceTypes, getDeviceTypes, sortData } from 'redux/data';

class DeviceTypes extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			route: 0,
			order: 'asc',
			orderBy: 'id',
			filters: {
				keyword: '',
			}
		}
		props.setHeader('devicetypes.pageTitle', false, '', 'devicetypes')
		props.setBC('devicetypes')
		props.setTabs({
			id: 'devicetypes',
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
	dLiveStatus = () => {
		const { t, classes } = this.props
		return [
			{ value: 0, label: t("devices.status.redShort"), icon: <SignalWifi2Bar className={classes.redSignal} /> },
			{ value: 1, label: t("devices.status.yellowShort"), icon: <SignalWifi2Bar className={classes.yellowSignal} /> },
			{ value: 2, label: t("devices.status.greenShort"), icon: <SignalWifi2Bar className={classes.greenSignal} /> }
		]
	}
	ft = () => {
		const { t } = this.props
		return [
			{ key: 'name', name: t('devicetypes.fields.name'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'devices[0].start', name: t('devicetypes.fields.activeDeviceStartDate'), type: 'date' },
			{ key: 'created', name: t('devicetypes.fields.created'), type: 'date' },
			{ key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	devicetypesHeader = () => {
		const { t } = this.props
		return [
			// { id: 'id', label: t('devicetypes.fields.id') },
			{ id: 'name', label: t('devicetypes.fields.name') },
			// { id: 'region', label: t('devicetypes.fields.region') },
			// { id: 'protocol', label: t('devicetypes.fields.created') },
			// { id: 'customer', label: t('devicetypes.fields.customer') },
		]
	}
	options = () => {
		const { t, isFav, devicetypes } = this.props
		const { selected } = this.state
		let devicetype = devicetypes[devicetypes.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: devicetype.id,
			name: devicetype.name,
			type: 'devicetype',
			path: `/devicetype/${devicetype.id}`
		}
		let isFavorite = isFav(favObj)
		let allOptions = [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: t('menus.assign.devicetypeToProject'), func: this.handleOpenAssignProject, single: true, icon: LibraryBooks },
			{ label: t('menus.assign.deviceToDeviceType'), func: this.handleOpenAssignDevice, single: true, icon: DeviceHub },
			{ label: t('menus.unassign.deviceFromDeviceType'), func: this.handleOpenUnassignDevice, single: true, icon: LayersClear, dontShow: devicetypes[devicetypes.findIndex(c => c.id === selected[0])].activeDeviceStats ? false : true },
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
			const { devicetypes } = this.props
			const { selected } = this.state
			let devicetype = devicetypes[devicetypes.findIndex(d => d.id === selected[0])]
			if (devicetype) {
				if (isFav({ id: devicetype.id, type: 'devicetype' })) {
					s('snackbars.favorite.saved', { name: devicetype.name, type: t('favorites.types.devicetype') })
					finishedSaving()
					this.setState({ selected: [] })
				}
				if (!isFav({ id: devicetype.id, type: 'devicetype' })) {
					s('snackbars.favorite.removed', { name: devicetype.name, type: t('favorites.types.devicetype') })
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
	addNewDeviceType = () => this.props.history.push({ pathname: `/devicetypes/new`, prevURL: '/devicetypes/list' })

	getFavs = () => {
		const { order, orderBy } = this.state
		const { favorites, devicetypes } = this.props
		let favs = favorites.filter(f => f.type === 'devicetype')
		let favDeviceTypes = favs.map(f => {
			return devicetypes[devicetypes.findIndex(d => d.id === f.id)]
		})
		favDeviceTypes = handleRequestSort(orderBy, order, favDeviceTypes)
		return favDeviceTypes
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
		const { devicetypes, s } = this.props
		const { selected } = this.state
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.deviceToDeviceType', { devicetype: ``, what: 'Device' })
				break;
			case 6:
				s('snackbars.assign.deviceToDeviceType', { devicetype: `${devicetypes[devicetypes.findIndex(c => c.id === selected[0])].name}`, device: display })
				break
			default:
				break;
		}
	}
	reload = async () => {
		await this.getData(true)
	}
	getData = async (reload) => {
		const { getDeviceTypes, setDeviceTypes } = this.props
		setDeviceTypes()
		if (reload)
			getDeviceTypes(true)
	}
	//#endregion

	//#region Handlers

	handleEdit = () => {
		const { selected } = this.state
		this.props.history.push({ pathname: `/devicetype/${selected[0]}/edit`, prevURL: `/devicetypes/list` })
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
	handleDeviceTypeClick = id => e => {
		e.stopPropagation()
		this.props.history.push('/devicetype/' + id)
	}

	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/devicetype/' + id, prevURL: '/devicetypes/favorites' })
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

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.devicetypes.map(n => n.id) })
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

	//#endregion

	renderConfirmDelete = () => {
		return null
		// const { openDelete, selected } = this.state
		// const { t, classes, devicetypes } = this.props
		// return <Dialog
		// 	open={openDelete}
		// 	onClose={this.handleCloseDeleteDialog}
		// 	aria-labelledby='alert-dialog-title'
		// 	aria-describedby='alert-dialog-description'
		// >
		// 	<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.devicetypes')}</DialogTitle>
		// 	<DialogContent>
		// 		<DialogContentText id='alert-dialog-description'>
		// 			{t('dialogs.delete.message.devicetypes')}
		// 		</DialogContentText>
		// 		<List>
		// 			{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
		// 				<ListItemText primary={devicetypes[devicetypes.findIndex(d => d.id === s)].name} /></ListItem>)}
		// 		</List>
		// 	</DialogContent>
		// 	<DialogActions>
		// 		<Button onClick={this.handleCloseDeleteDialog} color='primary'>
		// 			{t('actions.no')}
		// 		</Button>
		// 		<Button onClick={this.handleDeleteDeviceTypes} color='primary' autoFocus>
		// 			{t('actions.yes')}
		// 		</Button>
		// 	</DialogActions>
		// </Dialog>
	}


	renderTableToolBarContent = () => {
		const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.devicetype')}>
				<IconButton aria-label='Add new devicetype' onClick={this.addNewDeviceType}>
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
			reduxKey={'devicetypes'}
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
			devicetypeId={selected ? selected : []}
			handleCancel={this.handleCancelAssignProject}
			handleClose={this.handleCloseAssignProject}
			open={openAssignProject}
			t={t}
		/>
	}

	renderAssignDevice = () => {
		// const { selected, openAssignDevice } = this.state
		// const { t, devicetypes } = this.props
		// let devicetypeOrg = devicetypes.find(r => r.id === selected[0])
		// return <AssignDevice
		// 	devicetypeId={selected[0] ? selected[0] : 0}
		// 	orgId={devicetypeOrg ? devicetypeOrg.org.id : 0}
		// 	handleCancel={this.handleCancelAssignDevice}
		// 	handleClose={this.handleCloseAssignDevice}
		// 	open={openAssignDevice}
		// 	t={t}
		// />
	}

	renderTable = (items, handleClick, key) => {
		const { t } = this.props
		const { order, orderBy, selected } = this.state
		return <DeviceTypeTable
			data={this.filterItems(items)}
			handleCheckboxClick={this.handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={this.handleRequestSort(key)}
			handleSelectAllClick={this.handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={this.devicetypesHeader()}
		/>
	}

	renderCards = () => {
		const { /* t, history, devicetypes, */ loading } = this.props
		return loading ? <CircularLoader /> :
			// <DeviceTypesCards devicetypes={this.filterItems(devicetypes)} t={t} history={history} /> 
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

	renderDeviceTypes = () => {
		const { classes, devicetypes, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{/* {this.renderAssignProject()} */}
				{/* {this.renderAssignDevice()} */}
				{/* {selected.length > 0 ? this.renderDeviceUnassign() : null} */}
				{this.renderTableToolBar()}
				{this.renderTable(devicetypes, this.handleDeviceTypeClick, 'devicetypes')}
				{this.renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	render() {
		// const { devicetypes, route, filters } = this.state
		const { /* history,  */match } = this.props
		return (
			<Fragment>
				<Switch>
					<Route path={`${match.path}/list`} render={() => this.renderDeviceTypes()} />
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
	devicetypes: state.data.deviceTypes,
	loading: false, //!state.data.gotdevicetypes,
	filters: state.appState.filters.devicetypes
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getDeviceTypes: reload => dispatch(getDeviceTypes(reload)),
	setDeviceTypes: () => dispatch(setDeviceTypes()),
	sortData: (key, property, order) => dispatch(sortData(key, property, order))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(DeviceTypes))