import { Caption, ItemG, Info, Link } from 'components'
import InfoCard from 'components/Cards/InfoCard'
import Dropdown from 'components/Dropdown/Dropdown'
import React from 'react'
import { DataUsage, Edit, Star, StarBorder, Delete } from 'variables/icons'
import { useSelector } from 'react-redux'
import { useLocalization, useAuth } from 'hooks'

// const mapStateToProps = (state) => ({
// 	detailsPanel: state.settings.detailsPanel
// })

// @Andrei
const DeviceTypeDetails = props => {
	//Hooks
	const t = useLocalization()
	const hasAccess = useAuth().hasAccess

	//Redux
	const detailsPanel = useSelector(state => state.settings.detailsPanel)

	//State

	//Const

	const { handleOpenDeleteDialog, deviceType, isFav, addToFav, removeFromFav, history } = props
	const deviceTypeMenu = [
		{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
		{ isDivider: true },
		{ disabled: !hasAccess(deviceType.uuid, 'deviceType.modify'), label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `/devicetype/${deviceType.uuid}/edit`, prevURL: `/deviceType/${deviceType.uuid}` }) },
		{ disabled: !hasAccess(deviceType.uuid, 'deviceType.delete'), label: t('menus.delete'), icon: Delete, func: handleOpenDeleteDialog },
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
				<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{deviceType.uuid}
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
							<Link to={{ pathname: `/management/org/${deviceType.org.uuid}`, prevURL: `/devicetype/${deviceType.uuid}` }}>
								{deviceType.org.name}
							</Link>
						</Info>
					</ItemG>
				</ItemG>} />
	)
}

export default DeviceTypeDetails