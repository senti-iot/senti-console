import { Grid, IconButton, Menu, MenuItem, withStyles } from '@material-ui/core';
import { AccountBox, Business, Lock, SettingsRounded } from 'variables/icons';
import headerLinksStyle from 'assets/jss/material-dashboard-react/headerLinksStyle';
import React from 'react';
import cookie from 'react-cookies';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Gravatar from 'react-gravatar'
import { logOut } from 'variables/dataLogin';
class HeaderLinks extends React.Component {
	state = {
		anchorProfile: null
	};

	handleProfileOpen = e => {
		this.setState({ anchorProfile: e.currentTarget })
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
	render() {
		const { classes, t, user } = this.props;
		const { anchorProfile } = this.state;
		const openProfile = Boolean(anchorProfile)
		return (
			<Grid container classes={{ container: classes.headerMargin }}>
				<IconButton
					aria-owns={openProfile ? 'menu-appbar' : null}
					aria-haspopup='true'
					onClick={this.handleProfileOpen}
					classes={{
						root: classes.iconRoot
					}}
				>
					{user ? user.img ? <img src={user.img} alt='UserProfile' className={classes.img} /> : <Gravatar default='mp' email={user.email} className={classes.img} size={36} /> : null}
				</IconButton>
				<Menu
					id='menu-appbar'
					anchorEl={anchorProfile}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={openProfile}
					onClose={this.handleProfileClose}
					className={classes.menuList}
					MenuListProps={{
						classes: {
							padding: classes.menuList
						}
					}}
				>
					<MenuItem onClick={this.handleRedirectToOwnProfile}>
						<AccountBox className={classes.leftIcon} />{t('menus.user.profile')}
					</MenuItem>
					{user ? user.privileges.apiorg.editusers ? <MenuItem onClick={this.handleRedirectToOwnOrg}>
						<Business className={classes.leftIcon} />{t('menus.user.account')}
					</MenuItem> : null : null}
					<MenuItem onClick={this.handleSettingsOpen}>
						<SettingsRounded className={classes.leftIcon} />{t('sidebar.settings')}
					</MenuItem>
					<MenuItem onClick={this.logOut} className={classes.menuItem}>
						<Lock className={classes.leftIcon} />{t('menus.user.signout')}
					</MenuItem>
				</Menu>
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
