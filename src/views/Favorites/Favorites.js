import React, { useState, useEffect, Fragment } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import Toolbar from 'components/Toolbar/Toolbar'
import { ViewList, StarBorder } from 'variables/icons'
import TableToolbar from 'components/Table/TableToolbar'
import FavoritesTable from 'components/Favorites/FavoritesTable'
import { GridContainer, CircularLoader } from 'components'
import { Paper, Fade } from '@material-ui/core'
import projectStyles from 'assets/jss/views/projects'
import { filterItems, handleRequestSort } from 'variables/functions'
import { finishedSaving, removeFromFav, /* addToFav, */ /* isFav */ } from 'redux/favorites'
import { LibraryBooks, DeviceHub, Person, Business, DataUsage } from 'variables/icons';
import { customFilterItems } from 'variables/Filters';
import { useSnackbar, useLocalization, useMatch } from 'hooks'

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	filters: state.appState.filters.favorites
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

//@Andrei

const Favorites = props => {
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const match = useMatch()
	const history = useHistory()
	const classes = projectStyles()
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const filters = useSelector(state => state.appState.filters.favorites)

	const [selected, setSelected] = useState([])
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('name')
	// const [route, setRoute] = useState(0)
	const [stateFilters, setStateFilters] = useState({ keyword: '' })
	const [anchorElMenu, setAnchorElMenu] = useState(null) // added
	const [loading /* ,setLoading */] = useState(false) // added

	const tabs = () => {
		return [{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.path}/list` }]
	}

	props.setBC('favorites')
	props.setHeader('sidebar.favorites', false, '', 'favorites')
	props.setTabs({
		id: 'favorites',
		tabs: tabs(),
		route: 0
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		selected: [],
	// 		order: 'asc',
	// 		orderBy: 'name',
	// 		route: 0,
	// 		filters: {
	// 			keyword: '',
	// 		}
	// 	}
	// 	props.setBC('favorites')
	// 	props.setHeader('sidebar.favorites', false, '', 'favorites')
	// 	props.setTabs({
	// 		id: 'favorites',
	// 		tabs: this.tabs(),
	// 		route: 0
	// 	})
	// }
	const options = () => {
		// const { t } = this.props
		return [
			{ label: t('menus.favorites.remove'), icon: StarBorder, func: removeFromFavs }
		]
	}
	const removeFromFavs = () => {
		// const { selected } = this.state
		// const { favorites } = this.props
		selected.forEach(f => {
			let fav = favorites[favorites.findIndex(fe => fe.id === f)]
			dispatch(removeFromFav(fav))
		})
		setAnchorElMenu(null)
		// this.setState({ anchorElMenu: null })
	}
	const favoritesHeaders = () => {
		// const { t } = this.props
		return [
			{ id: 'type', label: '' },
			{ id: 'name', label: t('favorites.fields.name') },
			{ id: 'type', label: t('favorites.fields.type') }
		]
	}

	const dTypes = () => {
		// const { t } = this.props
		return [
			{ value: 'project', label: t('favorites.types.project'), icon: <LibraryBooks /> },
			{ value: 'collection', label: t('favorites.types.collection'), icon: <DataUsage /> },
			{ value: 'device', label: t('favorites.types.device'), icon: <DeviceHub /> },
			{ value: 'user', label: t('favorites.types.user'), icon: <Person /> },
			{ value: 'org', label: t('favorites.types.org'), icon: <Business /> }
		]
	}
	const ft = () => {
		// const { t } = this.props
		return [
			{ key: 'name', name: t('favorites.fields.name'), type: 'string' },
			{ key: 'type', name: t('favorites.fields.type'), type: 'dropDown', options: dTypes() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const addFilter = (f) => {
		let cFilters = stateFilters.custom
		let id = cFilters.length
		cFilters.push({ ...f, id: id })
		setStateFilters({ ...stateFilters, custom: cFilters })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		custom: cFilters
		// 	}
		// })
		return id
	}
	const editFilter = (f) => {
		let cFilters = stateFilters.custom
		let filterIndex = cFilters.findIndex(fi => fi.id === f.id)
		cFilters[filterIndex] = f
		setStateFilters({ ...stateFilters, custom: cFilters })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		custom: cFilters
		// 	}
		// })
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
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		custom: cFilters
		// 	}
		// })
	}
	const filterItemsFunc = (data) => {
		const rFilters = filters
		// const { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), rFilters)
	}

	useEffect(() => {
		handleRequestSortFunc(null, 'name', 'asc')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = () => {
	// 	handleRequestSort(null, 'name', 'asc')
	// }
	useEffect(() => {
		if (saved === true) {
			s('snackbars.favorite.manyRemoved')
			dispatch(finishedSaving())
			setSelected([])
			// this.setState({ selected: [] })
		}
	}, [dispatch, s, saved])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		this.props.s('snackbars.favorite.manyRemoved')
	// 		this.props.finishedSaving()
	// 		this.setState({ selected: [] })
	// 	}
	// }
	const handleToolbarMenuOpen = e => {
		e.stopPropagation()
		setAnchorElMenu(e.currentTarget)
		// this.setState({ anchorElMenu: e.currentTarget })
	}

	const handleToolbarMenuClose = e => {
		e.stopPropagation();
		setAnchorElMenu(null)
		// this.setState({ anchorElMenu: null })
	}
	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected(favorites.map(n => n.id))
			// this.setState({ selected: this.props.favorites.map(n => n.id) })
			return;
		}
		setSelected([])
		// this.setState({ selected: [] })
	}

	const handleRequestSortFunc = (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		handleRequestSort(property, order, favorites)
		setOrder(newOrder)
		setOrderBy(property)
		// this.setState({ order, orderBy: property })
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

	const handleClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: id, prevURL: match.path })
	}
	const renderTableToolBar = () => {
		// const { t } = this.props
		// const { selected } = this.state
		return <TableToolbar
			ft={ft()}
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
		// const { t, favorites } = this.props
		// const { selected, orderBy, order } = this.state
		return <FavoritesTable
			selected={selected}
			handleClick={handleClick}
			handleCheckboxClick={handleCheckboxClick}
			handleSelectAllClick={handleSelectAllClick}
			data={filterItemsFunc(favorites)}
			tableHead={favoritesHeaders()}
			// handleFilterEndDate={handleFilterEndDate}
			handleFilterKeyword={handleFilterKeyword}
			// handleFilterStartDate={handleFilterStartDate}
			handleRequestSort={handleRequestSortFunc}
			// handleOpenUnassignDevice={handleOpenUnassignDevice}
			orderBy={orderBy}
			order={order}
			filters={stateFilters}
			t={t}
		/>
	}
	const renderFavorites = () => {
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable()}
				{/* {this.renderConfirmDelete()} */}
			</Paper></Fade>
			}
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