import React, { Component, Fragment } from 'react'
import { getDevice, getAllPictures, getWeather } from 'variables/dataDevices'
import { withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { ItemGrid, AssignOrg, AssignDC, /* DateFilterMenu */ } from 'components'
import deviceStyles from 'assets/jss/views/deviceStyles'
import ImageUpload from './ImageUpload'
import CircularLoader from 'components/Loader/CircularLoader'
import GridContainer from 'components/Grid/GridContainer'
import DeviceDetails from './DeviceCards/DeviceDetails'
import DeviceHardware from './DeviceCards/DeviceHardware'
import DeviceImages from './DeviceCards/DeviceImages'
import { connect } from 'react-redux';
import { unassignDeviceFromCollection, getCollection } from 'variables/dataCollections';
import moment from 'moment'
import Toolbar from 'components/Toolbar/Toolbar';
import { Timeline, DeviceHub, Map, DeveloperBoard, Image } from 'variables/icons';
import teal from '@material-ui/core/colors/teal'
import { getWifiHourly, getWifiDaily, getWifiMinutely, getWifiSummary } from 'components/Charts/DataModel';
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites';
import { handleRequestSort } from 'variables/functions';
import ChartDataPanel from 'views/Charts/ChartDataPanel';
import ChartData from 'views/Charts/ChartData';
import Maps from 'views/Maps/MapCard';

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingData: true,
			openAssignCollection: false,
			openUnassign: false,
			openAssignOrg: false,
			heatData: null,
			device: null,
			loading: true,
			anchorElHardware: null,
			img: null,
			//Data Table
			selected: [],
			order: 'desc',
			orderBy: 'id'
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
					// await this.getHeatMapData()
					if (rs.lat && rs.long) {
						let data = await getWeather(rs, moment(), this.props.language)
						this.setState({ weather: data })
					}

				})

			}
		})
	}
	//#region Data Table func
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.devices)
		this.setState({ devices: newData, order, orderBy: property })
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

	//#endregion
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
		if (prevProps.periods.length < this.props.periods.length) {
			let el = document.getElementById(this.props.periods.length - 1)
			setTimeout(() => {
				let topOfElement = el.offsetTop - 130
				window.scroll({ top: topOfElement, behavior: 'smooth' })
			}, 300);
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

	handleSwitchDayHourSummary = async (p) => {
		// const { to, from, id } = this.props
		let diff = moment.duration(p.to.diff(p.from)).days()
		// this.getHeatMapData()
		switch (p.menuId) {
			case 0:// Today
			case 1:// Yesterday
				return await this.getWifiHourly(p);
			case 2:// This week
				return await parseInt(diff, 10) > 0 ? this.getWifiDaily(p) : this.getWifiHourly(p)
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
		const { device, hoverID } = this.state
		let newState = await getWifiSummary('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)
		return newState
	}
	getWifiHourly = async (p) => {
		const { device, hoverID } = this.state
		this.setState({ loadingData: true })
		let newState = await getWifiHourly('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)
		return newState
	}
	getWifiMinutely = async (p) => {
		const { device, hoverID } = this.state
		let newState = await getWifiMinutely('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)
		return newState
	}
	getWifiDaily = async (p) => {
		const { device, hoverID } = this.state

		let newState = await getWifiDaily('device', [{
			name: device.name,
			id: device.id,
			lat: device.lat,
			long: device.long,
			org: device.org ? device.org.name : "",
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)
		return newState

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
				s('snackbars.assign.deviceToCollection', { device: `${name}(${id})`, collection: '' /* `${device.dataCollection.name}(${device.dataCollection.id})` */ })
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
		else {
			this.setState({ openAssignOrg: false })
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
		const { device, loading, /* selected, order, orderBy */ } = this.state
		return (
			!loading ? <Fragment>
				<Toolbar
					hashLinks
					noSearch
					history={this.props.history}
					match={this.props.match}
					tabs={this.tabs}
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
						<ChartDataPanel t={this.props.t} />
					</ItemGrid>
					{this.props.periods.map((period, i) => {
						if (period.hide) { return null }
						return <ItemGrid xs={12} md={this.handleDataSize(i)} noMargin key={i} id={i}>
							<ChartData
								single
								getData={this.handleSwitchDayHourSummary}
								period={period}
								device={device}
								history={this.props.history}
								match={this.props.match}
								t={this.props.t}
							/>
						</ItemGrid>
					})}

					<ItemGrid xs={12} noMargin id={'map'}>
						<Maps
							reload={this.reload}
							device={this.state.device}
							markers={this.state.device ? [this.state.device] : []}
							loading={this.state.loading}
							weather={this.state.weather}
							heatData={this.state.heatData}
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
	periods: state.dateTime.periods
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles)(Device))
