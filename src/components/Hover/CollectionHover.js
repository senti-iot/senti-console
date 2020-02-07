import React, { Fragment, useEffect, useCallback } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import { T, ItemG, Link } from 'components'
import { Star, StarBorder, SignalWifi2Bar, LibraryBooks, DataUsage, Business } from 'variables/icons';
import { useSelector, useDispatch } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';

import { CircularLoader } from 'components';
import { useSnackbar, useLocalization } from 'hooks';
import hoverStyles from 'assets/jss/components/hover/hoverHStyles';




const CollectionHover = props => {
	//Hooks
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = hoverStyles()
	//Redux
	const saved = useSelector(state => state.favorites.saved)

	//State

	//Const
	const { anchorEl, collection } = props

	//useEffect
	const isFavorite = useCallback(id => dispatch(isFav({ id: id, type: 'collection' })), [dispatch])

	useEffect(() => {
		if (saved === true) {
			if (collection) {

				if (isFavorite(collection.id)) {
					s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.collection') })
					dispatch(finishedSaving())
				}
				if (!isFavorite(collection.id)) {
					s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.collection') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [collection, dispatch, props, s, saved, t, isFavorite])

	const addToFavorites = () => {
		const { collection } = props
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: `/collection/${collection.id}`
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		const { collection } = props
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: `/collection/${collection.id}`
		}
		dispatch(removeFromFav(favObj))

	}

	const handleClose = () => {
		props.handleClose()
	};
	const renderIcon = (status) => {
		switch (status) {
			case 1:
				return <SignalWifi2Bar className={classes.yellowSignal + ' ' + classes.smallIcon} />
			case 2:
				return <SignalWifi2Bar className={classes.greenSignal + ' ' + classes.smallIcon} />
			case 0:
				return <SignalWifi2Bar className={classes.redSignal + ' ' + classes.smallIcon} />
			case null:
				return <SignalWifi2Bar className={classes.smallIcon} />
			default:
				break;
		}
	}

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
						{collection !== null ?
							<Fragment>
								<ItemG container style={{ margin: "8px 0" }}>
									<ItemG xs={3} container justify={'center'} alignItems={'center'}>
										<DataUsage className={classes.img} />
									</ItemG>
									<ItemG xs={9} container justify={'center'}>
										<ItemG xs={12}>
											<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
												{collection.name}
											</T>
										</ItemG>
										<ItemG xs={12}>
											<T className={classes.smallText} paragraph={false}>{`${collection.id}`}</T>
										</ItemG>
									</ItemG>
								</ItemG>
								<ItemG xs={12} className={classes.middleContainer}>
									<ItemG xs={12}>
										<T className={classes.smallText} paragraph={false}>
											<Business className={classes.smallIcon} />
											{`${collection.org.name ? collection.org.name : t('devices.fields.free')}`}
										</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText}>
											{renderIcon(collection.activeDeviceStats ? collection.activeDeviceStats.state : null)}
											{collection.activeDeviceStats ?
												<Link to={{ pathname: `/device/${collection.activeDeviceStats.id}`, prevURL: '/collections' }}>
													{collection.activeDeviceStats.id}
												</Link>
												: t('no.device')}
										</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText}>
											<LibraryBooks className={classes.smallIcon} />
											{collection.project.title ? <Link to={{ pathname: `/project/${collection.project.id}`, prevURL: '/collections' }}>
												{collection.project.title}
											</Link> : t('no.project')}
										</T>
									</ItemG>

								</ItemG>
								<Divider />
								<ItemG container style={{ marginTop: '8px' }}>
									<ItemG>
										<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `/collection/${collection.id}/edit`, prevURL: '/collections' }}>
											{t('menus.edit')}
										</Button>
									</ItemG>
									<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
										<Tooltip placement="top" title={isFavorite(collection.id) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
											<IconButton className={classes.smallAction} onClick={isFavorite(collection.id) ? removeFromFavorites : addToFavorites}>
												{isFavorite(collection.id) ? <Star /> : <StarBorder />}
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

export default CollectionHover
