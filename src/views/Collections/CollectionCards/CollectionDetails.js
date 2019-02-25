import { withStyles, CircularProgress } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { Caption, Info, ItemG, WeatherIcon } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { DataUsage, Edit, DeviceHub, LibraryBooks, LayersClear, Star, StarBorder, Delete } from 'variables/icons';

class DeviceDetails extends Component {

	collectionState = () => {
		const { collection, t } = this.props
		switch (collection.state) {
			case 1:
				return t('collections.fields.state.active')
			case 2:
				return t('collections.fields.state.inactive')
			default:
				break;
		}
	}

	render() {
		const { classes, collection, t, isFav, addToFav, removeFromFav, /* accessLevel ,*/ history, handleOpenDeleteDialog, weather } = this.props
		return (
			<InfoCard
				title={collection.name ? collection.name : collection.id}
				avatar={<DataUsage />}
				topAction={<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/collection/${collection.id}/edit`, prevURL: `/collection/${collection.id}` }) },
						{ label: t('menus.assign.deviceToCollection'), icon: <DeviceHub className={classes.leftIcon} />, func: this.props.handleOpenAssignDevice },
						{ label: t('menus.unassign.deviceFromCollection'), icon: <LayersClear className={classes.leftIcon} />, func: this.props.handleOpenUnassignDevice, dontShow: collection.activeDeviceStats ? false : true },
						{ label: collection.project ? collection.project.id ? t('menus.reassign.collectionToProject') : t('menus.assign.collectionToProject') : t('menus.assign.collectionToProject'), icon: <LibraryBooks className={classes.leftIcon} />, func: this.props.handleOpenAssignProject, /*  dontShow: collection.org.id > 0 ? false : true */ },
						{ label: t('menus.delete'), icon: <Delete className={classes.leftIcon} />, func: handleOpenDeleteDialog },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav }

					]
				} />

				}
				subheader={<ItemG container alignItems={'center'}>
					<Caption>{t('collections.fields.id')}:</Caption>&nbsp;{collection.id}
				</ItemG>}
				noExpand
				content={
					<ItemG container spacing={16}>
						<ItemG xs={12} sm={1} md={1} lg={1} xl={1}>
							<Caption>{t('collections.fields.status')}:</Caption>
							<Info>{this.collectionState()}</Info>
						</ItemG>
						<ItemG container xs={12} sm={11} md={11} lg={11} xl={11}>
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
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('collections.fields.description')}:</Caption>
							<Info>{collection.description ? collection.description : ''}</Info>
						</ItemG>


						<ItemG>
							<Caption>{t('collections.fields.org')}:</Caption>
							<Info>{collection.org ?
								<Link to={{ pathname: `/management/org/${collection.org.id}`, prevURL: `/collection/${collection.id}` }} >
									{collection.org.name}
								</Link>
								: t('no.org')}</Info>

						</ItemG>
						<ItemG>
							<Caption>{t('collections.fields.project')}:</Caption>
							<Info>{collection.project ?
								<Link to={{
									pathname: `/project/${collection.project.id}`,
									prevURL: `/collection/${collection.id}`
								}}
								>
									{collection.project.title}
								</Link>
								: t('no.project')}</Info>

						</ItemG>
					</ItemG>} />
		)
	}
}

export default withStyles(collectionStyles)(DeviceDetails)