import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, AssignOrg, AssignProject, AssignDevice, DateFilterMenu } from 'components';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getCollection, deleteCollection, unassignDeviceFromCollection,  getDataHourly, getDataMinutely, getDataDaily, getDataSummary } from 'variables/dataCollections';
import CollectionActiveDevice from 'views/Collections/CollectionCards/CollectionActiveDevice';
import CollectionData from 'views/Collections/CollectionCards/CollectionData';
import CollectionDetails from 'views/Collections/CollectionCards/CollectionDetails';
import CollectionHistory from 'views/Collections/CollectionCards/CollectionHistory';
import { getProject } from 'variables/dataProjects';
import Search from 'components/Search/Search';
import { getDevice, getWeather } from 'variables/dataDevices';
import ActiveDeviceMap from './CollectionCards/CollectionActiveDeviceMap';
import moment from 'moment'
import teal from '@material-ui/core/colors/teal'
import { setHourlyData, setMinutelyData, setDailyData, setSummaryData } from 'components/Charts/DataModel';
import { DataUsage, Timeline, Map, DeviceHub, History } from 'variables/icons';
import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';

class Collection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			//Date Filter stuff
			dateOption: 3,
			loadingData: true,
			from: moment().subtract(7, 'd').startOf('day'),
			to: moment().endOf('day'),
			timeType: 2,
			raw: false,
			//End Date Filter Tools
			collection: null,
			activeDevice: null,
			weather: '',
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassignDevice: false,
			openAssignOrg: false,
			openAssignDevice: false,
			openDelete: false,
			img: null,
			filter: {
				startDate: '',
				endDate: ''
			},
			//Map
			loadingMap: true,
			heatData: null,
			//End Map
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/collections/list'
		props.setHeader(props.t('collections.fields.collection'), true, prevURL, 'collections')
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
	getCollectionProject = async (rs) => {
		let project = await getProject(rs)
		this.setState({ collection: { ...this.state.collection, project: project }, loadingProject: false })
	}
	getCollection = async (id) => {
		await getCollection(id).then(async rs => {
			if (rs === null)
				this.props.history.push('/404')
			else {
				this.setState({ collection: rs })
		
				if (rs.project.id) {
					this.getCollectionProject(rs.project.id)
				}
				if (rs.activeDeviceStats) { 
					await this.getActiveDevice(rs.activeDeviceStats.id)
					this.getWifiDaily()
					this.getHeatMapData()
				}
				else {
					this.setState({ loading: false, loadingData: false })
				}
			}
		})
	}
	componentDidUpdate = (prevProps, prevState) => {
		
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
			}
		}
		else {
			this.props.history.push('/404')
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
	getHeatMapData = async () => {
		// const { device } = this.props
		const { from, to, raw, collection } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		// let dataArr = []
		let dataSet = null
		let data = await getDataSummary(collection.id, startDate, endDate, raw)
		dataSet = {
			name: collection.name,
			id: collection.id,
			data: data,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}
		this.setState({
			heatData: dataSet,
			loadingMap: false
		})
	}
	//
	/**
	 * This is the callback from the Date Filter
	 * @function
	 * @param id Date Option id (Today, yesterday, 7 days...)
	 * @param to Date end Date
	 * @param from Date 
	 * @param timeType 
	 */
	handleSetDate = (id, to, from, timeType, loading) => {
		this.setState({
			dateOption: id,
			to: to,
			from: from,
			timeType: timeType,
			loadingData: loading !== undefined ? loading : true,
		}, this.handleSwitchDayHourSummary)
	}
	handleRawData = () => {
		this.setState({ loadingData: true, raw: !this.state.raw }, () => this.handleSwitchDayHourSummary())
	}
	handleSwitchDayHourSummary = () => {
		let id = this.state.dateOption
		const { to, from } = this.state
		let diff = moment.duration(to.diff(from)).days()
		switch (id) {
			case 0:// Today
				this.getWifiHourly();
				break;
			case 1:// Yesterday
				this.getWifiHourly();
				break;
			case 2://this week
				parseInt(diff, 10) > 1 ? this.getWifiDaily() : this.getWifiHourly()
				break;
			case 3:
				this.getWifiDaily();
				break;
			case 4:
				this.getWifiDaily();
				break
			case 5:
				this.getWifiDaily();
				break
			case 6:
				this.handleSetCustomRange()
				break
			default:
				this.getWifiDaily();
				break;
		}
	}
	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
	}

	handleSetCustomRange = () => {
		const { timeType } = this.state
		switch (timeType) {
			case 0:
				this.getWifiMinutely()
				break;
			case 1:
				this.getWifiHourly()
				break
			case 2:
				this.getWifiDaily()
				break
			case 3:
				this.getWifiSum()
				break
			default:
				break;
		}
	}
	getWifiHourly = async () => {
		// const { device } = this.props
		const { from, to, raw, collection, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		let dataSet = null
		let data = await getDataHourly(collection.id, startDate, endDate, raw)
		dataSet = {
			name: collection.name,
			id: collection.id,
			data: data,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}
		dataArr.push(dataSet)
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		let newState = setHourlyData(dataArr, from, to, hoverID)
		this.setState({
			...this.state,
			// dataArr: dataArr,
			loadingData: false,
			timeType: 1,
			...newState
		})
	}
	getWifiMinutely = async () => {
		const { from, to, raw, collection, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []

		let dataSet = null
		let data = await getDataMinutely(collection.id, startDate, endDate, raw)
		dataSet = {
			name: collection.name,
			id: collection.id,
			data: data,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}
		dataArr.push(dataSet)

		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		let newState = setMinutelyData(dataArr, from, to, hoverID)
		this.setState({
			...this.state,
			// dataArr: dataArr,
			loadingData: false,
			timeType: 0,
			...newState
		})
	}
	getWifiDaily = async () => {
		const { from, to, raw, collection, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		let dataSet = null
		let data = await getDataDaily(collection.id, startDate, endDate, raw)
		dataSet = {
			name: collection.name,
			id: collection.id,
			data: data,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}
		dataArr.push(dataSet)

		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		let newState = setDailyData(dataArr, from, to, hoverID)
		this.setState({
			...this.state,
			// dataArr: dataArr,
			loadingData: false,
			timeType: 2,
			...newState
		})
	}
	getWifiSum = async () => {
		const { from, to, raw, collection, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		let dataSet = null
		let data = await getDataSummary(collection.id, startDate, endDate, raw)
		dataSet = {
			name: collection.name,
			id: collection.id,
			data: data,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}
		dataArr.push(dataSet)
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		let newState = setSummaryData(dataArr, from, to, hoverID)
		this.setState({
			...this.state,
			// dataArr: dataArr,
			loadingData: false,
			timeType: 3,
			...newState
		})
	}
	snackBarMessages = (msg) => {
		const { s, t } = this.props
		let name = this.state.collection.name ? this.state.collection.name : t('collections.noName')
		let id = this.state.collection.id
		switch (msg) {
			case 1:
				s(t('snackbars.unassign.deviceFromCollection', { collection: `${name} (${id})`, device: this.state.collection.activeDeviceStats.id }))
				break
			case 2:
				s(t('snackbars.assign.collectionToOrg', { collection: `${name} (${id})`, org: this.state.collection.org.name }))
				break
			case 5: 
				s(t('snackbars.assign.collectionToProject', { collection: `${name} (${id})`, project: this.state.collection.project.title }))
				break
			case 6:
				s(t('snackbars.assign.deviceToCollection', { collection: `${name} (${id})`, device: this.state.collection.activeDeviceStats.id }))
				break
			case 4:
				s(t('snackbars.collectionDeleted'))
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
			// this.close()
			if (rs) { 
				this.props.history.push('/collections/list')
				this.snackBarMessages(4)
			}
			else {
				alert('Delete failed') //todo
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
		if (reload) { 
			this.setState({ loading: true, openAssignDevice: false })
			await this.getCollection(this.state.collection.id).then(rs => { 
				this.snackBarMessages(6)
			})
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
			await this.getCollection(this.state.collection.id).then(rs => {
				this.snackBarMessages(2)
			})
		}
		this.setState({ openAssignOrg: false })
	}
	handleOpenAssignProject = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}
	handleCancelAssignProject = () => {
		this.setState({ openAssign: false })
	}
	handleCloseAssignProject = async (reload, success) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null, openAssign: false })
			await this.getCollection(this.state.collection.id).then(() => {
				this.snackBarMessages(5)
			})
		}
		// this.setState({ openAssign: false })
	}


	// filterItems = (projects, keyword) => {
	// 	var searchStr = keyword.toLowerCase()
	// 	var arr = projects
	// 	if (arr[0] === undefined)
	// 		return []
	// 	var keys = Object.keys(arr[0])
	// 	var filtered = arr.filter(c => {
	// 		var contains = keys.map(key => {
	// 			if (c[key] === null)
	// 				return searchStr === 'null' ? true : false
	// 			if (c[key] instanceof Date) {
	// 				let date = dateFormatter(c[key])
	// 				return date.toLowerCase().includes(searchStr)
	// 			}
	// 			else
	// 				return c[key].toString().toLowerCase().includes(searchStr)
	// 		})
	// 		return contains.indexOf(true) !== -1 ? true : false
	// 	})
	// 	return filtered
	// }

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
				<DialogTitle>
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
			<DialogTitle id='alert-dialog-title'>{t('dialogs.unassign.title.deviceFromCollection')}</DialogTitle>
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
				<DialogTitle id='alert-dialog-title'>{t('dialogs.delete.title.collection')}</DialogTitle>
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
	
	renderMenu = () => {
		const { classes, t } = this.props
		const { dateOption, to, from, timeType } = this.state
		return <DateFilterMenu
			timeType={timeType}
			dateOption={dateOption}
			classes={classes}
			to={to}
			from={from}
			t={t}
			handleSetDate={this.handleSetDate}
			handleCustomDate={this.handleCustomDate}
		/>
	}
	render() {
		const { history, t, classes, accessLevel } = this.props
		const { collection, loading, loadingData, activeDevice, weather } = this.state
		return (
			<Fragment>
				<Toolbar
					noSearch
					history={this.props.history}
					match={this.props.match}
					tabs={this.tabs}
					content={this.renderMenu()}
				/>
				{!loading ?
					<GridContainer justify={'center'} alignContent={'space-between'}>
						<AssignDevice
							collectionId={this.state.collection.id}
							orgId={this.state.collection.org.id}
							handleCancel={this.handleCancelAssignDevice}
							handleClose={this.handleCloseAssignDevice}
							open={this.state.openAssignDevice}
							t={t}
						/>
						<AssignProject
							collectionId={[this.state.collection]}
							open={this.state.openAssign}
							handleClose={this.handleCloseAssignProject}
							handleCancel={this.handleCancelAssignProject}
							t={t}
						/>
						<AssignOrg
							collections
							collectionId={[this.state.collection]}
							open={this.state.openAssignOrg}
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
								history={this.props.history}
								match={this.props.match}
								handleOpenAssignProject={this.handleOpenAssignProject}
								handleOpenUnassignDevice={this.handleOpenUnassignDevice}
								handleOpenAssignOrg={this.handleOpenAssignOrg}
								handleOpenDeleteDialog={this.handleOpenDeleteDialog}
								handleOpenAssignDevice={this.handleOpenAssignDevice}
								t={t}
								accessLevel={this.props.accessLevel}
							/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id='data'>
							<CollectionData
								barDataSets={this.state.barDataSets}
								roundDataSets={this.state.roundDataSets}
								lineDataSets={this.state.lineDataSets}
								handleSetDate={this.handleSetDate}
								loading={loadingData}
								timeType={this.state.timeType}
								from={this.state.from}
								to={this.state.to}
								device={activeDevice}
								dateOption={this.state.dateOption}
								raw={this.state.raw}
								handleRawData={this.handleRawData}
								history={this.props.history}
								match={this.props.match}
								t={this.props.t}
							/>
						</ItemGrid>
						{this.state.activeDevice ? <ItemGrid xs={12} noMargin id='map'>
							<ActiveDeviceMap
								device={this.state.heatData}
								weather={this.state.weather}
								t={t}
							/>
						</ItemGrid> : null}
						<ItemGrid xs={12} noMargin id={'active-device'}>
							<CollectionActiveDevice
								collection={collection}
								history={history}
								device={collection.activeDeviceStats ? collection.activeDeviceStats : null}
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
					</GridContainer>
					: this.renderLoader()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	saved: state.favorites.saved
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(collectionStyles)(Collection))
