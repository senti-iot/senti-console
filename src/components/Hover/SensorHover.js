import React, { useEffect, Fragment } from 'react'
import { Popper, Paper, withStyles, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core'
// import T from 'components/Typography/T';
// import ItemG from 'components/Grid/ItemG';
import { T, ItemG, Link } from 'components'
// import Gravatar from 'react-gravatar'
import { Star, StarBorder, Block, CheckCircle, DeviceHub, InputIcon } from 'variables/icons';
import withLocalization from 'components/Localization/T';
import { Link as RLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

import { CircularLoader } from 'components';
import { useSnackbar, useLocalization } from 'hooks';


const SensorHover = props => {
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const saved = useSelector(state => state.favorites.saved)
	const { anchorEl, classes, device } = props

	useEffect(() => {
		if (saved === true) {
			if (device) {

				if (dispatch(isFav({ id: device.id, type: 'sensor' }))) {
					s('snackbars.favorite.saved', { name: device.name, type: t('favorites.types.sensor') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: device.id, type: 'sensor' }))) {
					s('snackbars.favorite.removed', { name: device.name, type: t('favorites.types.sensor') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, s, saved, t, device])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { device } = this.props
	// 		if (device) {

	// 			if (this.props.isFav({ id: device.id, type: 'sensor' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: device.name, type: this.props.t('favorites.types.sensor') })
	// 				this.props.finishedSaving()
	// 			}
	// 			if (!this.props.isFav({ id: device.id, type: 'sensor' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: device.name, type: this.props.t('favorites.types.sensor') })
	// 				this.props.finishedSaving()
	// 			}
	// 		}
	// 	}
	// }
	const addToFavorites = () => {
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'sensor',
			path: `/sensor/${device.id}`
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'sensor',
			path: `/sensor/${device.id}`
		}
		dispatch(removeFromFav(favObj))
	}
	const isFavorite = () => {
		console.log(device.id, dispatch(isFav({ id: device.id, type: 'sensor' })))
		return dispatch(isFav({ id: device.id, type: 'sensor' }))
	}
	const handleClose = () => {
		props.handleClose()
	};
	const renderCommunication = (val) => {
		switch (val) {
			case 0:
				return <ItemG container>
					<Block className={classes.blocked + ' ' + classes.smallIcon} />
					<T className={classes.smallText} paragraph={false}>
						{t('sensors.fields.communications.blocked')}
					</T>
				</ItemG>
			case 1:
				return <ItemG container>
					<CheckCircle className={classes.allowed + ' ' + classes.smallIcon} />
					<T className={classes.smallText} paragraph={false}>
						{t('sensors.fields.communications.allowed')}
					</T>
				</ItemG>
			default:
				break;
		}
	}
	// const renderSmallCommunication = (val) => {
	// 	switch (val) {
	// 		case 0:
	// 			return <ItemG container><Block className={classes.blocked + ' ' + classes.smallIcon} /></ItemG>
	// 		case 1:
	// 			return <ItemG container><CheckCircle className={classes.allowed + ' ' + classes.smallIcon} /></ItemG>
	// 		default:
	// 			break;
	// 	}
	// }

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
						{device !== null ?
							<Fragment>
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
											<T className={classes.smallText} paragraph={false}>{`${device.uuid}`}</T>
										</ItemG>
									</ItemG>
								</ItemG>
								<ItemG xs={12} className={classes.middleContainer}>
									<ItemG xs={12}>
										<T className={classes.smallText} paragraph={false}>
											<InputIcon className={classes.smallIcon} />
											<Link to={{ pathname: `/registry/${device.reg_id}` }}>{device.reg_name}</Link>
										</T>
									</ItemG>
									<ItemG xs={12}>
										{renderCommunication(device.communication)}
									</ItemG>
								</ItemG>

								<Divider />
								<ItemG container style={{ marginTop: '8px' }}>
									<ItemG>
										<Button color={'primary'} variant={'text'} component={RLink} to={{ pathname: `/sensor/${device.id}/edit`, prevURL: '/sensors' }}>
											{t('menus.edit')}
										</Button>
									</ItemG>
									<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
										<Tooltip placement="top" title={isFavorite() ? t('menus.favorites.remove') : t('menus.favorites.add')}>
											<IconButton className={classes.smallAction} onClick={isFavorite() ? removeFromFavorites : addToFavorites}>
												{isFavorite() ? <Star /> : <StarBorder />}
											</IconButton>
										</Tooltip>
									</ItemG>
								</ItemG>
							</Fragment>
							: <CircularLoader fill />}
					</Paper>
				</Fade>
			)
			}
		</Popper >
	)
}

export default withSnackbar()((withLocalization()(withStyles(hoverStyles)(SensorHover))))
