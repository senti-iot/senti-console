import React, { Component } from 'react'
import { Popper, Paper, withStyles, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { /* Language, */ Star, StarBorder, SignalWifi2Bar, LibraryBooks, Business } from 'variables/icons';
import withLocalization from 'components/Localization/T';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

class ProjectHover extends Component {
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { project } = this.props
			if (this.props.isFav({ id: project.id, type: 'project' })) {
				this.props.s('snackbars.favorite.saved', { name: project.title, type: this.props.t('favorites.types.project') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: project.id, type: 'project' })) {
				this.props.s('snackbars.favorite.removed', { name: project.title, type: this.props.t('favorites.types.project') })
				this.props.finishedSaving()
			}
		}
	}
	addToFav = () => {
		const { project } = this.props
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { project } = this.props
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: `/project/${project.id}`
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
				return <SignalWifi2Bar className={classes.smallIcon}/>
			default:
				break;
		}
	}
	render() {
		const { t, anchorEl, classes, project, isFav } = this.props
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
									<LibraryBooks className={classes.img} />
								</ItemG>
								<ItemG xs={9} container justify={'center'}>
									<ItemG xs={12}>
										<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
											{project.title}
										</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText} noParagraph>{`${project.id}`}</T>
									</ItemG>
								</ItemG>
							</ItemG>
							<ItemG xs={12} className={classes.middleContainer}>
								<ItemG xs={12}>
									<T className={classes.smallText} noParagraph>
										<Business className={classes.smallIcon}/>
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
									<Tooltip placement="top" title={isFav({ id: project.id, type: 'project' }) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
										<IconButton className={classes.smallAction} onClick={isFav({ id: project.id, type: 'project' }) ? this.removeFromFav : this.addToFav}>
											{isFav({ id: project.id, type: 'project' }) ? <Star /> : <StarBorder />}
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

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()((withLocalization()(withStyles(hoverStyles)(ProjectHover)))))
