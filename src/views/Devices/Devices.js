import React, { Component, Fragment } from 'react'
import { getAllDevices, getDevice } from 'variables/dataDevices';
import {
	withStyles, Paper, Dialog, DialogTitle, DialogContent,
	DialogContentText, DialogActions, Button, IconButton, Menu, MenuItem
} from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom'
import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
import CircularLoader from 'components/Loader/CircularLoader';
import { Maps } from 'components/Map/Maps';
import GridContainer from 'components/Grid/GridContainer';
import { ViewList, ViewModule, Map, Add, FilterList, Build, Business, DataUsage, Edit, LayersClear, SignalWifi2Bar, Star, StarBorder } from 'variables/icons'
import Toolbar from 'components/Toolbar/Toolbar'
import { filterItems, handleRequestSort } from 'variables/functions';
import DeviceCard from 'components/Devices/DeviceCard'
import { boxShadow } from 'assets/jss/material-dashboard-react';
import { unassignDeviceFromCollection } from 'variables/dataCollections';
import { Info, AssignDC, AssignOrg, ItemG } from 'components';
import TableToolbar from 'components/Table/TableToolbar';
import { connect } from 'react-redux'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';

class Devices extends Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: null,
			selected: [],
			openAssignCollection: false,
			openAssignOrg: false,
			openUnassign: false,
			deviceHeaders: [],
			loading: true,
			anchorElMenu: null,
			route: 0,
			order: 'desc',
			orderBy: 'id',
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader('devices.pageTitle', false, '', 'devices')
	}
	tabs = [
		{ id: 0, title: this.props.t('devices.tabs.listView'), label: <ViewList />, url: `${this.props.match.path}/list` },
		{ id: 1, title: this.props.t('devices.tabs.mapView'), label: <Map />, url: `${this.props.match.path}/map` },
		{ id: 2, title: this.props.t('devices.tabs.cardView'), label: <ViewModule />, url: `${this.props.match.path}/grid` },
		{ id: 3, title: this.props.t('sidebar.favorites'), label: <Star />, url: `${this.props.match.path}/favorites` }
	]

	deviceHeaders = () => {
		const { t } = this.props
		return [
			{ id: 'name', label: t('devices.fields.name') },
			{ id: 'id', label: t('devices.fields.id') },
			{ id: 'liveStatus', checkbox: true, label: <ItemG container justify={'center'} title={t('devices.fields.status')}><SignalWifi2Bar /></ItemG> },
			{ id: 'address', label: t('devices.fields.address') },
			{ id: 'org.name', label: t('devices.fields.org') },
			{ id: 'dataCollection[0].id', label: t('devices.fields.availability') }
		]
	}
	options = () => {
		const { t, accessLevel, isFav } = this.props
		const { devices, selected } =  this.state
		let device = devices[devices.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		let isFavorite = isFav(favObj)
		if (accessLevel.apisuperuser)
			return [
				{ label: t('menus.edit'), func: this.handleDeviceEdit, single: true, icon: Edit },
				{ label: t('menus.assign.deviceToCollection'), func: this.handleOpenAssignCollection, single: true, icon: DataUsage },
				{ label: t('menus.assign.deviceToOrg'), func: this.handleOpenAssignOrg, single: false, icon: Business },
				{ label: t('menus.unassign.deviceFromCollection'), func: this.handleOpenUnassignDialog, single: false, icon: LayersClear },
				{ label: t('menus.calibrate'), func: this.handleCalibrateFlow, single: true, icon: Build },
				{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) }
				// { label: t('menus.delete'), func: this.handleDeleteProjects, single: false, icon: Delete }, 
			]
		else {
			return [
				{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
				{ label: t('menus.exportPDF'), func: () => { }, single: false }
			]
		}
	}
	snackBarMessages = (msg) => {
		const { s, t } = this.props
		switch (msg) {
			case 1:
				//TODO
				s('snackbars.assign.deviceToCollection', { device: '', collection: '' })
				break
			case 2:
				//TODO
				s('snackbars.assign.deviceToOrg', { device: '', org: '' })
				break
			case 3:
				s('snackbars.unassignDevice', {
					device: '',
					what: t('collections.fields.id')
				})
				break
			default:
				break;
		}
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	handleTabs = () => {
		if (this.props.location.pathname.includes('/map'))
			this.setState({ route: 1 })
		else {
			if (this.props.location.pathname.includes('/grid'))
				this.setState({ route: 2 })
			if (this.props.location.pathname.includes('/favorites'))
				this.setState({ route: 3 })
			else {
				this.setState({ route: 0 })
			}
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		await this.getDevices()
		// No more bullcrap
		// this.liveStatus = setInterval(this.getDevices, 10000);
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.handleTabs()
		}
		if (this.props.saved === true) {
			const { devices, selected } = this.state
			let device = devices[devices.findIndex(d => d.id === selected[0])]
			if (this.props.isFav({ id: device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.saved', { name: device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
			if (!this.props.isFav({ id: device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.removed', { name: device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
		}
	}

	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}

	getDevices = async () => {
		await getAllDevices().then(rs => {
			return	this._isMounted ? this.setState({
				devices: rs ? rs : [],
				loading: false
			}, () => this.handleRequestSort(null, 'id', 'asc')) : null})
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	//region Handlers

	handleCalibrateFlow = () => {
		this.props.history.push(`/device/${this.state.selected[0]}/setup`)
	}

	handleDeviceEdit = () => {
		const { selected } = this.state
		this.props.history.push({
			pathname: `/device/${selected[0]}/edit`,
			prevURL: '/devices/list'
		})
	}

	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget });
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
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

	handleOpenAssignOrg = () => {
		this.setState({ openAssignOrg: true, anchorElMenu: null })
	}

	handleCloseAssignOrg = async reload => {
		if (reload) {
			this.setState({ loading: true, openAssignOrg: false })
			await this.getDevices().then(rs => {
				this.snackBarMessages(2)
			})
		}
		else { this.setState({ openAssignOrg: false }) }
	}

	handleOpenAssignCollection = () => {
		this.setState({ openAssignCollection: true, anchorElMenu: null })
	}

	handleCloseAssignCollection = async reload => {
		if (reload) {
			this.setState({ loading: true, openAssignCollection: false })
			await this.getDevices().then(rs => {
				this.snackBarMessages(1)
			})
		}
		else { this.setState({ openAssignCollection: false, }) }

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
	handleDeviceClick = id => e => {
		e.stopPropagation()
		this.props.history.push('/device/' + id)
	}
	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/device/' + id, prevURL: '/devices/favorites' })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.state.devices.map(n => n.id) });
			return;
		}
		this.setState({ selected: [] });
	};

	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected });
	};

	handleUnassignDevices = async () => {
		// const { data } = this.props
		const { selected } = this.state
		let devices = []
		devices = await Promise.all(selected.map(s => getDevice(s))).then(rs => rs)
		await Promise.all(devices.map(d => unassignDeviceFromCollection({
			id: d.dataCollection,
			deviceId: d.id
		}))).then(() => this.handleCloseUnassignDialog)
	}

	handleOpenUnassignDialog = () => {
		this.setState({ openUnassign: true, anchorElMenu: null })
	}

	handleCloseUnassignDialog = async () => {
		this.setState({ openUnassign: false })
		await this.getData().then(() => {
			this.snackBarMessages(3)
		})
	}

	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.devices)
		this.setState({ devices: newData, order, orderBy: property })
	}

	//endregion

	renderConfirmUnassign = () => {
		const { openUnassign, selected, devices } = this.state
		const { t } = this.props
		return <Dialog
			open={openUnassign}
			onClose={this.handleCloseUnassignDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.unassign.title.devicesFromCollection')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.unassign.message.devicesFromCollection')}
				</DialogContentText>
				<div>
					{selected.map(s => {
						let device = devices[devices.findIndex(d => d.id === s)]
						return <Info key={s}>&bull;{`${device.id} ${device.name}`}</Info>
					})
					}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassignDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleUnassignDevices} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderLoader = () => {
		// const { classes } = this.props

		return <CircularLoader />
	}
	renderTableToolBarContent = () => {
		const { classes, t } = this.props
		const { anchorFilterMenu } = this.state
		return <Fragment>
			<IconButton aria-label='Add new organisation' onClick={this.addNewOrg}>
				<Add />
			</IconButton>
			<IconButton
				className={classes.secondAction}
				aria-label={t('tables.filter')}
				aria-owns={anchorFilterMenu ? 'filter-menu' : null}
				onClick={this.handleFilterMenuOpen}>
				<FilterList />
			</IconButton>
			<Menu
				id='filter-menu'
				anchorEl={anchorFilterMenu}
				open={Boolean(anchorFilterMenu)}
				onClose={this.handleFilterMenuClose}
				PaperProps={{ style: { width: 200, boxShadow: boxShadow } }}>

				{this.deviceHeaders().map(option => {
					return <MenuItem key={option.id} onClick={this.handleFilter}>
						{option.label}
					</MenuItem>
				})}
			</Menu>
		</Fragment>
	}
	getFavs = () => {
		let favorites = this.props.favorites.filter(f => f.type === 'device')
		
		let favDevices = favorites.map(f => {
			return this.state.devices[this.state.devices.findIndex(d => d.id === f.id)]
		})
		
		return favDevices
	}
	renderFavorites = () => {
		const { t, classes } = this.props
		const { devices, loading, order, orderBy, selected, filters,
			openAssignCollection, openAssignOrg } = this.state

		return loading ? this.renderLoader() : <GridContainer justify={'center'}>
			<Paper className={classes.root}>
				<AssignDC
					deviceId={selected[0] ? selected[0] : 0}
					open={openAssignCollection}
					handleClose={this.handleCloseAssignCollection}
					handleCancel={this.handleCancelAssign}
					t={this.props.t}
				/>
				<AssignOrg
					devices
					open={openAssignOrg}
					handleClose={this.handleCloseAssignOrg}
					deviceId={selected.map(s => devices[devices.findIndex(d => d.id === s)])}
					t={t} />
				{this.renderConfirmUnassign()}
				<TableToolbar
					// ft={this.ft()}
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/>
				<DeviceTable
					handleClick={this.handleFavClick}
					handleOpenAssignCollection={this.handleOpenAssignCollection}
					handleOpenAssignOrg={this.handleOpenAssignOrg}
					handleOpenUnassignDialog={this.handleOpenUnassignDialog}
					selected={selected}
					filter={this.filter}
					data={this.filterItems(this.getFavs())}
					handleSelectAllClick={this.handleSelectAllClick}
					tableHead={this.deviceHeaders()}
					handleFilterEndDate={this.handleFilterEndDate}
					handleFilterKeyword={this.handleFilterKeyword}
					handleFilterStartDate={this.handleFilterStartDate}
					handleRequestSort={this.handleRequestSort}
					handleCheckboxClick={this.handleCheckboxClick}
					order={order}
					orderBy={orderBy}
					filters={filters}
					deleteProjects={this.deleteProjects}
					t={t}
				/>
			</Paper>
		</GridContainer>

	}
	renderList = () => {
		const { t, classes } = this.props
		const { devices, loading, order, orderBy, selected, filters,
			openAssignCollection, openAssignOrg } = this.state
		return loading ? this.renderLoader() : <GridContainer justify={'center'}>
			<Paper className={classes.root}>
				<AssignDC
					deviceId={selected[0] ? selected[0] : 0}
					open={openAssignCollection}
					handleClose={this.handleCloseAssignCollection}
					handleCancel={this.handleCancelAssign}
					t={this.props.t}
				/>
				<AssignOrg
					devices
					open={openAssignOrg}
					handleClose={this.handleCloseAssignOrg}
					deviceId={selected.map(s => devices[devices.findIndex(d => d.id === s)])}
					t={t} />
				{this.renderConfirmUnassign()}
				<TableToolbar
					// ft={this.ft()}
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/>
				<DeviceTable
					handleClick={this.handleDeviceClick}
					handleOpenAssignCollection={this.handleOpenAssignCollection}
					handleOpenAssignOrg={this.handleOpenAssignOrg}
					handleOpenUnassignDialog={this.handleOpenUnassignDialog}
					selected={selected}
					filter={this.filter}
					data={this.filterItems(devices)}
					handleSelectAllClick={this.handleSelectAllClick}
					tableHead={this.deviceHeaders()}
					handleFilterEndDate={this.handleFilterEndDate}
					handleFilterKeyword={this.handleFilterKeyword}
					handleFilterStartDate={this.handleFilterStartDate}
					handleRequestSort={this.handleRequestSort}
					handleCheckboxClick={this.handleCheckboxClick}
					order={order}
					orderBy={orderBy}
					filters={filters}
					deleteProjects={this.deleteProjects}
					t={t}
				/>
			</Paper>
		</GridContainer>
	}
	renderCards = () => {
		const { loading } = this.state
		return loading ? this.renderLoader() : <GridContainer spacing={8} justify={'center'}>
			{this.filterItems(this.state.devices).map((d, k) => {
				return <ItemG key={k} container justify={'center'} xs={12} sm={6} md={4}>
					<DeviceCard key={k} t={this.props.t} d={d} />
				</ItemG>
			})}
		</GridContainer>
	}
	renderMap = () => {
		const { devices, loading } = this.state
		const { classes } = this.props
		return loading ? <CircularLoader /> : <GridContainer container justify={'center'} >
			<Paper className={classes.paper}>
				<Maps t={this.props.t} isMarkerShown centerDenmark markers={this.filterItems(devices)} /* zoom={10} */ />
			</Paper>
		</GridContainer>
	}

	render() {
		const { devices, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={devices}
					filters={filters}
					history={this.props.history}
					route={this.state.route}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
				/>
				<Switch>
					<Route path={`${this.props.match.path}/map`} render={() => this.renderMap()} />
					<Route path={`${this.props.match.path}/list`} render={() => this.renderList()} />
					<Route path={`${this.props.match.path}/grid`} render={() => this.renderCards()} />
					<Route path={`${this.props.match.path}/favorites`} render={() => this.renderFavorites()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch>
			</Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Devices))