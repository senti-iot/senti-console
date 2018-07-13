import React, { Component } from 'react'
import { getDevice, getAllPictures, assignProjectToDevice } from 'variables/dataDevices';
import {  Grid, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import moment from 'moment'
import { ItemGrid } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import {  Map } from '@material-ui/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import AssignProject from 'components/Devices/AssignProject';
import ImageUpload from './ImageUpload';
import CircularLoader from 'components/Loader/CircularLoader';
import { Maps } from 'components/Map/Maps';
import GridContainer from 'components/Grid/GridContainer';
import DeviceDetails from './DeviceCards/DeviceDetails';
import DeviceHardware from './DeviceCards/DeviceHardware';
import DeviceImages from './DeviceCards/DeviceImages';

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassign: false,
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
				this.props.setHeader(rs.device_name ? rs.device_name : rs.device_id, true)
					
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
	getAllPics = (id) => {
		getAllPictures(id).then(rs => this.setState({ img: rs }))
	}
	handleOpenAssign = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}
	handleCloseAssign = async (reload) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null })
			await this.getDevice(this.state.device.device_id)
		}
		this.setState({ openAssign: false })
	}

	renderImageUpload = (dId) => {
		const getPics = () => { 
			this.getAllPics(this.state.device.device_id)
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
		await assignProjectToDevice({ project_id: null, id: this.state.device.device_id }).then(async rs => {
			if (rs)	
			{	this.handleCloseUnassign()
				this.setState({ loading: true, anchorEl: null })
				await this.getDevice(this.state.device.device_id)} 
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
		const { device }  = this.state
		return <Dialog
			open={this.state.openUnassign}
			onClose={this.handleCloseUnassign}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{"Unassign Project? "}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
						Are you sure you want to unassign {device.device_id + " " + device.device_name} from project {device.project.title} ?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassign} color="primary">
						No
				</Button>
				<Button onClick={this.handleUnassign} color="primary" autoFocus>
						Yes
				</Button>
			</DialogActions>
		</Dialog>
	}


	render() {
		const { device, loading } = this.state
		return (
			!loading ?
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<AssignProject device_id={this.state.device.device_id} open={this.state.openAssign} handleClose={this.handleCloseAssign} />
					{device.project ? this.renderConfirmUnassign() : null}
					<ItemGrid xs={12} noMargin>
						<DeviceDetails
							device={device}
							history={this.props.history}
							match={this.props.match}
							handleOpenAssign={this.handleOpenAssign}
							handleOpenUnassign={this.handleOpenUnassign}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<InfoCard
							title={"Map"}
							subheader={`Coordinates: ${device.lat} ${device.long}`}
							avatar={<Map />}
							noExpand
							content={
								<Grid container justify={'center'}>
									<Maps isMarkerShown markers={[{ lat: device.lat, long: device.long, liveStatus: device.liveStatus }]} zoom={18} />
								</Grid>
							} />

					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<DeviceImages
							device={device}/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<DeviceHardware
							device={device}
							history={this.props.history}
							match={this.props.match}
						/>
					</ItemGrid>

				</GridContainer>
				: this.renderLoader()
		)
	}
}

export default withStyles(deviceStyles)(Device)
