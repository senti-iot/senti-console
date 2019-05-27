import React, { Component } from 'react'
import { IconButton, Menu, MenuItem, withStyles, Button, Typography } from '@material-ui/core'
import { ItemGrid, SmallCard, ItemG, T } from 'components'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle'
import { MoreVert, Edit, /* PictureAsPdf, Devices, Delete, */ InputIcon } from 'variables/icons'
import { withRouter } from 'react-router-dom'

class RegistryCard extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 actionAnchor: null,
		 img: null
	  }
	}

	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	handleEdit = () => {
	}

	handleDeleteRegistry = () => {
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
		const { p, classes, t } = this.props
		const { actionAnchor } = this.state
		return (
			
			<SmallCard
				avatar={<InputIcon />}
				key={p.id}
				title={p.name}
				subheader={p.uuid}
				img={this.state.img}
				topAction={
					<ItemGrid noMargin noPadding>
						<IconButton
							aria-label='More'
							aria-owns={actionAnchor ? 'long-menu' : null}
							aria-haspopup='true'
							onClick={this.handleOpenActionsDetails}>
							<MoreVert />
						</IconButton>
						<Menu
							id='long-menu'
							anchorEl={actionAnchor}
							open={Boolean(actionAnchor)}
							onClose={this.handleCloseActionsDetails}
							PaperProps={{
								style: {
									minWidth: 200
								}
							}}>
							<MenuItem onClick={() => this.props.history.push(`/project/${p.id}/edit`)}>
								<Edit className={classes.leftIcon} />{t('menus.edit')}									
							</MenuItem>
						</Menu>
					</ItemGrid>
				}
				content={<ItemG container>
					<ItemG xs={12}>
						<T className={classes.smallText} noParagraph>
							{`${t('registries.fields.protocol')}: ${this.renderProtocol(p.protocol)}`}
						</T>
					</ItemG>
					<ItemG xs={12}>
						<Typography>{p.description}</Typography>
					</ItemG>

				</ItemG>}
				rightActions={
					<Button variant={'text'} color={'primary'} onClick={() => this.props.history.push({ pathname: `/registry/${p.id}`, prevURL: '/registries/grid' })}>
						{t('menus.seeMore')}
					</Button>
				}
			/>
		)
	}
}

export default withRouter(withStyles(regularCardStyle)(RegistryCard))
