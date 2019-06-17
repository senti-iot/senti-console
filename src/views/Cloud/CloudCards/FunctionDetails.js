import { withStyles } from '@material-ui/core';
import cloudfunctionStyles from 'assets/jss/views/deviceStyles';
import { Caption, ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { DataUsage, Edit, /* DeviceHub, LibraryBooks, LayersClear, */ Star, StarBorder, /* Delete */ } from 'variables/icons';
import { connect } from 'react-redux'

class RegistryDetails extends Component {

	renderProtocol = (id) => {
		const { t } = this.props
		switch (id) {
			case 0:
				return t('cloudfunctions.fields.types.function')
			case 1: 
				return t('registries.fields.protocols.mqtt')
			default:
				break;
		}
	}
	render() {
		const { classes, cloudfunction, t, isFav, addToFav, removeFromFav, detailsPanel, /* accessLevel ,*/ history } = this.props
		return (
			<InfoCard
				title={cloudfunction.name ? cloudfunction.name : cloudfunction.uuid}
				avatar={<DataUsage />}
				noExpand
				expanded={Boolean(detailsPanel)}
				topAction={<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/function/${cloudfunction.id}/edit`, prevURL: `/function/${cloudfunction.id}` }) },
						// { label: t('menus.delete'), icon: <Delete className={classes.leftIcon} />, func: handleOpenDeleteDialog },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav }

					]
				} />

				}
				subheader={<ItemG container alignItems={'center'}>
					<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{cloudfunction.id}
				</ItemG>}
				content={
					<ItemG container>
						<ItemG xs={12} md>
							<Caption>{t('cloudfunctions.fields.type')}</Caption>
							<Info>{this.renderProtocol(cloudfunction.type)}</Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('registries.fields.description')}</Caption>
							<Info>{cloudfunction.description}</Info>
						</ItemG>
					</ItemG>
				} />
		)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel
})

export default connect(mapStateToProps)(withStyles(cloudfunctionStyles)(RegistryDetails))