import React, { Component, Fragment } from 'react'
import Toolbar from 'components/Toolbar/Toolbar';
import { getAllUsers } from 'variables/dataUsers';
import { getAllOrgs } from 'variables/dataOrgs';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import CreateUser from 'components/User/CreateUser';
import Users from 'views/Users/Users';
import CreateOrg from 'components/Orgs/CreateOrg';
import Orgs from 'views/Orgs/Orgs';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { CircularLoader, GridContainer } from 'components';
import { People, Business, StarBorder, Star } from 'variables/icons';
import { filterItems, handleRequestSort } from 'variables/functions';
import { finishedSaving, removeFromFav, addToFav, isFav } from 'redux/favorites';
import { connect } from 'react-redux'
import FavoritesTable from 'components/Favorites/FavoritesTable';
import { Paper, withStyles } from '@material-ui/core';
import TableToolbar from 'components/Table/TableToolbar';
import projectStyles from 'assets/jss/views/projects';

class Management extends Component {
	constructor(props) {
		super(props)

		this.state = {
			order: 'asc',
			orderBy: 'name',
			route: window.location.pathname.includes('orgs') ? 1 : 0,
			selected: [],
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			},
			loading: true,
			users: [],
			orgs: []
		}
		props.setHeader('users.pageTitle', false, '', 'users')
	}
	tabs = [
		{ id: 0, title: this.props.t('users.tabs.users'), label: <People />, url: `/management/users` },
		{ id: 1, title: this.props.t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
		{ id: 3, title: this.props.t('sidebar.favorites'), label: <Star />, url: `/management/favorites` }
	]
	componentDidMount = async () => {
		this.handleTabs()
		await this.getData()
	}
	reload = () => {
		this.getData()
		this.handleFilterKeyword('')
	}
	getData = async () => {
		let users = await getAllUsers().then(rs => rs)
		let orgs = await getAllOrgs().then(rs => rs)
		this.setState({
			users: users ? users : [],
			orgs: orgs ? orgs : [],
			loading: false
		})

	}
	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
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

		this.setState({ selected: newSelected })
	}

	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}

	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}
	options = () => {
		const { t } = this.props
		return [
			{ label: t('menus.favorites.remove'), icon: StarBorder, func: this.removeFromFavs }
		]
	}

	removeFromFavs = () => {
		const { selected } = this.state
		const { favorites } = this.props
		selected.forEach(f => {
			let fav = favorites[favorites.findIndex(fe => fe.id === f)]
			this.props.removeFromFav(fav)
		})
		this.setState({ anchorElMenu: null })
	}
	handleTabs = () => {
		if (this.props.location.pathname.includes('/orgs'))
			this.setState({ route: 1 })
		else {
			if (this.props.location.pathname.includes('/favorites')) {
				this.setState({ route: 2 })
				this.props.setHeader('sidebar.favorites', false, '', 'users')
			}
			else {
				this.setState({ route: 0 })
			}
		}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.handleTabs()
		}
		if (window.location.pathname.includes('favorites')) {
			if (this.props.saved === true) {
				this.props.finishedSaving()
				this.setState({ selected: [] })
				this.props.s('snackbars.favorite.manyRemoved')
			}
		}
	}
	favoritesHeaders = () => {
		const { t } = this.props
		return [
			{ id: 'type', label: "" },
			{ id: 'name', label: t('favorites.fields.name') },
			{ id: 'type', label: t('favorites.fields.type') }
		]
	}
	handleClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: id, prevURL: this.props.match.path })
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}
	handleSelectAllClick = (event, checked) => {
		const { favorites } = this.props

		let usersAndOrgs = favorites.filter(f => f.type === 'user' || f.type === 'org')
		if (checked) {
			this.setState({ selected: usersAndOrgs.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		handleRequestSort(property, order, this.props.favorites)
		this.setState({ order, orderBy: property })
	}
	renderTableToolBar = () => {
		const { t } = this.props
		const { selected } = this.state
		return <TableToolbar //	./TableToolbar.js
			anchorElMenu={this.state.anchorElMenu}
			handleToolbarMenuClose={this.handleToolbarMenuClose}
			handleToolbarMenuOpen={this.handleToolbarMenuOpen}
			numSelected={selected.length}
			options={this.options}
			t={t}
		// content={this.renderTableToolBarContent()}
		/>
	}
	renderTable = () => {
		const { t, favorites } = this.props
		let usersAndOrgs = favorites.filter(f => f.type === 'user' || f.type === 'org')
		const { selected, orderBy, order } = this.state
		return <FavoritesTable
			selected={selected}
			handleClick={this.handleClick}
			handleCheckboxClick={this.handleCheckboxClick}
			handleSelectAllClick={this.handleSelectAllClick}
			data={this.filterItems(usersAndOrgs)}
			tableHead={this.favoritesHeaders()}
			handleFilterEndDate={this.handleFilterEndDate}
			handleFilterKeyword={this.handleFilterKeyword}
			handleFilterStartDate={this.handleFilterStartDate}
			handleRequestSort={this.handleRequestSort}
			handleOpenUnassignDevice={this.handleOpenUnassignDevice}
			orderBy={orderBy}
			order={order}
			filters={this.state.filters}
			t={t}
		/>
	}
	renderFavorites = () => {
		const { classes } = this.props
		const { loading } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable()}
				{/* {this.renderConfirmDelete()} */}
			</Paper>
			}
		</GridContainer>
	}

	render() {
		const { users, orgs, filters, loading } = this.state
		const { favorites } = this.props
		const { classes, ...rest } = this.props
		return (
			!loading ? <Fragment>
				<Toolbar
					data={window.location.pathname.includes('users') ? users : window.location.pathname.includes('orgs') ? orgs : favorites}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
					route={this.state.route}
				/>
				<Switch>
					<Route path={`${this.props.match.url}/users/new`} render={(rp) => <CreateUser {...rest} />} />
					<Route path={`${this.props.match.url}/users`} render={(rp) => <Users {...rest} reload={this.reload} users={this.filterItems(users)} />} />
					<Route path={`${this.props.match.url}/orgs/new`} component={(rp) => <CreateOrg {...rest} />} />
					<Route path={`${this.props.match.url}/orgs`} render={(rp) => <Orgs {...rest} reload={this.reload} orgs={this.filterItems(orgs)} />} />
					<Route path={`${this.props.match.url}/favorites`} render={() => this.renderFavorites()} />
					<Redirect from={'/management'} to={'/management/users'} />
				</Switch>
			</Fragment > : <CircularLoader />

		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	favorites: state.favorites.favorites,
	saved: state.favorites.saved
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default withRouter(withStyles(projectStyles)(withSnackbar()(withLocalization()(connect(mapStateToProps, mapDispatchToProps)(Management)))))
