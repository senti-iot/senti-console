import { Caption, ItemG, Info, Link } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React from 'react';
import { DataUsage, Edit, Delete, Star, StarBorder } from 'variables/icons';
import { useLocalization, useHistory, useAuth } from 'hooks'

const FunctionDetails = props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	const Auth = useAuth()
	const hasAccess = Auth.hasAccess
	//Redux

	//State

	//Const
	const { handleOpenDeleteDialog, cloudfunction, isFav, addToFav, removeFromFav } = props
	const cfMenu = [
		{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
		{ isDivider: true },
		{ disabled: !hasAccess(cloudfunction.uuid, 'cloudfunction.modify'), label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `/function/${cloudfunction.uuid}/edit`, prevURL: `/function/${cloudfunction.uuid}` }) },
		{ disabled: !hasAccess(cloudfunction.uuid, 'cloudfunction.delete'), label: t('menus.delete'), icon: Delete, func: handleOpenDeleteDialog },

	]
	//Handlers

	const renderProtocol = (id) => {
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
			topAction={<Dropdown menuItems={cfMenu} />}
			subheader={<ItemG container alignItems={'center'}>
				<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{cloudfunction.uuid}
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
					<ItemG xs={12}>
						<Caption>{t('cloudfunctions.fields.org')}</Caption>
						<Info>
							<Link to={{ pathname: `/management/org/${cloudfunction.org.uuid}`, prevURL: `/function/${cloudfunction.uuid}` }}>
								{cloudfunction.org.name}
							</Link>
						</Info>
					</ItemG>
				</ItemG>
			} />
	)
}

export default FunctionDetails