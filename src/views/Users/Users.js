import React, { Component, Fragment } from 'react'
import { withStyles } from "@material-ui/core";
import projectStyles from 'assets/jss/views/projects';
import UserTable from 'components/User/UserTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { getAllUsers, getAllOrgs } from 'variables/dataUsers';
import Toolbar from 'components/Toolbar/Toolbar'
import { People, Business } from '@material-ui/icons';
import { filterItems } from '../../variables/functions';

class Users extends Component {
	constructor(props) {
		super(props)

		this.state = {
			users: [],
			userHeader: [],
			loading: true,
			route: 0,
			order: "desc",
			orderBy: "firstName",
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader(props.t("users.pageTitle"), false)
	}

	componentDidMount = async () => {
		this._isMounted = 1
		await this.getData()
		if (this._isMounted) {
			if (this.props.location.pathname.includes('/orgs')) {
				this.setState({ route: 1 })
			}
			else {
				this.setState({ route: 0 })
			}
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}
	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		const users =
			order === 'desc'
				? this.state.users.sort((a, b) => (b[ orderBy ] < a[ orderBy ] ? -1 : 1))
				: this.state.users.sort((a, b) => (a[ orderBy ] < b[ orderBy ] ? -1 : 1))

		this.setState({ users, order, orderBy })
	}
	handleFilterStartDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				startDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}
	handleFilterEndDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				endDate: value,
				activeDateFilter: value !== null ? true : false
			}
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
	getData = async () => {
		const { t } = this.props
		let users = await getAllUsers().then(rs => rs)
		let orgs = await getAllOrgs().then(rs => rs)
		if (this._isMounted) {
			this.setState({
				users: users ? users : [],
				orgs: orgs ? orgs : [],
				userHeader: [
					{ id: "avatar", label: "" },
					{ id: "firstName", label: t("users.fields.name") },
					{ id: "phone", label: t("users.fields.phone") },
					{ id: "email", label: t("users.fields.email") },
					{ id: "org", label: t("users.fields.organisation") },
					{ id: "lastSignIng", label: t("users.fields.lastSignIn") }
				], 
				loading: false
			}, () => this.handleRequestSort(null, "firstName"))
		}
	}

	tabs = [
		{ id: 0, title: this.props.t("users.tabs.users"), label: <People />, url: `/users` },
		{ id: 1, title: this.props.t("users.tabs.orgs"), label: <Business />, url: `/orgs` },
	]
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	renderUsers = () => {
		const { t } = this.props
		const { loading, order, orderBy, filters, userHeader } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <UserTable
				data={this.filterItems(this.state.users)}
				tableHead={userHeader}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleFilterStartDate={ this.handleFilterStartDate }
				handleRequestSort={ this.handleRequestSort }
				order={order}
				orderBy={ orderBy}
				filters={filters}
				t={t}
			/>}
		</GridContainer>
	}

	render() {
		const { users, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={users}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
				/>
				{this.renderUsers()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Users)