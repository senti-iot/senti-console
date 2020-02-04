import { Paper, withStyles, IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TableToolbar from 'components/Table/TableToolbar';
import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort } from 'variables/functions';
import { /* Delete, PictureAsPdf, DeviceHub, LibraryBooks,  LayersClear, ViewModule, */ Edit, ViewList, Add, Star, StarBorder, CloudDownload, Delete } from 'variables/icons';
import { GridContainer, CircularLoader, DeleteDialog } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getFunctions, /* setFunctions, */ sortData } from 'redux/data';
import FunctionTable from 'components/Cloud/FunctionTable';
import { deleteCFunction } from 'variables/dataFunctions';
import { useSnackbar, useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	functions: state.data.functions,
// 	loading: false, //!state.data.gotfunctions,
// 	filters: state.appState.filters.functions,
// 	user: state.settings.user
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getFunctions: (reload, customerID, ua) => dispatch(getFunctions(reload, customerID, ua)),
// 	setFunctions: () => dispatch(setFunctions()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

const Functions = props => {
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.data.saved)
	const functions = useSelector(state => state.data.functions)
	const loading = false
	const filters = useSelector(state => state.appState.filters.functions)
	const user = useSelector(state => state.settings.user)

	const [/* anchorElMenu */, setAnchorElMenu] = useState(null) // added
	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	const [/* route */, setRoute] = useState(0)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [stateFilters, setStateFilters] = useState({ keyword: '' })
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
	// }

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

	const tabs = () => {
		const { match } = props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			// { id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}

	props.setHeader('cloudfunctions.pageTitle', false, '', 'manage.cloudfunctions')
	props.setBC('cloudfunctions')
	props.setTabs({
		id: 'functions',
		tabs: tabs(),
		route: handleTabs()
	})
	//#region Constants
	const dTypes = () => {
		// const { t } = this.props
		return [
			{ value: 0, label: t("cloudfunctions.fields.types.function") },
			{ value: 1, label: t("cloudfunctions.fields.types.external") },
		]
	}
	const ft = () => {
		// const { t } = this.props
		return [
			{ key: 'name', name: t('cloudfunctions.fields.name'), type: 'string' },
			// { key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			// { key: 'devices[0].start', name: t('cloudfunctions.fields.activeDeviceStartDate'), type: 'date' },
			// { key: 'created', name: t('cloudfunctions.fields.created'), type: 'date' },
			{ key: 'type', name: t('cloudfunctions.fields.type'), type: 'dropDown', options: dTypes() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const functionsHeader = () => {
		// const { t } = this.props
		return [
			// { id: 'id', label: t('functions.fields.id') },
			{ id: 'name', label: t('cloudfunctions.fields.name') },
			{ id: 'type', label: t('cloudfunctions.fields.type') },
		]
	}

	const options = () => {
		// const { t, isFav, functions } = this.props
		// const { selected } = this.state
		let collection = functions[functions.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'function',
			path: `/function/${collection.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		let allOptions = [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			// { label: t('menus.assign.collectionToProject'), func: this.handleOpenAssignProject, single: true, icon: LibraryBooks },
			// { label: t('menus.assign.deviceToFunction'), func: this.handleOpenAssignDevice, single: true, icon: DeviceHub },
			// { label: t('menus.unassign.deviceFromFunction'), func: this.handleOpenUnassignDevice, single: true, icon: LayersClear, dontShow: functions[functions.findIndex(c => c.id === selected[0])].activeDeviceStats ? false : true },
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
			// const { functions } = this.props
			// const { selected } = this.state
			let collection = functions[functions.findIndex(d => d.id === selected[0])]
			if (collection) {
				if (dispatch(isFav({ id: collection.id, type: 'function' }))) {
					s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.cloudfunction') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
				if (!dispatch(isFav({ id: collection.id, type: 'function' }))) {
					s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.cloudfunction') })
					dispatch(finishedSaving())
					setSelected([])
					// this.setState({ selected: [] })
				}
			}
		}
	}, [dispatch, functions, s, saved, selected, t])
	// componentDidUpdate = () => {
	// 	// const { t, saved, s, isFav, finishedSaving } = this.props
	// 	if (saved === true) {
	// 		const { functions } = this.props
	// 		const { selected } = this.state
	// 		let collection = functions[functions.findIndex(d => d.id === selected[0])]
	// 		if (collection) {
	// 			if (isFav({ id: collection.id, type: 'function' })) {
	// 				s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.cloudfunction') })
	// 				finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 			if (!isFav({ id: collection.id, type: 'function' })) {
	// 				s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.cloudfunction') })
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
	const addNewFunction = () => props.history.push({ pathname: `/functions/new`, prevURL: '/functions/list' })

	const getFavs = () => {
		// const { order, orderBy } = this.state
		// const { favorites, functions } = this.props
		let favs = favorites.filter(f => f.type === 'function')
		let favFunctions = favs.map(f => {
			return functions[functions.findIndex(d => d.id === f.id)]
		})
		favFunctions = handleRequestSort(orderBy, order, favFunctions)
		return favFunctions
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
		const rFilters = props.filters
		// const { filters } = this.state
		return customFilterItems(filterItems(data, filters), rFilters)
	}
	const snackBarMessages = (msg, display) => {
		// const { functions, s } = this.props
		// const { selected } = this.state
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
	// eslint-disable-next-line no-unused-vars
	const reload = async () => {
		await getData(true)
	}
	const getData = async (reload) => {
		// const { getFunctions, /* setFunctions, */ accessLevel, user } = this.props
		// setFunctions()
		if (accessLevel || user) {
			if (reload)
				dispatch(getFunctions(true, user.org.id, accessLevel.apisuperuser ? true : false))
			// getFunctions(true, user.org.id, accessLevel.apisuperuser ? true : false)
		}
	}
	//#endregion

	//#region Handlers

	const handleEdit = () => {
		// const { selected } = this.state
		props.history.push({ pathname: `/function/${selected[0]}/edit`, prevURL: `/functions/list` })
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
	const handleFunctionClick = id => e => {
		e.stopPropagation()
		props.history.push('/function/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		props.history.push({ pathname: '/function/' + id, prevURL: '/functions/favorites' })
	}
	// eslint-disable-next-line no-unused-vars
	const handleFilterKeyword = (value) => {
		setStateFilters({ ...stateFilters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		keyword: value
		// 	}
		// })
	}

	// eslint-disable-next-line no-unused-vars
	const handleTabsChange = (e, value) => {
		setRoute(value)
		// this.setState({ route: value })
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

	const handleDeleteCloudFunctions = () => {
		// const { selected } = this.state
		Promise.all([selected.map(u => {
			return deleteCFunction(u)
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

	const renderDeleteDialog = () => {
		// const { openDelete, selected } = this.state
		// const { t, functions } = this.props
		let data = selected.map(s => functions[functions.findIndex(d => d.id === s)])
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.cloudfunctions'}
			message={'dialogs.delete.message.cloudfunctions'}
			open={openDelete}
			icon={<CloudDownload />}
			handleCloseDeleteDialog={handleCloseDeleteDialog}
			handleDelete={handleDeleteCloudFunctions}
			data={data}
			dataKey={'name'}
		/>
	}

	const renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.cloudfunction')}>
				<IconButton aria-label='Add new cloud function' onClick={addNewFunction}>
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
			reduxKey={'functions'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}

	const renderTable = (items, handleClick, key) => {
		// const { t } = this.props
		// const { order, orderBy, selected } = this.state
		return <FunctionTable
			data={filterItemsFunc(items)}
			handleCheckboxClick={handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={handleRequestSortFunc(key)}
			handleSelectAllClick={handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={functionsHeader()}
		/>
	}

	const renderCards = () => {
		// const { /* t, history, functions, */ loading } = this.props
		return loading ? <CircularLoader /> :
			// <FunctionsCards functions={this.filterItems(functions)} t={t} history={history} />
			null
	}

	const renderFavorites = () => {
		const { classes } = props
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(getFavs(), handleFavClick, 'favorites')}
				{renderDeleteDialog()}
			</Paper>
			}
		</GridContainer>
	}

	const renderFunctions = () => {
		const { classes } = props
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(functions, handleFunctionClick, 'functions')}
				{renderDeleteDialog()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	const { match } = props
	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderFunctions()} />
				<Route path={`${match.path}/grid`} render={() => renderCards()} />
				<Route path={`${match.path}/favorites`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>

		</Fragment>
	)
}

export default withStyles(projectStyles)(Functions)