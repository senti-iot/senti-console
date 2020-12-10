import { Caption, ItemG, Info, Link } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React from 'react';
import { DataUsage, Edit, Star, StarBorder, Delete } from 'variables/icons';
import { useSelector } from 'react-redux'
import { useLocalization, useHistory, useAuth } from 'hooks';

const RegistryDetails = props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	const Auth = useAuth()
	const hasAccess = Auth.hasAccess
	//Redux
	const detailsPanel = useSelector(store => store.settings.detailsPanel)

	//State

	//Const
	const { registry, isFav, addToFav, removeFromFav, handleOpenDeleteDialog } = props

	//useCallbacks

	//useEffects

	//Handlers


	const renderProtocol = (id) => {
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

	return (
		<InfoCard
			title={registry.name ? registry.name : registry.uuid}
			avatar={<DataUsage />}
			noExpand
			expanded={Boolean(detailsPanel)}
			topAction={<Dropdown menuItems={
				[
					{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
					{ isDivider: true },
					{ disabled: !hasAccess(registry.uuid, 'registry.modify'), label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `/registry/${registry.uuid}/edit`, prevURL: `/registry/${registry.uuid}` }) },
					{ disabled: !hasAccess(registry.uuid, 'registry.delete'), label: t('menus.delete'), icon: Delete, func: handleOpenDeleteDialog }
				]
			} />

			}
			// subheader={<ItemG container alignItems={'center'}>

			// </ItemG>}
			content={
				<ItemG container >

					{/* <ItemG xs={12} md>
						<Caption>{t('registries.fields.uuid')}</Caption>
						<Info>{registry.uuid}</Info>
					</ItemG> */}
					<ItemG xs={6}>
						<Caption>{t('registries.fields.uuid')}:</Caption>
						<Info>
							{registry.uuid}
						</Info>
					</ItemG>
					<ItemG xs={6}>
						<Caption>{t('devices.fields.uuname')}:</Caption>
						<Info>
							{registry.uuname}
						</Info>
					</ItemG>
					<ItemG xs={12} md>
						<Caption>{t('registries.fields.protocol')}</Caption>
						<Info>{renderProtocol(registry.protocol)}</Info>
					</ItemG>
					{registry.description ? <ItemG xs={12}>
						<Caption>{t('registries.fields.description')}</Caption>
						<Info>{registry.description}</Info>
					</ItemG> : null}
					<ItemG xs={12}>
						<Caption>{t('orgs.fields.name')}</Caption>
						<Info>
							<Link to={{ pathname: `/management/org/${registry.org.uuid}`, prevURL: `/management/user/${registry.uuid}` }}>
								{registry.org ? registry.org.name : t('users.noOrg')}
							</Link>
						</Info>
					</ItemG>
				</ItemG>
			}
			hiddenContent={
				<ItemG container spacing={3}>
				</ItemG>} />
	)
}

export default RegistryDetails