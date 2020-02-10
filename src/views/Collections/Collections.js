import { Paper, withStyles, Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import CollectionTable from 'components/Collections/CollectionTable';
import TableToolbar from 'components/Table/TableToolbar';
// import Toolbar from 'components/Toolbar/Toolbar';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { deleteCollection, unassignDeviceFromCollection, getCollection } from 'variables/dataCollections';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Delete, Edit, PictureAsPdf, ViewList, ViewModule, DeviceHub, LibraryBooks, Add, LayersClear, Star, StarBorder, SignalWifi2Bar } from 'variables/icons';
import { GridContainer, CircularLoader, AssignDevice, AssignProject, ItemG, T } from 'components'
import CollectionsCards from './CollectionsCards';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { setCollections, getCollections, sortData } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	collections: state.data.collections,
// 	loading: !state.data.gotcollections,
// 	filters: state.appState.filters.collections
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getCollections: reload => dispatch(getCollections(reload)),
// 	setCollections: () => dispatch(setCollections()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

// @Andrei
const Collections = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()

	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const collections = useSelector(state => state.data.collections)
	const loading = useSelector(state => !state.data.gotcollections)
	const filters = useSelector(state => state.appState.filters.collections)

	const [selected, setSelected] = useState([])
	const [openAssignDevice, setOpenAssignDevice] = useState(false)
	const [openAssignProject, setOpenAssignProject] = useState(false)
	const [openUnassignDevice, setOpenUnassignDevice] = useState(false)
	const [openDelete, setOpenDelete] = useState(false)
	const [/* route */, setRoute] = useState(0)
	const [stateOrder, setStateOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [stateFilters, setStateFilters] = useState({ keyword: '' })
	const [/* anchorElMenu */, setAnchorElMenu] = useState(null) // added
	const [/* anchorEl */, setAnchorEl] = useState(null) // added

	const tabs = () => {
		const { match } = props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}

	const handleTabs = () => {
		const { location } = props
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

	props.setHeader('collections.pageTitle', false, '', 'collections')
	props.setBC('collections')
	props.setTabs({
		id: 'collections',
		tabs: tabs(),
		route: handleTabs()
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		selected: [],
	// 		openAssignDevice: false,
	// 		openAssignProject: false,
	// 		openUnassignDevice: false,
	// 		openDelete: false,
	// 		route: 0,
	// 		order: 'asc',
	// 		orderBy: 'id',
	// 		filters: {
	// 			keyword: '',
	// 		}
	// 	}
	// 	props.setHeader('collections.pageTitle', false, '', 'collections')
	// 	props.setBC('collections')
	// 	props.setTabs({
	// 		id: 'collections',
	// 		tabs: this.tabs(),
	// 		route: this.handleTabs()
	// 	})
	// }
	//#region Constants


	const dLiveStatus = () => {
		const { classes } = props
		return [
			{ value: 0, label: t("devices.status.redShort"), icon: <SignalWifi2Bar className={classes.redSignal} /> },
			{ value: 1, label: t("devices.status.yellowShort"), icon: <SignalWifi2Bar className={classes.yellowSignal} /> },
			{ value: 2, label: t("devices.status.greenShort"), icon: <SignalWifi2Bar className={classes.greenSignal} /> }
		]
	}
	const ft = () => {
		// const { t } = this.props
		return [
			{ key: 'name', name: t('collections.fields.name'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'devices[0].start', name: t('collections.fields.activeDeviceStartDate'), type: 'date' },
			{ key: 'created', name: t('collections.fields.created'), type: 'date' },
			{ key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: dLiveStatus() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const collectionsHeader = () => {
		// const { t } = this.props
		return [
			{ id: 'id', label: t('collections.fields.dcID') },
			{ id: 'name', label: t('collections.fields.name') },
			{ id: 'activeDeviceStats.state', label: <ItemG container justify={'center'} title={t('devices.fields.status')}><SignalWifi2Bar /></ItemG>, checkbox: true },
			{ id: 'created', label: t('collections.fields.created') },
			{ id: 'devices[0].start', label: t('collections.fields.activeDeviceStartDate') },
			{ id: 'org.name', label: t('collections.fields.org') }
		]
	}
	const options = () => {
		// const { isFav } = props
		// const { selected } = this.state
		let collection = collections[collections.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: `/collection/${collection.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		let allOptions = [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			{ label: t('menus.assign.collectionToProject'), func: handleOpenAssignProject, single: true, icon: LibraryBooks },
			{ label: t('menus.assign.deviceToCollection'), func: handleOpenAssignDevice, single: true, icon: DeviceHub },
			{ label: t('menus.unassign.deviceFromCollection'), func: handleOpenUnassignDevice, single: true, icon: LayersClear, dontShow: collections[collections.findIndex(c => c.id === selected[0])].activeDeviceStats ? false : true },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj) }
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle

	useEffect(() => {
		handleTabs()
		getData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	this.handleTabs()
	// 	this.getData()

	// }

	useEffect(() => {
		if (saved === true) {
			// const { collections } = this.props
			// const { selected } = this.state
			let collection = collections[collections.findIndex(d => d.id === selected[0])]
			if (collection) {
				if (dispatch(isFav({ id: collection.id, type: 'collection' }))) {
					s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.collection') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
				if (!dispatch(isFav({ id: collection.id, type: 'collection' }))) {
					s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.collection') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
			}
		}
	}, [collections, dispatch, s, saved, selected, t])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	const { t, saved, s, isFav, finishedSaving } = this.props
	// 	if (saved === true) {
	// 		const { collections } = this.props
	// 		const { selected } = this.state
	// 		let collection = collections[collections.findIndex(d => d.id === selected[0])]
	// 		if (collection) {
	// 			if (isFav({ id: collection.id, type: 'collection' })) {
	// 				s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.collection') })
	// 				finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 			if (!isFav({ id: collection.id, type: 'collection' })) {
	// 				s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.collection') })
	// 				finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 		}
	// 	}
	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }
	//#endregion

	//#region Functions
	const addNewCollection = () => props.history.push({ pathname: `/collections/new`, prevURL: '/collections/list' })

	const getFavs = () => {
		// const { order, orderBy } = this.state
		// const { favorites, collections } = this.props
		let favs = favorites.filter(f => f.type === 'collection')
		let favCollections = favs.map(f => {
			return collections[collections.findIndex(d => d.id === f.id)]
		})
		favCollections = handleRequestSort(orderBy, stateOrder, favCollections)
		return favCollections
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
		const rFilters = filters
		// const { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), rFilters)
	}
	const snackBarMessages = (msg, display) => {
		// const { collections, s } = this.props
		// const { selected } = this.state
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.deviceToCollection', { collection: ``, what: 'Device' })
				break;
			case 6:
				s('snackbars.assign.deviceToCollection', { collection: `${collections[collections.findIndex(c => c.id === selected[0])].name}`, device: display })
				break
			default:
				break;
		}
	}

	const reload = async () => {
		await getData(true)
	}
	const getData = async (reload) => {
		// const { getCollections, setCollections } = this.props
		dispatch(setCollections())
		if (reload)
			dispatch(getCollections(true))
	}
	//#endregion

	//#region Handlers

	const handleEdit = () => {
		// const { selected } = this.state
		props.history.push({ pathname: `/collection/${selected[0]}/edit`, prevURL: `/collections/list` })
	}

	const handleRequestSortFunc = key => (event, property, way) => {
		let order = way ? way : stateOrder === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			order = 'asc'
		}
		dispatch(sortData(key, property, order))
		// this.props.sortData(key, property, order)
		setStateOrder(order)
		setOrderBy(property)
		// this.setState({ order, orderBy: property })
	}
	const handleCollectionClick = id => e => {
		e.stopPropagation()
		props.history.push('/collection/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		props.history.push({ pathname: '/collection/' + id, prevURL: '/collections/favorites' })
	}

	const handleFilterKeyword = (value) => {
		setStateFilters({ ...stateFilters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		keyword: value
		// 	}
		// })
	}


	const handleTabsChange = (e, value) => {
		setRoute(value)
		// this.setState({ route: value })
	}
	const handleDeleteCollections = async () => {
		// const { selected } = this.state
		Promise.all([selected.map(u => {
			return deleteCollection(u)
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
	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected(collections.map(n => n.id))
			// this.setState({ selected: this.props.collections.map(n => n.id) })
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

	const handleOpenAssignDevice = () => {
		setOpenAssignDevice(true)
		setAnchorElMenu(null)
		// this.setState({ openAssignDevice: true, anchorElMenu: null })
	}

	const handleCancelAssignDevice = () => {
		setOpenAssignDevice(false)
		// this.setState({ openAssignDevice: false })
	}

	const handleCloseAssignDevice = async (reload, display) => {
		if (reload) {
			setOpenAssignDevice(false)
			// this.setState({ openAssignDevice: false })
			await getData(true).then(rs => {
				snackBarMessages(6, display)
				setSelected([])
				// this.setState({ selected: [] })
			})
		}
	}
	const handleOpenAssignProject = () => {
		setOpenAssignProject(true)
		setAnchorElMenu(null)
		// this.setState({ openAssignProject: true, anchorElMenu: null })
	}

	const handleCancelAssignProject = () => {
		setOpenAssignProject(false)
		// this.setState({ openAssignProject: false })
	}

	const handleCloseAssignProject = async (reload) => {
		if (reload) {
			setOpenAssignProject(false)
			// this.setState({ openAssignProject: false })
			await getData(true).then(rs => {
				snackBarMessages(6)
			})
		}
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
	const handleOpenUnassignDevice = () => {
		setOpenUnassignDevice(true)
		// this.setState({
		// 	openUnassignDevice: true
		// })
	}

	const handleCloseUnassignDevice = () => {
		setOpenUnassignDevice(false)
		setAnchorEl(null)
		// this.setState({
		// 	openUnassignDevice: false, anchorEl: null
		// })
	}

	const handleUnassignDevice = async () => {
		// const { selected } = this.state
		let collection = await getCollection(selected[0])
		if (collection.activeDeviceStats)
			await unassignDeviceFromCollection({
				id: collection.id,
				deviceId: collection.activeDeviceStats.id
			}).then(async rs => {
				if (rs) {
					handleCloseUnassignDevice()
					snackBarMessages(1)
					await getCollection(collection.id)
				}
			})
		else {
			//The Collection doesn't have a device assigned to it...
			handleCloseUnassignDevice()
		}
	}
	//#endregion

	const renderDeviceUnassign = () => {
		// const { t, collections } = this.props
		// const { selected } = this.state
		let collection = collections[collections.findIndex(c => c.id === selected[0])]
		if (collection.activeDeviceStats === null)
			return null
		return <Dialog
			open={openUnassignDevice}
			onClose={handleCloseUnassignDevice}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'><T reversed variant={'h6'}>{t('dialogs.unassign.title.devicesFromCollection')}</T></DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.unassign.message.deviceFromCollection', { collection: collection.name, device: collection.activeDeviceStats.id })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseUnassignDevice} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleUnassignDevice} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	const renderConfirmDelete = () => {
		// const { openDelete, selected } = this.state
		const { classes } = props
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.collections')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.collections')}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={collections[collections.findIndex(d => d.id === s)].name} /></ListItem>)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleDeleteCollections} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}


	const renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.collection')}>
				<IconButton aria-label='Add new collection' onClick={addNewCollection}>
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
			reduxKey={'collections'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}

	const renderAssignProject = () => {
		// const { selected, openAssignProject } = this.state
		// const { t } = this.props
		return <AssignProject
			// multiple
			collectionId={selected ? selected : []}
			handleCancel={handleCancelAssignProject}
			handleClose={handleCloseAssignProject}
			open={openAssignProject}
			t={t}
		/>
	}

	const renderAssignDevice = () => {
		// const { selected, openAssignDevice } = this.state
		// const { t, collections } = this.props
		let collectionOrg = collections.find(r => r.id === selected[0])
		return <AssignDevice
			collectionId={selected[0] ? selected[0] : 0}
			orgId={collectionOrg ? collectionOrg.org.id : 0}
			handleCancel={handleCancelAssignDevice}
			handleClose={handleCloseAssignDevice}
			open={openAssignDevice}
			t={t}
		/>
	}

	const renderTable = (items, handleClick, key) => {
		// const { t } = this.props
		// const { order, orderBy, selected } = this.state
		return <CollectionTable
			data={filterItemsFunc(items)}
			handleCheckboxClick={handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={handleRequestSortFunc(key)} // this.handleReqSort
			handleSelectAllClick={handleSelectAllClick}
			order={stateOrder}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={collectionsHeader()}
		/>
	}

	const renderCards = () => {
		const { history } = props
		return loading ? <CircularLoader /> :
			<CollectionsCards collections={filterItemsFunc(collections)} t={t} history={history} />
	}

	const renderFavorites = () => {
		const { classes } = props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{renderAssignProject()}
				{renderAssignDevice()}
				{selected.length > 0 ? renderDeviceUnassign() : null}
				{renderTableToolBar()}
				{renderTable(getFavs(), handleFavClick, 'favorites')}
				{renderConfirmDelete()}
			</Paper>
			}
		</GridContainer>
	}

	const renderCollections = () => {
		const { classes } = props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderAssignProject()}
				{renderAssignDevice()}
				{selected.length > 0 ? renderDeviceUnassign() : null}
				{renderTableToolBar()}
				{renderTable(collections, handleCollectionClick, 'collections')}
				{renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	// const { collections, route, filters } = this.state
	const { /* history,  */match } = props
	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderCollections()} />
				<Route path={`${match.path}/grid`} render={() => renderCards()} />
				<Route path={`${match.path}/favorites`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>

		</Fragment>
	)
}

export default withStyles(projectStyles)(Collections)