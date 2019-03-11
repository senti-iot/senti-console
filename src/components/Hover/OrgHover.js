import React, { Component } from 'react'
import { Popper, Paper, withStyles, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { Business, Language, Star, StarBorder } from 'variables/icons';
import withLocalization from 'components/Localization/T';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

class OrgHover extends Component {
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { org } = this.props
			if (this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.saved', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.removed', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
			}
		}
	}
	addToFav = () => {
		const { org } = this.props
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: `/management/org/${org.id}`
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { org } = this.props
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: `/management/org/${org.id}`
		}
		this.props.removeFromFav(favObj)

	}
	handleClose = () => {
		this.props.handleClose()
	};
	render() {
		const { t, anchorEl, classes, org, isFav } = this.props
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
									<Business className={classes.img} />
								</ItemG>
								<ItemG xs={9} container justify={'center'}>
									<ItemG xs={12}>
										<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
											{org.name}
										</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText} noParagraph>{`${org.address}`}</T>
									</ItemG>
									<ItemG xs={12}>
										<T className={classes.smallText} noParagraph>
											{`${org.zip} ${org.city}`}
										</T>
									</ItemG>
								</ItemG>
							</ItemG>
							<Divider />
							<ItemG container style={{ marginTop: '8px' }}>
								<ItemG>
									<Button color={'primary'} variant={'text'} component={Link} to={`org/${org.id}/edit`}>
										{t('menus.edit')}
									</Button>
								</ItemG>
								<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
									<Tooltip placement="top" title={t('actions.visitWebsite')}>
										<IconButton component={'a'} className={classes.smallAction} href={org.url} rel="noopener noreferrer" target="_blank">
											<Language />
										</IconButton>
									</Tooltip>
									<Tooltip placement="top" title={isFav({ id: org.id, type: 'org' }) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
										<IconButton className={classes.smallAction} onClick={isFav({ id: org.id, type: 'org' }) ? this.removeFromFav : this.addToFav}>
											{isFav({ id: org.id, type: 'org' }) ? <Star /> : <StarBorder />}
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

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()((withLocalization()(withStyles(hoverStyles)(OrgHover)))))
