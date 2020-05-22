import React, { useEffect } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core'
import T from 'components/Typography/T'
import ItemG from 'components/Grid/ItemG'
// import Gravatar from 'react-gravatar'
import { Business, Language, Star, StarBorder } from 'variables/icons'
// import withLocalization from 'components/Localization/T';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites'
// import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'
import { useLocalization, useSnackbar } from 'hooks'

// const mapStateToProps = (state) => ({
// 	saved: state.favorites.saved
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

const OrgHover = props => {
	const classes = hoverStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const saved = useSelector(state => state.favorites.saved)

	useEffect(() => {
		if (saved === true) {
			const { org } = props
			if (org) {
				if (dispatch(isFav({ id: org.uuid, type: 'org' }))) {
					s('snackbars.favorite.saved', { name: org.name, type: t('favorites.types.org') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: org.uuid, type: 'org' }))) {
					s('snackbars.favorite.removed', { name: org.name, type: t('favorites.types.org') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, props, s, saved, t])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { org } = this.props
	// 		if (org) {
	// 			if (this.props.isFav({ id: org.uuid, type: 'org' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: org.name, type: this.props.t('favorites.types.org') })
	// 				this.props.finishedSaving()
	// 			}
	// 			if (!this.props.isFav({ id: org.uuid, type: 'org' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: org.name, type: this.props.t('favorites.types.org') })
	// 				this.props.finishedSaving()
	// 			}
	// 		}
	// 	}
	// }
	const addToFavorites = () => {
		const { org } = props
		let favObj = {
			id: org.uuid,
			name: org.name,
			type: 'org',
			path: `/management/org/${org.uuid}`
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		const { org } = props
		let favObj = {
			id: org.uuid,
			name: org.name,
			type: 'org',
			path: `/management/org/${org.uuid}`
		}
		dispatch(removeFromFav(favObj))

	}
	const handleClose = () => {
		props.handleClose()
	}

	const { anchorEl, org } = props
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
								<Business className={classes.img} />
							</ItemG>
							<ItemG xs={9} container justify={'center'}>
								<ItemG xs={12}>
									<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
										{org.name}
									</T>
								</ItemG>
								<ItemG xs={12}>
									<T className={classes.smallText} paragraph={false}>{`${org.address}`}</T>
								</ItemG>
								<ItemG xs={12}>
									<T className={classes.smallText} paragraph={false}>
										{`${org.zip} ${org.city}`}
									</T>
								</ItemG>
							</ItemG>
						</ItemG>
						<Divider />
						<ItemG container style={{ marginTop: '8px' }}>
							<ItemG>
								<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `org/${org.uuid}/edit`, prevURL: '/management/orgs' }}>
									{t('menus.edit')}
								</Button>
							</ItemG>
							<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
								<Tooltip placement="top" title={t('actions.visitWebsite')}>
									<IconButton component={'a'} className={classes.smallAction} href={org.url} rel="noopener noreferrer" target="_blank">
										<Language />
									</IconButton>
								</Tooltip>
								<Tooltip placement="top" title={dispatch(isFav({ id: org.uuid, type: 'org' })) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
									<IconButton className={classes.smallAction} onClick={dispatch(isFav({ id: org.uuid, type: 'org' })) ? removeFromFavorites : addToFavorites}>
										{dispatch(isFav({ id: org.uuid, type: 'org' })) ? <Star /> : <StarBorder />}
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

export default OrgHover
