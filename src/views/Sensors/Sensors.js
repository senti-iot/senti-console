
import { Paper, IconButton, Fade, Tooltip } from '@material-ui/core';
import SensorTable from 'components/Sensors/SensorTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
// import { handleRequestSort } from 'variables/functions';
import { Delete, Edit, ViewList, ViewModule, Add, Star, StarBorder, CheckCircle, Block, DeviceHub } from 'variables/icons';
import { GridContainer, CircularLoader, DeleteDialog } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getSensors, sortData } from 'redux/data';
import SensorCards from 'components/Sensors/SensorCards';
import { deleteSensor } from 'variables/dataSensors';
import { useLocalization, useSnackbar, useHistory, useDispatch, useSelector } from 'hooks';
import sensorsStyles from 'assets/jss/components/devices/sensorsStyles';

const Sensors = props => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	const history = useHistory()
	const location = useLocation()
	const dispatch = useDispatch()
	const classes = sensorsStyles()

	//Redux
	const accessLevel = useSelector(s => s.settings.user.privileges)
	const favorites = useSelector(s => s.data.favorites)
	const saved = useSelector(s => s.favorites.saved)
	const devices = useSelector(s => s.data.sensors)
	const loading = useSelector(s => !s.data.gotdevices)
	const filters = useSelector(s => s.appState.filters.sensors)
	const user = useSelector(s => s.settings.user)

	//State
	const [openDelete, setOpenDelete] = useState(false)
	const [selected, setSelected] = useState([])
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')

	//Const
	const dCommunication = [
		{ value: 0, label: t("sensors.fields.communications.blocked"), icon: <Block className={classes.blocked} /> },
		{ value: 1, label: t("sensors.fields.communications.allowed"), icon: <CheckCircle className={classes.allowed} /> }
	]

	const ft = [
		{ key: 'name', name: t('devices.fields.name'), type: 'string' },
		{ key: 'uuid', name: t('sensors.fields.uuid'), type: 'string' },
		{ key: 'communication', name: t('sensors.fields.communication'), type: 'dropDown', options: dCommunication },
		{ key: 'reg_name', name: t('sensors.fields.registry'), type: 'string' },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]

	const devicesHeader = [
		{ id: 'id', label: t('devices.fields.id') },
		{ id: 'name', label: t('devices.fields.name') },
		{ id: 'uuid', label: t('sensors.fields.uuid') },
		{ id: 'communication', label: t('sensors.fields.communication') },
		{ id: 'reg_name', label: t('sensors.fields.registry') },
	]
	const options = () => {

		let device = devices[devices.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'sensor',
			path: `/sensor/${device.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		let allOptions = [
			{ label: t('menus.edit'), func: handleEditSensor, single: true, icon: Edit },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete },
			{
				single: true,
				label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'),
				icon: isFavorite ? Star : StarBorder,
				func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj)
			}
		]
		return allOptions
	}
	//useCallbacks
	const getData = useCallback(async () => {
		if (user && accessLevel) {
			dispatch(await getSensors(true, user.org.id, accessLevel.apisuperuser ? true : false))
		}
	}, [accessLevel, dispatch, user])

	//useEffects
	useEffect(() => {
		const tabs = [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `list` },
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `favorites` }
		]
		const handleTabs = () => {
			if (location.pathname.includes('grid'))
				return 1
			else {
				if (location.pathname.includes('favorites'))
					return 2
				else {
					return 0
				}
			}
		}
		props.setHeader('devices.pageTitle', false, '', 'manage.sensors')
		props.setBC('sensors')
		props.setTabs({
			id: 'sensors',
			tabs: tabs,
			route: handleTabs()
		})

	}, [location.pathname, props, t])

	useEffect(() => {
		if (saved === true) {
			if (selected.length > 1) {
				s('snackbars.favorite.updated')
			}
			else {
				let device = devices[devices.findIndex(d => d.id === selected[0])]
				if (device) {
					if (dispatch(isFav({ id: device.id, type: 'sensor' }))) {
						s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.device') })
						finishedSaving()
						setSelected([])
					}
					if (!dispatch(isFav({ id: device.id, type: 'sensor' }))) {
						s('snackbars.favorite.removed', { name: device.name, type: t('favorites.types.device') })
						finishedSaving()
						setSelected([])
					}
				}
			}
		}

	}, [devices, dispatch, s, saved, selected, t])

	useEffect(() => {
		const getSens = async () => await getData()
		getSens()
	}, [getData])


	//Handlers

	const handleAddNewSensor = () => history.push({ pathname: `/sensors/new`, prevURL: '/sensors/list' })
	const handleEditSensor = () => { history.push({ pathname: `/sensor/${selected[0]}/edit`, prevURL: `/sensors/list` }) }

	const getFavorites = () => {
		let favs = favorites.filter(f => f.type === 'sensor')
		let favSensors = favs.map(f => {
			return devices[devices.findIndex(d => d.id === f.id)]
		})
		favSensors = handleRequestSort(orderBy, order, favSensors)
		return favSensors
	}
	const addToFavorites = (favObj) => {
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = (favObj) => {
		dispatch(removeFromFav(favObj))
	}

	const filterItems = (data) => {
		const rFilters = filters
		return customFilterItems(data, rFilters)
	}
	const snackBarMessages = (msg) => {
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
				break
			default:
				break;
		}
	}

	const handleRequestSort = key => (event, property, way) => {
		let direction = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			direction = 'asc'
		}
		dispatch(sortData(key, property, direction))
		setOrder(direction)
		setOrderBy(property)
	}
	const handleSensorClick = id => e => {
		e.stopPropagation()
		history.push('/sensor/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: '/sensor/' + id, prevURL: '/sensors/favorites' })
	}

	const handleDeleteSensors = async () => {
		Promise.all([selected.map(u => {
			return deleteSensor(u)
		})]).then(async (rs) => {
			selected.forEach(u => {
				let device = devices[devices.findIndex(d => d.id === u)]
				let favObj = {
					id: device.id,
					name: device.name,
					type: 'sensor',
					path: `/sensor/${device.id}`
				}
				removeFromFavorites(favObj)
			})

			setOpenDelete(false)
			setSelected([])
			await getData(true).then(() => {
				snackBarMessages(1)
			})
		})
	}
	const handleSelectAllClick = (arr, checked) => {
		if (checked) {
			setSelected(arr)
			return;
		}
		setSelected([])
	}

	const handleCheckboxClick = (event, id) => {
		event.stopPropagation()
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
	}

	const handleOpenDeleteDialog = () => setOpenDelete(true)
	const handleCloseDeleteDialog = () => setOpenDelete(false)


	//#endregion

	const renderDeleteDialog = () => {
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
		return <Fragment>
			<Tooltip title={t('menus.create.device')}>
				<IconButton aria-label='Add new device' onClick={handleAddNewSensor}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	const renderTableToolBar = () => {
		return <TableToolbar
			ft={ft}
			reduxKey={'sensors'}
			numSelected={selected.length}
			options={options}
			content={renderTableToolBarContent()}
			t={t}
		/>
	}

	const renderTable = (items, handleClick, key) => {
		return <SensorTable
			data={filterItems(items)}
			handleCheckboxClick={handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={handleRequestSort(key)}
			handleSelectAllClick={handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			tableHead={devicesHeader}
		/>
	}

	const renderCards = () => {
		return loading ? <CircularLoader /> :
			<SensorCards sensors={filterItems(devices)} t={t} history={history} />
		// null
	}

	const renderFavorites = () => {
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(getFavorites(), handleFavClick, 'favorites')}
				{renderDeleteDialog()}
			</Paper>
			}
		</GridContainer>
	}

	const renderSensors = () => {
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(devices, handleSensorClick, 'sensors')}
				{renderDeleteDialog()}
			</Paper></Fade>
			}
		</GridContainer>
	}


	return (
		<Fragment>
			<Switch>
				<Route path={`/sensors/list`} render={() => renderSensors()} />
				<Route path={`/sensors/grid`} render={() => renderCards()} />
				<Route path={`/sensors/favorites`} render={() => renderFavorites()} />
				<Redirect path={`/sensors`} to={`/sensors/list`} />
			</Switch>

		</Fragment>
	)
}






export default Sensors