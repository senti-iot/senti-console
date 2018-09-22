import React, { Component, Fragment } from 'react'
import { withStyles } from "@material-ui/core";
import projectStyles from 'assets/jss/views/projects';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { getAllOrgs } from 'variables/dataUsers';
import OrgTable from 'components/Orgs/OrgTable';
import Toolbar from 'components/Toolbar/Toolbar'
import { People, Business } from '@material-ui/icons';
import { filterItems } from 'variables/functions'

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
	
	filterItems = (data) => {
		return filterItems(data, this.state.filters)
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
					{ id: "phone", label: t("users.fields.phone") },
					{ id: "email", label: t("users.fields.email") },
					{ id: "org", label: t("users.fields.organisation") },
					{ id: "lastSignIng", label: t("users.fields.lastSignIn") }
				],
				orgsHeader: [
					{ id: "name", label: t("orgs.fields.name") },
					{ id: "address", label: t("orgs.fields.address") },
					{ id: "city", label: t("orgs.fields.city") },
					{ id: "url", label: t("orgs.fields.url") },
				],
				loading: false
			})
		}
	}

	tabs = [
		{ id: 0, title: this.props.t("users.tabs.users"), label: <People />, url: `/users` },
		{ id: 1, title: this.props.t("users.tabs.orgs"), label: <Business />, url: `/orgs` },
	]
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}

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
		const { orgs, route, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={orgs} 
					route={route} 
					filters={filters} 
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
					defaultRoute={1}
				/>
				{this.renderOrgs()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Orgs)