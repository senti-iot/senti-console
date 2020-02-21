import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, withStyles, Button, Typography } from '@material-ui/core'
import { ItemGrid, SmallCard, ItemG, T, Caption } from 'components'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle'
import { MoreVert, Edit, /* PictureAsPdf, Devices, Delete, */ InputIcon } from 'variables/icons'
import { withRouter } from 'react-router-dom'
import { useLocalization } from 'hooks'

const RegistryCard = props => {
	const t = useLocalization()
	const [actionAnchor, setActionAnchor] = useState(null)
	const [img, /*setImg*/] = useState(null)
	// constructor(props) {
	//   super(props)

	//   this.state = {
	// 	 actionAnchor: null,
	// 	 img: null
	//   }
	// }

	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
		// this.setState({ actionAnchor: event.currentTarget });
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null });
	}

	// handleEdit = () => {
	// }

	// handleDeleteRegistry = () => {
	// }
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

	const { p, classes } = props
	return (
		<SmallCard
			avatar={<InputIcon />}
			key={p.id}
			title={p.name}
			subheader={<ItemG><Caption>
				{p.uuid}
			</Caption></ItemG>}
			img={img}
			topAction={
				<ItemGrid noMargin noPadding>
					<IconButton
						aria-label='More'
						aria-owns={actionAnchor ? 'long-menu' : null}
						aria-haspopup='true'
						onClick={handleOpenActionsDetails}>
						<MoreVert />
					</IconButton>
					<Menu
						id='long-menu'
						anchorEl={actionAnchor}
						open={Boolean(actionAnchor)}
						onClose={handleCloseActionsDetails}
						PaperProps={{
							style: {
								minWidth: 200
							}
						}}>
						<MenuItem onClick={() => props.history.push(`/project/${p.id}/edit`)}>
							<Edit className={classes.leftIcon} />{t('menus.edit')}
						</MenuItem>
					</Menu>
				</ItemGrid>
			}
			content={<ItemG container>
				<ItemG xs={12}>
					<T className={classes.smallText} paragraph={false}>
						{`${t('registries.fields.protocol')}: ${renderProtocol(p.protocol)}`}
					</T>
				</ItemG>
				<ItemG xs={12}>
					<Typography>{p.description}</Typography>
				</ItemG>

			</ItemG>}
			rightActions={
				<Button variant={'text'} color={'primary'} onClick={() => props.history.push({ pathname: `/registry/${p.id}`, prevURL: '/registries/grid' })}>
					{t('menus.seeMore')}
				</Button>
			}
		/>
	)
}

export default withRouter(withStyles(regularCardStyle)(RegistryCard))
