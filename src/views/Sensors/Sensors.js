import { Paper, IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import SensorTable from 'components/Sensors/SensorTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Delete, Edit, ViewList, ViewModule, Add, Star, StarBorder, CheckCircle, Block, DeviceHub } from 'variables/icons';
import { GridContainer, CircularLoader, DeleteDialog } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getSensors, /* setSensors, */ sortData } from 'redux/data';
import SensorCards from 'components/Sensors/SensorCards';
import { deleteSensor } from 'variables/dataSensors';
import { useLocalization, useSnackbar, useMatch, useHistory, useLocation } from 'hooks'

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	devices: state.data.sensors,
// 	loading: false, //!state.data.gotdevices,
// 	filters: state.appState.filters.sensors,
// 	user: state.settings.user
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getSensors: (reload, customerID, ua) => {
// 		return dispatch(getSensors(reload, customerID, ua))
// 	},
// 	setSensors: () => dispatch(setSensors()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

// @Andrei
const Sensors = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const match = useMatch()
	const history = useHistory()
	const location = useLocation()
	const dispatch = useDispatch()
	const classes = projectStyles()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const devices = useSelector(state => state.data.sensors)
	const loading = false
	const filters = useSelector(state => state.appState.filters.sensors)
	const user = useSelector(state => state.settings.user)

	const [openDelete, setOpenDelete] = useState(false)
	const [selected, setSelected] = useState([])
	// const [route, setRoute] = useState(0)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [stateFilters, /* setStateFilters */] = useState({ keyword: '' })
	const [ /*anchorElMenu */, setAnchorElMenu] = useState(null) // added

	const tabs = () => {
		// const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}

	const handleTabs = () => {
		// const { location } = this.props
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

	props.setHeader('devices.pageTitle', false, '', 'manage.sensors')
	props.setBC('sensors')
	props.setTabs({
		id: 'sensors',
		tabs: tabs(),
		route: handleTabs()
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		openDelete: false,
	// 		selected: [],
	// 		route: 0,
	// 		order: 'asc',
	// 		orderBy: 'id',
	// 		filters: {
	// 			keyword: ''
	// 		}
	// 	}
	// 	props.setHeader('devices.pageTitle', false, '', 'manage.sensors')
	// 	props.setBC('sensors')
	// 	props.setTabs({
	// 		id: 'sensors',
	// 		tabs: this.tabs(),
	// 		route: this.handleTabs()
	// 	})
	// }
	//#region Constants
	const dCommunication = () => {
		// const { classes } = props
		return [
			{ value: 0, label: t("sensors.fields.communications.blocked"), icon: <Block className={classes.blocked} /> },
			{ value: 1, label: t("sensors.fields.communications.allowed"), icon: <CheckCircle className={classes.allowed} /> }
		]
	}
	const ft = () => {
		// const { t } = this.props
		return [
			{ key: 'name', name: t('devices.fields.name'), type: 'string' },
			{ key: 'uuid', name: t('sensors.fields.uuid'), type: 'string' },
			{ key: 'communication', name: t('sensors.fields.communication'), type: 'dropDown', options: dCommunication() },
			{ key: 'reg_name', name: t('sensors.fields.registry'), type: 'string' },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const devicesHeader = () => {
		// const { t } = this.props
		return [
			{ id: 'id', label: t('devices.fields.id') },
			{ id: 'name', label: t('devices.fields.name') },
			{ id: 'uuid', label: t('sensors.fields.uuid') },
			{ id: 'communication', label: t('sensors.fields.communication') },
			{ id: 'reg_name', label: t('sensors.fields.registry') },
		]
	}
	const options = () => {
		// const { t, isFav, devices } = this.props
		// const { selected } = this.state

		let device = devices[devices.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'sensor',
			path: `/sensor/${device.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		let allOptions = [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj) }
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle
	useEffect(() => {
		handleTabs()
		if (user && accessLevel) {
			getData(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	this.handleTabs()
	// 	if (this.props.user && this.props.accessLevel) {
	// 		this.getData(true)
	// 	}

	// }

	useEffect(() => {
		if (saved === true) {
			// const { devices } = this.props
			// const { selected } = this.state
			let device = devices[devices.findIndex(d => d.id === selected[0])]
			if (device) {
				if (dispatch(isFav({ id: device.id, type: 'sensor' }))) {
					s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.device') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
				if (!dispatch(isFav({ id: device.id, type: 'sensor' }))) {
					s('snackbars.favorite.removed', { name: device.name, type: t('favorites.types.device') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
			}
		}
	}, [devices, dispatch, s, saved, selected, t])
	// componentDidUpdate = () => {
	// 	const { t, saved, s, isFav, finishedSaving } = this.props
	// 	if (saved === true) {
	// 		const { devices } = this.props
	// 		const { selected } = this.state
	// 		let device = devices[devices.findIndex(d => d.id === selected[0])]
	// 		if (device) {
	// 			if (isFav({ id: device.id, type: 'sensor' })) {
	// 				s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.device') })
	// 				finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 			if (!isFav({ id: device.id, type: 'sensor' })) {
	// 				s('snackbars.favorite.removed', { name: device.name, type: t('favorites.types.device') })
	// 				finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 		}
	// 	}
	// }

	//#endregion

	//#region Functions
	const addNewRegistry = () => history.push({ pathname: `/sensors/new`, prevURL: '/sensors/list' })

	const getFavs = () => {
		// const { order, orderBy } = this.state
		// const { favorites, devices } = this.props
		let favs = favorites.filter(f => f.type === 'sensor')
		let favSensors = favs.map(f => {
			return devices[devices.findIndex(d => d.id === f.id)]
		})
		favSensors = handleRequestSort(orderBy, order, favSensors)
		return favSensors
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
		// const rFilters = filters
		// const filters = stateFilters
		// const { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), filters)
	}
	const snackBarMessages = (msg) => {
		// const { /*  devices, */ s } = this.props
		// const { selected } = this.state
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.deviceToRegistry', { device: ``, what: 'Device' })
				break;
			case 6:
				// s('snackbars.assign.deviceToRegistry', { device: `${devices[devices.findIndex(c => c.id === selected[0])].name}`, device: display })
				break
			default:
				break;
		}
	}
	// const reload = async () => {
	// 	await getData(true)
	// }
	const getData = async (reload) => {
		// const { getSensors, accessLevel, user } = this.props
		if (accessLevel || user) {
			if (reload)
				dispatch(getSensors(true, user.org.id, accessLevel.apisuperuser ? true : false))
			// setSensors()
		}
	}
	//#endregion

	//#region Handlers

	const handleEdit = () => {
		// const { selected } = this.state
		history.push({ pathname: `/sensor/${selected[0]}/edit`, prevURL: `/sensors/list` })
	}

	const handleRequestSortFunc = key => (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		dispatch(sortData(key, property, newOrder))
		setOrder(newOrder) // hopefully it sets the correct variable name
		setOrderBy(property)
		// this.setState({ order, orderBy: property })
	}
	const handleRegistryClick = id => e => {
		e.stopPropagation()
		history.push('/sensor/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: '/sensor/' + id, prevURL: '/sensors/favorites' })
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

	// const handleTabsChange = (e, value) => {
	// 	setRoute(value)
	// 	// this.setState({ route: value })
	// }
	const handleDeleteSensors = async () => {
		// const { selected } = this.state
		Promise.all([selected.map(u => {
			return deleteSensor(u)
		})]).then(async () => {
			setOpenDelete(false)
			setAnchorElMenu(null)
			setSelected([])
			// this.setState({ openDelete: false, anchorElMenu: null, selected: [] })
			await getData(true).then(
				() => snackBarMessages(1)
			)
		})
	}
	const handleSelectAllClick = (arr, checked) => {
		if (checked) {
			setSelected(arr)
			// this.setState({ selected: arr })
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

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
		setAnchorElMenu(null)
		// this.setState({ openDelete: true, anchorElMenu: null })
	}

	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
		// this.setState({ openDelete: false })
	}


	//#endregion

	const renderDeleteDialog = () => {
		// const { openDelete, selected } = this.state
		// const { t, devices } = this.props
		let data = selected.map(s => devices[devices.findIndex(d => d.id === s)])
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.devices'}
			message={'dialogs.delete.message.devices'}
			open={openDelete}
			icon={<DeviceHub />}
			handleCloseDeleteDialog={handleCloseDeleteDialog}
			handleDelete={handleDeleteSensors}
			data={data}
			dataKey={'name'}
		/>
	}

	const renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.device')}>
				<IconButton aria-label='Add new device' onClick={addNewRegistry}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	const renderTableToolBar = () => {
		// const { t } = this.props
		// const { selected } = this.state
		return <TableToolbar
			ft={ft()}
			reduxKey={'sensors'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}




	const renderTable = (items, handleClick, key) => {
		// const { t } = this.props
		// const { order, orderBy, selected } = this.state
		return <SensorTable
			data={filterItemsFunc(items)}
			handleCheckboxClick={handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={handleRequestSortFunc(key)}
			handleSelectAllClick={handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={devicesHeader()}
		/>
	}

	const renderCards = () => {
		// const { t, history, devices, loading } = this.props
		return loading ? <CircularLoader /> :
			<SensorCards sensors={filterItems(devices)} t={t} history={history} />
		// null
	}

	const renderFavorites = () => {
		// const { classes, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{/* {this.renderAssignProject()} */}
				{/* {this.renderAssignDevice()} */}
				{/* {selected.length > 0 ? this.renderDeviceUnassign() : null} */}
				{renderTableToolBar()}
				{renderTable(getFavs(), handleFavClick, 'favorites')}
				{renderDeleteDialog()}
			</Paper>
			}
		</GridContainer>
	}

	const renderSensors = () => {
		// const { classes, devices, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{/* {this.renderAssignProject()} */}
				{/* {this.renderAssignDevice()} */}
				{/* {selected.length > 0 ? this.renderDeviceUnassign() : null} */}
				{renderTableToolBar()}
				{renderTable(devices, handleRegistryClick, 'sensors')}
				{/* {this.renderConfirmDelete()} */}
				{renderDeleteDialog()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	// const { devices, route, filters } = this.state
	// const { /* history,  */match } = this.props
	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderSensors()} />
				<Route path={`${match.path}/grid`} render={() => renderCards()} />
				<Route path={`${match.path}/favorites`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>

		</Fragment>
	)
}

export default Sensors