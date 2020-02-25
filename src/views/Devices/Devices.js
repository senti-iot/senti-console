/* eslint-disable indent */
import React, { useState, useEffect, Fragment } from 'react'
import { getDevice } from 'variables/dataDevices';
import {
	Paper, Dialog, DialogTitle, DialogContent,
	DialogContentText, DialogActions, Button, Fade
} from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom'
import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { ViewList, ViewModule, Map, Build, Business, DataUsage, Edit, LayersClear, SignalWifi2Bar, Star, StarBorder } from 'variables/icons'
// import Toolbar from 'components/Toolbar/Toolbar'
import { filterItems, handleRequestSort } from 'variables/functions';
import DevicesCards from './DevicesCards'
import { unassignDeviceFromCollection } from 'variables/dataCollections';
import { Info, AssignDC, AssignOrg, ItemG } from 'components';
import TableToolbar from 'components/Table/TableToolbar';
import { useSelector, useDispatch } from 'react-redux'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import OpenStreetMap from 'components/Map/OpenStreetMap';
import { customFilterItems } from 'variables/Filters';
import { getDevices, setDevices, sortData } from 'redux/data';
import { useSnackbar, useLocalization, useMatch, useLocation, useHistory } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	mapTheme: state.settings.mapTheme,
// 	filters: state.appState.filters.devices,
// 	loading: !state.data.gotdevices,
// 	devices: state.data.devices
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getDevices: reload => dispatch(getDevices(reload)),
// 	setDevices: () => dispatch(setDevices()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

// @Andrei
const Devices = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const classes = projectStyles()
	const match = useMatch()
	const location = useLocation()
	const history = useHistory()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const mapTheme = useSelector(state => state.settings.mapTheme)
	const filters = useSelector(state => state.appState.filters.devices)
	const loading = useSelector(state => !state.data.gotdevices)
	const devices = useSelector(state => state.data.devices)

	// const [stateDevices, setStateDevices] = useState(null)
	const [selected, setSelected] = useState([])
	const [openAssignCollection, setOpenAssignCollection] = useState(false)
	const [openAssignOrg, setOpenAssignOrg] = useState(false)
	const [openUnassign, setOpenUnassign] = useState(false)
	// const [route, setRoute] = useState(0)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [stateFilters, /* setStateFilters */] = useState({ keyword: '' })
	const [/* anchorElMenu */, setAnchorElMenu] = useState(null) // added

	const tabs = () => {
		// const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.path}/list` },
			{ id: 1, title: t('tooltips.mapView'), label: <Map />, url: `${match.path}/map` },
			{ id: 2, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.path}/grid` },
			{ id: 3, title: t('tooltips.favorites'), label: <Star />, url: `${match.path}/favorites` }
		]
	}

	const handleTabs = () => {
		if (location.pathname.includes('grid')) {
			// this.setState({ route: 2 })
			return 2
		}
		else {
			if (location.pathname.includes('favorites')) {
				// this.setState({ route: 3 })
				return 3
			}
			else {
				// this.setState({ route: 0 })
				return 0
			}
		}
	}

	props.setHeader('devices.pageTitle', false, '', 'devices')
	props.setTabs({
		id: 'devices',
		tabs: tabs(),
		route: handleTabs()
	})
	props.setBC('devices')

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		devices: null,
	// 		selected: [],
	// 		openAssignCollection: false,
	// 		openAssignOrg: false,
	// 		openUnassign: false,
	// 		route: 0,
	// 		order: 'asc',
	// 		orderBy: 'id',
	// 		filters: {
	// 			keyword: '',
	// 		}
	// 	}
	// 	props.setHeader('devices.pageTitle', false, '', 'devices')
	// 	props.setTabs({
	// 		id: 'devices',
	// 		tabs: this.tabs(),
	// 		route: this.handleTabs()
	// 	})
	// 	props.setBC('devices')
	// }

	//#region Constants

	const dLiveStatus = () => {
		// const { t, classes } = this.props
		return [
			{ value: 0, label: t("devices.status.redShort"), icon: <SignalWifi2Bar className={classes.redSignal} /> },
			{ value: 1, label: t("devices.status.yellowShort"), icon: <SignalWifi2Bar className={classes.yellowSignal} /> },
			{ value: 2, label: t("devices.status.greenShort"), icon: <SignalWifi2Bar className={classes.greenSignal} /> }
		]
	}
	const dCalibrated = () => {
		// const { t } = this.props
		return [
			{ value: true, label: t("filters.devices.calibrated") },
			{ value: false, label: t("filters.devices.notCalibrated") }
		]
	}
	const dLocationPlace = () => {
		// const { t } = this.props
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
	const dAvailable = () => {
		// const { t } = this.props
		return [
			{ value: true, label: t('devices.fields.notfree') },
			{ value: false, label: t('devices.fields.free') }
		]
	}
	const ft = () => {
		// const { t } = this.props
		return [{ key: 'name', name: t('devices.fields.name'), type: 'string' },
		{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
		{ key: 'address', name: t('devices.fields.address'), type: 'string' },
		{ key: 'liveStatus', name: t('devices.fields.status'), type: 'dropDown', options: dLiveStatus() },
		{ key: 'locationType', name: t('devices.fields.locType'), type: 'dropDown', options: dLocationPlace() },
		{ key: 'lat', name: t('calibration.stepheader.calibration'), type: 'diff', options: { dropdown: dCalibrated(), values: { false: [0] } } },
		{ key: 'dataCollection', name: t('devices.fields.availability'), type: 'dropDown', options: dAvailable() },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const deviceHeaders = () => {
		// const { t } = this.props
		return [
			{ id: 'name', label: t('devices.fields.name') },
			{ id: 'id', label: t('devices.fields.id') },
			{ id: 'liveStatus', checkbox: true, label: <ItemG container justify={'center'} title={t('devices.fields.status')}><SignalWifi2Bar /></ItemG> },
			{ id: 'address', label: t('devices.fields.address') },
			{ id: 'org.name', label: t('devices.fields.org') },
			{ id: 'dataCollection', label: t('devices.fields.availability') }
		]
	}
	const options = () => {
		// const { t, accessLevel, isFav, devices } = this.props
		// const { selected } = this.state
		let device = devices[devices.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		return [
			{ dontShow: !accessLevel.senticloud.editdevice, label: t('menus.edit'), func: handleDeviceEdit, single: true, icon: Edit },
			{ dontShow: !accessLevel.senticloud.assigndevicetodatacollection, label: t('menus.assign.deviceToCollection'), func: handleOpenAssignCollection, single: true, icon: DataUsage },
			{ dontShow: !accessLevel.senticloud.editdeviceownership, label: t('menus.assign.deviceToOrg'), func: handleOpenAssignOrg, single: false, icon: Business },
			{ dontShow: !accessLevel.senticloud.editdeviceownership, label: t('menus.unassign.deviceFromCollection'), func: handleOpenUnassignDialog, single: false, icon: LayersClear },
			{ dontShow: !accessLevel.senticloud.editdevice, label: t('menus.calibrate'), func: handleCalibrateFlow, single: true, icon: Build },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj) }
		]

	}
	//#endregion

	//#region Functions
	const snackBarMessages = (msg) => {
		// const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.assign.deviceToCollection', { device: getDeviceNames(), collection: '' })
				break
			case 2:
				s('snackbars.assign.deviceToOrg', { device: getDeviceNames(), org: '' })
				break
			case 3:
				s('snackbars.unassign.deviceFromCollection', { device: getDeviceNames(), collection: "" })
				break
			case 4:
				s('snackbars.error')
				break;
			default:
				break;
		}
		setSelected([])
		// this.setState({ selected: [] })
	}
	const getFavs = () => {
		// const { order, orderBy } = this.state
		// const { favorites, devices } = this.props
		let favs = favorites.filter(f => f.type === 'device')
		let favDevices = favs.map(f => {
			return devices[devices.findIndex(d => d.id === f.id)]
		})
		favDevices = handleRequestSort(orderBy, order, favDevices)
		return favDevices
	}
	const getDeviceNames = () => {
		// const { selected } = this.state
		// const { devices } = this.props

		let deviceNames = []
		deviceNames = selected.map(s => devices[devices.findIndex(d => d.id === s)].name)
		deviceNames = deviceNames.join(", ")
		return deviceNames
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

	const filterItemsFunc = (data) => {
		// const rFilters = this.props.filters
		// let { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), filters)
	}

	const getData = async (reload) => {
		// const { getDevices, setDevices } = this.props
		dispatch(setDevices())
		if (reload)
			dispatch(getDevices(true))
	}
	//#endregion

	//#region Life Cycle

	useEffect(() => {
		const asyncFunc = async () => {
			handleTabs()
			await getData(true)
		}
		asyncFunc()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	this.handleTabs()
	// 	await this.getData(true)
	// }

	useEffect(() => {
		handleTabs()

		if (saved === true) {
			// const { selected } = this.state
			// const { devices } = this.props
			let device = devices[devices.findIndex(d => d.id === selected[0])]
			if (device) {
				if (dispatch(isFav({ id: device.id, type: 'device' }))) {
					s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.device') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
				if (!dispatch(isFav({ id: device.id, type: 'device' }))) {
					s('snackbars.favorite.removed', { name: device.name, type: t('favorites.types.device') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname, saved])
	// componentDidUpdate = (prevProps) => {
	// 	if (this.props.location.pathname !== prevProps.location.pathname) {
	// 		this.handleTabs()
	// 	}
	// 	if (this.props.saved === true) {
	// 		const { selected } = this.state
	// 		const { devices } = this.props
	// 		let device = devices[devices.findIndex(d => d.id === selected[0])]
	// 		if (device) {
	// 			if (this.props.isFav({ id: device.id, type: 'device' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: device.name, type: this.props.t('favorites.types.device') })
	// 				this.props.finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 			if (!this.props.isFav({ id: device.id, type: 'device' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: device.name, type: this.props.t('favorites.types.device') })
	// 				this.props.finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 		}
	// 	}
	// }

	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }

	//#endregion

	//#region Handlers

	const handleCalibrateFlow = () => {
		history.push(`/device/${selected[0]}/setup`)
	}

	const handleDeviceEdit = () => {
		// const { selected } = this.state
		history.push({
			pathname: `/device/${selected[0]}/edit`,
			prevURL: '/devices/list'
		})
	}

	const handleOpenAssignOrg = () => {
		setOpenAssignOrg(true)
		setAnchorElMenu(null)
		// this.setState({ openAssignOrg: true, anchorElMenu: null })
	}

	const handleCloseAssignOrg = async reload => {
		if (reload) {
			setOpenAssignOrg(false)
			// this.setState({ openAssignOrg: false })
			await getData(true).then(() => {
				snackBarMessages(2)
			})
		}
		else {
			setOpenAssignOrg(false)
			// this.setState({ openAssignOrg: false })
		}
	}

	const handleOpenAssignCollection = () => {
		setOpenAssignCollection(true)
		setAnchorElMenu(null)
		// this.setState({ openAssignCollection: true, anchorElMenu: null })
	}

	const handleCloseAssignCollection = async reload => {
		if (reload) {
			setOpenAssignCollection(false)
			// this.setState({ openAssignCollection: false })
			await getData(true).then(() => {
				snackBarMessages(1)
			})
		}
		else {
			setOpenAssignCollection(false)
			// this.setState({ openAssignCollection: false, })
		}

	}

	// const handleFilterKeyword = (value) => {
	// 	setStateFilters({ ...stateFilters, keyword: value })
	// 	// this.setState({
	// 	// 	filters: {
	// 	// 		...this.state.filters,
	// 	// 		keyword: value
	// 	// 	}
	// 	// })
	// }
	const handleDeviceClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: '/device/' + id, prevURL: '/devices/list' })
	}
	const handleFavClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: '/device/' + id, prevURL: '/devices/favorites' })
	}
	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected(devices.map(n => n.id))
			// this.setState({ selected: devices.map(n => n.id) });
			return;
		}
		setSelected([])
		// this.setState({ selected: [] });
	};

	const handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		// const { selected } = this.state;
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
		setSelected(newSelected)
		// this.setState({ selected: newSelected });
	};

	const handleUnassignDevices = async () => {
		// const { selected } = this.state
		let devices = []
		devices = await Promise.all(selected.map(s => getDevice(s))).then(rs => rs)
		await Promise.all(devices.map(d => unassignDeviceFromCollection({
			id: d.dataCollection,
			deviceId: d.id
		}))).catch((e) => {
			snackBarMessages(4)
		}).then(() => { handleCloseUnassignDialog(true) })
	}

	const handleOpenUnassignDialog = () => {
		setOpenUnassign(true)
		setAnchorElMenu(null)
		// this.setState({ openUnassign: true, anchorElMenu: null })
	}

	const handleCloseUnassignDialog = msg => async e => {
		if (e) {
			e.preventDefault()
		}
		setOpenUnassign(false)
		setAnchorElMenu(null)
		// this.setState({ openUnassign: false, anchorElMenu: null })
		if (msg) {
			snackBarMessages(3)
			await getData(true)
		}
	}

	const handleRequestSortFunc = key => (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		dispatch(sortData(key, property, order))
		// handleRequestSort(property, order, this.props.devices)
		setOrder(newOrder)
		setOrderBy(property)
		// this.setState({ order, orderBy: property })
	}

	//#endregion

	const renderConfirmUnassign = () => {
		// const { openUnassign, selected } = this.state
		// const { t, devices } = this.props
		return <Dialog
			open={openUnassign}
			onClose={handleCloseUnassignDialog(false)}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.unassign.title.devicesFromCollection')}</DialogTitle>
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
				<Button onClick={handleCloseUnassignDialog(false)} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleUnassignDevices} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	const renderLoader = () => {
		return <CircularLoader />
	}

	const renderTableToolBarContent = () => {
		return null
	}

	const renderAssignDC = () => {
		// const { selected, openAssignCollection } = this.state
		// const { t } = this.props
		return <AssignDC
			deviceId={selected[0] ? selected[0] : 0}
			open={openAssignCollection}
			handleClose={handleCloseAssignCollection}
			t={t}
		/>
	}

	const renderAssignOrg = () => {
		// const { selected, openAssignOrg } = this.state
		// const { t, devices } = this.props
		return <AssignOrg
			devices
			open={openAssignOrg}
			handleClose={handleCloseAssignOrg}
			deviceId={selected.map(s => devices[devices.findIndex(d => d.id === s)])}
			t={t} />
	}

	const renderTable = (items, handleClick, key) => {
		// const { selected, order, orderBy } = this.state
		// const { t } = this.props
		return <DeviceTable
			classes={classes}
			data={filterItemsFunc(items)}
			handleCheckboxClick={handleCheckboxClick}//
			handleClick={handleClick}//
			handleRequestSort={handleRequestSortFunc(key)}//
			handleSelectAllClick={handleSelectAllClick}//
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={deviceHeaders()}
		/>
	}

	const renderTableToolbar = () => {
		// const { selected } = this.state
		// const { t } = this.props

		return <TableToolbar
			ft={ft()}
			reduxKey={'devices'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}

	const renderFavorites = () => {
		// const { classes, loading } = this.props
		return loading ? renderLoader() : <GridContainer justify={'center'}>
			<Paper className={classes.root}>
				{renderAssignDC()}
				{renderAssignOrg()}
				{renderConfirmUnassign()}
				{renderTableToolbar()}
				{renderTable(getFavs(), handleFavClick, 'favorites')}
			</Paper>
		</GridContainer>

	}

	const renderList = () => {
		// const { classes, devices, loading } = this.props
		return loading ? renderLoader() :
			<Fade in={true}>
				<GridContainer justify={'center'}>
					<Paper className={classes.root}>
						{renderAssignDC()}
						{renderAssignOrg()}
						{renderConfirmUnassign()}
						{renderTableToolbar()}
						{renderTable(devices, handleDeviceClick, 'devices')}
					</Paper>
				</GridContainer>
			</Fade>

	}

	const renderCards = () => {
		// const {  } = this.state
		// const { t, loading } = this.props
		return loading ? renderLoader() : <DevicesCards t={t} devices={filterItemsFunc(devices)} />
	}

	const renderMap = () => {
		// const { classes, mapTheme, t, devices, loading } = this.props
		return loading ? <CircularLoader /> : <GridContainer container justify={'center'} >
			<Paper className={classes.paper}>
				<OpenStreetMap
					t={t}
					mapTheme={mapTheme}
					markers={filterItemsFunc(devices)} />
			</Paper>
		</GridContainer>
	}

	// const { match } = this.props
	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/map`} render={() => renderMap()} />
				<Route path={`${match.path}/list`} render={() => renderList()} />
				<Route path={`${match.path}/grid`} render={() => renderCards()} />
				<Route path={`${match.path}/favorites`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>
		</Fragment>
	)
}

export default Devices