import { Grid, Menu, MenuItem, withStyles, Divider, Tooltip, Button } from '@material-ui/core';
import { AccountBox, Business, PowerSettingsNew, SettingsRounded, ExpandMore } from 'variables/icons';
import headerLinksStyle from 'assets/jss/material-dashboard-react/headerLinksStyle';
import React from 'react';
import cookie from 'react-cookies';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Gravatar from 'react-gravatar'
import { logOut } from 'variables/dataLogin';
// import moment from 'moment'
// import christmas from 'assets/img/christmas'
import { ItemG, T, Muted } from 'components';
import { GoogleLogout } from 'react-google-login';
import cx from 'classnames'

class HeaderLinks extends React.Component {
	state = {
		anchorProfile: null
	};

	handleProfileOpen = e => {
		this.setState({ anchorProfile: e.currentTarget })
	}
	handleRedirectToChristmas = () => {
		this.props.history.push(`/holiday`)
	}
	handleRedirectToOwnProfile = () => {
		this.handleProfileClose()
		if (this.props.user)
			this.props.history.push(`/management/user/${this.props.user.id}`)

	}
	handleRedirectToOwnOrg = () => {
		this.handleProfileClose()
		if (this.props.user)
			this.props.history.push(`/management/org/${this.props.user.org.id}`)
	}
	handleProfileClose = () => {
		this.setState({ anchorProfile: null })
		if (this.props.onClose)
			this.props.onClose()
	}
	logOut = async () => {
		try {
			await logOut().then(() => { cookie.remove('SESSION', { path: '/' }) })
		}
		catch (e) {
		}
		if (!cookie.load('SESSION')) {
			this.props.history.push('/login')
		}
		this.setState({ anchorProfile: null })
	}
	handleSettingsOpen = () => {
		this.handleProfileClose()
		if (this.props.user)
			this.props.history.push(`/settings`)
	}
	// renderChristmasIcon = () => {
	// 	const { classes } = this.props
	// 	if (moment().format('MM') === '12') { 
	// 		let today = moment().format('DD')
	// 		return today
	// 	}
	// 	else
	// 	{
	// 		if (moment().format('MM') === '11') {
	// 			return <IconButton onClick={this.handleRedirectToChristmas}>
	// 				<img src={christmas[0]} className={classes.img} alt={'christmas'} />
	// 			</IconButton>
	// 		}
	// 		return null
	// 	}

	// }
	renderUserMenu = () => {
		const { classes, t, user } = this.props;
		const { anchorProfile } = this.state;
		const openProfile = Boolean(anchorProfile)

		return <ItemG>
			<Tooltip title={t('menus.user.profile')}>
				<Button
					aria-owns={openProfile ? 'menu-appbar' : null}
					aria-haspopup='true'
					onClick={this.handleProfileOpen}
					classes={{
						root: classes.iconRoot
					}}
				>
					<ExpandMore className={cx(classes.expand, {
						[classes.expandOpen]: openProfile,
					})} />
					{user ? <T style={{ /* fontSize: '1rem', */ textTransform: 'none', margin: 8 }}>{`${user.firstName}`}</T> : null}
					{user ? user.img ? <img src={user.img} alt='UserProfile' className={classes.img} /> : <Gravatar default='mp' email={user.email} className={classes.img} size={36} /> : null}
				</Button>
			</Tooltip>
			<Menu
				style={{ marginTop: 50 }}
				id='menu-appbar'
				anchorEl={anchorProfile}
				// anchorOrigin={{
				// 	// vertical: 'bottom',
				// 	horizontal: 'right',
				// }}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={openProfile}
				onClose={this.handleProfileClose}
				disableAutoFocusItem
			>
				{user ?
					<MenuItem disableRipple component={'div'} className={classes.nameAndEmail}>
						<T style={{ fontSize: '1rem' }}>{`${user.firstName} ${user.lastName}`}</T>
						<Muted style={{ fontSize: '0.875rem' }}>{user.email}</Muted>
					</MenuItem>
					: null}
				<Divider />
				<MenuItem onClick={this.handleRedirectToOwnProfile}>
					<AccountBox className={classes.leftIcon} />{t('menus.user.profile')}
				</MenuItem>
				{user ? user.privileges.apiorg.editusers ? <MenuItem onClick={this.handleRedirectToOwnOrg}>
					<Business className={classes.leftIcon} />{t('menus.user.account')}
				</MenuItem> : null : null}
				<MenuItem onClick={this.handleSettingsOpen}>
					<SettingsRounded className={classes.leftIcon} />{t('sidebar.settings')}
				</MenuItem>
				<GoogleLogout
					// onLogoutSuccess={() => this.logOut()}
					clientId="1038408973194-qcb30o8t7opc83k158irkdiar20l3t2a.apps.googleusercontent.com"
					render={renderProps => (<MenuItem onClick={() => { renderProps.onClick(); this.logOut() }} className={classes.menuItem}>
						<PowerSettingsNew className={classes.leftIcon} />{t('menus.user.signout')}
					</MenuItem>)}
				>

				</GoogleLogout>
			</Menu>
		</ItemG>
	}
	render() {
		const { classes } = this.props;
		return (
			<Grid container classes={{ container: classes.headerMargin }}>
				{/* <ItemG>
					{this.renderChristmasIcon()}
				</ItemG> */}
				{this.renderUserMenu()}
			</Grid>
		);
	}
}
const mapStateToProps = (state) => ({
	user: state.settings.user,

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(headerLinksStyle)(HeaderLinks)));
