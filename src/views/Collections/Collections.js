import { Paper, withStyles } from "@material-ui/core";
import projectStyles from 'assets/jss/views/projects';
import CollectionTable from 'components/Collections/CollectionTable';
import TableToolbar from 'components/Table/TableToolbar';
import Toolbar from 'components/Toolbar/Toolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from "react-router-dom";
import { deleteCollection, getAllCollections } from 'variables/dataCollections';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Delete, Edit, Map, PictureAsPdf, ViewList, ViewModule } from 'variables/icons';
import { GridContainer, CircularLoader } from 'components'

class Collections extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
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
			// console.log(collections);
			this.setState({
				collections: collections ? collections : [],
				collectionsHeader: [
					{ id: "name", label: t("collections.fields.name") },
					{ id: "activeDevice.liveStatus", label: t("collections.fields.status") },
					{ id: "created", label: t("collections.fields.created") },
					{ id: "devices[0].start", label: t("collections.fields.activeDeviceStartDate") },
					{ id: "org.name", label: t("collections.fields.org") }
				],
				loading: false
			}, () => this.handleRequestSort(null, 'name', 'asc'))

		}
	}

	tabs = [
		{ id: 0, title: this.props.t("devices.tabs.listView"), label: <ViewList />, url: `${this.props.match.url}/list` },
		{ id: 1, title: this.props.t("devices.tabs.mapView"), label: <Map />, url: `${this.props.match.url}/map` },
		{ id: 2, title: this.props.t("devices.tabs.cardView"), label: <ViewModule />, url: `${this.props.match.url}/cards` },
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
		await this.getData()
		this.setState({ selected: [], anchorElMenu: null })
		this.snackBarMessages(1)
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.state.collections.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleClick = (event, id) => {
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
	renderTableToolBarContent = () => {
		// const { accessLevel } = this.props
		// const { anchorFilterMenu } = this.state
		// let access = accessLevel.apicollection ? accessLevel.apicollection.edit ? true : false : false
		// return <Fragment>
		// 	{access ? <IconButton aria-label="Add new collection" onClick={this.addNewCollection}>
		// 		<Add />
		// 	</IconButton> : null
		// 	}
		// </Fragment>
	}
	options = () => {
		const { t, /* accessLevel */ } = this.props
		let allOptions = [
			{ label: t("menus.edit"), func: this.handleEdit, single: true, icon: Edit },
			{ label: t("menus.exportPDF"), func: () => { }, icon: PictureAsPdf },
			{ label: t("menus.delete"), func: this.handleOpenDeleteDialog, icon: Delete }
		]
		// if (accessLevel.apiorg.edit)
		return allOptions
		// else return [
		// { label: t("menus.exportPDF"), func: () => { }, icon: PictureAsPdf }
		// ]
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
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
		const { t } = this.props
		const { order, orderBy, selected } = this.state

		return <CollectionTable
			selected={selected}
			handleClick={this.handleClick}
			handleSelectAllClick={this.handleSelectAllClick}
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
		/>
	}
	renderCollections = () => {
		const { classes } = this.props
		const { loading } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable()}
			</Paper>
			}
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
				<Switch>
					<Route path={`${this.props.match.path}/map`} render={() => this.renderCollections()} />
					<Route path={`${this.props.match.path}/list`} render={() => this.renderCollections() } />
					<Route path={`${this.props.match.path}/grid`} render={() => this.renderCollections()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch>
				
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Collections))