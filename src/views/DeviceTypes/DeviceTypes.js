import { Paper, Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, IconButton, Fade, Tooltip, Divider } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TableToolbar from 'components/Table/TableToolbar';
import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Edit, ViewList, Add, Star, StarBorder, /* SignalWifi2Bar, */ Memory, Delete } from 'variables/icons';
import { GridContainer, CircularLoader } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getDeviceTypes, /* setDeviceTypes, */ sortData } from 'redux/data';
import DeviceTypeTable from 'components/DeviceTypes/DeviceTypeTable';
import { deleteDeviceType } from 'variables/dataDeviceTypes';
import { useSnackbar, useLocalization, useMatch, useLocation, useHistory } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	devicetypes: state.data.deviceTypes,
// 	loading: false, //!state.data.gotdevicetypes,
// 	filters: state.appState.filters.devicetypes,
// 	user: state.settings.user
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getDeviceTypes: (reload, customerID, ua) => dispatch(getDeviceTypes(reload, customerID, ua)),
// 	setDeviceTypes: () => dispatch(setDeviceTypes()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

// @Andrei
const DeviceTypes = props => {
	const classes = projectStyles()
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const t = useLocalization()
	const match = useMatch()
	const location = useLocation()
	const history = useHistory()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const devicetypes = useSelector(state => state.data.deviceTypes)
	const loading = false
	const filters = useSelector(state => state.appState.filters.devicetypes)
	const user = useSelector(state => state.settings.user)

	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	// const [route, setRoute] = useState(0)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [stateFilters, /* setStateFilters */] = useState({ keyword: '' })
	const [/* anchorElMenu */, setAnchorElMenu] = useState(null) // added

	const tabs = () => {
		// const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			// { id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
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

	props.setHeader('devicetypes.pageTitle', false, '', 'manage.devicetypes')
	props.setBC('devicetypes')
	props.setTabs({
		id: 'devicetypes',
		tabs: tabs(),
		route: handleTabs()
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		selected: [],
	// 		openDelete: false,
	// 		route: 0,
	// 		order: 'asc',
	// 		orderBy: 'id',
	// 		filters: {
	// 			keyword: '',
	// 		}
	// 	}
	// 	props.setHeader('devicetypes.pageTitle', false, '', 'manage.devicetypes')
	// 	props.setBC('devicetypes')
	// 	props.setTabs({
	// 		id: 'devicetypes',
	// 		tabs: this.tabs(),
	// 		route: this.handleTabs()
	// 	})
	// }
	//#region Constants

	// const dLiveStatus = () => {
	// 	// const { t, classes } = this.props
	// 	return [
	// 		{ value: 0, label: t("devices.status.redShort"), icon: <SignalWifi2Bar className={classes.redSignal} /> },
	// 		{ value: 1, label: t("devices.status.yellowShort"), icon: <SignalWifi2Bar className={classes.yellowSignal} /> },
	// 		{ value: 2, label: t("devices.status.greenShort"), icon: <SignalWifi2Bar className={classes.greenSignal} /> }
	// 	]
	// }
	const ft = () => {
		// const { t } = this.props
		return [
			{ key: 'name', name: t('devicetypes.fields.name'), type: 'string' },
			{ key: 'customer_name', name: t('devices.fields.org'), type: 'string' },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const devicetypesHeader = () => {
		// const { t } = this.props
		return [
			{ id: 'name', label: t('devicetypes.fields.name') },
			{ id: 'customer_name', label: t('devices.fields.org') }
		]
	}
	const options = () => {
		// const { t, isFav, devicetypes } = this.props
		// const { selected } = this.state
		let devicetype = devicetypes[devicetypes.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: devicetype.id,
			name: devicetype.name,
			type: 'devicetype',
			path: `/devicetype/${devicetype.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		let allOptions = [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			// { label: t('menus.assign.devicetypeToProject'), func: this.handleOpenAssignProject, single: true, icon: LibraryBooks },
			// { label: t('menus.assign.deviceToDeviceType'), func: this.handleOpenAssignDevice, single: true, icon: DeviceHub },
			// { label: t('menus.unassign.deviceFromDeviceType'), func: this.handleOpenUnassignDevice, single: true, icon: LayersClear, dontShow: devicetypes[devicetypes.findIndex(c => c.id === selected[0])].activeDeviceStats ? false : true },
			// { label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj) },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete },
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle
	useEffect(() => {
		handleTabs()
		getData(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	this.handleTabs()
	// 	this.getData(true)

	// }
	useEffect(() => {
		if (saved === true) {
			// const { devicetypes } = this.props
			// const { selected } = this.state
			let devicetype = devicetypes[devicetypes.findIndex(d => d.id === selected[0])]
			if (devicetype) {
				if (dispatch(isFav({ id: devicetype.id, type: 'devicetype' }))) {
					s('snackbars.favorite.saved', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
				if (!dispatch(isFav({ id: devicetype.id, type: 'devicetype' }))) {
					s('snackbars.favorite.removed', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
			}
		}
	}, [devicetypes, dispatch, s, saved, selected, t])
	// componentDidUpdate = () => {
	// 	const { t, saved, s, isFav, finishedSaving } = this.props
	// 	if (saved === true) {
	// 		const { devicetypes } = this.props
	// 		const { selected } = this.state
	// 		let devicetype = devicetypes[devicetypes.findIndex(d => d.id === selected[0])]
	// 		if (devicetype) {
	// 			if (isFav({ id: devicetype.id, type: 'devicetype' })) {
	// 				s('snackbars.favorite.saved', { name: devicetype.name, type: t('favorites.types.devicetype') })
	// 				finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 			if (!isFav({ id: devicetype.id, type: 'devicetype' })) {
	// 				s('snackbars.favorite.removed', { name: devicetype.name, type: t('favorites.types.devicetype') })
	// 				finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 		}
	// 	}
	// }
	// componentWillUnmount = () => {
	// 	// this._isMounted = 0
	// }
	//#endregion

	//#region Functions
	const addNewDeviceType = () => history.push({ pathname: `/devicetypes/new`, prevURL: '/devicetypes/list' })

	const getFavs = () => {
		// const { order, orderBy } = this.state
		// const { favorites, devicetypes } = this.props
		let favs = favorites.filter(f => f.type === 'devicetype')
		let favDeviceTypes = favs.map(f => {
			return devicetypes[devicetypes.findIndex(d => d.id === f.id)]
		})
		favDeviceTypes = handleRequestSort(orderBy, order, favDeviceTypes)
		return favDeviceTypes
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
		// const { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), filters)
	}
	const snackBarMessages = (msg, display) => {
		// const { devicetypes, s } = this.props
		// const { selected } = this.state
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
	// const reload = async () => {
	// 	await getData(true)
	// }
	const getData = async (reload) => {
		// const { getDeviceTypes/*  setDeviceTypes */, accessLevel, user } = this.props
		if (accessLevel || user) {
			if (reload)
				dispatch(getDeviceTypes(true, user.org.id, accessLevel.apisuperuser ? true : false))
		}
	}
	//#endregion

	//#region Handlers

	const handleEdit = () => {
		// const { selected } = this.state
		history.push({ pathname: `/devicetype/${selected[0]}/edit`, prevURL: `/devicetypes/list` })
	}

	const handleRequestSortFunc = key => (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		dispatch(sortData(key, property, order))
		setOrder(newOrder)
		setOrderBy(property)
		// this.setState({ order, orderBy: property })
	}
	const handleDeviceTypeClick = id => e => {
		e.stopPropagation()
		history.push('/devicetype/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: '/devicetype/' + id, prevURL: '/devicetypes/favorites' })
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

	const handleDeleteDeviceTypes = async () => {
		// const { selected } = this.state
		Promise.all([selected.map(u => {
			return deleteDeviceType(u)
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
	//#endregion

	const renderConfirmDelete = () => {
		// const { openDelete, selected } = this.state
		// const { t, devicetypes } = this.props
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.deviceTypes')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.deviceTypes')}
				</DialogContentText>
				<List dense={true}>
					<Divider />
					{selected.map(s => {
						let u = devicetypes[devicetypes.findIndex(d => d.id === s)]
						return u ? <ListItem divider key={u.id}>
							<ListItemIcon>
								<Memory />
							</ListItemIcon>
							<ListItemText primary={u.name} />
						</ListItem> : null
					})
					}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleDeleteDeviceTypes} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}


	const renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.devicetype')}>
				<IconButton aria-label='Add new devicetype' onClick={addNewDeviceType}>
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
			reduxKey={'devicetypes'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}



	const renderTable = (items, handleClick, key) => {
		// const { t } = this.props
		// const { order, orderBy, selected } = this.state
		return <DeviceTypeTable
			data={filterItemsFunc(items)}
			handleCheckboxClick={handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={handleRequestSortFunc(key)}
			handleSelectAllClick={handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={devicetypesHeader()}
		/>
	}

	const renderCards = () => {
		// const { /* t, history, devicetypes, */ loading } = props
		return loading ? <CircularLoader /> :
			// <DeviceTypesCards devicetypes={this.filterItems(devicetypes)} t={t} history={history} />
			null
	}

	const renderFavorites = () => {
		// const { classes, loading } = this.props
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(getFavs(), handleFavClick, 'favorites')}
				{renderConfirmDelete()}
			</Paper>
			}
		</GridContainer>
	}

	const renderDeviceTypes = () => {
		// const { classes, devicetypes, loading } = this.props
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(devicetypes, handleDeviceTypeClick, 'devicetypes')}
				{renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	// const { match } = this.props
	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderDeviceTypes()} />
				<Route path={`${match.path}/grid`} render={() => renderCards()} />
				<Route path={`${match.path}/favorites`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>

		</Fragment>
	)
}

export default DeviceTypes