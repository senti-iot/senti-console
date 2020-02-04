import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, withStyles, Button } from '@material-ui/core'
import { ItemGrid, SmallCard, ItemG, T, Link } from 'components'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle'
import { MoreVert, Edit, /* PictureAsPdf, Devices, Delete, */ InputIcon, Block, CheckCircle, DeviceHub } from 'variables/icons'
import { withRouter } from 'react-router-dom'
import { useLocalization } from 'hooks'

// @Andrei
const SensorCard = props => {
	const t = useLocalization()
	const [actionAnchor, setActionAnchor] = useState(null)
	const [img, /* setImg */] = useState(null)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		actionAnchor: null,
	// 		img: null
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

	const renderCommunication = (val) => {
		const { classes } = props
		switch (val) {
			case 0:
				return <ItemG container>
					<Block className={classes.blocked + ' ' + classes.icon} />
					<T className={classes.smallText} paragraph={false}>
						{t('sensors.fields.communications.blocked')}
					</T>
				</ItemG>
			case 1:
				return <ItemG container>
					<CheckCircle className={classes.allowed + ' ' + classes.icon} />
					<T className={classes.smallText} paragraph={false}>
						{t('sensors.fields.communications.allowed')}
					</T>
				</ItemG>
			default:
				break;
		}
	}

	const { p, classes } = props

	return (
		<SmallCard
			avatar={< DeviceHub className={classes.bigIcon} />}
			key={p.id}
			title={p.name}
			subheader={p.uuid}
			img={img}
			topAction={
				< ItemGrid noMargin noPadding>
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
						<MenuItem onClick={() => props.history.push(`/sensor/${p.id}/edit`)}>
							<Edit className={classes.leftIcon} />{t('menus.edit')}
						</MenuItem>
					</Menu>
				</ItemGrid >
			}
			content={< ItemG container >
				<ItemG xs={12}>
					<T className={classes.smallText} paragraph={false}>
						<InputIcon className={classes.icon} />
						<Link to={{ pathname: `/sensor/${p.reg_id}` }}>{p.reg_name}</Link>
					</T>
				</ItemG>
				<ItemG xs={12}>
					{renderCommunication(p.communication)}
				</ItemG>
			</ItemG >}
			rightActions={
				< Button variant={'text'} color={'primary'} onClick={() => props.history.push(`/sensor/${p.id}`)}>
					{t('menus.seeMore')}
				</Button >
			}
		/>
	)
}

export default withRouter(withStyles(regularCardStyle)(SensorCard))
