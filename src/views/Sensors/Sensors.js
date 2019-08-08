import { Paper, withStyles, Dialog, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import SensorTable from 'components/Sensors/SensorTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort } from 'variables/functions';
import { Delete, Edit, ViewList, ViewModule, Add, Star, StarBorder, CheckCircle, Block } from 'variables/icons';
import { GridContainer, CircularLoader } from 'components'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getSensors, setSensors, sortData } from 'redux/data';
import SensorCards from 'components/Sensors/SensorCards';

class Sensors extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openDelete: false,
			selected: [],
			route: 0,
			order: 'asc',
			orderBy: 'id',
			filters: {
				keyword: ''
			}
		}
		props.setHeader('devices.pageTitle', false, '', 'manage.sensors')
		props.setBC('devices')
		props.setTabs({
			id: 'devices',
			tabs: this.tabs(),
			route: this.handleTabs()
		})
	}
	//#region Constants
	tabs = () => {
		const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			{ id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}
	dCommunication = () => {
		const { t, classes } = this.props
		return [
			{ value: 0, label: t("sensors.fields.communications.blocked"), icon: <Block className={classes.blocked} /> },
			{ value: 1, label: t("sensors.fields.communications.allowed"), icon: <CheckCircle className={classes.allowed} /> }
		]
	}
	ft = () => {
		const { t } = this.props
		return [
			{ key: 'name', name: t('devices.fields.name'), type: 'string' },
			{ key: 'uuid', name: t('sensors.fields.uuid'), type: 'string' },
			{ key: 'communication', name: t('sensors.fields.communication'), type: 'dropDown', options: this.dCommunication() },
			{ key: 'reg_name', name: t('sensors.fields.registry'), type: 'string' },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	devicesHeader = () => {
		const { t } = this.props
		return [
			{ id: 'id', label: t('devices.fields.id') },
			{ id: 'name', label: t('devices.fields.name') },
			{ id: 'uuid', label: t('sensors.fields.uuid') },
			{ id: 'communication', label: t('sensors.fields.communication') },
			{ id: 'reg_name', label: t('sensors.fields.registry') },
		]
	}
	options = () => {
		const { t, isFav, devices } = this.props
		const { selected } = this.state

		let device = devices[devices.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'sensor',
			path: `/sensor/${device.id}`
		}
		let isFavorite = isFav(favObj)
		let allOptions = [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) }
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle
	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		if (this.props.user && this.props.accessLevel) {
			this.getData(true)
		}

	}

	componentDidUpdate = () => {
		const { t, saved, s, isFav, finishedSaving } = this.props
		if (saved === true) {
			const { devices } = this.props
			const { selected } = this.state
			let device = devices[devices.findIndex(d => d.id === selected[0])]
			if (device) {
				if (isFav({ id: device.id, type: 'sensor' })) {
					s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.device') })
					finishedSaving()
					this.setState({ selected: [] })
				}
				if (!isFav({ id: device.id, type: 'sensor' })) {
					s('snackbars.favorite.removed', { name: device.name, type: t('favorites.types.device') })
					finishedSaving()
					this.setState({ selected: [] })
				}
			}
		}
	}

	//#endregion

	//#region Functions
	addNewRegistry = () => this.props.history.push({ pathname: `/sensors/new`, prevURL: '/sensors/list' })

	getFavs = () => {
		const { order, orderBy } = this.state
		const { favorites, devices } = this.props
		let favs = favorites.filter(f => f.type === 'sensor')
		let favSensors = favs.map(f => {
			return devices[devices.findIndex(d => d.id === f.id)]
		})
		favSensors = handleRequestSort(orderBy, order, favSensors)
		return favSensors
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	filterItems = (data) => {
		const rFilters = this.props.filters
		const { filters } = this.state
		return customFilterItems(filterItems(data, filters), rFilters)
	}
	snackBarMessages = (msg) => {
		const {/*  devices, */ s } = this.props
		// const { selected } = this.state
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			case 3:
				s('snackbars.assign.deviceToRegistry', { device: ``, what: 'Device' })
				break;
			case 6:
				// s('snackbars.assign.deviceToRegistry', { device: `${devices[devices.findIndex(c => c.id === selected[0])].name}`, device: display })
				break
			default:
				break;
		}
	}
	reload = async () => {
		await this.getData(true)
	}
	getData = async (reload) => {
		const { getSensors, accessLevel, user } = this.props
		if (accessLevel || user) {
			if (reload)
				getSensors(true, user.org.id, accessLevel.apisuperuser ? true : false)
			// setSensors()
		}
	}
	//#endregion

	//#region Handlers

	handleEdit = () => {
		const { selected } = this.state
		this.props.history.push({ pathname: `/sensor/${selected[0]}/edit`, prevURL: `/sensors/list` })
	}

	handleTabs = () => {
		const { location } = this.props
		if (location.pathname.includes('grid'))
			// this.setState({ route: 1 })
			return 1
		else {
			if (location.pathname.includes('favorites'))
				// this.setState({ route: 2 })
				return 2
			else {
				// this.setState({ route: 0 })
				return 0
			}
		}
	}
	handleRequestSort = key => (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		this.props.sortData(key, property, order)
		this.setState({ order, orderBy: property })
	}
	handleRegistryClick = id => e => {
		e.stopPropagation()
		this.props.history.push('/sensor/' + id)
	}

	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/sensor/' + id, prevURL: '/sensors/favorites' })
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
	handleDeleteSensors = async () => {
		// const { selected } = this.state
		// Promise.all([selected.map(u => {
		// 	return deleteRegistry(u)
		// })]).then(async () => {
		// 	this.setState({ openDelete: false, anchorElMenu: null, selected: [] })
		// 	await this.getData(true).then(
		// 		() => this.snackBarMessages(1)
		// 	)
		// })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.devices.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleCheckboxClick = (event, id) => {
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

	handleCloseAssignDevice = async (reload, display) => {
		if (reload) {
			this.setState({ openAssignDevice: false })
			await this.getData(true).then(() => {
				this.snackBarMessages(6, display)
				this.setState({ selected: [] })
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
			this.setState({ openAssignProject: false })
			await this.getData(true).then(() => {
				this.snackBarMessages(6)
			})
		}
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleOpenUnassignDevice = () => {
		this.setState({
			openUnassignDevice: true
		})
	}

	handleCloseUnassignDevice = () => {
		this.setState({
			openUnassignDevice: false, anchorEl: null
		})
	}


	//#endregion


	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { t, classes, devices } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.devices')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.devices')}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={devices[devices.findIndex(d => d.id === s)].name} /></ListItem>)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteSensors} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}


	renderTableToolBarContent = () => {
		const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.device')}>
				<IconButton aria-label='Add new device' onClick={this.addNewRegistry}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	renderTableToolBar = () => {
		const { t } = this.props
		const { selected } = this.state
		return <TableToolbar
			ft={this.ft()}
			reduxKey={'sensors'}
			numSelected={selected.length}
			options={this.options}
			t={t}
			content={this.renderTableToolBarContent()}
		/>
	}




	renderTable = (items, handleClick, key) => {
		const { t } = this.props
		const { order, orderBy, selected } = this.state
		return <SensorTable
			data={this.filterItems(items)}
			handleCheckboxClick={this.handleCheckboxClick}
			handleClick={handleClick}
			handleRequestSort={this.handleRequestSort(key)}
			handleSelectAllClick={this.handleSelectAllClick}
			order={order}
			orderBy={orderBy}
			selected={selected}
			t={t}
			tableHead={this.devicesHeader()}
		/>
	}

	renderCards = () => {
		const { t, history, devices, loading } = this.props
		return loading ? <CircularLoader /> :
			<SensorCards sensors={this.filterItems(devices)} t={t} history={history} />
		// null
	}

	renderFavorites = () => {
		const { classes, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{/* {this.renderAssignProject()} */}
				{/* {this.renderAssignDevice()} */}
				{/* {selected.length > 0 ? this.renderDeviceUnassign() : null} */}
				{this.renderTableToolBar()}
				{this.renderTable(this.getFavs(), this.handleFavClick, 'favorites')}
				{this.renderConfirmDelete()}
			</Paper>
			}
		</GridContainer>
	}

	renderSensors = () => {
		const { classes, devices, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{/* {this.renderAssignProject()} */}
				{/* {this.renderAssignDevice()} */}
				{/* {selected.length > 0 ? this.renderDeviceUnassign() : null} */}
				{this.renderTableToolBar()}
				{this.renderTable(devices, this.handleRegistryClick, 'sensors')}
				{this.renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	render() {
		// const { devices, route, filters } = this.state
		const { /* history,  */match } = this.props
		return (
			<Fragment>
				<Switch>
					<Route path={`${match.path}/list`} render={() => this.renderSensors()} />
					<Route path={`${match.path}/grid`} render={() => this.renderCards()} />
					<Route path={`${match.path}/favorites`} render={() => this.renderFavorites()} />
					<Redirect path={`${match.path}`} to={`${match.path}/list`} />
				</Switch>

			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	favorites: state.data.favorites,
	saved: state.favorites.saved,
	devices: state.data.sensors,
	loading: false, //!state.data.gotdevices,
	filters: state.appState.filters.sensors,
	user: state.settings.user
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getSensors: (reload, customerID, ua) => {
		return dispatch(getSensors(reload, customerID, ua))
	},
	setSensors: () => dispatch(setSensors()),
	sortData: (key, property, order) => dispatch(sortData(key, property, order))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Sensors))