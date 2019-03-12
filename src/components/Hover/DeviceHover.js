import React, { Component } from 'react'
import { Popper, Paper, withStyles, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { /* Language, */ Star, StarBorder, LocationOn, DeviceHub, SignalWifi2Bar } from 'variables/icons';
import withLocalization from 'components/Localization/T';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

class DeviceHover extends Component {
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { device } = this.props
			if (this.props.isFav({ id: device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.saved', { name: device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: device.id, type: 'device' })) {
				this.props.s('snackbars.favorite.removed', { name: device.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
			}
		}
	}
	addToFav = () => {
		const { device } = this.props
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { device } = this.props
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		this.props.removeFromFav(favObj)

	}
	handleClose = () => {
		this.props.handleClose()
	};
	renderIcon = (status) => {
		const { classes } = this.props
		switch (status) {
			case 1:
				return <SignalWifi2Bar className={classes.yellowSignal + ' ' + classes.smallIcon} />
			case 2:
				return <SignalWifi2Bar className={classes.greenSignal + ' ' + classes.smallIcon} />
			case 0:
				return <SignalWifi2Bar className={classes.redSignal + ' ' + classes.smallIcon} />
			case null:
				return <SignalWifi2Bar />
			default:
				break;
		}
	}
	render() {
		const { t, anchorEl, classes, device, isFav } = this.props
		return (
			<Popper
				style={{ zIndex: 1040 }}
				disablePortal
				id="simple-popover"
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={this.handleClose}
				placement={'top-start'}
				onMouseLeave={this.handleClose}
				transition
			>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps} timeout={250}>
						<Paper className={classes.paper}>
							<ItemG container style={{ margin: "8px 0" }}>
								<ItemG xs={3} container justify={'center'} alignItems={'center'}>
									<DeviceHub className={classes.img} />
								</ItemG>
								<ItemG xs={9} container justify={'center'}>
									<ItemG xs={12}>
										<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
											{device.name}
										</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText} noParagraph>{`${device.id}`}</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText} noParagraph>
											{`${device.org.name ? device.org.name : t('devices.fields.free')}`}
										</T>
									</ItemG>
								</ItemG>
							</ItemG>
							<ItemG xs={12} className={classes.middleContainer}>
								<ItemG xs={12}>
									<T className={classes.smallText}>
										{this.renderIcon(device.liveStatus)}
										{t(`devices.status.${device.liveStatus === 0 ? 'red' : device.liveStatus === 1 ? 'yellow' : 'green'}`)}
									</T>
								</ItemG>
								{device.address ?
									<ItemG xs={12}>
										<T className={classes.smallText}>
											<LocationOn className={classes.smallIcon}/>
											{device.address}
										</T>
									</ItemG>
									: null}
							</ItemG>
							<Divider />
							<ItemG container style={{ marginTop: '8px' }}>
								<ItemG>
									<Button color={'primary'} variant={'text'} component={Link} to={`/device/${device.id}/edit`}>
										{t('menus.edit')}
									</Button>
								</ItemG>
								<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
									{/* <Tooltip placement="top" title={t('actions.visitWebsite')}>
										<IconButton component={'a'} className={classes.smallAction} href={device.url} rel="noopener noreferrer" target="_blank">
											<Language />
										</IconButton>
									</Tooltip> */}
									<Tooltip placement="top" title={isFav({ id: device.id, type: 'device' }) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
										<IconButton className={classes.smallAction} onClick={isFav({ id: device.id, type: 'device' }) ? this.removeFromFav : this.addToFav}>
											{isFav({ id: device.id, type: 'device' }) ? <Star /> : <StarBorder />}
										</IconButton>
									</Tooltip>
								</ItemG>
							</ItemG>
						</Paper>
					</Fade>
				)}
			</Popper>
		)
	}
}
const mapStateToProps = (state) => ({
	saved: state.favorites.saved
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()((withLocalization()(withStyles(hoverStyles)(DeviceHover)))))
