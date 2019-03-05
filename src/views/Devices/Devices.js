import React, { Component, Fragment } from 'react'
import { getAllDevices, getDevice } from 'variables/dataDevices';
import {
	withStyles, Paper, Dialog, DialogTitle, DialogContent,
	DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom'
import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { ViewList, ViewModule, Map, Build, Business, DataUsage, Edit, LayersClear, SignalWifi2Bar, Star, StarBorder } from 'variables/icons'
import Toolbar from 'components/Toolbar/Toolbar'
import { filterItems, handleRequestSort } from 'variables/functions';
import DevicesCards from './DevicesCards'
import { unassignDeviceFromCollection } from 'variables/dataCollections';
import { Info, AssignDC, AssignOrg, ItemG } from 'components';
import TableToolbar from 'components/Table/TableToolbar';
import { connect } from 'react-redux'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import OpenStreetMap from 'components/Map/OpenStreetMap';
import { customFilterItems } from 'variables/Filters';

class Devices extends Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: null,
			selected: [],
			openAssignCollection: false,
			openAssignOrg: false,
			openUnassign: false,
			loading: true,
			route: 0,
			order: 'asc',
			orderBy: 'id',
			filters: {
				keyword: '',
			}
		}
		props.setHeader('devices.pageTitle', false, '', 'devices')
		props.setTabs({
			id: 'devices',
			tabs: this.tabs(),
			route: this.handleTabs()
		})
		props.setBC('devices')
	}
	
	//#region Constants

	tabs = () => {
		const { t, match } = this.props
		return [
			{ id: 0, title: t('devices.tabs.listView'), label: <ViewList />, url: `${match.path}/list` },
			{ id: 1, title: t('devices.tabs.mapView'), label: <Map />, url: `${match.path}/map` },
			{ id: 2, title: t('devices.tabs.cardView'), label: <ViewModule />, url: `${match.path}/grid` },
			{ id: 3, title: t('sidebar.favorites'), label: <Star />, url: `${match.path}/favorites` }
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
	dCalibrated = () => { 
		const { t } = this.props
		return [
			{ value: true, label: t("filters.devices.calibrated") },
			{ value: false, label: t("filters.devices.notCalibrated") }
		]
	}
	dLocationPlace = () => {
		const { t } = this.props
		return [
			{ value: 1, label: t('devices.locationTypes.pedStreet') },
			{ value: 2, label: t('devices.locationTypes.park') },
			{ value: 3, label: t('devices.locationTypes.path') },
			{ value: 4, label: t('devices.locationTypes.square') },
			{ value: 5, label: t('devices.locationTypes.crossroads') },
			{ value: 6, label: t('devices.locationTypes.road') },
			{ value: 7, label: t('devices.locationTypes.motorway') },
			{ value: 8, label: t('devices.locationTypes.port') },
			{ value: 9, label: t('devices.locationTypes.office') },
			{ value: 0, label: t('devices.locationTypes.unspecified') }]
	}
	dAvailable = () => { 
		const { t } = this.props
		return [
			{ value: true, label: t('devices.fields.notfree') },
			{ value: false, label: t('devices.fields.free') }
		]
	}
	ft = () => {
		const { t } = this.props
		return [{ key: 'name', name: t('devices.fields.name'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'address', name: t('devices.fields.address'), type: 'string' },
			{ key: 'liveStatus', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
			{ key: 'locationType', name: t('devices.fields.locType'), type: 'dropDown', options: this.dLocationPlace() },
			{ key: 'lat', name: t('calibration.stepheader.calibration'), type: 'diff', options: { dropdown: this.dCalibrated(), values: { false: [0] } } },
			{ key: 'dataCollection', name: t('devices.fields.availability'), type: 'dropDown', options: this.dAvailable() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	deviceHeaders = () => {
		const { t } = this.props
		return [
			{ id: 'name', label: t('devices.fields.name') },
			{ id: 'id', label: t('devices.fields.id') },
			{ id: 'liveStatus', checkbox: true, label: <ItemG container justify={'center'} title={t('devices.fields.status')}><SignalWifi2Bar /></ItemG> },
			{ id: 'address', label: t('devices.fields.address') },
			{ id: 'org.name', label: t('devices.fields.org') },
			{ id: 'dataCollection', label: t('devices.fields.availability') }
		]
	}
	options = () => {
		const { t, accessLevel, isFav } = this.props
		const { devices, selected } =  this.state
		let device = devices[devices.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		let isFavorite = isFav(favObj)
		return [
			{ dontShow: !accessLevel.senticloud.editdevice, label: t('menus.edit'), func: this.handleDeviceEdit, single: true, icon: Edit },
			{ dontShow: !accessLevel.senticloud.assigndevicetodatacollection, label: t('menus.assign.deviceToCollection'), func: this.handleOpenAssignCollection, single: true, icon: DataUsage },
			{ dontShow: !accessLevel.senticloud.editdeviceownership, label: t('menus.assign.deviceToOrg'), func: this.handleOpenAssignOrg, single: false, icon: Business },
			{ dontShow: !accessLevel.senticloud.editdeviceownership, label: t('menus.unassign.deviceFromCollection'), func: this.handleOpenUnassignDialog, single: false, icon: LayersClear },
			{ dontShow: !accessLevel.senticloud.editdevice, label: t('menus.calibrate'), func: this.handleCalibrateFlow, single: true, icon: Build },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) }
		]
	
	}
	//#endregion

	//#region Functions
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.assign.deviceToCollection', { device: this.getDeviceNames(), collection: '' })
				break
			case 2:
				s('snackbars.assign.deviceToOrg', { device: this.getDeviceNames(), org: '' })
				break
			case 3:
				s('snackbars.unassign.deviceFromCollection', { device: this.getDeviceNames(), collection: "" })
				break
			case 4:
				s('snackbars.error')
				break;
			default:
				break;
		}
		this.setState({ selected: [] })
	}
	getFavs = () => {
		const { devices } = this.state
		const { favorites } = this.props
		let favs = favorites.filter(f => f.type === 'device')
		let favDevices = favs.map(f => {
			return devices[devices.findIndex(d => d.id === f.id)]
		})
		return favDevices
	}
	getDeviceNames = () => { 
		const { devices, selected } = this.state
		let deviceNames = []
		deviceNames = selected.map(s => devices[devices.findIndex(d => d.id === s)].name)
		deviceNames = deviceNames.join(", ")
		return deviceNames
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
		let { filters } = this.state
		return customFilterItems(filterItems(data, filters), rFilters)
	}

	getData = async () => {
		await getAllDevices().then(rs => {
			return this._isMounted ? this.setState({
				devices: rs ? rs : [],
				loading: false
			}, () => this.handleRequestSort(null, 'id', 'asc')) : null
		})
	}
	//#endregion

	//#region Life Cycle

	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		await this.getData()
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.handleTabs()
		}
		if (this.props.saved === true) {
			const { devices, selected } = this.state
			let device = devices[devices.findIndex(d => d.id === selected[0])]
			if (this.props.isFav({ id: device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.saved', { name: device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
			if (!this.props.isFav({ id: device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.removed', { name: device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	//#endregion

	//#region Handlers

	handleTabs = () => {
		if (this.props.location.pathname.includes('grid')) {
			// this.setState({ route: 2 })
			return 2
		}
		else {
			if (this.props.location.pathname.includes('favorites')) {
				// this.setState({ route: 3 })
				return 3
			}
			else {
				// this.setState({ route: 0 })
				return 0
			}
		}
	}

	handleCalibrateFlow = () => {
		this.props.history.push(`/device/${this.state.selected[0]}/setup`)
	}

	handleDeviceEdit = () => {
		const { selected } = this.state
		this.props.history.push({
			pathname: `/device/${selected[0]}/edit`,
			prevURL: '/devices/list'
		})
	}

	handleOpenAssignOrg = () => {
		this.setState({ openAssignOrg: true, anchorElMenu: null })
	}

	handleCloseAssignOrg = async reload => {
		if (reload) {
			this.setState({ loading: true, openAssignOrg: false })
			await this.getData().then(() => {
				this.snackBarMessages(2)
			})
		}
		else { this.setState({ openAssignOrg: false }) }
	}

	handleOpenAssignCollection = () => {
		this.setState({ openAssignCollection: true, anchorElMenu: null })
	}

	handleCloseAssignCollection = async reload => {
		if (reload) {
			this.setState({ loading: true, openAssignCollection: false })
			await this.getData().then(() => {
				this.snackBarMessages(1)
			})
		}
		else { this.setState({ openAssignCollection: false, }) }

	}

	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	handleDeviceClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/device/' + id, prevURL: '/devices/list' })
	}
	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/device/' + id, prevURL: '/devices/favorites' })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.state.devices.map(n => n.id) });
			return;
		}
		this.setState({ selected: [] });
	};

	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected });
	};

	handleUnassignDevices = async () => {
		const { selected } = this.state
		let devices = []
		devices = await Promise.all(selected.map(s => getDevice(s))).then(rs => rs)
		await Promise.all(devices.map(d => unassignDeviceFromCollection({
			id: d.dataCollection,
			deviceId: d.id
		}))).catch((e) => {
			this.snackBarMessages(4)
		}).then(() => { this.handleCloseUnassignDialog() })
	}

	handleOpenUnassignDialog = () => {
		this.setState({ openUnassign: true, anchorElMenu: null })
	}

	handleCloseUnassignDialog = async () => {
		this.setState({ openUnassign: false })
		this.snackBarMessages(3)
		await this.getData()
	}

	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) { 
			order = 'asc'
		}
		let newData = handleRequestSort(property, order, this.state.devices)
		this.setState({ devices: newData, order, orderBy: property })
	}

	//#endregion

	renderConfirmUnassign = () => {
		const { openUnassign, selected, devices } = this.state
		const { t } = this.props
		return <Dialog
			open={openUnassign}
			onClose={this.handleCloseUnassignDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.unassign.title.devicesFromCollection')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.unassign.message.devicesFromCollection')}
				</DialogContentText>
				<div>
					{selected.map(s => {
						let device = devices[devices.findIndex(d => d.id === s)]
						return <Info key={s}>&bull;{`${device.id} ${device.name}`}</Info>
					})
					}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassignDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleUnassignDevices} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	renderLoader = () => {
		return <CircularLoader />
	}

	renderTableToolBarContent = () => {
		return null
	}

	renderAssignDC = () => { 
		const { selected, openAssignCollection } = this.state
		const { t } = this.props
		return <AssignDC
			deviceId={selected[0] ? selected[0] : 0}
			open={openAssignCollection}
			handleClose={this.handleCloseAssignCollection}
			t={t}
		/>
	}

	renderAssignOrg = () => { 
		const { selected, openAssignOrg, devices } = this.state
		const { t } = this.props
		return <AssignOrg
			devices
			open={openAssignOrg}
			handleClose={this.handleCloseAssignOrg}
			deviceId={selected.map(s => devices[devices.findIndex(d => d.id === s)])}
			t={t} />
	}

	renderTable = (items, handleClick) => { 
		const { selected, order, orderBy } = this.state
		const { t } = this.props
		return <DeviceTable
			data={this.filterItems(items)}
			handleCheckboxClick={this.handleCheckboxClick}//
			handleClick={handleClick}//
			handleRequestSort={this.handleRequestSort}//
			handleSelectAllClick={this.handleSelectAllClick}//
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={this.deviceHeaders()}
		/>
	}

	renderTableToolbar = () => { 
		const { selected } = this.state
		const { t } = this.props

		return 	<TableToolbar
			ft={this.ft()}
			reduxKey={'devices'}
			numSelected={selected.length}
			options={this.options}
			t={t}
			content={this.renderTableToolBarContent()}
		/>
	}

	renderFavorites = () => {
		const { classes } = this.props
		const { loading } = this.state

		return loading ? this.renderLoader() : <GridContainer justify={'center'}>
			<Paper className={classes.root}>
				{this.renderAssignDC()}
				{this.renderAssignOrg()}
				{this.renderConfirmUnassign()}
				{this.renderTableToolbar()}
				{this.renderTable(this.getFavs(), this.handleFavClick)}
			</Paper>
		</GridContainer>

	}

	renderList = () => {
		const { classes } = this.props
		const { devices, loading } = this.state
		return loading ? this.renderLoader() : <GridContainer justify={'center'}>
			<Paper className={classes.root}>
				{this.renderAssignDC()}
				{this.renderAssignOrg()}
				{this.renderConfirmUnassign()}
				{this.renderTableToolbar()}
				{this.renderTable(devices, this.handleDeviceClick)}
			</Paper>
		</GridContainer>
	}

	renderCards = () => {
		const { loading } = this.state
		const { t } = this.props 
		return loading ? this.renderLoader() : <DevicesCards t={t} devices={this.filterItems(this.state.devices)}/> 
	}

	renderMap = () => {
		const { devices, loading } = this.state
		const { classes, mapTheme, t } = this.props
		return loading ? <CircularLoader /> : <GridContainer container justify={'center'} >
			<Paper className={classes.paper}>
				<OpenStreetMap
					t={t}
					mapTheme={mapTheme}
					markers={this.filterItems(devices)} />
			</Paper>
		</GridContainer>
	}

	render() {
		const { devices, filters, route } = this.state
		const { history, match,  } = this.props
		return (
			<Fragment>
				<Toolbar
					data={devices}
					filters={filters}
					history={history}
					route={route}
					match={match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs()}
				/>
				<Switch>
					<Route path={`${match.path}/map`} render={() => this.renderMap()} />
					<Route path={`${match.path}/list`} render={() => this.renderList()} />
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
	favorites: state.favorites.favorites,
	saved: state.favorites.saved,
	mapTheme: state.settings.mapTheme,
	filters: state.appState.filters.devices,
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Devices))