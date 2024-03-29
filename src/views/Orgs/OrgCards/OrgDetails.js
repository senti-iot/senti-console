import React from 'react'
import { InfoCard, ItemGrid, Caption, Info, Dropdown, Muted } from 'components'
import { Grid, Link } from '@material-ui/core'
import { Business, Edit, Delete, StarBorder, Star } from 'variables/icons'
import { Link as RLink } from 'react-router-dom'
import { useAuth } from 'hooks'
var countries = require('i18n-iso-countries')

const OrgDetails = props => {
	//Hooks
	const hasAccess = useAuth().hasAccess

	//Redux

	//State

	//Const
	const { org, /* devices, */ /* accessLevel, */ isFav, addToFav, removeFromFav, t, history, match, deleteOrg, language } = props

	//useCallbacks

	//useEffects

	//Handlers


	const handleDeleteOrg = () => deleteOrg()
	const handleEdit = () => history.push({ pathname: `${match.url}/edit`, prevURL: `/management/org/${org.uuid}` })

	const options = () => {
		let allOptions = [
			{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
			{ isDivider: true },
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit, disabled: !hasAccess(org.uuid, 'org.modify') },
			{ label: t('menus.delete'), func: handleDeleteOrg, icon: Delete, disabled: !hasAccess(org.uuid, 'org.delete') },

		]
		/**TODO @Andrei */
		// if (accessLevel.apiorg.edit)
		return allOptions
		// else return [
		// 	{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },

		// ]
	}
	return (
		<InfoCard
			title={org.name}
			avatar={<Business />}
			subheader={
				<Muted>
					{org.nickname}
				</Muted>}
			noExpand
			topAction={options().length > 0 ? <Dropdown menuItems={options()} /> : null}
			content={
				<Grid container>
					<ItemGrid xs={4}>
						<Caption>
							{t('orgs.fields.orgDevices')}
						</Caption>
						<Info >
							{org.totalDevices?.orgDevices}
						</Info>
					</ItemGrid>
					<ItemGrid xs={4}>
						<Caption>
							{t('orgs.fields.subOrgDevices')}
						</Caption>
						<Info >
							{org.totalDevices?.subOrgDevices.reduce((a, b) => (a = a + b.total), 0)}
						</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>
							{t('orgs.fields.totalDevices')}
						</Caption>
						<Info >
							{org.totalDevices?.subOrgDevices.reduce((a, b) => (a = a + b.total), 0) + org.totalDevices?.orgDevices}
						</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>
							{t('orgs.fields.address')}
						</Caption>
						<Info >
							{org.address}
						</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>
							{t('orgs.fields.zip')}
						</Caption>
						<Info>
							{org.zip}
						</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>
							{t('orgs.fields.city')}
						</Caption>
						<Info>
							{org.city}
						</Info>
					</ItemGrid>

					<ItemGrid xs={12} />
					<ItemGrid>
						<Caption>
							{t('orgs.fields.region')}
						</Caption>
						<Info>
							{org.region}
						</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>
							{t('orgs.fields.country')}
						</Caption>
						<Info>
							{org.country?.length === 2 ? countries.getName(org.country, language)
								: org.country}
						</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>
							{t('orgs.fields.url')}
						</Caption>
						<Info>
							<Link href={org.website ? org.website : ''} target={'_blank'}>
								{org.website ? org.website : ''}
							</Link>
						</Info>
					</ItemGrid>
					{/* <ItemGrid xs={12}>
						<Caption>
							{t('orgs.fields.deviceCount')}
						</Caption>
						<Info>
							{devices}
						</Info>
					</ItemGrid> */}
					{org.org.uuid ?
						<ItemGrid xs={12}>
							<Caption>
								{t('orgs.fields.parentOrg')}
							</Caption>
							<Info>
								<Link component={RLink} to={{ pathname: `/management/org/${org.org.uuid}`, prevURL: `/management/org/${org.uuid}` }}>
									{org.org.name}
								</Link>
							</Info>
						</ItemGrid> : null}
					<ItemGrid>
						<Caption>
							{t('orgs.fields.CVR')}
						</Caption>
						<Info>
							{org.aux ? org.aux.cvr : null}
						</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>
							{t('orgs.fields.EAN')}
						</Caption>
						<Info>
							{org.aux ? org.aux.ean : null}
						</Info>
					</ItemGrid>
				</Grid>
			}
		/>
	)
}

export default OrgDetails
