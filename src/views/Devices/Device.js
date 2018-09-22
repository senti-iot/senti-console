import React, { Component } from 'react'
import { getDevice, getAllPictures, updateDevice } from 'variables/dataDevices'
import {  Grid, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar } from '@material-ui/core'
import moment from 'moment'
import { ItemGrid } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import {  Map } from '@material-ui/icons'
import deviceStyles from 'assets/jss/views/deviceStyles'
import AssignProject from 'components/Devices/AssignProject'
import ImageUpload from './ImageUpload'
import CircularLoader from 'components/Loader/CircularLoader'
import { Maps } from 'components/Map/Maps'
import GridContainer from 'components/Grid/GridContainer'
import DeviceDetails from './DeviceCards/DeviceDetails'
import DeviceHardware from './DeviceCards/DeviceHardware'
import DeviceImages from './DeviceCards/DeviceImages'
import DeviceData from './DeviceCards/DeviceData'

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassign: false,
			openSnackbar: 0,
			img: null
		}
		props.setHeader('')
	}

	getDevice = async (id) => {
		await getDevice(id).then(rs => {
			if (rs === null)
				this.props.history.push('/404')
			else {
				this.setState({ device: rs, loading: false })
				this.props.setHeader(rs.name ? rs.name : rs.id, true, `/devices/list`) 
					
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

	snackBarMessages = () => {
		const { t } = this.props
		let msg = this.state.openSnackbar
		let name = this.state.device.name ? this.state.device.name : t("devices.noName")
		let id = this.state.device.id
		switch (msg) {
			case 1:
				return t("snackbars.unassign", { device: name + "(" + id + ")" })
			case 2:
				return t("snackbars.assign", { device: name + "(" + id + ")" } )
			default:
				break
		}
	}

	getAllPics = (id) => {
		getAllPictures(id).then(rs => this.setState({ img: rs }))
	}

	handleOpenAssign = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}

	handleCloseAssign = async (reload) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null, openSnackbar: 2 })
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
					let date = moment(c[key]).format("DD.MM.YYYY")
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
				this.setState({ loading: true, anchorEl: null, openSnackbar: 1 })
				await this.getDevice(this.state.device.id)} 
			else {
				console.log('Failed to unassign') // Snackbar
				// this.setState({ errorUnassign: true })
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
					{/* Are you sure you want to unassign {device.id + " " + device.name} from project {device.project.title} ? */}
					{t("dialogs.unassign", { deviceID: device.id, deviceName: device.name, project: device.project.title } )}
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
					<AssignProject
						deviceId={[this.state.device]}
						open={this.state.openAssign}
						handleClose={this.handleCloseAssign}
						t={this.props.t}
					/>
					{device.project ? this.renderConfirmUnassign() : null}
					<ItemGrid xs={12} noMargin>
						<DeviceDetails
							device={device}
							history={this.props.history}
							match={this.props.match}
							handleOpenAssign={this.handleOpenAssign}
							handleOpenUnassign={this.handleOpenUnassign}
							t={this.props.t}
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
					<Snackbar
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						open={this.state.openSnackbar !== 0 ? true : false}
						onClose={() => { this.setState({ openSnackbar: 0 }) }}
						autoHideDuration={5000}
						message={
							<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
								{this.snackBarMessages()}
							</ItemGrid>
						}
					/>
				</GridContainer>
				: this.renderLoader()
		)
	}
}

export default withStyles(deviceStyles)(Device)
