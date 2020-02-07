import React, { useEffect, Fragment } from 'react'
import { Popper, Paper, withStyles, Fade, /* Divider, Button, IconButton, Tooltip */ } from '@material-ui/core';
// import T from 'components/Typography/T';
// import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { /* Language,  Star, StarBorder,*/ /* SignalWifi2Bar, */ /* LibraryBooks, DataUsage, Business */ } from 'variables/icons';
import withLocalization from 'components/Localization/T';
// import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isFav, /* removeFromFav, */ finishedSaving, /* addToFav */ } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

import { CircularLoader } from 'components';
import { useLocalization, useSnackbar } from 'hooks';

// const mapStateToProps = (state) => ({
// 	saved: state.favorites.saved
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

//@Andrei
const RegistryHover = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const saved = useSelector(state => state.favorites.saved)
	const dispatch = useDispatch()

	useEffect(() => {
		if (saved) {
			const { collection } = props
			if (collection) {

				if (dispatch(isFav({ id: collection.id, type: 'collection' }))) {
					s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.collection') })
					this.props.finishedSaving()
				}
				if (!dispatch(isFav({ id: collection.id, type: 'collection' }))) {
					s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.collection') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, props, s, saved, t])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { collection } = this.props
	// 		if (collection) {

	// 			if (this.props.isFav({ id: collection.id, type: 'collection' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: collection.name, type: this.props.t('favorites.types.collection') })
	// 				this.props.finishedSaving()
	// 			}
	// 			if (!this.props.isFav({ id: collection.id, type: 'collection' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: collection.name, type: this.props.t('favorites.types.collection') })
	// 				this.props.finishedSaving()
	// 			}
	// 		}
	// 	}
	// }

	// const addToFavorites = () => {
	// 	const { collection } = props
	// 	let favObj = {
	// 		id: collection.id,
	// 		name: collection.name,
	// 		type: 'collection',
	// 		path: `/collection/${collection.id}`
	// 	}
	// 	dispatch(addToFav(favObj))
	// }

	// const removeFromFavorites = () => {
	// 	const { collection } = props
	// 	let favObj = {
	// 		id: collection.id,
	// 		name: collection.name,
	// 		type: 'collection',
	// 		path: `/collection/${collection.id}`
	// 	}
	// 	dispatch(removeFromFav(favObj))

	// }
	const handleClose = () => {
		props.handleClose()
	};


	const { /* t, */ anchorEl, classes, collection, /* isFav */ } = props
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
								{/* <ItemG container style={{ margin: "8px 0" }}>
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
												{this.renderIcon(collection.activeDeviceStats ? collection.activeDeviceStats.state : null)}
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
											<Tooltip placement="top" title={isFav({ id: collection.id, type: 'collection' }) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
												<IconButton className={classes.smallAction} onClick={isFav({ id: collection.id, type: 'collection' }) ? this.removeFromFav : this.addToFav}>
													{isFav({ id: collection.id, type: 'collection' }) ? <Star /> : <StarBorder />}
												</IconButton>
											</Tooltip>
										</ItemG>
									</ItemG> */}
							</Fragment>
							: <CircularLoader fill />}
					</Paper>
				</Fade>
			)}
		</Popper>
	)
}

export default withSnackbar()((withLocalization()(withStyles(hoverStyles)(RegistryHover))))
