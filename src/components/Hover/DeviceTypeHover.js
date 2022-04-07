import React, { useEffect, Fragment } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
import { Star, StarBorder, /* SignalWifi2Bar, */ Memory, Business, /* LibraryBooks, DataUsage, Business */ } from 'variables/icons'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

import { CircularLoader } from 'components';
import { useLocalization, useSnackbar } from 'hooks';


const DeviceTypeHover = props => {
	const classes = hoverStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const saved = useSelector(state => state.favorites.saved)

	const { anchorEl, devicetype } = props

	useEffect(() => {
		if (saved === true) {
			if (devicetype) {

				if (dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' }))) {
					s('snackbars.favorite.saved', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' }))) {
					s('snackbars.favorite.removed', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, devicetype, s, saved, t])

	const addToFavorites = () => {
		const { devicetype } = props
		let favObj = {
			id: devicetype.uuid,
			name: devicetype.name,
			type: 'devicetype',
			path: `/devicetype/${devicetype.uuid}`,
			orgName: devicetype.org.name,
			orgUUID: devicetype.org.uuid
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		const { devicetype } = props
		let favObj = {
			id: devicetype.uuid,
			name: devicetype.name,
			type: 'devicetype',
			path: `/devicetype/${devicetype.uuid}`,
			orgName: devicetype.org.name,
			orgUUID: devicetype.org.uuid
		}
		dispatch(removeFromFav(favObj))

	}
	const handleClose = () => {
		props.handleClose()
	};


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
						{devicetype !== null ?
							<Fragment>
								<ItemG container style={{ margin: "8px 0" }}>
									<ItemG xs={3} container justify={'center'} alignItems={'center'}>
										<Memory className={classes.img} />
									</ItemG>
									<ItemG xs={9} container justify={'center'}>
										<ItemG xs={12}>
											<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
												{devicetype.name}
											</T>
										</ItemG>
									</ItemG>
								</ItemG>
								<ItemG xs={12} className={classes.middleContainer}>
									<ItemG xs={12}>
										<T className={classes.smallText} paragraph={false}>
											<Business className={classes.smallIcon} />
											{devicetype.org.name}
										</T>
									</ItemG>
								</ItemG>
								<Divider />
								<ItemG container style={{ marginTop: '8px' }}>
									<ItemG>
										<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `/devicetype/${devicetype.uuid}/edit`, prevURL: '/devicetypes' }}>
											{t('menus.edit')}
										</Button>
									</ItemG>
									<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
										<Tooltip placement="top" title={dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' })) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
											<IconButton className={classes.smallAction} onClick={dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' })) ? removeFromFavorites : addToFavorites}>
												{dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' })) ? <Star /> : <StarBorder />}
											</IconButton>
										</Tooltip>
									</ItemG>
								</ItemG>
							</Fragment>
							: <CircularLoader fill />}
					</Paper>
				</Fade>
			)}
		</Popper>
	)
}

export default DeviceTypeHover
