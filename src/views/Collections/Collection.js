import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles, Fade } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, AssignOrg, AssignProject, AssignDevice } from 'components';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getCollection, deleteCollection, unassignDeviceFromCollection } from 'variables/dataCollections';
import CollectionActiveDevice from 'views/Collections/CollectionCards/CollectionActiveDevice';
import CollectionDetails from 'views/Collections/CollectionCards/CollectionDetails';
import CollectionHistory from 'views/Collections/CollectionCards/CollectionHistory';
import { getProject } from 'variables/dataProjects';
import Search from 'components/Search/Search';
import { getDevice, getWeather } from 'variables/dataDevices';
import moment from 'moment'
import teal from '@material-ui/core/colors/teal'
import { getWifiDaily, getWifiMinutely, getWifiHourly, getWifiSummary } from 'components/Charts/DataModel';
import { DataUsage, Timeline, Map, DeviceHub, History } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import ChartDataPanel from 'views/Charts/ChartDataPanel';
import ChartData from 'views/Charts/ChartData';
import Maps from 'views/Maps/MapCard';

class Collection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			//Date Filter
			//End Date Filter Tools
			collection: null,
			activeDevice: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassignDevice: false,
			openAssignOrg: false,
			openAssignDevice: false,
			openDelete: false,
			//Map
			loadingMap: true,
			heatData: null,
			//End Map
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/collections/list'
		props.setHeader('collections.fields.collection', true, prevURL, 'collections')
	}

	format = 'YYYY-MM-DD+HH:mm'
	tabs = [
		{ id: 0, title: '', label: <DataUsage />, url: `#details` },
		{ id: 1, title: '', label: <Timeline />, url: `#data` },
		{ id: 2, title: '', label: <Map />, url: `#map` },
		{ id: 3, title: '', label: <DeviceHub />, url: `#active-device` },
		{ id: 3, title: '', label: <History />, url: `#history` }
	]
	getActiveDevice = async (id) => {
		let device = await getDevice(id)
		if (device.lat && device.long) {
			let data = await getWeather(device, moment(), this.props.language)
			this.setState({ weather: data })
		}
		return device ? this.setState({ activeDevice: device, loading: false }) : this.setState({ loading: false })
	}
	reload = (msgId) => { 
		this.snackBarMessages(msgId)
		this.getActiveDevice(this.state.activeDevice.id)
	}
	getCollectionProject = async (rs) => {
		let project = await getProject(rs)
		this.setState({ collection: { ...this.state.collection, project: project }, loadingProject: false })
	}
	getCollection = async (id) => {
		await getCollection(id).then(async rs => {
			if (rs === null)

				this.props.history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				})
			else {
				this.setState({ collection: rs })

				if (rs.project.id) {
					await this.getCollectionProject(rs.project.id)
				}
				if (rs.activeDeviceStats) {
					await this.getActiveDevice(rs.activeDeviceStats.id)
					// this.handleSwitchDayHourSummary()
					// this.getHeatMapData()
				}
				else {
					this.setState({ loading: false, loadingData: false })
				}
			}
		})
	}
	componentDidUpdate = (prevProps) => {
		if (this.props.id !== prevProps.id || this.props.to !== prevProps.to || this.props.timeType !== prevProps.timeType || this.props.from !== prevProps.from) {
			// this.handleSwitchDayHourSummary()
			// this.getHeatMapData()
		}
		if (this.props.saved === true) {
			const { collection } = this.state
			if (this.props.isFav({ id: collection.id, type: 'collection' })) {
				this.props.s('snackbars.favorite.saved', { name: collection.name, type: this.props.t('favorites.types.collection') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: collection.id, type: 'collection' })) {
				this.props.s('snackbars.favorite.removed', { name: collection.name, type: this.props.t('favorites.types.collection') })
				this.props.finishedSaving()
			}
		}
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				await this.getCollection(id)
				this.props.setBC('collection', this.state.collection.name)
				this.props.setTabs({
					route: 0,
					id: 'collection',
					tabs: this.tabs,
					hashLinks: true
				})
			}
		}
		else {
			this.props.history.push({
				pathname: '/404',
				prevURL: window.location.pathname
			})
		}
	}
	addToFav = () => {
		const { collection } = this.state
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { collection } = this.state
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}

	handleSwitchDayHourSummary = async (p) => {
		let diff = moment.duration(moment(p.to).diff(moment(p.from))).days()
		switch (p.menuId) {
			case 0:// Today
			case 1:// Yesterday
				return await this.getWifiHourly(p);
			case 2:// This week
				return parseInt(diff, 10) > 0 ? this.getWifiDaily(p) : this.getWifiHourly(p)
			case 3:// Last 7 days
			case 4:// 30 days
			case 5:// 90 Days
				return await this.getWifiDaily(p);
			case 6:
				return await this.handleSetCustomRange(p)
			default:
				return await this.getWifiDaily(p);
		}
	}

	handleSetCustomRange = (p) => {
		switch (p.timeType) {
			case 0:
				return this.getWifiMinutely(p)
			case 1:
				return this.getWifiHourly(p)
			case 2:
				return this.getWifiDaily(p)
			case 3:
				return this.getWifiSummary(p)
			default:
				break;
		}
	}

	getWifiSummary = async (p) => {
		const {  collection, hoverID } = this.state
		this.setState({ loadingData: true })
		let newState = await getWifiSummary('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.activeDevice ? collection.activeDevice.id : collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState
	}
	getWifiHourly = async (p) => {
		const {  collection, hoverID } = this.state
		this.setState({ loadingData: true })
		let newState = await getWifiHourly('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.activeDevice ? collection.activeDevice.id : collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState
	}

	getWifiMinutely = async (p) => {
		const {  collection, hoverID } = this.state
		this.setState({ loadingData: true })
		let newState = await getWifiMinutely('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState

	}

	getWifiDaily = async (p) => {
		const {  collection, hoverID } = this.state
		this.setState({ loadingData: true })
		let newState = await getWifiDaily('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState
	}

	snackBarMessages = (msg) => {
		const { s, t } = this.props
		let name = this.state.collection.name ? this.state.collection.name : t('collections.noName')
		let deviceName = this.state.activeDevice ? this.state.activeDevice.name : null
		let deviceId = this.state.activeDevice ? this.state.activeDevice.id : null
		let id = this.state.collection ? this.state.collection.id : null
		switch (msg) {
			case 1:
				s('snackbars.unassign.deviceFromCollection', { collection: `${name} (${id})`, device: this.state.collection.activeDeviceStats.id })
				break
			case 2:
				s('snackbars.assign.collectionToOrg', { collection: `${name} (${id})`, org: this.state.collection.org.name })
				break
			case 5: 
				s('snackbars.deviceUpdated', { device: `${deviceName}(${deviceId})` })
				break;
			case 7:
				s('snackbars.assign.collectionToProject', { collection: `${name} (${id})`, project: this.state.collection.project.title })
				break
			case 6:
				s('snackbars.assign.deviceToCollection', { collection: `${name} (${id})`, device: deviceId ? deviceId : "" })
				break
			case 4:
				s('snackbars.collectionDeleted')
				break
			default:
				break
		}
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	handleDeleteCollection = async () => {
		await deleteCollection(this.state.collection.id).then(rs => {
			this.setState({
				openDelete: false
			})
			if (rs) {
				this.snackBarMessages(4)
				this.props.history.push('/collections/list')
			}

		})
	}

	handleOpenAssignDevice = () => {
		this.setState({ openAssignDevice: true, anchorEl: null })
	}

	handleCancelAssignDevice = () => {
		this.setState({ openAssignDevice: false })
	}

	handleCloseAssignDevice = async (reload) => {
		console.trace()
		if (reload) {
			this.setState({ loading: true, openAssignDevice: false })
			if (this.state.collection)
			{
				await this.getCollection(this.state.collection.id).then(() => {
					this.snackBarMessages(6)
				})
			}
		}
		else {
			this.setState({ openAssignDevice: false })
		}
	}

	handleOpenAssignOrg = () => {
		this.setState({ openAssignOrg: true, anchorEl: null })
	}

	handleCancelAssignOrg = () => {
		this.setState({ openAssignOrg: false })
	}

	handleCloseAssignOrg = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignOrg: false })
			await this.getCollection(this.state.collection.id).then(() => {
				this.snackBarMessages(2)
			})
		}
	}

	handleOpenAssignProject = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}

	handleCancelAssignProject = () => {
		this.setState({ openAssign: false })
	}

	handleCloseAssignProject = async (reload) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null, openAssign: false })
			await this.getCollection(this.state.collection.id).then(() => {
				this.snackBarMessages(7)
			})
		}
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
	handleUnassignDevice = async () => {
		const { collection } = this.state
		await unassignDeviceFromCollection({
			id: collection.id,
			deviceId: collection.activeDeviceStats.id
		}).then(async rs => {
			if (rs) {
				this.handleCloseUnassignDevice()
				this.setState({ loading: true })
				this.snackBarMessages(1)
				await this.getCollection(this.state.collection.id)
			}
		})
	}

	renderLoader = () => {
		return <CircularLoader />
	}

	renderAssignDevice = () => {
		const { t } = this.props
		const { collection, openAssignDevice } = this.state
		return (
			<Dialog
				open={openAssignDevice}
				onClose={this.handleCloseAssignDevice}
			>
				<DialogTitle disableTypography>
					<DialogActions>
						<Search />
					</DialogActions>
					<DialogContentText id='alert-dialog-description'>
						{t('dialogs.unassign', { id: collection.id, name: collection.name, what: collection.org.name })}
					</DialogContentText>
				</DialogTitle>
			</Dialog>
		)
	}

	renderConfirmUnassign = () => {
		const { t } = this.props
		const { collection } = this.state
		return <Dialog
			open={this.state.openUnassignDevice}
			onClose={this.handleCloseUnassignDevice}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.unassign.title.deviceFromCollection')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.unassign.message.deviceFromCollection', { device: collection.activeDeviceStats.id, collection: collection.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassignDevice} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleUnassignDevice} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	renderDeleteDialog = () => {
		const { openDelete } = this.state
		const { t } = this.props
		return (
			<Dialog
				open={openDelete}
				onClose={this.handleCloseDeleteDialog}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.collection')}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{t('dialogs.delete.message.collection', { collection: this.state.collection.name })}
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleCloseDeleteDialog} color='primary'>
						{t('actions.cancel')}
					</Button>
					<Button onClick={this.handleDeleteCollection} color='primary' autoFocus>
						{t('actions.yes')}
					</Button>
				</DialogActions>
			</Dialog>
		)
	}

	handleDataSize = (i) => {
		let visiblePeriods = 0
		this.props.periods.forEach(p => p.hide === false ? visiblePeriods += 1 : visiblePeriods)
		if (visiblePeriods === 1)
			return 12
		if (i === this.props.periods.length - 1 && visiblePeriods % 2 !== 0 && visiblePeriods > 2)
			return 12
		return 6
	}
	render() {
		const { history, match, t, classes, accessLevel } = this.props
		const { collection, loading, activeDevice, weather, openAssign, openAssignOrg, } = this.state
		return (
			<Fragment>
				{/* <Toolbar
					hashLinks
					noSearch
					history={history}
					match={match}
					tabs={this.tabs}
				// content={this.renderMenu()}
				/> */}
				{!loading ? <Fade in={true}>
					<GridContainer justify={'center'} alignContent={'space-between'}>
						<AssignDevice
							collectionId={collection.id}
							orgId={collection.org.id}
							handleCancel={this.handleCancelAssignDevice}
							handleClose={this.handleCloseAssignDevice}
							open={this.state.openAssignDevice}
							t={t}
						/>
						<AssignProject
							collectionId={[collection]}
							open={openAssign}
							handleClose={this.handleCloseAssignProject}
							handleCancel={this.handleCancelAssignProject}
							t={t}
						/>
						<AssignOrg
							collections
							collectionId={[collection]}
							open={openAssignOrg}
							handleClose={this.handleCloseAssignOrg}
							t={t}
						/>
						{collection.activeDeviceStats ? this.renderConfirmUnassign() : null}
						{this.renderDeleteDialog()}
						{/* {this.renderAssignDevice()} */}
						<ItemGrid xs={12} noMargin id='details'>
							<CollectionDetails
								isFav={this.props.isFav({ id: collection.id, type: 'collection' })}
								addToFav={this.addToFav}
								removeFromFav={this.removeFromFav}
								collection={collection}
								weather={weather}
								history={history}
								match={match}
								handleOpenAssignProject={this.handleOpenAssignProject}
								handleOpenUnassignDevice={this.handleOpenUnassignDevice}
								handleOpenAssignOrg={this.handleOpenAssignOrg}
								handleOpenDeleteDialog={this.handleOpenDeleteDialog}
								handleOpenAssignDevice={this.handleOpenAssignDevice}
								t={t}
								accessLevel={accessLevel}
							/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id={'data'}>
							<ChartDataPanel />
						</ItemGrid>
						{this.props.periods.map((period, i) => {
							if (period.hide) { return null }
							return <ItemGrid xs={12} md={this.handleDataSize(i)} noMargin key={i} id={i}>
								<ChartData
									period={period}
									single
									getData={this.handleSwitchDayHourSummary}
									// device={activeDevice}
									history={history}
									match={match}
									t={t}
								/>
							</ItemGrid>
						})}
						{this.state.activeDevice ? <ItemGrid xs={12} noMargin id='map'>
							<Maps
								single
								reload={this.reload}
								device={activeDevice}
								mapTheme={this.props.mapTheme}
								markers={this.state.activeDevice ? [this.state.activeDevice] : []}
								weather={this.state.weather}
								loading={this.state.loading}
								heatData={this.state.heatData}
								t={t}
							/>
						</ItemGrid> : null}
						<ItemGrid xs={12} noMargin id={'active-device'}>
							<CollectionActiveDevice
								collection={collection}
								history={history}
								device={activeDevice}
								accessLevel={accessLevel}
								classes={classes}
								t={t}
							/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id={'history'}>
							<CollectionHistory
								classes={classes}
								collection={collection}
								history={this.props.history}
								match={this.props.match}
								t={t}
							/>
						</ItemGrid>
					</GridContainer></Fade>
					: this.renderLoader()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	saved: state.favorites.saved,
	mapTheme: state.settings.mapTheme,
	periods: state.dateTime.periods
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(collectionStyles)(Collection))
