import { Paper, Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, IconButton, Fade, Tooltip, Divider } from '@material-ui/core'
import projectStyles from 'assets/jss/views/projects'
import TableToolbar from 'components/Table/TableToolbar'
import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { handleRequestSort } from 'variables/functions'
import { Edit, ViewList, Add, Star, StarBorder, /* SignalWifi2Bar, */ Memory, Delete } from 'variables/icons'
import { GridContainer, CircularLoader } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites'
import { customFilterItems } from 'variables/Filters'
import { getDeviceTypes, /* setDeviceTypes, */ sortData } from 'redux/data'
import DeviceTypeTable from 'components/DeviceTypes/DeviceTypeTable'
import { deleteDeviceType } from 'variables/dataDeviceTypes'
import { useSnackbar, useLocalization, useMatch, useLocation, useHistory, useAuth } from 'hooks'


const DeviceTypes = props => {
	//Hooks
	const classes = projectStyles()
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const t = useLocalization()
	const match = useMatch()
	const location = useLocation()
	const history = useHistory()
	const Auth = useAuth()
	const hasAccess = Auth.hasAccess
	const hasAccessList = Auth.hasAccessList
	//Redux
	const accessLevel = useSelector(s => s.auth.accessLevel.role)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const devicetypes = useSelector(state => state.data.deviceTypes)
	const loading = false
	const filters = useSelector(state => state.appState.filters.devicetypes)
	const user = useSelector(state => state.settings.user)

	//State
	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')

	//Const
	const { setHeader, setBC, setTabs } = props

	const ft = [
		{ key: 'name', name: t('devicetypes.fields.name'), type: 'string' },
		{ key: 'customer_name', name: t('devices.fields.org'), type: 'string' },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]

	const devicetypesHeader = [
		{ id: 'name', label: t('devicetypes.fields.name') },
		{ id: 'customer_name', label: t('devices.fields.org') }
	]

	const options = () => {
		let devicetype = devicetypes[devicetypes.findIndex(d => d.uuid === selected[0])]
		let favObj = {
			id: devicetype.uuid,
			name: devicetype.name,
			type: 'devicetype',
			path: `/devicetype/${devicetype.uuid}`
		}
		let isFavorite = dispatch(isFav(favObj))
		let allOptions = [
			{
				single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'),
				icon: isFavorite ? Star : StarBorder,
				func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj)
			},
			{ isDivider: true, dontShow: selected.length > 1 },
			{ disabled: !hasAccess(selected[0], 'deviceType.modify'), label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			{ disabled: !hasAccessList(selected, 'deviceType.delete'), label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete },
		]
		return allOptions
	}
	//useCallbacks

	//useEffects
	useEffect(() => {

		const tabs = [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `list` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `favorites` }
		]
		const handleTabs = () => {
			if (location.pathname.includes('favorites'))
				return 2
			else {
				return 0
			}
		}

		setHeader('devicetypes.pageTitle', false, '', 'manage.devicetypes')
		setBC('devicetypes')
		setTabs({
			id: 'devicetypes',
			tabs: tabs,
			route: handleTabs()
		})

		getData(true)
		//eslint-disable-next-line
	}, [])
	useEffect(() => {
		if (saved === true) {
			let devicetype = devicetypes[devicetypes.findIndex(d => d.uuid === selected[0])]
			if (devicetype) {
				if (dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' }))) {
					s('snackbars.favorite.saved', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
					setSelected([])
				}
				if (!dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' }))) {
					s('snackbars.favorite.removed', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
					setSelected([])
				}
			}
		}
	}, [devicetypes, dispatch, s, saved, selected, t])

	//Handlers

	//#region Functions

	const getFavs = () => {
		// const { order, orderBy } = this.state
		// const { favorites, devicetypes } = this.props
		let favs = favorites.filter(f => f.type === 'devicetype')
		let favDeviceTypes = favs.map(f => {
			return devicetypes[devicetypes.findIndex(d => d.uuid === f.id)]
		})
		favDeviceTypes = handleRequestSort(orderBy, order, favDeviceTypes)
		return favDeviceTypes
	}
	const addToFavorites = (favObj) => {
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = (favObj) => {
		dispatch(removeFromFav(favObj))
	}
	const filterItemsFunc = (data) => {
		return customFilterItems(data, filters)
	}
	const snackBarMessages = (msg, display) => {
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break
			case 2:
				s('snackbars.exported')
				break
			case 3:
				s('snackbars.assign.deviceToDeviceType', { devicetype: ``, what: 'Device' })
				break
			case 6:
				s('snackbars.assign.deviceToDeviceType', { devicetype: `${devicetypes[devicetypes.findIndex(c => c.uuid === selected[0])].name}`, device: display })
				break
			default:
				break
		}
	}

	const getData = async (reload) => {
		/**
		 * @Andrei
		 * this also needs normalization
		 * Check Registries or Sensors
		 */
		if (accessLevel && user) {
			if (reload)
				dispatch(getDeviceTypes(true))
		}
	}
	//#endregion

	//#region Handlers

	const handleAddNew = () => history.push({ pathname: `/devicetypes/new`, prevURL: '/devicetypes/list' })

	const handleEdit = () => {
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
	}

	const handleDeviceTypeClick = id => e => {
		e.stopPropagation()
		history.push('/devicetype/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: '/devicetype/' + id, prevURL: '/devicetypes/favorites' })
	}

	const handleSelectAllClick = (arr, checked) => {
		if (checked) {
			setSelected(arr)
			return
		}
		setSelected([])
	}

	const handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const selectedIndex = selected.indexOf(id)
		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			)
		}
		setSelected(newSelected)
	}

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}

	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}

	const handleDeleteDeviceTypes = async () => {
		Promise.all([selected.map(u => {
			return deleteDeviceType(u)
		})]).then(async () => {
			setOpenDelete(false)
			setSelected([])
			await getData(true).then(
				() => snackBarMessages(1)
			)
		})
	}
	//#endregion

	const renderConfirmDelete = () => {
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
						let u = devicetypes[devicetypes.findIndex(d => d.uuid === s)]
						return u ? <ListItem divider key={u.uuid}>
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


	const renderTableToolBarContent = () =>
		hasAccess(null, 'deviceType.create') ? <Tooltip title={t('menus.create.devicetype')}>
			<IconButton aria-label='Add new devicetype' onClick={handleAddNew}>
				<Add />
			</IconButton>
		</Tooltip> : null


	const renderTableToolBar = () =>
		 <TableToolbar
			ft={ft}
			reduxKey={'devicetypes'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>


	const renderTable = (items, handleClick, key) =>
		<DeviceTypeTable
			data={filterItemsFunc(items)}
			handleCheckboxClick={handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={handleRequestSortFunc(key)}
			handleSelectAllClick={handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={devicetypesHeader}
		/>


	// const renderCards = () => {
	// 	// const { /* t, history, devicetypes, */ loading } = props
	// 	// <DeviceTypesCards devicetypes={this.filterItems(devicetypes)} t={t} history={history} />
	// 	return loading ? <CircularLoader /> : null

	// }

	const renderFavorites = () =>
		<GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(getFavs(), handleFavClick, 'favorites')}
				{renderConfirmDelete()}
			</Paper>
			}
		</GridContainer>


	const renderDeviceTypes = () =>
		<GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(devicetypes, handleDeviceTypeClick, 'devicetypes')}
				{renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>

	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderDeviceTypes()} />
				{/* <Route path={`${match.path}/grid`} render={() => renderCards()} /> */}
				<Route path={`${match.path}/favorites`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>

		</Fragment>
	)
}

export default DeviceTypes