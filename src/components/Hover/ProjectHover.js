import React, { useEffect } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { /* Language, */ Star, StarBorder, /* SignalWifi2Bar, */ LibraryBooks, Business } from 'variables/icons';
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

const ProjectHover = props => {
	const classes = hoverStyles()
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const saved = useSelector(state => state.favorites.saved)

	useEffect(() => {
		if (saved === true) {
			const { project } = props
			if (dispatch(isFav({ id: project.id, type: 'project' }))) {
				s('snackbars.favorite.saved', { name: project.title, type: t('favorites.types.project') })
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: project.id, type: 'project' }))) {
				s('snackbars.favorite.removed', { name: project.title, type: t('favorites.types.project') })
				dispatch(finishedSaving())
			}
		}
	}, [dispatch, props, s, saved, t])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { project } = this.props
	// 		if (this.props.isFav({ id: project.id, type: 'project' })) {
	// 			this.props.s('snackbars.favorite.saved', { name: project.title, type: this.props.t('favorites.types.project') })
	// 			this.props.finishedSaving()
	// 		}
	// 		if (!this.props.isFav({ id: project.id, type: 'project' })) {
	// 			this.props.s('snackbars.favorite.removed', { name: project.title, type: this.props.t('favorites.types.project') })
	// 			this.props.finishedSaving()
	// 		}
	// 	}
	// }
	const addToFavorites = () => {
		const { project } = props
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		const { project } = props
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
		}
		dispatch(removeFromFav(favObj))

	}
	const handleClose = () => {
		props.handleClose()
	};

	// const renderIcon = (status) => {
	// 	const { classes } = props
	// 	switch (status) {
	// 		case 1:
	// 			return <SignalWifi2Bar className={classes.yellowSignal + ' ' + classes.smallIcon} />
	// 		case 2:
	// 			return <SignalWifi2Bar className={classes.greenSignal + ' ' + classes.smallIcon} />
	// 		case 0:
	// 			return <SignalWifi2Bar className={classes.redSignal + ' ' + classes.smallIcon} />
	// 		case null:
	// 			return <SignalWifi2Bar className={classes.smallIcon} />
	// 		default:
	// 			break;
	// 	}
	// }

	const { anchorEl, project } = props
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
								<LibraryBooks className={classes.img} />
							</ItemG>
							<ItemG xs={9} container justify={'center'}>
								<ItemG xs={12}>
									<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
										{project.title}
									</T>
								</ItemG>
								<ItemG xs={12}>
									<T className={classes.smallText} paragraph={false}>{`${project.id}`}</T>
								</ItemG>
							</ItemG>
						</ItemG>
						<ItemG xs={12} className={classes.middleContainer}>
							<ItemG xs={12}>
								<T className={classes.smallText} paragraph={false}>
									<Business className={classes.smallIcon} />
									{`${project.org.name ? project.org.name : t('no.org')}`}
								</T>
							</ItemG>
							<ItemG xs={12}>
								<T className={classes.smallText}>
									{project.description}
								</T>
							</ItemG>
						</ItemG>
						<Divider />
						<ItemG container style={{ marginTop: '8px' }}>
							<ItemG>
								<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `/project/${project.id}/edit`, prevURL: '/projects' }}>
									{t('menus.edit')}
								</Button>
							</ItemG>
							<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
								{/* <Tooltip placement="top" title={t('actions.visitWebsite')}>
										<IconButton component={'a'} className={classes.smallAction} href={device.url} rel="noopener noreferrer" target="_blank">
											<Language />
										</IconButton>
									</Tooltip> */}
								<Tooltip placement="top" title={dispatch(isFav({ id: project.id, type: 'project' })) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
									<IconButton className={classes.smallAction} onClick={dispatch(isFav({ id: project.id, type: 'project' })) ? removeFromFavorites : addToFavorites}>
										{dispatch(isFav({ id: project.id, type: 'project' })) ? <Star /> : <StarBorder />}
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

export default ProjectHover
