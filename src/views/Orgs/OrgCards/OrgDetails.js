import React, { useState } from 'react'
import { InfoCard, ItemGrid, Caption, Info, Dropdown, Muted } from 'components';
import { Grid, Link } from '@material-ui/core';
import { Business, Edit, Delete, StarBorder, Star } from 'variables/icons'
import { Link as RLink } from 'react-router-dom'
import { useLocalization } from 'hooks'
var countries = require('i18n-iso-countries')

const OrgDetails = props => {
	const t = useLocalization()
	const [/* actionAnchor */, setActionAnchor] = useState(null)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		actionAnchor: null
	// 	}
	// }

	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
		// this.setState({ actionAnchor: event.currentTarget });
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null });
	}
	const handleDeleteOrg = () => {
		handleCloseActionsDetails()
		props.deleteOrg()
	}
	const handleEdit = () => props.history.push({ pathname: `${props.match.url}/edit`, prevURL: `/management/org/${props.org.id}` })

	const options = () => {
		const { accessLevel, classes, isFav, addToFav, removeFromFav } = props
		let allOptions = [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: <Edit className={classes.leftIcon} /> },
			{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav },
			{ label: t('menus.delete'), func: handleDeleteOrg, icon: <Delete className={classes.leftIcon} /> },

		]
		if (accessLevel.apiorg.edit)
			return allOptions
		else return [
			{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav },

		]
	}


	const { org, devices } = props
	return (
		<InfoCard
			title={org.name}
			avatar={<Business />}
			subheader={
				<Muted>
					{org.nickname}
				</Muted>}
			noExpand
			topAction={options().length > 0 ? <Dropdown
				menuItems={
					options()
				} /> : null}
			content={
				<Grid container>
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
							{org.country.length === 2 ? countries.getName(org.country, props.language)
								: org.country}
						</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>
							{t('orgs.fields.url')}
						</Caption>
						<Info>
							<Link href={org.url} target={'_blank'}>
								{org.url}
							</Link>
						</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>
							{t('orgs.fields.deviceCount')}
						</Caption>
						<Info>
							{devices}
						</Info>
					</ItemGrid>
					{org.org.id > 0 ?
						<ItemGrid xs={12}>
							<Caption>
								{t('orgs.fields.parentOrg')}
							</Caption>
							<Info>
								<Link component={RLink} to={{ pathname: `/management/org/${org.org.id}`, prevURL: `/management/org/${org.id}` }}>
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
