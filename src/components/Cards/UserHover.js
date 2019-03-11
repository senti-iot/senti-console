import React, { Component } from 'react'
import { Popper, Paper, withStyles, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
import Gravatar from 'react-gravatar'
import { Business, Call, LocationOn, Mail, Star, StarBorder } from 'variables/icons';
import withLocalization from 'components/Localization/T';
import { hoverColor, primaryColor } from 'assets/jss/material-dashboard-react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';

const styles = theme => ({
	paper: {
		width: 300,
		maxWidth: 450,
		padding: theme.spacing.unit,
		background: "#fff"
	},
	smallText: {
		font: '400 13px/20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
		color: '#3c4043',
		display: 'flex',
		alignItems: 'center'
	},
	img: {
		borderRadius: "50%",
		height: "50px",
		width: "50px",
		display: 'flex',
		marginRight: 8
	},
	smallAction: {
		padding: '6px 8px',
		color: primaryColor,
		"&:hover": {
			background: 'initial',
			color: hoverColor
		}
	},
	smallActionLink: {
		display: 'flex',
		color: 'inherit',
		"&:hover": {
			background: 'initial',
		}
	},
})
class UserHover extends Component {
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { user } = this.props
			// let user = data[data.findIndex(d => d.id === selected[0])]
			if (this.props.isFav({ id: user.id, type: 'user' })) {
				this.props.s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: user.id, type: 'user' })) {
				this.props.s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
				this.props.finishedSaving()
			}
		}
	}
	addToFav = () => {
		const { user } = this.props
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.id}`
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { user } = this.props
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.id}`
		}
		this.props.removeFromFav(favObj)

	}
	handleClose = () => {
		this.props.handleClose()
	};
	render() {
		const { t, anchorEl, classes, user, isFav } = this.props
		return (
			<div>
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
						<Fade {...TransitionProps} timeout={350}>
							<Paper className={classes.paper}>

								<ItemG container style={{ margin: "8px 0" }}>
									<ItemG xs={3} container justify={'center'} alignItems={'center'}>
										<Gravatar size={50} default='mp' email={user.email} className={classes.img} />
									</ItemG>
									<ItemG xs={9} container justify={'center'}>
										<ItemG xs={12}>

											<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
												{`${user.firstName} ${user.lastName}`}
											</T>
										</ItemG>
										<ItemG xs={12}>
											<T className={classes.smallText} noParagraph>{user.email}</T>
										</ItemG>
										<ItemG xs={12}>
											<T className={classes.smallText} noParagraph>{user.phone ? user.phone : ""}</T>
										</ItemG>
									</ItemG>
								</ItemG>
								<ItemG container style={{ margin: "0 22px 14px 22px" }}>
									<ItemG xs={12}>

										<T className={classes.smallText}>
											<Business width={10} height={10} style={{ marginRight: 8 }} />
											{user.org.name}
										</T>

									</ItemG>
									<ItemG xs={12}>
										{user.aux.senti ? user.aux.senti.extendedProfile ?
											user.aux.senti.extendedProfile.location ? <T className={classes.smallText}>
												<LocationOn width={10} height={10} style={{ marginRight: 8 }} />
												{user.aux.senti.extendedProfile.location}
											</T> : null : null : null}
									</ItemG>
								</ItemG>
								<Divider />
								<ItemG container style={{ marginTop: '8px' }}>
									<ItemG>
										<Button color={'primary'} variant={'text'} component={Link} to={`user/${user.id}/edit`}>
											{t('menus.edit')}
										</Button>
									</ItemG>
									<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
										<Tooltip placement="top" title={t('actions.sendEmail')}>
											<IconButton className={classes.smallAction}>
												<a className={classes.smallActionLink} href={`mailto:${user.email}`}>
													<Mail/>
												</a>
											</IconButton>
										</Tooltip>
										<Tooltip placement="top" title={t('actions.call')}>
											<IconButton className={classes.smallAction}>
												<a className={classes.smallActionLink} href={`tel:${user.phone}`}>
													<Call/>
												</a>
											</IconButton>
										</Tooltip>
										<Tooltip placement="top" title={isFav({ id: user.id, type: 'user' }) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
											<IconButton className={classes.smallAction} onClick={isFav({ id: user.id, type: 'user' }) ? this.removeFromFav : this.addToFav}>
												{isFav({ id: user.id, type: 'user' }) ?  <Star/> : <StarBorder/> }
											</IconButton>
										</Tooltip>
									</ItemG>
								</ItemG>
							</Paper>
						</Fade>)}
				</Popper>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()((withLocalization()(withStyles(styles)(UserHover)))))
