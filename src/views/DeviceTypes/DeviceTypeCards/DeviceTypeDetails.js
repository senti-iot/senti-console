import { withStyles } from '@material-ui/core';
import deviceTypeStyles from 'assets/jss/views/deviceStyles';
import { Caption, ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { DataUsage, Edit, /* DeviceHub, LibraryBooks, LayersClear, */ Star, StarBorder, /* Delete */ } from 'variables/icons';
import { connect } from 'react-redux'

class DeviceTypeDetails extends Component {

	deviceTypeState = () => {
		const { deviceType, t } = this.props
		switch (deviceType.state) {
			case 1:
				return t('registries.fields.state.active')
			case 2:
				return t('registries.fields.state.inactive')
			default:
				break;
		}
	}

	render() {
		const { classes, deviceType, t, isFav, addToFav, removeFromFav, detailsPanel, /* accessLevel ,*/ history } = this.props
		return (
			<InfoCard
				title={deviceType.name ? deviceType.name : deviceType.id}
				avatar={<DataUsage />}
				// noPadding
				noExpand
				// noRightExpand
				// menuExpand
				expanded={Boolean(detailsPanel)}
				topAction={<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/deviceType/${deviceType.id}/edit`, prevURL: `/deviceType/${deviceType.id}` }) },
						// { label: t('menus.delete'), icon: <Delete className={classes.leftIcon} />, func: handleOpenDeleteDialog },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav }

					]
				} />

				}
				subheader={<ItemG container alignItems={'center'}>
					<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{deviceType.id}
				</ItemG>}

				content={
					<ItemG container spacing={16}>
						<ItemG xs={12}>
							<Caption>{t('devicetypes.fields.structure.name')}:</Caption>
							<Info>{deviceType.structure ? Object.keys(deviceType.structure).map(s => {
								return s
							}) : null}</Info>
						</ItemG>
						{/* <ItemG container xs={12} sm={11} md={11} lg={11} xl={11}>
							{weather === '' || weather === undefined ? null : weather !== null ? <Fragment>
								<ItemG xs={2} sm={1} md={1} lg={1} container justify={'center'}>
									<WeatherIcon height={24} width={24} icon={weather.currently.icon} />
								</ItemG>
								<ItemG xs>
									<Caption>{t('devices.fields.weather')}</Caption>
									<Info>
										{weather.currently.summary}
									</Info>
								</ItemG>
							</Fragment>
								: <CircularProgress size={20} />}
						</ItemG> */}
						{/* <ItemG xs={12}>
							<Caption>{t('registries.fields.description')}:</Caption>
							<Info>{deviceType.description ? deviceType.description : ''}</Info>
						</ItemG> */}


						{/* <ItemG>
							<Caption>{t('registries.fields.org')}:</Caption>
							<Info>{deviceType.org ?
								<Link to={{ pathname: `/management/org/${deviceType.org.id}`, prevURL: `/deviceType/${deviceType.id}` }} >
									{deviceType.org.name}
								</Link>
								: t('no.org')}</Info>

						</ItemG>
						<ItemG>
							<Caption>{t('registries.fields.project')}:</Caption>
							<Info>{deviceType.project ?
								<Link to={{
									pathname: `/project/${deviceType.project.id}`,
									prevURL: `/deviceType/${deviceType.id}`
								}}
								>
									{deviceType.project.title}
								</Link>
								: t('no.project')}</Info>

						</ItemG> */}
					</ItemG>} />
		)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel
})

export default connect(mapStateToProps)(withStyles(deviceTypeStyles)(DeviceTypeDetails))