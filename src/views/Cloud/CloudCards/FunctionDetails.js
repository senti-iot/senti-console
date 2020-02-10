import { Caption, ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React from 'react';
import { DataUsage, Edit, Delete, Star, StarBorder } from 'variables/icons';
import { useSelector } from 'react-redux'
import { useLocalization, useHistory } from 'hooks'

// @Andrei
const FunctionDetails = props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	//Redux
	const detailsPanel = useSelector(state => state.settings.detailsPanel)

	//State

	//Const
	const { handleOpenDeleteDialog, cloudfunction, isFav, addToFav, removeFromFav } = props


	const renderProtocol = (id) => {
		// const { t } = this.props
		switch (id) {
			case 0:
				return t('cloudfunctions.fields.types.function')
			case 1:
				return t('registries.fields.protocols.mqtt')
			default:
				break;
		}
	}

	return (
		<InfoCard
			title={cloudfunction.name ? cloudfunction.name : cloudfunction.uuid}
			avatar={<DataUsage />}
			noExpand
			expanded={Boolean(detailsPanel)}
			topAction={<Dropdown menuItems={
				[
					{ label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `/function/${cloudfunction.id}/edit`, prevURL: `/function/${cloudfunction.id}` }) },
					{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
					{ label: t('menus.delete'), icon: Delete, func: handleOpenDeleteDialog },

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
						<Info>{renderProtocol(cloudfunction.type)}</Info>
					</ItemG>
					<ItemG xs={12}>
						<Caption>{t('registries.fields.description')}</Caption>
						<Info>{cloudfunction.description}</Info>
					</ItemG>
				</ItemG>
			} />
	)
}

export default FunctionDetails