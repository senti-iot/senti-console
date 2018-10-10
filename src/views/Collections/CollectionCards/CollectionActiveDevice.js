import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info, ItemG } from '../../../components/index';
import { DeviceHub, SignalWifi2BarLock, SignalWifi2Bar } from '../../../variables/icons';
import { dateFormatter, dateFormat, ConvertDDToDMS } from '../../../variables/functions';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';

class CollectionActiveDevice extends Component {

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
					<Typography>
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

	renderDeviceLocType = () => {
		const { device, t } = this.props
		let deviceLoc = this.LocationTypes()[this.LocationTypes().findIndex(r => r.id === device.locationType)]
		return deviceLoc ? deviceLoc.label : t("devices.noLocType")
	}

	render() {
		const {/*  classes, */ device, t, /* accessLevel, */ history, collection } = this.props
		// console.log(device)
		return (
			<InfoCard
				title={t("collections.fields.activeDevice")}
				avatar={<DeviceHub />}
				subheader={device.id}
				noRightExpand
				leftActionContent={
					<ItemG xs={12}>
						<Button variant={'text'} color={"primary"} onClick={() => { history.push({ pathname: `/device/${device.id}`, state: { prevURL: `/collection/${collection.id}` } })}}>
							{t("menus.seeMore")}
						</Button>
					</ItemG>
				}
				content={
					<ItemG container>
						<ItemGrid>
							<Caption>{t("devices.fields.status")}:</Caption>
							{this.renderStatus(device.liveStatus)}
						</ItemGrid>
						<ItemGrid>
							<Caption>{t("devices.fields.temp")}:</Caption>
							<Info>
								{device.temperature} &#8451;
							</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("devices.fields.description")}:</Caption>
							<Info>{device.description ? device.description : ""}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("devices.fields.lastData")}:</Caption>
							<Info title={dateFormatter(device.wifiLast)}>
								{dateFormat(device.wifiLast)}
							</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("devices.fields.lastStats")}:</Caption>
							<Info title={dateFormatter(device.execLast)}>
								{dateFormat(device.execLast)}
							</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("devices.fields.locType")}:</Caption>
							<Info>{this.renderDeviceLocType()} </Info>
						</ItemGrid>
						<ItemGrid xs={2}>
							<Caption>{t("devices.fields.address")}:</Caption>
							<Info>{device.address} </Info>
						</ItemGrid>
						<ItemGrid xs={9}>
							<Caption>{t("devices.fields.coords")}:</Caption>
							<Info><a title={t("links.googleMaps")} href={`https://www.google.com/maps/search/${device.lat}+${device.long}`} target={'_blank'}>
								{ConvertDDToDMS(device.lat, false) + " " + ConvertDDToDMS(device.long, true)}</a>
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>{t("devices.fields.org")}:</Caption>
							<Info>{device.org ?
								<Link to={`/org/${device.org.id}`} >
									{device.org.name}
								</Link>
								: t("devices.noProject")}</Info>

						</ItemGrid>
						<ItemGrid>
							<Caption>{t("devices.fields.project")}:</Caption>
							<Info>{device.project.id > 0 ? <Link to={'/project/' + device.project.id}>{device.project.title}</Link> : t("devices.noProject")}</Info>
						</ItemGrid>
						
					</ItemG>
		
				} />)
	}
}

export default CollectionActiveDevice
