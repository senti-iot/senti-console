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
import { compose } from 'recompose';
import { CircularLoader } from 'components';
import { People, Business } from 'variables/icons';
import { filterItems } from 'variables/functions';
class Management extends Component {
	constructor(props) {
		super(props)

		this.state = {
			route: window.location.pathname.includes('orgs') ? 1 : 0,
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
		props.setHeader(props.t('users.pageTitle'), false, '', 'users')
	}
	componentDidMount = async () => {
		await this.getData()
		console.log(window.location.pathname.includes('orgs'))
		if (window.location.pathname.includes('orgs'))
		{
			this.setState({
				route: 1
			})
		}
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
	tabs = [
		{ id: 0, title: this.props.t('users.tabs.users'), label: <People />, url: `/management/users` },
		{ id: 1, title: this.props.t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
	]
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}

	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}
	render() {
		const { users, orgs, filters, loading } = this.state
		return (
			!loading ? <Fragment>
				<Toolbar
					data={window.location.pathname.includes('users') ? users : orgs}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
					route={this.state.route}
				/>
				<Switch>
					<Route path={'/management/users/new'} render={(rp) => <CreateUser {...this.props} />} />
					<Route path={'/management/users'} render={(rp) => <Users {...this.props} reload={this.reload} users={this.filterItems(users)}/>} />
					<Route path={'/management/orgs/new'} component={(rp) => <CreateOrg {...this.props} />} />
					<Route path={'/management/orgs'} render={(rp) => <Orgs {...this.props} reload={this.reload} orgs={this.filterItems(orgs)}/>} />
					<Redirect from={'/management'} to={'/management/users'} />
				</Switch>
			</Fragment > : <CircularLoader />

		)
	}
}

export default compose(withRouter, withLocalization(), withSnackbar())(Management)
