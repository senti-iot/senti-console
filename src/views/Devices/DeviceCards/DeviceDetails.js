import React, { Component, Fragment } from 'react'
import { Grid, Typography, withStyles, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ItemGrid, Warning, P, Info, Caption } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, MoreVert, Build, LibraryBooks, Edit, Devices, LayersClear } from '@material-ui/icons'
import { ConvertDDToDMS } from 'variables/functions'
import { Link } from 'react-router-dom'
import deviceStyles from 'assets/jss/views/deviceStyles';
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
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	render() {
		const { actionAnchor } = this.state
		const { classes, device, t } = this.props
		return (
			<InfoCard
				title={t("devices.cards.details")}
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
								<Edit className={classes.leftIcon} />{t("menus.edit")}
							</MenuItem>
							<MenuItem onClick={this.props.handleOpenAssign}>
								<LibraryBooks className={classes.leftIcon} />{device.project ? t("menus.reassign") : t("menus.assign")}
							</MenuItem>
							{device.project ? <MenuItem onClick={this.props.handleOpenUnassign}>
								<LayersClear className={classes.leftIcon} /> {t("menus.unassignDevice")}
							</MenuItem> : null}
							<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}>
								<Build className={classes.leftIcon} />{!(device.lat > 0) && !(device.long > 0) ? t("menus.calibrate") : t("menus.recalibrate")}
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
												{t("devices.notCalibrated")}
											</P>
										</ItemGrid>
										<ItemGrid container xs={12}>
											<Button
												color={"default"}
												onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}
												variant={"outlined"}>
												{t("devices.calibrateButton")}
											</Button>
										</ItemGrid>
									</Warning>
								</ItemGrid>}
							<ItemGrid>
								<Caption>{t("devices.fields.name")}</Caption>
								<Info>
									{device.device_name ? device.device_name : t("devices.noName")}
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("devices.fields.status")}</Caption>
								{this.renderStatus(device.liveStatus)}
							</ItemGrid>
							<ItemGrid xs={9}>
								<Caption>{t("devices.fields.temp")}</Caption>
								<Info>
									{device.temperature} &#8451;
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("devices.fields.lastData")}</Caption>
								<Info>
									{moment(device.wifiLastD).format("HH:mm - DD.MM.YYYY")}
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("devices.fields.lastStats")}</Caption>
								<Info>
									{moment(device.execLastD).format("HH:mm - DD.MM.YYYY")}
								</Info>
							</ItemGrid>
							<ItemGrid xs={12}>
								<Caption>{t("devices.fields.description")}</Caption>
								<Info>{device.description ? device.description : ""}</Info>
							</ItemGrid>
						</Grid>
						<Grid container>
							<ItemGrid>
								<Caption>{t("devices.fields.address")}</Caption>
								<Info>{device.address} </Info>
							</ItemGrid>
							<ItemGrid >
								<Caption>{t("devices.fields.locType")}</Caption>
								<Info>{device.locationType} </Info>
							</ItemGrid>
							<ItemGrid >
								<Caption>{t("devices.fields.coords")}</Caption>
								<Info><a title={t("links.googleMaps")} href={`https://www.google.com/maps/search/${device.lat}+${device.long}`} target={'_blank'}>
									{ConvertDDToDMS(device.lat, false) + " " + ConvertDDToDMS(device.long, true)}</a>
								</Info>
							</ItemGrid>
						</Grid>
						<Grid container>
							<ItemGrid>
								<Caption>{t("devices.fields.org")}</Caption>
								<Info>{device.organisation ? device.organisation.vcName : t("devices.noProject")}</Info>
							</ItemGrid>
							<ItemGrid xs={4}>
								<Caption>{t("devices.fields.project")}</Caption>
								<Info>{device.project ? <Link to={'/project/' + device.project.id}>{device.project.title}</Link> : t("devices.noProject")}</Info>
							</ItemGrid>
						</Grid>
					</Fragment>} />
		)
	}
}

export default withStyles(deviceStyles)(DeviceDetails)