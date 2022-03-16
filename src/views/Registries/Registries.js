import {
	Paper, Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText,
	DialogActions, Button, ListItemIcon, IconButton, Fade, Tooltip, Divider
} from '@material-ui/core'
import RegistryTable from 'components/Registry/RegistryTable'
import TableToolbar from 'components/Table/TableToolbar'
import React, { useState, Fragment, useCallback, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Delete, Edit, ViewList, ViewModule, Add, Star, StarBorder, InputIcon } from 'variables/icons'
import { GridContainer, CircularLoader, /* AssignProject */ } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites'
import { customFilterItems } from 'variables/Filters'
import { getRegistries, sortData } from 'redux/data'
import RegistryCards from 'components/Registry/RegistryCards'
import { deleteRegistry } from 'variables/dataRegistry'
import { useLocalization, useLocation, useHistory, useDispatch, useSnackbar, useSelector, useAuth  } from 'hooks'
import registriesStyles from 'assets/jss/components/registries/registriesStyles'
import { handleRequestSort } from 'variables/functions'

const Registries = props => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	const location = useLocation()
	const history = useHistory()
	const dispatch = useDispatch()
	const classes = registriesStyles()
	const Auth = useAuth()

	//Redux
	const accessLevel = useSelector(s => s.auth.accessLevel.role)
	const favorites = useSelector(s => s.data.favorites)
	const saved = useSelector(s => s.favorites.saved)
	const registries = useSelector(s => s.data.registries)
	const loading = useSelector(s => !s.data.gotregistries)
	const dataLoading = useSelector(s => !s.data.getRegistries)
	const filters = useSelector(s => s.appState.filters.registries)
	const user = useSelector(s => s.settings.user)

	//State
	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('name')

	//Const
	const dProtocols = [
		{ value: 0, label: t("registries.fields.protocols.none") },
		{ value: 1, label: t("registries.fields.protocols.mqtt") },
		{ value: 2, label: t("registries.fields.protocols.http") },
		{ value: 3, label: `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}` }
	]

	const ft = [
		{ key: 'name', name: t('registries.fields.name'), type: 'string' },
		{ key: 'customer_name', name: t('orgs.fields.name'), type: 'string' },
		{ key: 'created', name: t('registries.fields.created'), type: 'date' },
		{ key: 'protocol', name: t('registries.fields.protocol'), type: 'dropDown', options: dProtocols },
		// { key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]

	const registriesHeader = [
		{ id: 'name', label: t('registries.fields.name') },
		{ id: 'protocol', label: t('registries.fields.protocol') },
		{ id: 'created', label: t('registries.fields.created') },
		{ id: 'customer', label: t('registries.fields.customer') },
		{ id: 'devices', label: t('sidebar.devices') }
	]

	const options = () => {
		let registry = registries[registries.findIndex(d => d.uuid === selected[0])]
		let favObj = {
			id: registry.uuid,
			name: registry.name,
			type: 'registry',
			path: `/registry/${registry.uuid}`
		}
		let isFavorited = dispatch(isFav(favObj))
		let allOptions = [
			{
				single: true, label: isFavorited ? t('menus.favorites.remove') : t('menus.favorites.add'),
				icon: isFavorited ? Star : StarBorder,
				func: isFavorited ? () => { removeFromFavorites(favObj); console.trace() } : () => {
					console.trace(); addToFavorites(favObj)
				}
			},
			{ isDivider: true, dontShow: selected.length > 1 },
			{ dontShow: !Auth.hasAccess(null, 'registry.modify'), label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			{ dontShow: !Auth.hasAccess(null, 'registry.delete'), label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete }
		]
		return allOptions
	}
	//useCallbacks
	const handleTabs = useCallback(() => {
		if (location.pathname.includes('grid'))
			return 1
		else {
			if (location.pathname.includes('favorites'))
				return 2
			else {
				return 0
			}
		}
	}, [location])

	const getData = useCallback(async () => {
		/**
		 * @Andrei
		 */
		if (user && accessLevel && dataLoading && loading) {
			dispatch(await getRegistries(true))
		}
	}, [accessLevel, dispatch, loading, user, dataLoading])

	//useEffects
	useEffect(() => {
		if (saved === true) {
			let registry = registries[registries.findIndex(d => d.uuid === selected[0])]
			if (registry) {
				if (dispatch(isFav({ id: registry.uuid, type: 'registry' }))) {
					s('snackbars.favorite.saved', { name: registry.name, type: t('favorites.types.registry') })
					dispatch(finishedSaving())
					setSelected([])
				}
				if (!dispatch(isFav({ id: registry.uuid, type: 'registry' }))) {
					s('snackbars.favorite.removed', { name: registry.name, type: t('favorites.types.registry') })
					dispatch(finishedSaving())
					setSelected([])
				}
			}

		}
	}, [registries, s, saved, selected, t, dispatch])

	useEffect(() => {
		const getRegs = async () => await getData()
		getRegs()

	}, [getData])

	useEffect(() => {
		if (registries) {

			const tabs = [
				{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `list` },
				{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `grid` },
				{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `favorites` }
			]
			props.setHeader('registries.pageTitle', false, '', 'manage.registries')
			props.setBC('registries')
			props.setTabs({
				id: 'registries',
				tabs: tabs,
				route: handleTabs()
			})
		}
	}, [handleTabs, props, registries, t])

	//#region Handlers
	const handleAddNewRegistry = () => history.push({ pathname: `/registries/new`, prevURL: '/registries/list' })

	const handleGetFavorites = () => {
		let favs = favorites.filter(f => f.type === 'registry')
		let favRegistries = favs.map(f => {
			return registries[registries.findIndex(d => d.uuid === f.id)]
		})
		favRegistries = handleRequestSort(orderBy, order, favRegistries)
		return favRegistries
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
	const snackBarMessages = (msg, display) => {
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break
			// case 2:
			// 	s('snackbars.exported')
			// 	break;
			// case 3:
			// 	s('snackbars.assign.deviceToRegistry', { registry: ``, what: 'Device' })
			// 	break;
			// case 6:
			// 	s('snackbars.assign.deviceToRegistry', { registry: `${registries[registries.findIndex(c => c.uuid === selected[0])].name}`, device: display })
			// 	break
			default:
				break
		}
	}

	const handleEdit = () => {
		history.push({ pathname: `/registry/${selected[0]}/edit`, prevURL: `/registries/list` })
	}

	const handleRequestSortRegistries = key => (event, property, way) => {
		let nOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			nOrder = 'asc'
		}
		dispatch(sortData(key, property, nOrder))
		setOrder(nOrder)
		setOrderBy(property)
	}
	const handleRegistryClick = id => e => {
		e.stopPropagation()
		history.push('/registry/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: '/registry/' + id, prevURL: '/registries/favorites' })
	}

	const handleDeleteRegistries = async () => {
		Promise.all([selected.map(u => {
			return deleteRegistry(u)
		})]).then(async () => {
			setOpenDelete(false)
			setSelected([])
			snackBarMessages(1)
			await getData()
			// await this.getData(true).then(
			// 	() =>
			// )
		})
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

	const renderConfirmDelete = () => {

		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.registries')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.registries')}
				</DialogContentText>
				<List dense={true}>
					<Divider />
					{selected.map(s => {
						let u = registries[registries.findIndex(d => d.uuid === s)]
						return u ? <ListItem divider key={u.uuid}>
							<ListItemIcon>
								<InputIcon />
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
				<Button onClick={handleDeleteRegistries} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}


	const renderTableToolBarContent = () => {
		let access = Auth.hasAccess(null, 'registry.create')
		return access ? <Tooltip title={t('menus.create.registry')}>
			<IconButton aria-label='Add new registry' onClick={handleAddNewRegistry}>
				<Add />
			</IconButton>
		</Tooltip>
			: null
	}

	const renderTableToolBar = () => {
		return <TableToolbar
			ft={ft}
			reduxKey={'registries'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}


	const renderTable = (items, handleClick, key) => {
		return <RegistryTable
			data={filterItems(items)}
			handleCheckboxClick={handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={handleRequestSortRegistries(key)}
			handleSelectAllClick={handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={registriesHeader}
		/>
	}

	const renderCards = () => {
		return loading ? <CircularLoader /> :
			<RegistryCards registries={filterItems(registries)} />
		// null
	}

	const renderFavorites = () => {
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(handleGetFavorites(), handleFavClick, 'favorites')}
				{renderConfirmDelete()}
			</Paper>
			}
		</GridContainer>
	}

	const renderRegistries = () => {
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(registries, handleRegistryClick, 'registries')}
				{renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	return (
		<Fragment>
			<Switch>
				<Route path={`/registries/list`} render={() => renderRegistries()} />
				<Route path={`/registries/grid`} render={() => renderCards()} />
				<Route path={`/registries/favorites`} render={() => renderFavorites()} />
				<Redirect path={`/registries`} to={`/registries/list`} />
			</Switch>

		</Fragment>
	)

}

export default Registries