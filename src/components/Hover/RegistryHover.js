import React, { useEffect, Fragment, useCallback } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core'
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
import { Star, StarBorder, Business, InputIcon } from 'variables/icons';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';

import { CircularLoader } from 'components';
import { useLocalization, useSnackbar } from 'hooks';
import hoverStyles from 'assets/jss/components/hover/hoverHStyles';


const RegistryHover = props => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const classes = hoverStyles()

	//Redux
	const saved = useSelector(state => state.favorites.saved)

	//State

	//Const
	const { anchorEl, registry } = props

	//useCallbacks
	const isFavorite = useCallback(uuid => dispatch(isFav({ id: uuid, type: 'registry' })), [dispatch])

	//useEffects

	useEffect(() => {
		if (saved === true) {
			if (registry) {

				if (isFavorite(registry.uuid)) {
					s('snackbars.favorite.saved', { name: registry.name, type: t('favorites.types.registry') })
					dispatch(finishedSaving())
				}
				if (!isFavorite(registry.uuid)) {
					s('snackbars.favorite.removed', { name: registry.name, type: t('favorites.types.registry') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, registry, s, saved, t, isFavorite])

	//Handlers

	const addToFavorites = () => {
		const { registry } = props
		let favObj = {
			id: registry.uuid,
			name: registry.name,
			type: 'registry',
			path: `/registry/${registry.uuid}`,
			orgName: registry.org.name,
			orgUUID: registry.org.uuid,
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		const { registry } = props
		let favObj = {
			id: registry.uuid,
			name: registry.name,
			type: 'registry',
			path: `/registry/${registry.uuid}`
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
						{registry !== null ?
							<Fragment>
								<ItemG container style={{ margin: "8px 0" }}>
									<ItemG xs={3} container justify={'center'} alignItems={'center'}>
										<InputIcon className={classes.img} />
									</ItemG>
									<ItemG xs={9} container justify={'center'}>
										<ItemG xs={12}>
											<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
												{registry.name}
											</T>
										</ItemG>
										<ItemG xs={12}>
											<T className={classes.smallText} paragraph={false}>{`${registry.uuid}`}</T>
										</ItemG>
									</ItemG>
								</ItemG>
								<ItemG xs={12} className={classes.middleContainer}>
									<ItemG xs={12}>
										<T className={classes.smallText} paragraph={false}>
											<Business className={classes.smallIcon} />
											{registry.customer_name}
										</T>
									</ItemG>
								</ItemG>
								<Divider />
								<ItemG container style={{ marginTop: '8px' }}>
									<ItemG>
										<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `/registry/${registry.uuid}/edit`, prevURL: '/registries' }}>
											{t('menus.edit')}
										</Button>
									</ItemG>
									<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
										<Tooltip placement="top" title={isFavorite(registry.uuid) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
											<IconButton className={classes.smallAction} onClick={isFavorite(registry.uuid) ? removeFromFavorites : addToFavorites}>
												{isFavorite(registry.uuid) ? <Star /> : <StarBorder />}
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

export default RegistryHover
