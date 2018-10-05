import React, { Component, Fragment } from 'react'
import { Grid, Typography, withStyles, /* Button */ } from '@material-ui/core';
import { ItemGrid, /* Warning, P, */ Info, Caption } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, Build, /* LibraryBooks, */ Edit, Devices, /*  LayersClear, */ Business } from 'variables/icons'
// import { ConvertDDToDMS, dateFormat, dateFormatter } from 'variables/functions'
import { Link } from 'react-router-dom'
import collectionStyles from 'assets/jss/views/deviceStyles';
import Dropdown from 'components/Dropdown/Dropdown'
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
			{ id: 1, label: t("collections.locationTypes.pedStreet") },
			{ id: 2, label: t("collections.locationTypes.park") },
			{ id: 3, label: t("collections.locationTypes.path") },
			{ id: 4, label: t("collections.locationTypes.square") },
			{ id: 5, label: t("collections.locationTypes.crossroads") },
			{ id: 6, label: t("collections.locationTypes.road") },
			{ id: 7, label: t("collections.locationTypes.motorway") },
			{ id: 8, label: t("collections.locationTypes.port") },
			{ id: 9, label: t("collections.locationTypes.office") },
			{ id: 0, label: t("collections.locationTypes.unspecified") }]
	}

	renderDeviceLocType = () => {
		const { collection, t } = this.props
		let collectionLoc = this.LocationTypes()[this.LocationTypes().findIndex(r => r.id === collection.locationType)]
		return collectionLoc ? collectionLoc.label : t("collections.noLocType")
	}
	render() {
		const { classes, collection, t, accessLevel, history } = this.props
		return (
			<InfoCard
				title={collection.name ? collection.name : collection.id}
				avatar={<Devices />}
				topAction={<Dropdown menuItems={
					[
						{ label: t("menus.edit"), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/collection/${collection.id}/edit`, state: { prevURL: `/collection/${collection.id}` } }) },
						// { label: collection.project.id > 0 ? t("menus.reassign") : t("menus.assign"), icon: <LibraryBooks className={classes.leftIcon} />, func: this.props.handleOpenAssign },
						{ label: collection.org.id > 0 ? t("menus.reassignOrg") : t("menus.assignOrg"), icon: <Business className={classes.leftIcon} />, func: this.props.handleOpenAssignOrg, dontShow: accessLevel.apisuperuser ? false : true },
						// { label: t("menus.unassignDevice"), icon: <LayersClear className={classes.leftIcon} />, func: this.props.handleOpenUnassign, dontShow: collection.project.id > 0 ? false : true },
						{ label: !(collection.lat > 0) && !(collection.long > 0) ? t("menus.calibrate") : t("menus.recalibrate"), icon: <Build className={classes.leftIcon} />, func: () => this.props.history.push(`${this.props.match.url}/setup`) }
					]
				} />

				}
				subheader={collection.id}
				noExpand
				content={
					<Fragment>
						<Grid container>
							{/* {!(collection.lat > 0) && !(collection.long > 0) &&
								<ItemGrid xs={12}>
									<Warning>
										<ItemGrid container xs={12}>
											<P>
												{t("collections.notCalibrated")}
											</P>
										</ItemGrid>
										<ItemGrid container xs={12}>
											<Button
												color={"default"}
												onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}
												variant={"outlined"}>
												{t("collections.calibrateButton")}
											</Button>
										</ItemGrid>
									</Warning>
								</ItemGrid>} */}
							{/* 							<ItemGrid>
								<Caption>{t("collections.fields.name")}:</Caption>
								<Info>
									{collection.name ? collection.name : t("collections.noName")}
								</Info>
							</ItemGrid > */}
							<ItemGrid>
								<Caption>{t("collections.fields.status")}:</Caption>
								{this.renderStatus(collection.state)}
							</ItemGrid>
							{/* <ItemGrid>
								<Caption>{t("collections.fields.temp")}:</Caption>
								<Info>
									{collection.temperature} &#8451;
								</Info>
							</ItemGrid> */}
							<ItemGrid xs={12}>
								<Caption>{t("collections.fields.description")}:</Caption>
								<Info>{collection.description ? collection.description : ""}</Info>
							</ItemGrid>
							{/* <ItemGrid xs={12}>
								<Caption>{t("collections.fields.lastData")}:</Caption>
								<Info title={dateFormatter(collection.wifiLast)}>
									{dateFormat(collection.wifiLast)}
								</Info>
							</ItemGrid>
							<ItemGrid xs={12}>
								<Caption>{t("collections.fields.lastStats")}:</Caption>
								<Info title={dateFormatter(collection.execLast)}>
									{dateFormat(collection.execLast)}
								</Info>
							</ItemGrid> */}
						</Grid>
						<Grid container>
							{/* <ItemGrid>
								<Caption>{t("collections.fields.address")}:</Caption>
								<Info>{collection.address} </Info>
							</ItemGrid> */}
							{/* <ItemGrid >
								<Caption>{t("collections.fields.locType")}:</Caption>
								<Info>{this.renderDeviceLocType()} </Info>
							</ItemGrid>
							<ItemGrid >
								<Caption>{t("collections.fields.coords")}:</Caption>
								<Info><a title={t("links.googleMaps")} href={`https://www.google.com/maps/search/${collection.lat}+${collection.long}`} target={'_blank'}>
									{ConvertDDToDMS(collection.lat, false) + " " + ConvertDDToDMS(collection.long, true)}</a>
								</Info>
							</ItemGrid> */}
						</Grid>
						<Grid container>
							<ItemGrid>
								<Caption>{t("collections.fields.org")}:</Caption>
								<Info>{collection.org ?
									<Link to={`/org/${collection.org.id}`} >
										{collection.org.name}
									</Link>
									: t("collections.noProject")}</Info>

							</ItemGrid>
							{/* <ItemGrid>
								<Caption>{t("collections.fields.project")}:</Caption>
								<Info>{collection.project.id > 0 ? <Link to={'/project/' + collection.project.id}>{collection.project.title}</Link> : t("collections.noProject")}</Info>
							</ItemGrid> */}
							{/* <ItemGrid>
								<Caption>{t("collections.fields.availability")}:</Caption>
								<Info>{collection.project.id > 0 ? t("collections.fields.notfree") : t("collections.fields.free")}</Info>
							</ItemGrid> */}
						</Grid>
					</Fragment>} />
		)
	}
}

export default withStyles(collectionStyles)(DeviceDetails)