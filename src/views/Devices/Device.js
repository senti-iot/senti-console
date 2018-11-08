import React, { Component } from 'react'
import { getDevice, getAllPictures, getWeather, /* getWeather */ } from 'variables/dataDevices'
import { withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { ItemGrid, AssignOrg, AssignDC } from 'components'
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

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true,
			anchorElHardware: null,
			openAssignCollection: false,
			openUnassign: false,
			openAssignOrg: false,
			img: null
		}
		props.setHeader('', true, `/devices/list`, "devices")
	}

	getDevice = async (id) => {
		await getDevice(id).then(async rs => {
			if (rs === null)
				this.props.history.push('/404')
			else {
				this.setState({ device: rs, loading: false })
				if (rs.dataCollection) {
					await this.getDataCollection(rs.dataCollection)
				}
				if (rs.lat && rs.long) { 
					let data = await getWeather(rs, moment(), this.props.language)
					this.setState({ weather: data })
				}
				let prevURL = this.props.location.prevURL ? this.props.location.prevURL : '/devices/list'
				this.props.setHeader(rs.name ? rs.name : rs.id, true, prevURL ? prevURL : '/devices/list', "devices")
			}
		})
	}

	getDataCollection = async (id) => {
		await getCollection(id).then(rs => {
			if (rs) {

				this.setState({
					device: {
						...this.state.device,
						project: {
							id: 0
						},
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
						dataCollection: {
							id: 0
						},
						project: {
							id: 0
						},
					}
				})
			}
		})
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				// this.getAllPics(id)
				await this.getDevice(id)
				// console.log(this.state.device);

			}
		}
		else {
			this.props.history.push('/404')
		}
	}

	snackBarMessages = (msg) => {
		const { s, t } = this.props
		const { device, oldCollection } = this.state
		let name = this.state.device.name ? this.state.device.name : t("devices.noName")
		let id = this.state.device.id
		switch (msg) {
			case 1:
				s("snackbars.unassign.deviceFromCollection", { device: `${name}(${id})`, collection: `${oldCollection.name}(${oldCollection.id})` })
				break
			case 2:
				s("snackbars.assign.deviceToCollection", { device: `${name}(${id})`, collection: `${device.dataCollection.name}(${device.dataCollection.id})` })
				break
			case 3:
				s("snackbars.failedUnassign")
				break
			case 4:
				s("snackbars.assign.deviceToOrg", { device: `${name}(${id})`, org: `${device.org.name}` })
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
			this.setState({ loading: true })
			await this.getDevice(this.state.device.id).then(
				() => this.snackBarMessages(4)
			)
		}
		this.setState({ openAssignOrg: false })
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
					return searchStr === "null" ? true : false
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
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("dialogs.unassign.title.deviceFromCollection", { what: t("collections.fields.id") })}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("dialogs.unassign.message.deviceFromCollection", { device: `${device.name} (${device.id})`, collection: device.dataCollection.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassign} color="primary">
					{t("actions.no")}
				</Button>
				<Button onClick={this.handleUnassign} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}

	render() {
		const { device, loading } = this.state
		return (
			!loading ?
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
					<ItemGrid xs={12} noMargin>
						<DeviceDetails
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
					<ItemGrid xs={12} noMargin>
						<DeviceData
							device={device}
							history={this.props.history}
							match={this.props.match}
							t={this.props.t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						{/* <DeviceDataCollection
							dcId={device.dataCollection}
							history={this.props.history}
							match={this.props.match}
							t={this.props.t}
						/> */}
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<DeviceMap
							device={device}
							weather={this.state.weather}
							t={this.props.t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<DeviceImages
							s={this.props.s}
							t={this.props.t}
							device={device} />
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<DeviceHardware
							device={device}
							history={this.props.history}
							match={this.props.match}
							t={this.props.t}
						/>
					</ItemGrid>
				</GridContainer>
				: this.renderLoader()
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	language: state.settings.language
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles)(Device))
