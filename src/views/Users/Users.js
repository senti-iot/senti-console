import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import UserTable from 'components/User/UserTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { /* getAllUsers, */ deleteUser } from 'variables/dataUsers';
// import Toolbar from 'components/Toolbar/Toolbar'
import { People, Business } from 'variables/icons';
import { filterItems, handleRequestSort } from 'variables/functions';

class Users extends Component {
	constructor(props) {
		super(props)

		this.state = {
			users: [],
			userHeader: [],
			loading: true,
			route: 0,
			order: 'desc',
			orderBy: 'firstName',
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader('users.pageTitle', false, '', 'users')
	}
	userHeader = () => {
		const { t } = this.props
		return	[
			{ id: 'avatar', label: '' },
			{ id: 'firstName', label: t('users.fields.name') },
			{ id: 'phone', label: t('users.fields.phone') },
			{ id: 'email', label: t('users.fields.email') },
			{ id: 'org.name', label: t('users.fields.organisation') },
			{ id: 'lastSignIng', label: t('users.fields.lastSignIn') }
		]
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getData()
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	componentDidUpdate = async (prevState, prevProps) => {
		if (prevProps.users !== this.props.users) {
			this.setState({ users: this.props.users })
		}
	}
	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.users)
		this.setState({ users: newData, order, orderBy: property })
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
		if (this.props.users) { 
			this.setState({
				users: this.props.users,
				loading: false
			}, () => this.handleRequestSort(null, 'firstName', 'asc'))
			return
		}
		// let users = await getAllUsers().then(rs => rs)
		// if (this._isMounted) {
		// 	this.setState({
		// 		users: users ? users : [],
		
		// 		loading: false
		// 	}, () => this.handleRequestSort(null, 'firstName', 'asc'))
		// }
	}

	tabs = [
		{ id: 0, title: this.props.t('users.tabs.users'), label: <People />, url: `/management/users` },
		{ id: 1, title: this.props.t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
	]
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break
			case 2:
				s('snackbars.exported')
				break
			default:
				break;
		}
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.props.reload()
	}
	handleDeleteUsers = async (selected) => {
		await selected.forEach(async u => {
			await deleteUser(u)
		})
		await this.props.reload()
		this.snackBarMessages(1)
	}
	renderUsers = () => {
		const { t } = this.props
		const { loading, order, orderBy, filters } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <UserTable
				data={this.filterItems(this.state.users)}
				tableHead={this.userHeader()}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleFilterStartDate={this.handleFilterStartDate}
				handleRequestSort={this.handleRequestSort}
				handleDeleteUsers={this.handleDeleteUsers}
				order={order}
				orderBy={orderBy}
				filters={filters}
				t={t}
			/>}
		</GridContainer>
	}

	render() {
		// const { users, filters } = this.state
		return (
			<Fragment>
				{/* <Toolbar
					data={users}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
				/> */}
				{this.renderUsers()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Users)