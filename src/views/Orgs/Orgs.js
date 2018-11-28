import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
// import { getAllOrgs } from 'variables/dataOrgs';
import OrgTable from 'components/Orgs/OrgTable';
// import Toolbar from 'components/Toolbar/Toolbar'
import { People, Business } from 'variables/icons';
import { filterItems, handleRequestSort } from 'variables/functions'
import { deleteOrg } from 'variables/dataOrgs';

class Orgs extends Component {
	constructor(props) {
		super(props)

		this.state = {
			orgs: [],
			loading: true,
			route: 1,
			order: 'desc',
			orderBy: 'name',
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader('orgs.pageTitle', false, '', 'users')
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.props.reload()
	}
	orgsHeader = () => {
		const { t } = this.props
		return [
			{ id: 'name', label: t('orgs.fields.name') },
			{ id: 'address', label: t('orgs.fields.address') },
			{ id: 'city', label: t('orgs.fields.city') },
			{ id: 'url', label: t('orgs.fields.url') },
		]
	} 
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getData()
		if (this._isMounted) {
			if (this.props.location.pathname.includes('/management/orgs')) {
				this.setState({ route: 1 })
			}
			else {
				this.setState({ route: 0 })
			}
		}
	}
	componentDidUpdate = async (prevState, prevProps) => {
		if (prevProps.orgs !== this.props.orgs) {
			this.setState({ orgs: this.props.orgs })
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.orgs)
		this.setState({ orgs: newData, order, orderBy: property })
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
		// const { t } = this.props
		if (this.props.orgs) { 
			this.setState({
				orgs: this.props.orgs,
				loading: false
			}, () => this.handleRequestSort(null, 'name', 'asc'))
			return
		}
		// let orgs = await getAllOrgs().then(rs => rs)
		// if (this._isMounted) {
		// 	this.setState({
		// 		orgs: orgs ? orgs : [],
			
		// 		loading: false
		// 	}, () => this.handleRequestSort(null, 'name', 'asc'))

		// }
	}

	tabs = [
		{ id: 0, title: this.props.t('users.tabs.users'), label: <People />, url: `/management/users` },
		{ id: 1, title: this.props.t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
	]
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			default:
				break;
		}
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	handleDeleteOrgs = async (selected) => {
		await selected.forEach(async u => {
			await deleteOrg(u)
		})
		await this.props.reload()
		this.snackBarMessages(1)
	}
	renderOrgs = () => {
		const { t } = this.props
		const { loading, order, orderBy } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <OrgTable
				data={this.state.orgs}
				tableHead={this.orgsHeader()}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleFilterStartDate={this.handleFilterStartDate}
				handleRequestSort={this.handleRequestSort}
				handleDeleteOrgs={this.handleDeleteOrgs}
				orderBy={orderBy}
				order={order}
				filters={this.state.filters}
				t={t}
			/>}
		</GridContainer>
	}
	render() {
		// const { orgs, route, filters } = this.state
		return (
			<Fragment>
				{/* <Toolbar
					data={orgs}
					route={route}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
					defaultRoute={1}
				/> */}
				{this.renderOrgs()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Orgs)