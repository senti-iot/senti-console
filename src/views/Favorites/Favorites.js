import React, { useState, useEffect, Fragment } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import Toolbar from 'components/Toolbar/Toolbar'
import { ViewList, StarBorder } from 'variables/icons'
import TableToolbar from 'components/Table/TableToolbar'
import FavoritesTable from 'components/Favorites/FavoritesTable'
import { GridContainer } from 'components'
import { Paper, Fade } from '@material-ui/core'
import projectStyles from 'assets/jss/views/projects'
import { handleRequestSort } from 'variables/functions'
import { finishedSaving, removeFromFav, /* addToFav, */ /* isFav */ } from 'redux/favorites'
import { /* LibraryBooks, */ DeviceHub, Person, Business, /* DataUsage */ } from 'variables/icons'
import { customFilterItems } from 'variables/Filters'
import { useSnackbar, useLocalization, useMatch } from 'hooks'



const Favorites = props => {
	//Hooks
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const match = useMatch()
	const history = useHistory()
	const classes = projectStyles()

	//Redux
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const filters = useSelector(state => state.appState.filters.favorites)

	//State
	const [selected, setSelected] = useState([])
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('name')
	// const [route, setRoute] = useState(0)
	const [stateFilters, setStateFilters] = useState({ keyword: '' })
	const [anchorElMenu, setAnchorElMenu] = useState(null) // added

	//Const
	const { setBC, setHeader, setTabs } = props
	const favoritesHeaders = [
		{ id: 'type', label: '' },
		{ id: 'name', label: t('favorites.fields.name') },
		{ id: 'description', label: t('favorites.fields.description') },
		{ id: 'type', label: t('favorites.fields.type') },
		{ id: 'org', label: t('favorites.fields.org') }
	]

	const dTypes = [
		// { value: 'project', label: t('favorites.types.project'), icon: <LibraryBooks /> },
		// { value: 'collection', label: t('favorites.types.collection'), icon: <DataUsage /> },
		{ value: 'device', label: t('favorites.types.device'), icon: <DeviceHub /> },
		{ value: 'user', label: t('favorites.types.user'), icon: <Person /> },
		{ value: 'org', label: t('favorites.types.org'), icon: <Business /> }
	]

	const ft = [
		{ key: 'name', name: t('favorites.fields.name'), type: 'string' },
		{ key: 'type', name: t('favorites.fields.type'), type: 'dropDown', options: dTypes },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]

	const removeFromFavs = () => {
		selected.forEach(f => {
			let fav = favorites[favorites.findIndex(fe => fe.id === f)]
			dispatch(removeFromFav(fav))
		})
		setAnchorElMenu(null)
	}

	const options = () => [
		{ label: t('menus.favorites.remove'), icon: StarBorder, func: removeFromFavs }
	]
	//useCallbacks

	//useEffects

	useEffect(() => {
		if (saved === true) {
			s('snackbars.favorite.manyRemoved')
			dispatch(finishedSaving())
			setSelected([])
		}
	}, [dispatch, s, saved])

	useEffect(() => {
		const tabs = [{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `list` }]

		setBC('favorites')
		setHeader('sidebar.favorites', false, '', 'favorites')
		setTabs({
			id: 'favorites',
			tabs: tabs,
			route: 0
		})

	}, [setBC, setHeader, setTabs, t])
	//Handlers

	const addFilter = (f) => {
		let cFilters = stateFilters.custom
		let id = cFilters.length
		cFilters.push({ ...f, id: id })
		setStateFilters({ ...stateFilters, custom: cFilters })
		return id
	}
	const editFilter = (f) => {
		let cFilters = stateFilters.custom
		let filterIndex = cFilters.findIndex(fi => fi.id === f.id)
		cFilters[filterIndex] = f
		setStateFilters({ ...stateFilters, custom: cFilters })

	}
	const removeFilter = (fId) => {
		let cFilters = stateFilters.custom
		cFilters = cFilters.reduce((newFilters, f) => {
			if (f.id !== fId) {
				newFilters.push(f)
			}
			return newFilters
		}, [])
		setStateFilters({ ...stateFilters, custom: cFilters })

	}
	const filterItemsFunc = (data) => {
		const rFilters = filters
		return customFilterItems(data, rFilters)
	}

	const handleToolbarMenuOpen = e => {
		e.stopPropagation()
		setAnchorElMenu(e.currentTarget)
	}

	const handleToolbarMenuClose = e => {
		e.stopPropagation()
		setAnchorElMenu(null)
	}
	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected(favorites.map(n => n.id))
			return
		}
		setSelected([])
	}

	const handleRequestSortFunc = (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		handleRequestSort(property, order, favorites)
		setOrder(newOrder)
		setOrderBy(property)
	}

	const handleFilterKeyword = (value) => {
		setStateFilters({ ...stateFilters, keyword: value })
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

	const handleClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: id, prevURL: match.path })
	}
	const renderTableToolBar = () => {
		return <TableToolbar
			ft={ft}
			addFilter={addFilter}
			editFilter={editFilter}
			removeFilter={removeFilter}
			reduxKey={'favorites'}
			anchorElMenu={anchorElMenu}
			handleToolbarMenuClose={handleToolbarMenuClose}
			handleToolbarMenuOpen={handleToolbarMenuOpen}
			numSelected={selected.length}
			options={options}
			t={t}
		/>
	}
	const renderTable = () => {
		return <FavoritesTable
			selected={selected}
			handleClick={handleClick}
			handleCheckboxClick={handleCheckboxClick}
			handleSelectAllClick={handleSelectAllClick}
			data={filterItemsFunc(favorites)}
			tableHead={favoritesHeaders}
			handleFilterKeyword={handleFilterKeyword}
			handleRequestSort={handleRequestSortFunc}
			orderBy={orderBy}
			order={order}
			filters={stateFilters}
			t={t}
		/>
	}
	const renderFavorites = () => {
		return <GridContainer justify={'center'}>
			<Fade in={true}>
				<Paper className={classes.root}>
					{renderTableToolBar()}
					{renderTable()}
				</Paper>
			</Fade>
		</GridContainer>
	}

	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderFavorites()} />
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>
		</Fragment>
	)
}

export default Favorites