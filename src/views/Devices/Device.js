import React, { Component, Fragment } from 'react'
import { getDevice, getAllPictures, assignProjectToDevice } from 'variables/data';
import {  Grid, Typography, withStyles, Button, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import moment from 'moment'
import { ItemGrid, Warning, P } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, MoreVert, Build, LibraryBooks, Edit, Devices, DeveloperBoard, Image, LayersClear } from '@material-ui/icons'
import { ConvertDDToDMS } from 'variables/functions'
import { Link } from 'react-router-dom'
import deviceStyles from 'assets/jss/views/deviceStyles';
import SmallInfo from 'components/Card/SmallInfo';
import AssignProject from 'components/Devices/AssignProject';
import DeviceImage from 'components/Devices/DeviceImage';
import ImageUpload from './DeviceImageUpload';
import CircularLoader from 'components/Loader/CircularLoader';


const Caption = (props) => <Typography variant={"caption"}>{props.children}</Typography>
const Info = (props) => <Typography paragraph classes={props.classes}>{props.children}</Typography>

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true,
			anchorEl: null,
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
				this.props.setHeader(rs.device_name ? rs.device_name : rs.device_id)
					
			}
		})

	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				this.getAllPics(id)
				await this.getDevice(id)
			}
		}
		else {
			this.props.history.push('/404')
		}
	}
	getAllPics = async (id) => {
		await getAllPictures(id).then(rs => this.setState({ img: rs }))
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
	renderLoader = () => {
		// return <Grid container justify={'center'} alignItems="center"><CircularProgress /></Grid>
		return <CircularLoader/>
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
						Are you sure you want to unassign {device.device_id + " " + device.device_name} from project {device.project.title}
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
	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};
	renderStatus = (status) => {
		const { classes } = this.props


		switch (status) {
			case 1:
				return <SignalWifi2Bar className={classes.yellowSignal} />

			case 2:
				return <SignalWifi2Bar className={classes.greenSignal} />

			case 0:
				return <SignalWifi2Bar className={classes.redSignal} />

			case null:
				return <div>
					<SignalWifi2BarLock className={classes.redSignal} />
					<Typography paragraph>
						Error
					</Typography>
				</div>
			default:
				break;
		}
	}
	render() {
		const { device, loading, anchorEl } = this.state
		const { classes } = this.props
		return (
			!loading ?
				<Grid container justify={'center'} alignContent={'space-between'} spacing={8}>
					<AssignProject device_id={this.state.device.device_id} open={this.state.openAssign} handleClose={this.handleCloseAssign} />
					{device.project ? this.renderConfirmUnassign() : null}
					<ItemGrid xs={12}>
						<InfoCard
							title={

								<Typography paragraph className={classes.typoNoMargin}>
									Device Details
								</Typography>
							}
							topAction={
								<ItemGrid>
									<IconButton
										aria-label="More"
										aria-owns={anchorEl ? 'long-menu' : null}
										aria-haspopup="true"
										onClick={this.handleClick}>
										<MoreVert />
									</IconButton>
									<Menu
										id="long-menu"
										anchorEl={anchorEl}
										open={Boolean(anchorEl)}
										onClose={this.handleClose}
										PaperProps={{
											style: {
												maxHeight: 200,
												minWidth: 200
											}
										}}>
										<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}>
											<Build className={classes.leftIcon} />{!(device.lat > 0) && !(device.long > 0) ? "Manual Calibration" : "Recalibrate"}
										</MenuItem>
										<MenuItem onClick={this.handleOpenAssign}>
											<LibraryBooks className={classes.leftIcon} />{device.project ? "Move to another project" : "Assign to new project"}
										</MenuItem>
										{device.project ? <MenuItem onClick={this.handleOpenUnassign}>
											<LayersClear className={classes.leftIcon} /> Unassign from project
										</MenuItem> : null}
										<MenuItem onClick={this.handleClose}>
											<Edit className={classes.leftIcon} />Edit Details
										</MenuItem>
										))}
									</Menu>
								</ItemGrid>
							}
							avatar={<Devices />}
							subheader={device.device_id}
							noExpand
							content={
								<Fragment>
									<Grid container>
										{!(device.lat > 0) && !(device.long > 0) &&
											<ItemGrid xs={12}>
												<Warning>
													<ItemGrid container xs={12}>
														<P>
															Device has not been manually calibrated!
														</P>
													</ItemGrid>
													<ItemGrid container xs={12}>
														<Button
															color={"default"}
															onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}
															variant={"outlined"}>
															Manual Calibration
														</Button>
													</ItemGrid>
												</Warning>
											</ItemGrid>}
										<ItemGrid>
											<SmallInfo caption={"Name"} info={device.device_name ? device.device_name : "No name"} />
										</ItemGrid>
										<ItemGrid>
											<Caption>Status:</Caption>
											{this.renderStatus(device.liveStatus)}
										</ItemGrid>
										<ItemGrid>
											<Caption>Temperature:</Caption>
											<Info>
												{device.temperature} &#8451;
											</Info>
										</ItemGrid>
										<ItemGrid xs={12}>
											<Caption>Description:</Caption>
											<Info>{device.description ? device.description : ""}</Info>
										</ItemGrid>
									</Grid>
									<Grid container>
										<ItemGrid>
											<Caption>Address:</Caption>
											<Info>{device.address} </Info>
										</ItemGrid>
										<ItemGrid >
											<Caption>Location Type:</Caption>
											<Info>{device.locationType} </Info>
										</ItemGrid>
										<ItemGrid >
											<Caption>Coordinates:</Caption>
											<Info><a title={'Open link to Google Maps'} href={`https://www.google.com/maps/search/${device.lat}+${device.long}`} target={'_blank'}>
												{ConvertDDToDMS(device.lat, false) + " " + ConvertDDToDMS(device.long, true)}</a>
											</Info>
										</ItemGrid>
									</Grid>
									<Grid container>
										<ItemGrid>
											<Caption>Organisation:</Caption>
											<Info>{device.organisation ? device.organisation.vcName : "Unassigned"}</Info>
										</ItemGrid>
										<ItemGrid xs={4}>
											<Caption>Project:</Caption>
											<Info>{device.project ? <Link to={'/project/' + device.project.id}>{device.project.title}</Link> : "Unassigned"}</Info>
										</ItemGrid>
									</Grid>
								</Fragment>
							}
						/>
					</ItemGrid>
					<ItemGrid xs={12}>
						<InfoCard
							title={"Pictures"}
							avatar={<Image />}
							noExpand
							content={
								this.state.img !== null ?
									this.state.img === 0 ?
										this.renderImageUpload(device.device_id) :
										<Grid container justify={'center'}>
											<DeviceImage images={this.state.img} />
											{this.renderImageUpload(device.device_id)}
										</Grid>
									: this.renderLoader()} />

					</ItemGrid>
					<ItemGrid xs={12}>
						<InfoCard
							title={"Hardware"}
							avatar={<DeveloperBoard />}
							subheader={''}
							content={
								<Grid container>
									<Grid container >
										<ItemGrid xs>
											<Caption>PC Model:</Caption>
											<Info>{device.RPImodel}</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>Memory:</Caption>
											<Info>{device.memory + " - " + device.memoryModel}</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>Power Adapter:</Caption>
											<Info>{device.adapter}</Info>
										</ItemGrid>
									</Grid>
									<Grid container>
										<ItemGrid xs>
											<Caption>Wifi Module:</Caption>
											<Info>{device.wifiModule}</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>Modem Model:</Caption>
											<Info>{device.modemModel}</Info>
										</ItemGrid>
									</Grid>
								</Grid>
							}
							hiddenContent={<Grid container>
								<ItemGrid>
									<Caption>Cell Number:</Caption>
									<Info>{device.cellNumber}</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>SIM Provider:</Caption>
									<Info>{device.SIMProvider}</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>SIM-Card ID</Caption>
									<Info>{device.SIMID}</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>Modem IMEI:</Caption>
									<Info>{device.modemIMEI}</Info>
								</ItemGrid>

							</Grid>
							}
						/>
					</ItemGrid>

				</Grid>
				: this.renderLoader()
		)
	}
}

export default withStyles(deviceStyles)(Device)
