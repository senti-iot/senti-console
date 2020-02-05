import React, { Fragment, useState, useEffect } from 'react'
// import Toolbar from 'components/Toolbar/Toolbar';
// import { getAllUsers } from 'variables/dataUsers';
// import { getAllOrgs } from 'variables/dataOrgs';
import { Route, Switch, Redirect, useRouteMatch, useLocation, useHistory } from 'react-router-dom'
import CreateUser from 'components/User/CreateUser';
import Users from 'views/Users/Users';
import CreateOrg from 'components/Orgs/CreateOrg';
import Orgs from 'views/Orgs/Orgs';
// import withLocalization from 'components/Localization/T';
// import withSnackbar from 'components/Localization/S';
import { CircularLoader, GridContainer } from 'components';
import { People, Business, StarBorder, Star, Person } from 'variables/icons';
import { filterItems, handleRequestSort } from 'variables/functions';
import { finishedSaving, removeFromFav, /* addToFav, isFav */ } from 'redux/favorites';
import { /* connect, */ useSelector, useDispatch } from 'react-redux'
import FavoritesTable from 'components/Favorites/FavoritesTable';
import { Paper/* , withStyles  */ } from '@material-ui/core';
import TableToolbar from 'components/Table/TableToolbar';
// import projectStyles from 'assets/jss/views/projects';
import { customFilterItems } from 'variables/Filters';
import { getUsers, getOrgs, setUsers, setOrgs, sortData } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';
import { useCallback } from 'react';


// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getUsers: (reload) => dispatch(getUsers(reload)),
// 	getOrgs: (reload) => dispatch(getOrgs(reload)),
// 	setUsers: () => dispatch(setUsers()),
// 	setOrgs: () => dispatch(setOrgs()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

const Management = props => {
	//Hooks
	const t = useLocalization()
	const match = useRouteMatch()
	const location = useLocation()
	const dispatch = useDispatch()
	const history = useHistory()
	const s = useSnackbar().s
	//Redux
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const filtersFavorites = useSelector(state => state.appState.filters.favorites)
	const loadingUsers = useSelector(state => !state.data.gotusers)
	const loadingOrgs = useSelector(state => !state.data.gotorgs)
	const users = useSelector(state => state.data.users)
	const orgs = useSelector(state => state.data.orgs)

	//State
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('name')
	// const [route, setRoute] = useState(window.location.pathname.includes('orgs') ? 1 : 0)
	const [selected, setSelected] = useState([])
	const [filters, setFilters] = useState({ keyword: '', custom: [] })
	// const [loading, setLoading] = useState(true)

	//Const
	const { setHeader, setTabs } = props

	const favoritesHeaders = [
		{ id: 'type', label: "" },
		{ id: 'name', label: t('favorites.fields.name') },
		{ id: 'type', label: t('favorites.fields.type') }
	]

	const dTypes = [
		{ value: 'user', label: t('favorites.types.user'), icon: <Person /> },
		{ value: 'org', label: t('favorites.types.org'), icon: <Business /> },
	]

	const ft = [
		{ key: "", name: t('filters.freeText'), type: 'string', hidden: true },
		{ key: 'name', name: t('favorites.fields.name'), type: 'string' },
		{ key: 'type', name: t('favorites.fields.type'), type: 'dropDown', options: dTypes }
	]

	//Effects
	useEffect(() => {
		if (saved === true) {
			s('snackbars.favorite.updated')
			dispatch(finishedSaving())

		}

	}, [saved, dispatch, s])
	useEffect(() => {
		const tabs = [
			{ id: 0, title: t('users.tabs.users'), label: <People />, url: `/management/users` },
			{ id: 1, title: t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
			{ id: 2, title: t('sidebar.favorites'), label: <Star />, url: `/management/favorites` }
		]
		setHeader('users.pageTitle', false, '', 'users')
		setTabs({
			id: 'management',
			tabs: tabs,
			route: handleTabs()
		})
		const getData = async () => await handleGetData(true)
		// handleGetData()
		getData()
		//eslint-disable-next-line
	}, [])
	//Handlers
	const handleTabs = useCallback(() => {
		if (location.pathname.includes('/orgs')) {
			return 1
		}
		else {
			if (location.pathname.includes('/favorites')) {
				setHeader('sidebar.favorites', false, '', 'users')
				return 2
			}
			else {
				return 0
			}
		}
	}, [location, setHeader])
	const handleGetData = async (reload) => {
		// const { getUsers, getOrgs, setUsers, setOrgs } = this.props
		if (reload) {
			dispatch(getUsers(reload))
			dispatch(getOrgs(reload))
		}
		else {
			dispatch(setUsers())
			dispatch(setOrgs())
		}
		sortData('users', 'firstName', 'asc')
		// this.props.sortData('users', 'firstName', 'asc')
	}

	// componentDidMount = async () => {
	// 	this.handleTabs()
	// 	this.getData()
	// }
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (this.props.location.pathname !== prevProps.location.pathname) {
	// 		this.props.setTabs({
	// 			id: 'management',
	// 			tabs: this.tabs,
	// 			route: this.handleTabs()
	// 		})
	// 	}
	// 	if (window.location.pathname.includes('favorites')) {
	// 		this.props.setBC('favorites')
	// 		if (this.props.saved === true) {
	// 			this.props.finishedSaving()
	// 			this.setState({ selected: [] })
	// 			this.props.s('snackbars.favorite.manyRemoved')
	// 		}
	// 	}
	// }
	const handleReload = () => {
		handleGetData(true)
		handleFilterKeyword('')
	}

	const handleFilterKeyword = (value) => {
		setFilters({
			...filters,
			keyword: value
		})
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


	const handleFilterFavorites = (data) => customFilterItems(data, filtersFavorites)
	const handleFilterItems = (data) => {
		return filterItems(data, filters)
	}
	const handleRemoveFromFavs = () => {

		selected.forEach(f => {
			let fav = favorites[favorites.findIndex(fe => fe.id === f)]
			dispatch(removeFromFav(fav))
		})
	}

	const options = [
		{ label: t('menus.favorites.remove'), icon: StarBorder, func: handleRemoveFromFavs }
	]

	const handleClick = id => e => {
		e.stopPropagation()
		history.push({ pathname: id, prevURL: match.path })
	}

	const handleSelectAllClick = (event, checked) => {
		let usersAndOrgs = favorites.filter(f => f.type === 'user' || f.type === 'org')
		if (checked) {
			setSelected(usersAndOrgs.map(n => n.uuid))
			return;
		}
		setSelected([])
	}
	const handleReqSort = (event, property, way) => {
		let nOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			nOrder = 'asc'
		}

		dispatch(sortData('favorites', property, order))
		setOrder(nOrder)
		setOrderBy(property)
	}
	// const renderUserGroup = (user) => {
	// 	if (user.groups) {
	// 		if (user.groups[136550100000143])
	// 			return t("users.groups.superUser")
	// 		if (user.groups[136550100000211])
	// 			return t("users.groups.accountManager")
	// 		if (user.groups[136550100000225])
	// 			return t("users.groups.user")
	// 	}
	// 	return ''
	// }

	const renderTableToolBar = (reduxKey) => {
		return <TableToolbar
			ft={ft}
			reduxKey={reduxKey}
			// removeFilter={removeFilter}
			// anchorElMenu={anchorElMenu}
			// handleToolbarMenuClose={handleToolbarMenuClose}
			// handleToolbarMenuOpen={handleToolbarMenuOpen}
			numSelected={selected.length}
			options={options}
			t={t}
		/>
	}
	const renderTable = () => {
		let usersAndOrgs = favorites.filter(f => f.type === 'user' || f.type === 'org')
		usersAndOrgs = handleRequestSort(orderBy, order, usersAndOrgs)
		return <FavoritesTable
			selected={selected}
			handleClick={handleClick}
			handleCheckboxClick={handleCheckboxClick}
			handleSelectAllClick={handleSelectAllClick}
			data={handleFilterFavorites(usersAndOrgs)}
			tableHead={favoritesHeaders()}
			handleRequestSort={handleReqSort}
			orderBy={orderBy}
			order={order}
			t={t}
		/>
	}
	const renderFavorites = () => {
		return <GridContainer justify={'center'}>
			{loadingUsers || loadingOrgs ? <CircularLoader /> : <Paper /*className={classes.root} */>
				{renderTableToolBar('favorites')}
				{renderTable()}
			</Paper>
			}
		</GridContainer>
	}

	// const { users, orgs, /* filters, */ loading } = this.state
	// const { favorites } = this.props
	// const { classes, filtersOrgs, filtersUsers, users, orgs, loadingUsers, loadingOrgs, ...rest } = this.props

	return (
		<Fragment>
			<Switch>
				<Route path={`${match.url}/users/new`} render={(rp) => <CreateUser {...props} />} />
				<Route path={`${match.url}/users`} render={(rp) => loadingUsers ? <CircularLoader /> : <Users {...props} reload={handleReload} users={handleFilterItems(users)} />} />
				<Route path={`${match.url}/orgs/new`} component={(rp) => <CreateOrg {...props} />} />
				<Route path={`${match.url}/orgs`} render={(rp) => loadingOrgs ? <CircularLoader /> : <Orgs {...props} reload={handleReload} orgs={handleFilterItems(orgs)} />} />
				<Route path={`${match.url}/favorites`} render={() => renderFavorites()} />
				<Redirect from={'/management'} to={'/management/users'} />
			</Switch>
		</Fragment >

	)

}


export default Management
