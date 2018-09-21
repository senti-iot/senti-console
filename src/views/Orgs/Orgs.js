import React, { Component, Fragment } from 'react'
import { withStyles } from "@material-ui/core";
import projectStyles from 'assets/jss/views/projects';
import UserTable from 'components/User/UserTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { getAllOrgs } from 'variables/dataUsers';
import OrgTable from 'components/Orgs/OrgTable';
import Toolbar from 'views/Users/Toolbar'
var moment = require('moment');

class Orgs extends Component {
	constructor(props) {
		super(props)

		this.state = {
			users: [],
			userHeader: [],
			loading: true,
			route: 0,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader(props.t("orgs.pageTitle"), false)
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
	filterByDate = (items) => {
		const { startDate, endDate } = this.state.filters
		var arr = items
		var keys = Object.keys(arr[0])
		var filteredByDate = arr.filter(c => {
			var contains = keys.map(key => {
				var openDate = moment(c['open_date'])
				var closeDate = moment(c['close_date'])
				if (openDate > startDate
					&& closeDate < (endDate ? endDate : moment())) {
					return true
				}
				else
					return false
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filteredByDate
	}

	isObject = (obj) => {
		return obj === Object(obj);
	}
	keyTester = (obj) => {
		let searchStr = this.state.filters.keyword.toLowerCase()
		let found = false
		if (this.isObject(obj)) {
			for (var k in obj) {
				if (!found) {
					if (k instanceof Date) {
						let date = moment(obj[k]).format("DD.MM.YYYY")
						found = date.toLowerCase().includes(searchStr)
					}
					else {
						if (this.isObject(obj[k])) {
							found = this.keyTester(obj[k])
						}
						else {
							found = obj[k] ? obj[k].toString().toLowerCase().includes(searchStr) : false
						}
					}
				}
				else {
					break
				}
			}
		}
		else {
			found = obj ? obj.toString().toLowerCase().includes(searchStr) : null
		}
		return found
	}
	filterItems = (projects) => {
		const { activeDateFilter } = this.state.filters
		var arr = projects
		if (activeDateFilter)
			arr = this.filterByDate(arr)
		if (arr) {
			if (arr[0] === undefined)
				return []
			var keys = Object.keys(arr[0])
			var filtered = arr.filter(c => {
				var contains = keys.map(key => {
					return this.keyTester(c[key])

				})
				return contains.indexOf(true) !== -1 ? true : false
			})
			return filtered
		}
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
		let users = await getAllOrgs().then(rs => rs)
		let orgs = await getAllOrgs().then(rs => rs)
		if (this._isMounted) {
			this.setState({
				users: users ? users : [],
				orgs: orgs ? orgs : [],
				userHeader: [
					{ id: "avatar", label: "" },
					{ id: "firstName", label: t("users.fields.name") },
					// { id: "firstName", label: t("users.fields.firstName") },
					// { id: "lastName", label: t("users.fields.lastName") },
					{ id: "phone", label: t("users.fields.phone") },
					{ id: "email", label: t("users.fields.email") },
					{ id: "org", label: t("users.fields.organisation") },
					{ id: "lastSignIng", label: t("users.fields.lastSignIn") }
				],
				orgsHeader: [
					{ id: "name", label: t("orgs.fields.name") },
					{ id: "address", label: t("orgs.fields.address") },
					{ id: "city", label: t("orgs.fields.city") },
					// { id: "country", label: t("orgs.fields.country") },
					{ id: "url", label: t("orgs.fields.url") },
					// { id: "org", label: t("orgs.fields.org") }
				],
				loading: false
			})
		}
	}


	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	renderOrgs = () => {
		const { t } = this.props
		const { loading } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <UserTable
				data={this.filterItems(this.state.users)}
				tableHead={this.state.userHeader}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleFilterStartDate={this.handleFilterStartDate}
				filters={this.state.filters}
				t={t}
			/>}
		</GridContainer>
	}
	// renderNewOrg = () => {
	// 	const { t } = this.props
	// 	const { loading } = this.state
	// 	return <GridContainer justify={'center'}>
	// 		{loading ?  <CircularLoader/> : <CreateOrg t={t}/>}
	// 	</GridContainer>
	// }
	renderOrgs = () => {
		const { t } = this.props
		const { loading } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <OrgTable
				data={this.filterItems(this.state.orgs)}
				tableHead={this.state.orgsHeader}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleFilterStartDate={this.handleFilterStartDate}
				filters={this.state.filters}
				t={t}
			/>}
		</GridContainer>
	}
	render() {
		const { classes, t } = this.props
		const { users, route, filters } = this.state
		return (
			<Fragment>
				<Toolbar classes={classes} t={t} users={users} 
					route={route} 
					handleTabsChange={this.handleTabsChange}
					filters={filters} 
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
				/>
				{this.renderOrgs()}
				{/* <Switch>
					<Route path={`${this.props.match.path}/orgs/new`} render={() => this.renderNewOrg()} />
					<Route path={`${this.props.match.path}/orgs`} render={() => this.renderOrgs()} />
					<Route path={`${this.props.match.path}/`} render={() => this.renderOrgs()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/`} />
				</Switch> */}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Orgs)