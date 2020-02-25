import { Caption, ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React from 'react';
import { Link } from 'react-router-dom'
import { DataUsage, Edit, Star, StarBorder, Delete } from 'variables/icons';
import { useSelector } from 'react-redux'
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	detailsPanel: state.settings.detailsPanel
// })

// @Andrei
const DeviceTypeDetails = props => {
	//Hooks
	const t = useLocalization()

	//Redux
	const detailsPanel = useSelector(state => state.settings.detailsPanel)

	//State

	//Const

	const { handleOpenDeleteDialog, deviceType, isFav, addToFav, removeFromFav, history } = props
	const deviceTypeMenu = [
		{ label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `/devicetype/${deviceType.id}/edit`, prevURL: `/deviceType/${deviceType.id}` }) },
		{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
		{ label: t('menus.delete'), icon: Delete, func: handleOpenDeleteDialog },
	]
	//useCallbacks

	//useEffects

	//Handlers


	return (
		<InfoCard
			title={deviceType.name ? deviceType.name : deviceType.id}
			avatar={<DataUsage />}
			noExpand
			expanded={Boolean(detailsPanel)}
			topAction={<Dropdown menuItems={deviceTypeMenu} />}
			subheader={<ItemG container alignItems={'center'}>
				<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{deviceType.id}
			</ItemG>}

			content={
				<ItemG container spacing={3}>
					<ItemG xs={12}>
						<Caption>{t('devices.fields.description')}</Caption>
						<Info>{deviceType.description}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t('orgs.fields.name')}</Caption>
						<Info>
							<Link to={{ pathname: `/management/org/${deviceType.orgId}`, prevURL: `/management/user/${deviceType.orgId}` }}>
								{deviceType.customerName}
							</Link>
						</Info>
					</ItemG>
				</ItemG>} />
	)
}

export default DeviceTypeDetails