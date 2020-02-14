import React, { useEffect } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { /* Language, */ Star, StarBorder, LocationOn, DeviceHub, SignalWifi2Bar, Business } from 'variables/icons';
// import withLocalization from 'components/Localization/T';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
// import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'
import { useSnackbar, useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	saved: state.favorites.saved
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

const DeviceHover = props => {
	const classes = hoverStyles()
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const saved = useSelector(store => store.favorites.saved)


	useEffect(() => {
		if (saved) {
			const { device } = props
			if (device) {
				if (dispatch(isFav({ id: device.id, type: 'device' }))) {
					s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.device') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: device.id, type: 'device' }))) {
					s('snackbars.favorite.removed', { name: device.name, type: this.props.t('favorites.types.device') })
					dispatch(finishedSaving())
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saved])
	// const componentDidUpdate = () => {
	// 	if (saved === true) {
	// 		const { device } = props
	// 		if (device) {
	// 			if (dispatch(isFav({ id: device.id, type: 'device' }))) {
	// 				s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.device') })
	// 				this.props.finishedSaving()
	// 			}
	// 			if (!dispatch(isFav({ id: device.id, type: 'device' }))) {
	// 				s('snackbars.favorite.removed', { name: device.name, type: this.props.t('favorites.types.device') })
	// 				dispatch(finishedSaving())
	// 			}
	// 		}
	// 	}
	// }
	const addToFavFunc = () => {
		const { device } = props
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavFunc = () => {
		const { device } = props
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		dispatch(removeFromFav(favObj))

	}
	const handleClose = () => {
		props.handleClose()
	};
	const renderIcon = (status) => {
		const { classes } = props
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

	const { anchorEl, device } = props
	return (
		<Popper
			style={{ zIndex: 1040 }}
			disablePortal
			id="simple-popover"
			open={Boolean(anchorEl)}
			anchorEl={anchorEl}
			onClose={handleClose}
			placement={'top-start'}
			onMouseLeave={handleClose}
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
									<T className={classes.smallText} paragraph={false}>{`${device.id}`}</T>
								</ItemG>

							</ItemG>
						</ItemG>
						<ItemG xs={12} className={classes.middleContainer}>
							<ItemG xs={12}>
								<T className={classes.smallText} paragraph={false}>
									<Business className={classes.smallIcon} />
									{`${device.org.name ? device.org.name : t('devices.fields.free')}`}
								</T>
							</ItemG>
							<ItemG xs={12}>
								<T className={classes.smallText}>
									{renderIcon(device.liveStatus)}
									{t(`devices.status.${device.liveStatus === 0 ? 'red' : device.liveStatus === 1 ? 'yellow' : 'green'}`)}
								</T>
							</ItemG>
							{device.address ?
								<ItemG xs={12}>
									<T className={classes.smallText}>
										<LocationOn className={classes.smallIcon} />
										{device.address}
									</T>
								</ItemG>
								: null}
						</ItemG>
						<Divider />
						<ItemG container style={{ marginTop: '8px' }}>
							<ItemG>
								<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `/device/${device.id}/edit`, prevURL: '/devices' }}>
									{t('menus.edit')}
								</Button>
							</ItemG>
							<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
								<Tooltip placement="top" title={dispatch(isFav({ id: device.id, type: 'device' })) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
									<IconButton className={classes.smallAction} onClick={isFav({ id: device.id, type: 'device' }) ? removeFromFavFunc : addToFavFunc}>
										{dispatch(isFav({ id: device.id, type: 'device' })) ? <Star /> : <StarBorder />}
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

export default DeviceHover
