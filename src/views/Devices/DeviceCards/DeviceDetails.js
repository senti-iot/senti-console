import React, { Component, Fragment } from 'react'
import { Grid, Typography, withStyles, Button, CircularProgress } from '@material-ui/core';
import { ItemG, Warning, P, Info, Caption, WeatherIcon } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, Build, /* LibraryBooks,  */Edit, DeviceHub, LayersClear, Business, DataUsage } from 'variables/icons'
import { ConvertDDToDMS, dateFormat, dateFormatter } from 'variables/functions'
import { Link } from 'react-router-dom'
import deviceStyles from 'assets/jss/views/deviceStyles';
import Dropdown from 'components/Dropdown/Dropdown'
// import teal from '@material-ui/core/colors/teal'
// const Skycons = require('skycons')(window)

class DeviceDetails extends Component {

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

	LocationTypes = () => {
		const { t } = this.props
		return [
			{ id: 1, label: t("devices.locationTypes.pedStreet") },
			{ id: 2, label: t("devices.locationTypes.park") },
			{ id: 3, label: t("devices.locationTypes.path") },
			{ id: 4, label: t("devices.locationTypes.square") },
			{ id: 5, label: t("devices.locationTypes.crossroads") },
			{ id: 6, label: t("devices.locationTypes.road") },
			{ id: 7, label: t("devices.locationTypes.motorway") },
			{ id: 8, label: t("devices.locationTypes.port") },
			{ id: 9, label: t("devices.locationTypes.office") },
			{ id: 0, label: t("devices.locationTypes.unspecified") }]
	}
	componentDidMount = () => {

	}
	componentWillUpdate = () => {
		// if (this.props.weather) {
		// console.log(this.props.weather)
		// var skycons = new Skycons({
		//  "monochrome": false,
		//  "colors" : {
		//    "cloud" : "#F00"
		//  }
		//  });
		// let weatherIcon = new Skycons({
		// 	"monochrome": false,
		// 	"colors": {
		// 		"main": teal[500],
		// 		"sun": "#FF0",
		// 		"cloud": "#F00"
		// 	}
		// });
		// let iconStr = /* this.props.weather.currently.icon.toString() ?*/  'PARTLY_CLOUDY_DAY'
		// // iconStr = iconStr.replace(/-/g, '_')
		// // iconStr = iconStr.toUpperCase()
		// // console.log(Skycons[iconStr], iconStr)
		// weatherIcon.add('icon1', Skycons[iconStr])
		// weatherIcon.play()
		// }
	}
	renderDeviceLocType = () => {
		const { device, t } = this.props
		let deviceLoc = this.LocationTypes()[this.LocationTypes().findIndex(r => r.id === device.locationType)]
		return deviceLoc ? deviceLoc.label : t("devices.noLocType")
	}
	render() {
		const { classes, device, t, accessLevel, history, weather } = this.props
		return (
			<InfoCard
				title={device.name ? device.name : device.id}
				avatar={<DeviceHub />}
				topAction={<Dropdown menuItems={
					[
						{ label: t("menus.edit"), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/device/${device.id}/edit`, prevURL: `/device/${device.id}` }) },
						{ label: t("menus.assign.deviceToCollection"), icon: <DataUsage className={classes.leftIcon} />, func: this.props.handleOpenAssign },
						{ label: device.org.id > 0 ? t("menus.reassign.deviceToOrg") : t("menus.assign.deviceToOrg"), icon: <Business className={classes.leftIcon} />, func: this.props.handleOpenAssignOrg, dontShow: accessLevel.senticloud ? accessLevel.senticloud.editdeviceownership ? false : true : true },
						{ label: t("menus.unassign.deviceFromCollection"), icon: <LayersClear className={classes.leftIcon} />, func: this.props.handleOpenUnassign, dontShow: device.dataCollection.id > 0 ? false : true },
						{ label: !(device.lat > 0) && !(device.long > 0) ? t("menus.calibrate") : t("menus.recalibrate"), icon: <Build className={classes.leftIcon} />, func: () => this.props.history.push(`${this.props.match.url}/setup`) }
					]
				} />

				}
				subheader={device.id}
				noExpand
				content={
					<Fragment>
						<Grid container spacing={16}>
							{!(device.lat > 0) && !(device.long > 0) &&
								<ItemG xs={12}>
									<Warning>
										<ItemG container xs={12}>
											<P>
												{t("devices.notCalibrated")}
											</P>
										</ItemG>
										<ItemG container xs={12}>
											<Button
												color={"default"}
												onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}
												variant={"outlined"}>
												{t("devices.calibrateButton")}
											</Button>
										</ItemG>
									</Warning>
								</ItemG>}
							<ItemG xs={6} md={3} lg={3} xl={3}>
								<Caption>{t("devices.fields.status")}:</Caption>
								{this.renderStatus(device.liveStatus)}
							</ItemG>
							<ItemG xs={6} md={3} lg={3} xl={3}>
								<Caption>{t("devices.fields.temp")}:</Caption>
								<Info>
									{device.temperature} &#8451;
								</Info>
							</ItemG>
							<ItemG container xs={6} md={3} lg={3} xl={3}>
								{weather ? 	<Fragment>
									<ItemG xs={5} sm={2} md={3} lg={2}>
										<WeatherIcon icon={weather.currently.icon} /> 
									</ItemG>
									<ItemG xs={7} sm={10} md={9} lg={10}>
										<Caption>{t("devices.fields.weather")}</Caption>
										<Info>
											{weather.currently.summary}
										</Info>
									</ItemG>
								</Fragment>
									: <CircularProgress size={20}/>}
							</ItemG> 
							<ItemG xs={6} md={3} lg={3} xl={3}>
								<Caption>{t("devices.fields.locType")}:</Caption>
								<Info>{this.renderDeviceLocType()} </Info>
							</ItemG>
							<ItemG xs={12}>
								<Caption>{t("devices.fields.description")}:</Caption>
								<Info>{device.description ? device.description : ""}</Info>
							</ItemG>
							<ItemG xs={12} md={6} lg={6} xl={4}>
								<Caption>{t("devices.fields.lastData")}:</Caption>
								<Info title={dateFormatter(device.wifiLast)}>
									{dateFormat(device.wifiLast)}
								</Info>
							</ItemG>
							<ItemG xs={12} md={6} lg={6} xl={8}>
								<Caption>{t("devices.fields.lastStats")}:</Caption>
								<Info title={dateFormatter(device.execLast)}>
									{dateFormat(device.execLast)}
								</Info>
							</ItemG>
					
					
							<ItemG xs={12} md={6} lg={6} xl={4}>
								<Caption>{t("devices.fields.address")}:</Caption>
								<Info>{device.address} </Info>
							</ItemG>
							<ItemG xs={12} md={6} lg={6}>
								<Caption>{t("devices.fields.coords")}:</Caption>
								<Info><a title={t("links.googleMaps")} href={`https://www.google.com/maps/search/${device.lat}+${device.long}`} target={'_blank'}>
									{ConvertDDToDMS(device.lat, false) + " " + ConvertDDToDMS(device.long, true)}</a>
								</Info>
							</ItemG>
						
					
							<ItemG xs={12} md={3} lg={3}>
								<Caption>{t("devices.fields.org")}:</Caption>
								<Info>{device.org ?
									<Link to={{ pathname: `/org/${device.org.id}`, prevURL: `/device/${device.id}` }} >
										{device.org.name}
									</Link>
									: t("devices.noProject")}</Info>

							</ItemG>
							<ItemG xs={12} md={3} lg={3}>
								<Caption>{t("collections.fields.id")}:</Caption>
								<Info>{device.dataCollection.id > 0 ? <Link to={'/collection/' + device.dataCollection.id}>{device.dataCollection.name}</Link> : t("devices.noProject")}</Info>
							</ItemG>
							<ItemG xs={12} md={3} lg={3}>
								<Caption>{t("devices.fields.availability")}:</Caption>
								<Info>{device.dataCollection.id > 0 ? t("devices.fields.notfree") : t("devices.fields.free")}</Info>
							</ItemG>
						</Grid>
					</Fragment>} />
		)
	}
}

export default withStyles(deviceStyles)(DeviceDetails)