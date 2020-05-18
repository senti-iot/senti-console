import React, { useState, useEffect } from 'react'
import { withStyles, IconButton, Menu, MenuItem, Button } from '@material-ui/core'
import { ItemGrid, SmallCard, ItemG, Info, Caption } from 'components'
import { MoreVert, Edit, SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import { Link } from 'react-router-dom'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle'
import { useLocalization } from 'hooks'

/**
 * TODO
 * @Andrei
 */
const DeviceCard = props => {
	const t = useLocalization()
	const [actionAnchor, setActionAnchor] = useState(null)
	// const [img, setImg] = useState(null)
	// let _isMounted // this value may be lost after each render



	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		actionAnchor: null,
	// 		img: null
	// 	}
	// }

	useEffect(() => {
		// _isMounted = 1

		return () => {
			// _isMounted = 0
		}
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// }

	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }

	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
		// this.setState({ actionAnchor: event.currentTarget });
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null });
	}

	const renderIcon = (status) => {
		const { classes } = props
		switch (status) {
			case 1:
				return <div title={t('devices.status.yellow')}><SignalWifi2Bar className={classes.yellowSignal} /></div>
			case 2:
				return <div title={t('devices.status.green')}><SignalWifi2Bar className={classes.greenSignal} /></div>
			case 0:
				return <div title={t('devices.status.red')}><SignalWifi2Bar className={classes.redSignal} /></div>
			case null:
				return <SignalWifi2BarLock />
			default:
				break
		}
	}

	const { d, classes } = props
	return (
		<SmallCard
			// whiteAvatar
			key={d.id}
			title={d.name ? d.name : d.id}
			avatar={renderIcon(d.liveStatus)}
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
						PaperProps={{ style: { minWidth: 200 } }}>
						<MenuItem component={Link} to={`/device/${d.id}/edit`} style={{ color: 'black' }}>
							<Edit className={classes.leftIcon} />{t('menus.edit')}
						</MenuItem>
					</Menu>
				</ItemGrid>
			}
			content={<ItemGrid container>
				<ItemG xs={6}>
					<Caption>{t('devices.fields.temp')}</Caption>
					<Info>{d.temperature ? `${d.temperature}\u2103` : `-\u2103`}</Info>
				</ItemG>
				<ItemG xs={12}>
					<Caption>{t('devices.fields.address')}</Caption>
					<Info>{d.address ? d.address : t('devices.noAddress')}</Info>
				</ItemG>
			</ItemGrid>}
			rightActions={
				<Button variant={'text'} color={'primary'} component={Link} to={`/device/${d.id}`}>
					{t('menus.seeMore')}
				</Button>
			}
		/>
	)
}

export default withStyles(regularCardStyle)(DeviceCard)
