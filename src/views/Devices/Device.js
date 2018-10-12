import React, { Component } from 'react'
import { getDevice, getAllPictures, updateDevice } from 'variables/dataDevices'
import {  Grid, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { ItemGrid } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import {  Map } from 'variables/icons'
import deviceStyles from 'assets/jss/views/deviceStyles'
// import AssignProject from 'components/Devices/AssignProject'
import AssignOrg from 'components/Devices/AssignOrg'
import ImageUpload from './ImageUpload'
import CircularLoader from 'components/Loader/CircularLoader'
import { Maps } from 'components/Map/Maps'
import GridContainer from 'components/Grid/GridContainer'
import DeviceDetails from './DeviceCards/DeviceDetails'
import DeviceHardware from './DeviceCards/DeviceHardware'
import DeviceImages from './DeviceCards/DeviceImages'
import DeviceData from './DeviceCards/DeviceData'
import { dateFormatter } from 'variables/functions';
import { connect } from 'react-redux';

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassign: false,
			openAssignOrg: false,
			img: null
		}
		props.setHeader('', true, `/devices/list`, "devices")
	}

	getDevice = async (id) => {
		await getDevice(id).then(rs => {
			if (rs === null)
				this.props.history.push('/404')
			else {
				this.setState({ device: rs, loading: false })
				let prevURL = this.props.history.location.state ? this.props.history.location.state['prevURL'] : null
				this.props.setHeader(rs.name ? rs.name : rs.id, true, prevURL ? prevURL : '/devices/list', "devices") 
					
			}
		})

	}

	componentDidMount = async () => {
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

	snackBarMessages = (msg) => {
		const { s, t } = this.props
		let name = this.state.device.name ? this.state.device.name : t("devices.noName")
		let id = this.state.device.id
		switch (msg) {
			case 1:
				s("snackbars.unassign", { device: name + "(" + id + ")" })
				break
			case 2:
				s("snackbars.assign", { device: name + "(" + id + ")" })
				break
			case 3: 
				s("snackbars.failedUnassign")
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
			this.setState({ loading: true, anchorEl: null })
			this.snackBarMessages(2)
			await this.getDevice(this.state.device.id)
		}
		this.setState({ openAssignOrg: false })
	}
	handleOpenAssign = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}

	handleCloseAssign = async (reload) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null })
			this.snackBarMessages(2)
			await this.getDevice(this.state.device.id)
		}
		this.setState({ openAssign: false })
	}

	renderImageUpload = (dId) => {
		const getPics = () => { 
			this.getAllPics(this.state.device.id)
		}
		return <ImageUpload dId={dId} imgUpload={this.getAllPics} callBack={getPics}/>
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
		await updateDevice({ ...this.state.device, project: { id: 0 } }).then(async rs => {
			if (rs)	
			{	this.handleCloseUnassign()
				this.setState({ loading: true, anchorEl: null })
				this.snackBarMessages(1)
				await this.getDevice(this.state.device.id)} 
			else {
				this.setState({ loading: false, anchorEl: null })
				this.snackBarMessages(3)
			}
		})
	}

	renderImageLoader = () => {
		return <CircularLoader notCentered/>
	}

	renderLoader = () => {
		return <CircularLoader />
	}

	renderConfirmUnassign = () => {
		const { t } = this.props
		const { device }  = this.state
		return <Dialog
			open={this.state.openUnassign}
			onClose={this.handleCloseUnassign}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("dialogs.unassignTitle", { what: "Project" })}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("dialogs.unassign", { id: device.id, name: device.name, what: device.project.title } )}
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
					{/* <AssignProject
						deviceId={[this.state.device]}
						open={this.state.openAssign}
						handleClose={this.handleCloseAssign}
						t={this.props.t}
					/> */}
					<AssignOrg
						devices
						deviceId={[this.state.device]}
						open={this.state.openAssignOrg}
						handleClose={this.handleCloseAssignOrg}
						t={this.props.t}
					/>
					{device.project ? this.renderConfirmUnassign() : null}
					<ItemGrid xs={12} noMargin>
						<DeviceDetails
							device={device}
							history={this.props.history}
							match={this.props.match}
							// handleOpenAssign={this.handleOpenAssign}
							// handleOpenUnassign={this.handleOpenUnassign}
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
						<InfoCard
							title={this.props.t("devices.cards.map")}
							subheader={this.props.t("devices.fields.coordsW", { lat: device.lat, long: device.long })}
							avatar={<Map />}
							noExpand
							content={
								<Grid container justify={'center'}>
									<Maps t={this.props.t} isMarkerShown markers={[device]} zoom={18} />
								</Grid>
							} />

					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<DeviceImages
							s={this.props.s}
							t={this.props.t}
							device={device}/>
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
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles)(Device))
