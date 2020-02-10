import { Paper, IconButton, Fade, Tooltip } from '@material-ui/core';
import TableToolbar from 'components/Table/TableToolbar';
import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { handleRequestSort } from 'variables/functions';
import { /* Delete, PictureAsPdf, DeviceHub, LibraryBooks,  LayersClear, ViewModule, */ Edit, ViewList, Add, Star, StarBorder, CloudDownload, Delete } from 'variables/icons';
import { GridContainer, CircularLoader, DeleteDialog } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getFunctions, /* setFunctions, */ sortData } from 'redux/data';
import FunctionTable from 'components/Cloud/FunctionTable';
import { deleteCFunction } from 'variables/dataFunctions';
import { useSnackbar, useLocalization } from 'hooks'
import cloudfunctionsStyles from 'assets/jss/components/cloudfunctions/cloudfunctionsStyles';

const Functions = props => {
	//Hooks
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const history = useHistory()
	const match = useRouteMatch()
	const location = useLocation()
	const classes = cloudfunctionsStyles()
	//Redux
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const functions = useSelector(state => state.data.functions)
	const filters = useSelector(state => state.appState.filters.functions)
	const user = useSelector(state => state.settings.user)
	const loading = useSelector(state => !state.data.gotfunctions)
	//State

	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')


	//Const

	const dTypes = [
		{ value: 0, label: t("cloudfunctions.fields.types.function") },
		{ value: 1, label: t("cloudfunctions.fields.types.external") },
	]

	const ft = [
		{ key: 'name', name: t('cloudfunctions.fields.name'), type: 'string' },
		{ key: 'type', name: t('cloudfunctions.fields.type'), type: 'dropDown', options: dTypes },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]

	const functionsHeader = [
		{ id: 'name', label: t('cloudfunctions.fields.name') },
		{ id: 'type', label: t('cloudfunctions.fields.type') },
	]


	const options = () => {
		let func = functions[functions.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: func.id,
			name: func.name,
			type: 'cloudfunction',
			path: `/function/${func.id}`
		}
		let isFavorite = dispatch(isFav(favObj))
		let allOptions = [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => removeFromFavorites(favObj) : () => addToFavorites(favObj) },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete },
		]
		return allOptions
	}

	//useEffects

	useEffect(() => {
		const tabs = [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			// { id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
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
		props.setHeader('cloudfunctions.pageTitle', false, '', 'manage.cloudfunctions')
		props.setBC('cloudfunctions')
		props.setTabs({
			id: 'functions',
			tabs: tabs,
			route: handleTabs()
		})

	}, [location.pathname, match.url, props, t])



	useEffect(() => {
		if (user && accessLevel) {
			getData(true)
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (saved === true) {
			let func = functions[functions.findIndex(d => d.id === selected[0])]
			if (func) {
				if (dispatch(isFav({ id: func.id, type: 'cloudfunction' }))) {
					s('snackbars.favorite.saved', { name: func.name, type: t('favorites.types.cloudfunction') })
					dispatch(finishedSaving())
					setSelected([])
				}
				if (!dispatch(isFav({ id: func.id, type: 'cloudfunction' }))) {
					s('snackbars.favorite.removed', { name: func.name, type: t('favorites.types.cloudfunction') })
					dispatch(finishedSaving())
					setSelected([])
				}
			}
		}
	}, [dispatch, functions, s, saved, selected, t])


	//Handlers
	const addNewFunction = () => history.push({ pathname: `/functions/new`, prevURL: '/functions/list' })

	const getFavs = () => {
		let favs = favorites.filter(f => f.type === 'cloudfunction')
		let favFunctions = favs.map(f => {
			return functions[functions.findIndex(d => d.id === f.id)]
		})
		favFunctions = handleRequestSort(orderBy, order, favFunctions)
		return favFunctions
	}
	const addToFavorites = (favObj) => {
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = (favObj) => {
		dispatch(removeFromFav(favObj))
	}
	const filterItemsFunc = (data) => {
		const rFilters = filters
		return customFilterItems(data, rFilters)
	}
	const snackBarMessages = (msg, display) => {
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.deviceToFunction', { func: ``, what: 'Device' })
				break;
			case 6:
				s('snackbars.assign.deviceToFunction', { func: `${functions[functions.findIndex(c => c.id === selected[0])].name}`, device: display })
				break
			default:
				break;
		}
	}
	const getData = async (reload) => {
		if (accessLevel || user) {
			if (reload)
				dispatch(getFunctions(true, user.org.id, accessLevel.apisuperuser ? true : false))
		}
	}
	//#endregion

	//#region Handlers

	const handleEdit = () => {
		history.push({ pathname: `/function/${selected[0]}/edit`, prevURL: `/functions/list` })
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
	const handleFunctionClick = id => e => {
		e.stopPropagation()
		props.history.push('/function/' + id)
	}

	const handleFavClick = id => e => {
		e.stopPropagation()
		props.history.push({ pathname: '/function/' + id, prevURL: '/functions/favorites' })
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

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}


	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}

	const handleDeleteCloudFunctions = () => {
		Promise.all([selected.map(u => {
			return deleteCFunction(u)
		})]).then(async () => {
			setOpenDelete(false)
			setSelected([])
			await getData(true).then(
				() => snackBarMessages(1)
			)
		})
	}

	const renderDeleteDialog = () => {
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
		return <Fragment>
			<Tooltip title={t('menus.create.cloudfunction')}>
				<IconButton aria-label='Add new cloud function' onClick={addNewFunction}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	const renderTableToolBar = () => {
		return <TableToolbar
			ft={ft}
			reduxKey={'functions'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}

	const renderTable = (items, handleClick, key) => {
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
			tableHead={functionsHeader}
		/>
	}

	const renderCards = () => {
		return loading ? <CircularLoader /> :
			// <FunctionsCards functions={this.filterItems(functions)} t={t} history={history} />
			null
	}

	const renderFavorites = () => {
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
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(functions, handleFunctionClick, 'functions')}
				{renderDeleteDialog()}
			</Paper></Fade>
			}
		</GridContainer>
	}

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

export default Functions