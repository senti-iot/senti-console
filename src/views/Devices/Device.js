import React, { Component, Fragment } from 'react'
import { getDevice, getAllPictures, getWeather, getDataHourly, getDataMinutely, getDataDaily, getDataSummary, /* getWeather */ } from 'variables/dataDevices'
import { withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { ItemGrid, AssignOrg, AssignDC, DateFilterMenu } from 'components'
import deviceStyles from 'assets/jss/views/deviceStyles'
import ImageUpload from './ImageUpload'
import CircularLoader from 'components/Loader/CircularLoader'
import GridContainer from 'components/Grid/GridContainer'
import DeviceDetails from './DeviceCards/DeviceDetails'
import DeviceHardware from './DeviceCards/DeviceHardware'
import DeviceImages from './DeviceCards/DeviceImages'
import DeviceData from './DeviceCards/DeviceData'
import { dateFormatter } from 'variables/functions';
import { connect } from 'react-redux';
import { unassignDeviceFromCollection, getCollection } from 'variables/dataCollections';
import DeviceMap from './DeviceCards/DeviceMap';
import moment from 'moment'
import Toolbar from 'components/Toolbar/Toolbar';
import { Timeline, DeviceHub, Map, DeveloperBoard, Image } from 'variables/icons';
import teal from '@material-ui/core/colors/teal'
import { setHourlyData, setMinutelyData, setDailyData, setSummaryData } from 'components/Charts/DataModel';
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites';

class Device extends Component {
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
			//Assign/Unassign
			openAssignCollection: false,
			openUnassign: false,
			openAssignOrg: false,
			//End Assign/Unassign
			//Map
			loadingMap: true,
			heatData: null,
			//End Map
			device: null,
			loading: true,
			anchorElHardware: null,
			img: null,
		}
	}
	format = 'YYYY-MM-DD+HH:mm'
	tabs = [
		{ id: 0, title: '', label: <DeviceHub />, url: `#details` },
		{ id: 1, title: '', label: <Timeline />, url: `#data` },
		{ id: 2, title: '', label: <Map />, url: `#map` },
		{ id: 3, title: '', label: <Image />, url: `#images` },
		{ id: 4, title: '', label: <DeveloperBoard />, url: `#hardware` }
	]
	getDevice = async (id) => {
		await getDevice(id).then(async rs => {
			if (rs === null)
				this.props.history.push('/404')
			else {
				this.setState({ device: rs, loading: false }, () => {
					this.getWifiDaily()
					this.getHeatMapData()
				})
				if (rs.dataCollection) {
					await this.getDataCollection(rs.dataCollection)
				}
				if (rs.lat && rs.long) { 
					let data = await getWeather(rs, moment(), this.props.language)
					this.setState({ weather: data })
				}

			}
		})
	}

	getDataCollection = async (id) => {
		await getCollection(id).then(rs => {
			if (rs) {
				this.setState({
					device: {
						...this.state.device,
						project: { id: 0 },
						dataCollection: rs
					},
					loading: false })}
			else {
				this.setState({
					loading: false,
					device: {
						...this.state.device,
						dataCollection: { id: 0 },
						project: { id: 0 },
					} })}
		})
	}
	componentDidMount = async () => {
		let prevURL = this.props.location.prevURL ? this.props.location.prevURL : '/devices/list'
		this.props.setHeader('devices.device', true, prevURL ? prevURL : '/devices/list', 'devices')
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				// this.getAllPics(id)
				await this.getDevice(id)
			
			}
		}
		else {
			this.props.history.push('/404')
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.saved === true) {
			if (this.props.isFav({ id: this.state.device.id, type: 'device' }))
			{	this.props.s('snackbars.favorite.saved', { name: this.state.device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: this.state.device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.removed', { name: this.state.device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
			}
		}
	}
	addToFav = () => {
		const { device } = this.state
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: this.props.match.url }
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { device } = this.state
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: this.props.match.url }
		this.props.removeFromFav(favObj)
	}
	getHeatMapData = async () => {
		// const { device } = this.props
		const { from, to, device } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		// let dataArr = []
		let dataSet = null
		let data = await getDataSummary(device.id, startDate, endDate, true)
		dataSet = {
			...device,
			data: data,
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
		const { from, to, raw, device, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		let dataSet = null
		let data = await getDataHourly(device.id, startDate, endDate, raw)
		dataSet = {
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			data: data,
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
		const { from, to, raw, device, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []

		let dataSet = null
		let data = await getDataMinutely(device.id, startDate, endDate, raw)
		dataSet = {
			name: device.name,
			id: device.id,
			data: data,
			lat: device.lat,
			long: device.long,
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
		const { from, to, raw, device, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		let dataSet = null
		let data = await getDataDaily(device.id, startDate, endDate, raw)
		dataSet = {
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			data: data,
			color: teal[500]
		}
		dataArr.push(dataSet)

		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		let newState = { ...setDailyData(dataArr, from, to, hoverID), /* ...setPieData(dataArr, from, to, this.state.timeType) */ }
		window.newState = newState
		this.setState({
			...this.state,
			// dataArr: dataArr,
			loadingData: false,
			timeType: 2,
			...newState
		}, () => window.state = this.state)
	}
	getWifiSum = async () => {
		const { from, to, raw, device, hoverID } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		let dataSet = null
		let data = await getDataSummary(device.id, startDate, endDate, raw)
		dataSet = {
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			data: data,
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
		const { device, oldCollection } = this.state
		let name = this.state.device.name ? this.state.device.name : t('devices.noName')
		let id = this.state.device.id
		switch (msg) {
			case 1:
				s('snackbars.unassign.deviceFromCollection', { device: `${name}(${id})`, collection: `${oldCollection.name}(${oldCollection.id})` })
				break
			case 2:
				s('snackbars.assign.deviceToCollection', { device: `${name}(${id})`, collection: `${device.dataCollection.name}(${device.dataCollection.id})` })
				break
			case 3:
				s('snackbars.failedUnassign')
				break
			case 4:
				s('snackbars.assign.deviceToOrg', { device: `${name}(${id})`, org: `${device.org.name}` })
				break
			default:
				break
		}
	}

	getAllPics = (id) => {
		getAllPictures(id).then(rs => this.setState({ img: rs }))
	}

	handleOpenAssignOrg = () => {
		this.setState({ openAssignOrg: true, anchorEl: null })
	}

	handleCloseAssignOrg = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignOrg: false })
			await this.getDevice(this.state.device.id).then(
				() => this.snackBarMessages(4)
			)
		}
	}
	handleOpenAssign = () => {
		this.setState({ openAssignCollection: true, anchorEl: null })
	}

	handleCloseAssign = async (reload) => {
		this.setState({ openAssignCollection: false }, () => setTimeout(async () => {
			if (reload) {
				this.setState({ loading: true })
				await this.getDevice(this.state.device.id).then(() => this.snackBarMessages(2))
			}
		}, 300))
	}

	renderImageUpload = (dId) => {
		const getPics = () => {
			this.getAllPics(this.state.device.id)
		}
		return <ImageUpload dId={dId} imgUpload={this.getAllPics} callBack={getPics} />
	}

	filterItems = (projects, keyword) => {

		var searchStr = keyword.toLowerCase()
		var arr = projects
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				if (c[key] === null)
					return searchStr === 'null' ? true : false
				if (c[key] instanceof Date) {
					let date = dateFormatter(c[key])
					return date.toLowerCase().includes(searchStr)
				}
				else
					return c[key].toString().toLowerCase().includes(searchStr)
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filtered
	}

	handleOpenUnassign = () => {
		this.setState({
			openUnassign: true
		})
	}

	handleCloseUnassign = () => {
		this.setState({
			openUnassign: false
		})
	}

	handleUnassign = async () => {
		const { device } = this.state
		let collection = this.state.device.dataCollection
		this.setState({
			oldCollection: {
				name: collection.name,
				id: collection.id
			}
		})
		let rs = await unassignDeviceFromCollection({
			id: device.dataCollection.id,
			deviceId: device.id
		})
		if (rs) {
			this.handleCloseUnassign()
			this.setState({ loading: true, anchorEl: null })

			await this.getDevice(this.state.device.id).then(() => this.snackBarMessages(1))
		}
		else {
			this.setState({ loading: false, anchorEl: null })
			this.snackBarMessages(3)
		}
	}

	handleRawData = () => {
		this.setState({ loadingData: true, raw: !this.state.raw }, () => this.handleSwitchDayHourSummary())
	}

	renderImageLoader = () => {
		return <CircularLoader notCentered />
	}

	renderLoader = () => {
		return <CircularLoader />
	}

	renderConfirmUnassign = () => {
		const { t } = this.props
		const { device } = this.state
		return <Dialog
			open={this.state.openUnassign}
			onClose={this.handleCloseUnassign}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.unassign.title.deviceFromCollection', { what: t('collections.fields.id') })}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.unassign.message.deviceFromCollection', { device: `${device.name} (${device.id})`, collection: device.dataCollection.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassign} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleUnassign} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
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
		const { device, loading, loadingData } = this.state
		
		return (
			!loading ? <Fragment>
				<Toolbar
					noSearch
					history={this.props.history}
					match={this.props.match}
					tabs={this.tabs}
					content={this.renderMenu()}
				/>
			
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<AssignDC
						deviceId={device.id}
						open={this.state.openAssignCollection}
						handleClose={this.handleCloseAssign}
						handleCancel={this.handleCancelAssign}
						t={this.props.t}
					/>
					<AssignOrg
						devices
						deviceId={[this.state.device]}
						open={this.state.openAssignOrg}
						handleClose={this.handleCloseAssignOrg}
						t={this.props.t}
					/>
					{device.dataCollection ? this.renderConfirmUnassign() : null}
					<ItemGrid xs={12} noMargin id={'details'}>
						<DeviceDetails
							isFav={this.props.isFav({ id: device.id, type: 'device' })}
							addToFav={this.addToFav}
							removeFromFav={this.removeFromFav}
							weather={this.state.weather}
							device={device}
							history={this.props.history}
							match={this.props.match}
							handleOpenAssign={this.handleOpenAssign}
							handleOpenUnassign={this.handleOpenUnassign}
							handleOpenAssignOrg={this.handleOpenAssignOrg}
							t={this.props.t}
							accessLevel={this.props.accessLevel}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'data'}>
						<DeviceData
							barDataSets={this.state.barDataSets}
							roundDataSets={this.state.roundDataSets}
							lineDataSets={this.state.lineDataSets}
							handleSetDate={this.handleSetDate}
							loading={loadingData}
							timeType={this.state.timeType}
							from={this.state.from}
							to={this.state.to}
							device={device}
							dateOption={this.state.dateOption}
							raw={this.state.raw}
							handleRawData={this.handleRawData}
							history={this.props.history}
							match={this.props.match}
							t={this.props.t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'map'}>
						<DeviceMap
							classes={this.props.classes}
							heatData={this.state.heatData}
							loading={this.state.loadingMap}
							device={this.state.heatData}
							weather={this.state.weather}
							t={this.props.t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'images'}>
						<DeviceImages
							s={this.props.s}
							t={this.props.t}
							device={device} />
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'hardware'}>
						<DeviceHardware
							device={device}
							history={this.props.history}
							match={this.props.match}
							t={this.props.t}
						/>
					</ItemGrid>
				</GridContainer>
					
			</Fragment> : this.renderLoader()
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles)(Device))
