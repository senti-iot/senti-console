import React, { Component, Fragment } from 'react'
import { withStyles } from "@material-ui/core";
import projectStyles from 'assets/jss/views/projects';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { getAllCollections } from 'variables/dataCollections';
import CollectionTable from 'components/Collections/CollectionTable';
import Toolbar from 'components/Toolbar/Toolbar'
import { /* People, Business, */ DataUsage } from 'variables/icons';
import { filterItems, handleRequestSort } from 'variables/functions'
import { deleteCollection } from '../../variables/dataCollections';

class Collections extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collections: [],
			loading: true,
			route: 0,
			order: 'desc',
			orderBy: 'name',
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader("collections.pageTitle", false, '', "collections")
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.getData()
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getData()
		// if (this._isMounted) {
		// 	if (this.props.location.pathname.includes('/collections')) {
		// 		this.setState({ route: 1 })
		// 	}
		// 	else {
		// 		this.setState({ route: 0 })
		// 	}
		// }
	}
	componentWillUnmount = () => {

		this._isMounted = 0
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.collections)
		this.setState({ collections: newData, order, orderBy: property })
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
		let collections = await getAllCollections().then(rs => rs)
		if (this._isMounted) {
			this.setState({
				collections: collections ? collections : [],
				collectionsHeader: [
					{ id: "name", label: t("collections.fields.name") },
					{ id: "description", label: t("collections.fields.address") },
					{ id: "created", label: t("collections.fields.city") },
					{ id: "modified", label: t("collections.fields.url") },
					{ id: "org.name", label: t("collections.fields.org") }
				],
				loading: false
			}, () => this.handleRequestSort(null, 'name', 'asc'))

		}
	}

	tabs = [
		{ id: 0, title: this.props.t("users.tabs.collections"), label: <DataUsage />, url: `/users` },
		// { id: 1, title: this.props.t("users.tabs.collections"), label: <Business />, url: `/collections` },
	]
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s("snackbars.deletedSuccess")
				break;
			case 2:
				s("snackbars.exported")
				break;
			default:
				break;
		}
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	handleDeleteCollections = async (selected) => {
		await selected.forEach(async u => {
			await deleteCollection(u)
		})
		this.getData()
		this.snackBarMessages(1)
	}
	renderCollections = () => {
		const { t } = this.props
		const { loading, order, orderBy } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <CollectionTable
				data={this.filterItems(this.state.collections)}
				tableHead={this.state.collectionsHeader}
				handleFilterEndDate={this.handleFilterEndDate}
				handleFilterKeyword={this.handleFilterKeyword}
				handleFilterStartDate={this.handleFilterStartDate}
				handleRequestSort={this.handleRequestSort}
				handleDeleteCollections={this.handleDeleteCollections}
				orderBy={orderBy}
				order={order}
				filters={this.state.filters}
				t={t}
			/>}
		</GridContainer>
	}
	render() {
		const { collections, route, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={collections}
					route={route}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
					defaultRoute={0}
				/>
				{this.renderCollections()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Collections)