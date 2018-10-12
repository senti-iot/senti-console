import { Grid, withStyles } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { Caption, Info, ItemGrid } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Business, DataUsage, Edit,  } from 'variables/icons';

class DeviceDetails extends Component {

	collectionState = () => {
		const { collection, t } = this.props
		switch (collection.state) {
			case 1:
				return t("collections.fields.state.active")
			case 2:
				return t("collections.fields.state.inactive") 
			default:
				break;
		}
	}

	render() {
		const { classes, collection, t, accessLevel, history } = this.props
		return (
			<InfoCard
				title={collection.name ? collection.name : collection.id}
				avatar={<DataUsage />}
				topAction={<Dropdown menuItems={
					[
						{ label: t("menus.edit"), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/collection/${collection.id}/edit`, state: { prevURL: `/collection/${collection.id}` } }) },
						// { label: collection.project.id > 0 ? t("menus.reassign") : t("menus.assign"), icon: <LibraryBooks className={classes.leftIcon} />, func: this.props.handleOpenAssign },
						{ label: collection.org.id > 0 ? t("menus.reassignOrg") : t("menus.assignOrg"), icon: <Business className={classes.leftIcon} />, func: this.props.handleOpenAssignOrg, dontShow: accessLevel.apisuperuser ? false : true },
						// { label: t("menus.unassignOrg"), icon: <LayersClear className={classes.leftIcon} />, func: this.props.handleOpenUnassign, dontShow: collection.org.id > 0 ? false : true },
						// { label: !(collection.lat > 0) && !(collection.long > 0) ? t("menus.calibrate") : t("menus.recalibrate"), icon: <Build className={classes.leftIcon} />, func: () => this.props.history.push(`${this.props.match.url}/setup`) }
					]
				} />

				}
				subheader={collection.id}
				noExpand
				content={
					<Fragment>
						<Grid container>
							<ItemGrid>
								<Caption>{t("collections.fields.status")}:</Caption>
								<Info>{this.collectionState()}</Info>
							</ItemGrid>
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