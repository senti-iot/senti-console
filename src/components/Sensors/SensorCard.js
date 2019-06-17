import React, { Component } from 'react'
import { IconButton, Menu, MenuItem, withStyles, Button } from '@material-ui/core'
import { ItemGrid, SmallCard, ItemG, T } from 'components'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle'
import { MoreVert, Edit, /* PictureAsPdf, Devices, Delete, */ InputIcon, Block, CheckCircle, DeviceHub } from 'variables/icons'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

class SensorCard extends Component {
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

	handleDeleteSensor = () => {
	}
	renderCommunication = (val) => {
		const { t, classes } = this.props
		switch (val) {
			case 0:
				return <ItemG container>
					<Block className={classes.blocked + ' ' + classes.icon} /> 
					<T className={classes.smallText} noParagraph>
						{t('sensors.fields.communications.blocked')}	
					</T>
				</ItemG>
			case 1:
				return <ItemG container>
					<CheckCircle className={classes.allowed + ' ' + classes.icon} />
					<T className={classes.smallText} noParagraph>
						{t('sensors.fields.communications.allowed')}
					</T>
				</ItemG>
			default:
				break;
		}
	}
	render() {
		const { p, classes, t } = this.props
		const { actionAnchor } = this.state
		return (
			
			<SmallCard
				avatar={<DeviceHub className={classes.bigIcon} />}
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
							<MenuItem onClick={() => this.props.history.push(`/sensor/${p.id}/edit`)}>
								<Edit className={classes.leftIcon} />{t('menus.edit')}									
							</MenuItem>
						</Menu>
					</ItemGrid>
				}
				content={<ItemG container>
					<ItemG xs={12}>
						<T className={classes.smallText} noParagraph>
							<InputIcon className={classes.icon} />
							<Link to={{ pathname: `/sensor/${p.reg_id}` }}>{p.reg_name}</Link>
						</T>
					</ItemG>
					<ItemG xs={12}>
						{this.renderCommunication(p.communication)}
					</ItemG>
				</ItemG>}
				rightActions={
					<Button variant={'text'} color={'primary'} onClick={() => this.props.history.push(`/sensor/${p.id}`)}>
						{t('menus.seeMore')}
					</Button>
				}
			/>
		)
	}
}

export default withRouter(withStyles(regularCardStyle)(SensorCard))
