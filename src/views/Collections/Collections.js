import { Paper, withStyles, Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, IconButton } from "@material-ui/core";
import projectStyles from 'assets/jss/views/projects';
import CollectionTable from 'components/Collections/CollectionTable';
import TableToolbar from 'components/Table/TableToolbar';
import Toolbar from 'components/Toolbar/Toolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from "react-router-dom";
import { deleteCollection, getAllCollections } from 'variables/dataCollections';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Delete, Edit, PictureAsPdf, ViewList, ViewModule, DeviceHub, LibraryBooks, Add } from 'variables/icons';
import { GridContainer, CircularLoader, AssignDevice, AssignProject } from 'components'
import CollectionCard from 'components/Collections/CollectionCard';

class Collections extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			collections: [],
			loading: true,
			openAssignDevice: false,
			openAssignProject: false,
			openDelete: false,
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
	tabs = [
		{ id: 0, title: this.props.t("devices.tabs.listView"), label: <ViewList />, url: `${this.props.match.url}/list` },
		{ id: 2, title: this.props.t("devices.tabs.cardView"), label: <ViewModule />, url: `${this.props.match.url}/grid` },
	]
	options = () => {
		const { t, /* accessLevel */ } = this.props
		let allOptions = [
			{ label: t("menus.edit"), func: this.handleEdit, single: true, icon: Edit },
			{ label: t("menus.assignProject"), func: this.handleOpenAssignProject, single: false, icon: LibraryBooks },
			{ label: t("menus.assignDevice"), func: this.handleOpenAssignDevice, single: true, icon: DeviceHub },
			{ label: t("menus.exportPDF"), func: () => { }, icon: PictureAsPdf },
			{ label: t("menus.delete"), func: this.handleOpenDeleteDialog, icon: Delete }
		]
		return allOptions
	}
	handleEdit = () => {
		const { selected } = this.state
		this.props.history.push({ pathname: `/collection/${selected[0]}/edit`, prevURL: `/collections/list` })
	}
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s("snackbars.deletedSuccess")
				break;
			case 2:
				s("snackbars.exported")
				break;
			case 3:
				s("snackbars.assignCollection", { collection: ``, what: "Device" })
				break;
			case 6:
				s("snackbars.assignCollection", { collection: ``, what: "Project" })
				break
			default:
				break;
		}
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.getData()
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

	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	handleDeleteCollections = async () => {
		const { selected } = this.state
		Promise.all([selected.map(u => {
			return deleteCollection(u)
		})]).then(async () => {
			this.setState({ loading: true, openDelete: false, anchorElMenu: null, selected: [] })
			await this.getData().then(
				() => this.snackBarMessages(1)
			)
		})
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

	handleOpenAssignDevice = () => {
		this.setState({ openAssignDevice: true, anchorElMenu: null })
	}

	handleCancelAssignDevice = () => {
		this.setState({ openAssignDevice: false })
	}

	handleCloseAssignDevice = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignDevice: false })
			await this.getData().then(rs => {
				this.snackBarMessages(6)
			})
		}
	}
	handleOpenAssignProject = () => {
		this.setState({ openAssignProject: true, anchorElMenu: null })
	}

	handleCancelAssignProject = () => {
		this.setState({ openAssignProject: false })
	}

	handleCloseAssignProject = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignProject: false })
			await this.getData().then(rs => {
				this.snackBarMessages(6)
			})
		}
	}

	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	renderConfirmDelete = () => {
		const { openDelete, collections, selected } = this.state
		const { t, classes  } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("collections.dcDelete")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("collections.dcsDeleteConfirm")}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={collections[collections.findIndex(d => d.id === s)].name} /></ListItem>)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color="primary">
					{t("actions.no")}
				</Button>
				<Button onClick={this.handleDeleteCollections} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}
	addNewCollection = () => this.props.history.push(`/collections/new`)
	renderTableToolBarContent = () => {
		// const { accessLevel } = this.props
		// const { anchorFilterMenu } = this.state
		// let access = accessLevel.apicollection ? accessLevel.apicollection.edit ? true : false : false
		return <Fragment>
			 <IconButton aria-label="Add new collection" onClick={this.addNewCollection}>
				<Add />
			</IconButton>
		</Fragment>
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
			content={this.renderTableToolBarContent()}
		/>
	}

	renderTable = () => {
		const { t } = this.props
		const { order, orderBy, selected, openAssignDevice, openAssignProject } = this.state
		let collectionOrg = this.state.collections.find(r => r.id === selected[0])
		return <Fragment>
			<AssignProject
				multiple
				collectionId={selected ? selected : []}
				handleCancel={this.handleCancelAssignProject}
				handleClose={this.handleCloseAssignProject}
				open={openAssignProject}
				t={t}
			/>
			<AssignDevice
				collectionId={selected[0] ? selected[0] : 0}
				orgId={collectionOrg ? collectionOrg.org.id : 0}
				handleCancel={this.handleCancelAssignDevice}
				handleClose={this.handleCloseAssignDevice}
				open={openAssignDevice}
				t={t}
			/>
			<CollectionTable
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
		</Fragment>
	}

	renderCards = () => {
		const { loading } = this.state
		return loading ? <CircularLoader /> : <GridContainer container justify={'center'}>
			{this.filterItems(this.state.collections).map((d, k) => {
				return <CollectionCard key={k} t={this.props.t} d={d} history={this.props.history} />
			})}
		</GridContainer>
	}

	renderCollections = () => {
		const { classes } = this.props
		const { loading } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable()}
				{this.renderConfirmDelete()}
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
					<Route path={`${this.props.match.path}/list`} render={() => this.renderCollections()} />
					<Route path={`${this.props.match.path}/grid`} render={() => this.renderCards()} />
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