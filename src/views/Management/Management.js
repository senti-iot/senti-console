import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect, useRouteMatch, useLocation, useHistory } from 'react-router-dom'
import CreateUser from 'components/User/CreateUser';
import Users from 'views/Users/Users';
import CreateOrg from 'components/Orgs/CreateOrg';
import Orgs from 'views/Orgs/Orgs';
import { CircularLoader, GridContainer } from 'components';
import { People, Business, StarBorder, Star, Person } from 'variables/icons';
import { handleRequestSort } from 'variables/functions';
import { finishedSaving, removeFromFav, /* addToFav, isFav */ } from 'redux/favorites';
import { useSelector, useDispatch } from 'react-redux'
import FavoritesTable from 'components/Favorites/FavoritesTable';
import { Paper, makeStyles } from '@material-ui/core';
import TableToolbar from 'components/Table/TableToolbar';
import { customFilterItems } from 'variables/Filters';
import { getUsers, getOrgs, setUsers, setOrgs, sortData } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';

const favContainerStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		margin: theme.spacing(1),
		borderRadius: "3px",
	},
}))

const Management = props => {
	//Hooks
	const t = useLocalization()
	const match = useRouteMatch()
	const location = useLocation()
	const dispatch = useDispatch()
	const history = useHistory()
	const s = useSnackbar().s
	const classes = favContainerStyles()
	//Redux
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
	const [selected, setSelected] = useState([])

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
		const handleTabs = () => {
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
		}
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
		getData()
		//eslint-disable-next-line
	}, [])

	//Handlers

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
	}

	const handleReload = () => {
		handleGetData(true)
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


	const renderTableToolBar = (reduxKey) => {
		return <TableToolbar
			ft={ft}
			reduxKey={reduxKey}
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
			tableHead={favoritesHeaders}
			handleRequestSort={handleReqSort}
			orderBy={orderBy}
			order={order}
			t={t}
		/>
	}
	const renderFavorites = () => {
		return <GridContainer justify={'center'}>
			{loadingUsers || loadingOrgs ? <CircularLoader /> : <Paper className={classes.root}>
				{renderTableToolBar('favorites')}
				{renderTable()}
			</Paper>
			}
		</GridContainer>
	}
	return (
		<Switch>
			<Route path={`${props.path}/users/new`}>
				<CreateUser {...props} />
			</Route>
			<Route path={`${props.path}/users`} >
				{loadingUsers ? <CircularLoader /> : <Users {...props} reload={handleReload} users={users} />}
			</Route>
			<Route path={`${props.path}/orgs/new`} component={(rp) => <CreateOrg {...props} />} />
			<Route path={`${props.path}/orgs`}>
				{loadingOrgs ? <CircularLoader /> : <Orgs {...props} reload={handleReload} orgs={orgs} />}
			</Route>
			<Route path={`${props.path}/favorites`} render={() => renderFavorites()} />
			<Redirect from={'/management'} to={'/management/users'} />
		</Switch>

	)

}


export default Management
