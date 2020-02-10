import React, { Fragment } from 'react'
import { Typography, withStyles, Button, CircularProgress, Link } from '@material-ui/core';
import { ItemG, Warning, P, Info, Caption, WeatherIcon } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, Build, Star, StarBorder, Edit, /* DeviceHub, */ LayersClear, Business, DataUsage } from 'variables/icons'
import { ConvertDDToDMS, dateFormat, dateFormatter } from 'variables/functions'
import { Link as RLink } from 'react-router-dom'
import deviceStyles from 'assets/jss/views/deviceStyles';
import Dropdown from 'components/Dropdown/Dropdown'
import { useSelector } from 'react-redux'
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	detailsPanel: state.settings.detailsPanel
// })

// @Andrei
const DeviceDetails = props => {
	const t = useLocalization()
	const detailsPanel = useSelector(state => state.settings.detailsPanel)

	const renderStatus = (status) => {
		const { classes } = props
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

	const LocationTypes = () => {
		// const { t } = this.props
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

	const renderDeviceLocType = () => {
		const { device } = props
		let deviceLoc = LocationTypes()[LocationTypes().findIndex(r => r.id === device.locationType)]
		return deviceLoc ? deviceLoc.label : t('devices.noLocType')
	}

	const { device, accessLevel, history, weather, isFav, addToFav, removeFromFav } = props
	return (
		<InfoCard
			whiteAvatar
			title={device.name ? device.name : device.id}
			avatar={renderStatus(device.liveStatus)}
			// noRightExpand
			// menuExpand
			expanded={Boolean(detailsPanel)}
			topAction={<Dropdown menuItems={
				[
					{ label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `/device/${device.id}/edit`, prevURL: `/device/${device.id}` }) },
					{ label: t('menus.assign.deviceToCollection'), icon: DataUsage, func: props.handleOpenAssign },
					{ label: device.org.id > 0 ? t('menus.reassign.deviceToOrg') : t('menus.assign.deviceToOrg'), icon: Business, func: props.handleOpenAssignOrg, dontShow: accessLevel.senticloud ? accessLevel.senticloud.editdeviceownership ? false : true : true },
					{ label: t('menus.unassign.deviceFromCollection'), icon: LayersClear, func: props.handleOpenUnassign, dontShow: device.dataCollection ? device.dataCollection.id > 0 ? false : true : true },
					{ label: !(device.lat > 0) && !(device.long > 0) ? t('menus.calibrate') : t('menus.recalibrate'), icon: Build, /* dontShow: device.liveStatus === 0, */ func: () => props.history.push(`${props.match.url}/setup`) },
					{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav }
				]
			} />

			}
			subheader={<ItemG><Caption>
				{device.id}
			</Caption></ItemG>}
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
											onClick={() => props.history.push(`${props.match.url}/setup`)}
											variant={'outlined'}>
											{t('actions.manualCalibration')}
										</Button>
									</ItemG>
								</ItemG>
							</Warning>
						</ItemG>}
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
						<Info>{renderDeviceLocType()} </Info>
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
						<Info><Link title={t('links.googleMaps')} href={`https://www.google.com/maps/search/${device.lat}+${device.long}`} target={'_blank'}>
							{ConvertDDToDMS(device.lat, false) + ' ' + ConvertDDToDMS(device.long, true)}</Link>
						</Info>
					</ItemG>


					<ItemG xs={12} md={3} lg={3}>
						<Caption>{t('devices.fields.org')}:</Caption>
						<Info>{device.org ?
							<Link component={RLink} to={{ pathname: `/management/org/${device.org.id}`, prevURL: `/device/${device.id}` }} >
								{device.org.name}
							</Link>
							: t('no.org')}</Info>

					</ItemG>
					<ItemG xs={12} md={3} lg={3}>
						<Caption>{t('collections.fields.id')}:</Caption>
						<Info>{device.dataCollection ? device.dataCollection.id > 0 ?
							<Link component={RLink} to={{
								pathname: `/collection/${device.dataCollection.id}`,
								prevURL: `/device/${device.id}`
							}}>
								{device.dataCollection.name}
							</Link> : t('no.collection') : t('no.collection')}</Info>
					</ItemG>
					<ItemG xs={12} md={3} lg={3}>
						<Caption>{t('devices.fields.availability')}:</Caption>
						<Info>{device.dataCollection ? t('devices.fields.notfree') : t('devices.fields.free')}</Info>
					</ItemG>

				</ItemG>} />
	)
}

export default withStyles(deviceStyles)(DeviceDetails)