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

class CollectionHover extends Component {
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { collection } = this.props
			if (this.props.isFav({ id: collection.id, type: 'collection' })) {
				this.props.s('snackbars.favorite.saved', { name: collection.name, type: this.props.t('favorites.types.collection') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: collection.id, type: 'collection' })) {
				this.props.s('snackbars.favorite.removed', { name: collection.name, type: this.props.t('favorites.types.collection') })
				this.props.finishedSaving()
			}
		}
	}
	addToFav = () => {
		const { collection } = this.props
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: `/collection/${collection.id}`
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { collection } = this.props
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: `/collection/${collection.id}`
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
		const { t, anchorEl, classes, collection, isFav } = this.props
		return (
			<Popper
				style={{ zIndex: 1040 }}
				disablePortal
				id="simple-popover"
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={this.handleClose}
				placement={'right'}
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
											{collection.name}
										</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText} noParagraph>{`${collection.id}`}</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText} noParagraph>
											{`${collection.org.name ? collection.org.name : t('devices.fields.free')}`}
										</T>
									</ItemG>
								</ItemG>
							</ItemG>
							<ItemG xs={12} className={classes.middleContainer}>
								<ItemG xs={12}>
									<T className={classes.smallText}>
										{this.renderIcon(collection.activeDevice ? collection.activeDevice.state : null)}
										{/* {t(`devices.status.${device.liveStatus === 0 ? 'red' : device.liveStatus === 1 ? 'yellow' : 'green'}`)} */}
									</T>
								</ItemG>
								{collection.address ?
									<ItemG xs={12}>
										<T className={classes.smallText}>
											<LocationOn className={classes.smallIcon}/>
											{collection.address}
										</T>
									</ItemG>
									: null}
							</ItemG>
							<Divider />
							<ItemG container style={{ marginTop: '8px' }}>
								<ItemG>
									<Button color={'primary'} variant={'text'} component={Link} to={`collection/${collection.id}/edit`}>
										{t('menus.edit')}
									</Button>
								</ItemG>
								<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
									{/* <Tooltip placement="top" title={t('actions.visitWebsite')}>
										<IconButton component={'a'} className={classes.smallAction} href={device.url} rel="noopener noreferrer" target="_blank">
											<Language />
										</IconButton>
									</Tooltip> */}
									<Tooltip placement="top" title={isFav({ id: collection.id, type: 'collection' }) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
										<IconButton className={classes.smallAction} onClick={isFav({ id: collection.id, type: 'collection' }) ? this.removeFromFav : this.addToFav}>
											{isFav({ id: collection.id, type: 'collection' }) ? <Star /> : <StarBorder />}
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

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()((withLocalization()(withStyles(hoverStyles)(CollectionHover)))))