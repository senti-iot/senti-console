import React, { Component, Fragment } from 'react'
import { Typography, withStyles, Button, CircularProgress } from '@material-ui/core';
import { ItemG, Warning, P, Info, Caption, WeatherIcon } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, Build, Star, StarBorder, Edit, /* DeviceHub, */ LayersClear, Business, DataUsage } from 'variables/icons'
import { ConvertDDToDMS, dateFormat, dateFormatter } from 'variables/functions'
import { Link } from 'react-router-dom'
import deviceStyles from 'assets/jss/views/deviceStyles';
import Dropdown from 'components/Dropdown/Dropdown'
import { connect } from 'react-redux'

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
			{ id: 1, label: t('devices.locationTypes.pedStreet') },
			{ id: 2, label: t('devices.locationTypes.park') },
			{ id: 3, label: t('devices.locationTypes.path') },
			{ id: 4, label: t('devices.locationTypes.square') },
			{ id: 5, label: t('devices.locationTypes.crossroads') },
			{ id: 6, label: t('devices.locationTypes.road') },
			{ id: 7, label: t('devices.locationTypes.motorway') },
			{ id: 8, label: t('devices.locationTypes.port') },
			{ id: 9, label: t('devices.locationTypes.office') },
			{ id: 0, label: t('devices.locationTypes.unspecified') }]
	}

	renderDeviceLocType = () => {
		const { device, t } = this.props
		let deviceLoc = this.LocationTypes()[this.LocationTypes().findIndex(r => r.id === device.locationType)]
		return deviceLoc ? deviceLoc.label : t('devices.noLocType')
	}
	render() {
		const { classes, device, t, accessLevel, history, weather, isFav, addToFav, removeFromFav, detailsPanel } = this.props
		return (
			<InfoCard
				whiteAvatar
				title={device.name ? device.name : device.id}
				avatar={this.renderStatus(device.liveStatus)}
				// noRightExpand
				// menuExpand
				expanded={Boolean(detailsPanel)}
				topAction={<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/device/${device.id}/edit`, prevURL: `/device/${device.id}` }) },
						{ label: t('menus.assign.deviceToCollection'), icon: <DataUsage className={classes.leftIcon} />, func: this.props.handleOpenAssign },
						{ label: device.org.id > 0 ? t('menus.reassign.deviceToOrg') : t('menus.assign.deviceToOrg'), icon: <Business className={classes.leftIcon} />, func: this.props.handleOpenAssignOrg, dontShow: accessLevel.senticloud ? accessLevel.senticloud.editdeviceownership ? false : true : true },
						{ label: t('menus.unassign.deviceFromCollection'), icon: <LayersClear className={classes.leftIcon} />, func: this.props.handleOpenUnassign, dontShow: device.dataCollection ? device.dataCollection.id > 0 ? false : true : true },
						{ label: !(device.lat > 0) && !(device.long > 0) ? t('menus.calibrate') : t('menus.recalibrate'), icon: <Build className={classes.leftIcon} />, /* dontShow: device.liveStatus === 0, */ func: () => this.props.history.push(`${this.props.match.url}/setup`) },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav }
					]
				} />

				}
				subheader={device.id}
				// noExpand
				noPadding
				hiddenContent={
					<ItemG container>
						{!(device.lat > 0) && !(device.long > 0) &&
							<ItemG xs={12} container justify={'center'} style={{ marginBottom: 24 }}>
								<Warning>
									<ItemG xs={12} alignItems={'center'} container>
										<ItemG xs={12} container justify={'center'}>
											<P>
												{t('devices.notCalibrated')}
											</P>
										</ItemG>
										<ItemG xs={12} container justify={'center'}>
											<Button
												color={'default'}
												onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}
												variant={'outlined'}>
												{t('actions.manualCalibration')}
											</Button>
										</ItemG>
									</ItemG>
								</Warning>
							</ItemG>}
						{/* <ItemG xs={6} md={3} lg={3} xl={3}>
							<Caption>{t('devices.fields.status')}:</Caption>
							{this.renderStatus(device.liveStatus)}
						</ItemG> */}
						<ItemG xs={6} md={3} lg={3} xl={3}>
							<Caption>{t('devices.fields.temp')}:</Caption>
							<Info>{device.temperature ? `${device.temperature}\u2103` : `-\u2103`}</Info>
						</ItemG>
						<ItemG container xs={6} md={3} lg={3} xl={3}>
							{weather ? weather === '' ? <CircularProgress size={20} /> : <Fragment>
								<ItemG xs={5} sm={2} md={3} lg={3} xl={2}>
									<WeatherIcon height={24} width={24} icon={weather.currently.icon} />
								</ItemG>
								<ItemG xs={7} sm={10} md={9} lg={9} xl={10}>
									<Caption>{t('devices.fields.weather')}</Caption>
									<Info>
										{weather.currently.summary}
									</Info>
								</ItemG>
							</Fragment>
								: null}
						</ItemG>
						<ItemG xs={6} md={3} lg={3} xl={3}>
							<Caption>{t('devices.fields.locType')}:</Caption>
							<Info>{this.renderDeviceLocType()} </Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('devices.fields.description')}:</Caption>
							<Info>{device.description ? device.description : ''}</Info>
						</ItemG>
						<ItemG xs={12} md={6} lg={6} xl={4}>
							<Caption>{t('devices.fields.lastData')}:</Caption>
							<Info title={dateFormatter(device.wifiLast)}>
								{dateFormat(device.wifiLast)}
							</Info>
						</ItemG>
						<ItemG xs={12} md={6} lg={6} xl={8}>
							<Caption>{t('devices.fields.lastStats')}:</Caption>
							<Info title={dateFormatter(device.execLast)}>
								{dateFormat(device.execLast)}
							</Info>
						</ItemG>


						<ItemG xs={12} md={6} lg={6} xl={4}>
							<Caption>{t('devices.fields.address')}:</Caption>
							<Info>{device.address} </Info>
						</ItemG>
						<ItemG xs={12} md={6} lg={6}>
							<Caption>{t('devices.fields.coords')}:</Caption>
							<Info><a title={t('links.googleMaps')} href={`https://www.google.com/maps/search/${device.lat}+${device.long}`} target={'_blank'}>
								{ConvertDDToDMS(device.lat, false) + ' ' + ConvertDDToDMS(device.long, true)}</a>
							</Info>
						</ItemG>


						<ItemG xs={12} md={3} lg={3}>
							<Caption>{t('devices.fields.org')}:</Caption>
							<Info>{device.org ?
								<Link to={{ pathname: `/management/org/${device.org.id}`, prevURL: `/device/${device.id}` }} >
									{device.org.name}
								</Link>
								: t('no.org')}</Info>

						</ItemG>
						<ItemG xs={12} md={3} lg={3}>
							<Caption>{t('collections.fields.id')}:</Caption>
							<Info>{device.dataCollection.id > 0 ?
								<Link to={{
									pathname: `/collection/${device.dataCollection.id}`,
									prevURL: `/device/${device.id}`
								}}>
									{device.dataCollection.name}
								</Link> : t('no.collection')}</Info>
						</ItemG>
						<ItemG xs={12} md={3} lg={3}>
							<Caption>{t('devices.fields.availability')}:</Caption>
							<Info>{device.dataCollection ? t('devices.fields.notfree') : t('devices.fields.free')}</Info>
						</ItemG>

					</ItemG>} />
		)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel
})


export default connect(mapStateToProps)(withStyles(deviceStyles)(DeviceDetails))