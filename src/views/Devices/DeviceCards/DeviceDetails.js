import React, { Component, Fragment } from 'react'
import { Grid, Typography, withStyles, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ItemGrid, Warning, P, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, MoreVert, Build, LibraryBooks, Edit, Devices, LayersClear } from '@material-ui/icons'
import { ConvertDDToDMS } from 'variables/functions'
import { Link } from 'react-router-dom'
import deviceStyles from 'assets/jss/views/deviceStyles';
import SmallInfo from 'components/Card/SmallInfo';
import Caption from 'components/Typography/Caption';
var moment = require("moment");

class DeviceDetails extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 actionAnchor: null
	  }
	}
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
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	};
	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	};
	render() {
		const { actionAnchor } = this.state
		const { classes, device } = this.props
		return (
			<InfoCard
				title={'Device Details'}
				avatar={<Devices />}
				topAction={
					<ItemGrid noMargin noPadding>
						<IconButton
							aria-label="More"
							aria-owns={actionAnchor ? 'long-menu' : null}
							aria-haspopup="true"
							onClick={this.handleOpenActionsDetails}>
							<MoreVert />
						</IconButton>
						<Menu
							id="long-menu"
							anchorEl={actionAnchor}
							open={Boolean(actionAnchor)}
							onClose={this.handleCloseActionsDetails}
							PaperProps={{
								style: {
									maxHeight: 200,
									minWidth: 200
								}
							}}>
						
							<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/edit`)}>
								<Edit className={classes.leftIcon} />Edit details
							</MenuItem>
							<MenuItem onClick={this.props.handleOpenAssign}>
								<LibraryBooks className={classes.leftIcon} />{device.project ? "Move to another project" : "Assign to new project"}
							</MenuItem>
							{device.project ? <MenuItem onClick={this.props.handleOpenUnassign}>
								<LayersClear className={classes.leftIcon} /> Unassign from project
							</MenuItem> : null}
							<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}>
								<Build className={classes.leftIcon} />{!(device.lat > 0) && !(device.long > 0) ? "Manual Calibration" : "Recalibrate"}
							</MenuItem>
							))}
						</Menu>
					</ItemGrid>
				}
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
							<ItemGrid xs={9}>
								<Caption>Temperature:</Caption>
								<Info>
									{device.temperature} &#8451;
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>Last time device sent data to server:</Caption>
								<Info>
									{moment(device.wifiLastD).format("HH:mm:ss DD.MM.YYYY")}
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>Last time device sent stats to server:</Caption>
								<Info>
									{moment(device.execLastD).format("HH:mm:ss DD.MM.YYYY")}
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
					</Fragment>} />
		)
	}
}
export default withStyles(deviceStyles)(DeviceDetails)