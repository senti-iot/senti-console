import { withStyles } from '@material-ui/core';
import registryStyles from 'assets/jss/views/deviceStyles';
import { Caption, ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { DataUsage, Edit, /* DeviceHub, LibraryBooks, LayersClear, */ Star, StarBorder, Delete } from 'variables/icons';
import { connect } from 'react-redux'

class RegistryDetails extends Component {

	registryState = () => {
		const { registry, t } = this.props
		switch (registry.state) {
			case 1:
				return t('registries.fields.state.active')
			case 2:
				return t('registries.fields.state.inactive')
			default:
				break;
		}
	}
	renderProtocol = (id) => {
		const { t } = this.props
		switch (id) {
			case 0:
				return t('registries.fields.protocols.none')
			case 1:
				return t('registries.fields.protocols.mqtt')
			case 2:
				return t('registries.fields.protocols.http')
			case 3:
				return `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}`
			default:
				break;
		}
	}
	render() {
		const { classes, registry, t, isFav, addToFav, removeFromFav, detailsPanel, handleOpenDeleteDialog, history } = this.props
		return (
			<InfoCard
				title={registry.name ? registry.name : registry.uuid}
				avatar={<DataUsage />}
				noExpand
				// noRightExpand
				// menuExpand
				expanded={Boolean(detailsPanel)}
				topAction={<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/registry/${registry.id}/edit`, prevURL: `/registry/${registry.id}` }) },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav },
						{ label: t('menus.delete'), icon: <Delete className={classes.leftIcon} />, func: handleOpenDeleteDialog }


					]
				} />

				}
				subheader={<ItemG container alignItems={'center'}>
					<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{registry.id}
				</ItemG>}
				content={
					<ItemG container >

						<ItemG xs={12} md>
							<Caption>{t('registries.fields.uuid')}</Caption>
							<Info>{registry.uuid}</Info>
						</ItemG>
						<ItemG xs={12} md>
							<Caption>{t('registries.fields.protocol')}</Caption>
							<Info>{this.renderProtocol(registry.protocol)}</Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('registries.fields.description')}</Caption>
							<Info>{registry.description}</Info>
						</ItemG>
					</ItemG>
				}
				hiddenContent={
					<ItemG container spacing={3}>
					</ItemG>} />
		)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel
})

export default connect(mapStateToProps)(withStyles(registryStyles)(RegistryDetails))