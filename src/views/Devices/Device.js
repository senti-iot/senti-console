import React, { Component, Fragment } from 'react'
import { getDevice, getAllPictures, getWeather, getDataSummary } from 'variables/dataDevices'
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
import { connect } from 'react-redux';
import { unassignDeviceFromCollection, getCollection } from 'variables/dataCollections';
import DeviceMap from './DeviceCards/DeviceMap';
import moment from 'moment'
import Toolbar from 'components/Toolbar/Toolbar';
import { Timeline, DeviceHub, Map, DeveloperBoard, Image } from 'variables/icons';
import teal from '@material-ui/core/colors/teal'
import { getWifiHourly, getWifiDaily, getWifiMinutely } from 'components/Charts/DataModel';
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites';

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingData: true,
			raw: props.rawData ? props.rawData : false,
			openAssignCollection: false,
			openUnassign: false,
			openAssignOrg: false,
			loadingMap: true,
			heatData: null,
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
				this.props.history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				})
			else {
				this.setState({ device: rs, loading: false }, async () => {
					if (rs.dataCollection) {
						await this.getDataCollection(rs.dataCollection)
					}
					this.getWifiDaily()
					this.getHeatMapData()
					if (rs.lat && rs.long) {
						let data = await getWeather(rs, moment(), this.props.language)
						this.setState({ weather: data })
					}

				})
		
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
					loading: false
				})
			}
			else {
				this.setState({
					loading: false,
					device: {
						...this.state.device,
						dataCollection: { id: 0 },
						project: { id: 0 },
					}
				})
			}
		})
	}
	componentDidMount = async () => {
		let prevURL = this.props.location.prevURL ? this.props.location.prevURL : '/devices/list'
		this.props.setHeader('devices.device', true, prevURL ? prevURL : '/devices/list', 'devices')
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				await this.getDevice(id)
			}
		}
		else {
			this.props.history.push({
				pathname: '/404',
				prevURL: window.location.pathname
			})
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.id !== prevProps.id || this.props.to !== prevProps.to || this.props.timeType !== prevProps.timeType || this.props.from !== prevProps.from)
			this.handleSwitchDayHourSummary()
		if (this.props.saved === true) {
			if (this.props.isFav({ id: this.state.device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.saved', { name: this.state.device.name, type: this.props.t('favorites.types.device') })
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
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { device } = this.state
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}
	getHeatMapData = async () => {
		const {  device } = this.state
		const { from, to } = this.props
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
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

	handleSwitchDayHourSummary = () => {
		const { to, from, id } = this.props
		let diff = moment.duration(to.diff(from)).days()
		this.getHeatMapData()
		switch (id) {
			case 0:// Today
			case 1:// Yesterday
				this.getWifiHourly();
				break;
			case 2:// This week
				parseInt(diff, 10) > 0 ? this.getWifiDaily() : this.getWifiHourly()
				break;
			case 3:// Last 7 days
			case 4:// 30 days
			case 5:// 90 Days
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

	handleSetCustomRange = () => {
		const { timeType } = this.props
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
		const { raw, device, hoverID } = this.state
		const { from, to } = this.props
		let newState = await getWifiHourly('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], from, to, hoverID, raw)

		this.setState({
			...this.state,
			loadingData: false,
			...newState
		})
	}
	getWifiMinutely = async () => {
		const { raw, device, hoverID } = this.state
		const { from, to } = this.props
		let newState = await getWifiMinutely('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], from, to, hoverID, raw)

		this.setState({
			...this.state,
			loadingData: false,
			...newState
		})
	}
	getWifiDaily = async () => {
		const { raw, device, hoverID } = this.state
		const { from, to } = this.props

		let newState = await getWifiDaily('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], from, to, hoverID, raw)

		this.setState({
			...this.state,
			loadingData: false,
			...newState
		})
	}
	getWifiSum = async () => {
		const { raw, device, hoverID } = this.state
		const { from, to } = this.props

		let newState = await getWifiDaily('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], from, to, hoverID, raw)

		this.setState({
			...this.state,
			loadingData: false,
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
			case 5: 
				s('snackbars.deviceUpdated', { device: `${name}(${id})` })
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

	reload = async (msgId) => { 
		this.snackBarMessages(msgId)
		this.setState({
			loading: true
		})
		await this.getDevice(this.state.device.id)
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
		const { t } = this.props
		return <DateFilterMenu t={t} />
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
							exportData={this.state.exportData}
							barDataSets={this.state.barDataSets}
							roundDataSets={this.state.roundDataSets}
							lineDataSets={this.state.lineDataSets}
							handleSetDate={this.handleSetDate}
							loading={loadingData}
							timeType={this.props.timeType}
							from={this.props.from}
							to={this.props.to}
							device={device}
							dateOption={this.props.id}
							raw={this.state.raw}
							handleRawData={this.handleRawData}
							history={this.props.history}
							match={this.props.match}
							t={this.props.t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'map'}>
						<DeviceMap
							reload={this.reload}
							device={this.state.heatData}
							loading={this.state.loadingMap}
							weather={this.state.weather}
							heatData={this.state.heatData}
							classes={this.props.classes}
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
	saved: state.favorites.saved,
	rawData: state.settings.rawData,
	id: state.dateTime.id,
	to: state.dateTime.to,
	from: state.dateTime.from,
	timeType: state.dateTime.timeType
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles)(Device))
