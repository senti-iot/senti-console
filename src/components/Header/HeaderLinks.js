import { Grid, IconButton, Menu, MenuItem, withStyles } from "@material-ui/core";
import { AccountBox, Business, Lock } from '@material-ui/icons';
import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";
import React from "react";
import cookie from "react-cookies";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Gravatar from 'react-gravatar'
class HeaderLinks extends React.Component {
	state = {
		anchorProfile: null
	};

	handleProfileOpen = e => {
		this.setState({ anchorProfile: e.currentTarget })
	}
	handleRedirectToOwnProfile = () => {
		this.setState({ anchorProfile: null })
		if (this.props.user)
			this.props.history.push(`/user/${this.props.user.id}`)
	}
	handleProfileClose = () => {
		this.setState({ anchorProfile: null })
	}
	logOut = () => {
		try {
			cookie.remove("SESSION", { path: '/' })
		}
		catch (e) { 
		}
		if (!cookie.load('SESSION'))
		{
			this.props.history.push('/login')
		}
		this.setState({ anchorProfile: null })
	}
	render() {
		const { classes, t, user } = this.props;
		const { anchorProfile } = this.state;
		const openProfile = Boolean(anchorProfile)
		return (
			<Grid container classes={{ container: classes.headerMargin }}>
				{/* <IconButton
					color="inherit"
					aria-label="Dashboard"
					className={classes.buttonLink}
				>
					<Dashboard className={classes.links} />
				</IconButton> */}
				<IconButton
					aria-owns={openProfile ? 'menu-appbar' : null}
					aria-haspopup="true"
					onClick={this.handleProfileOpen}
					classes={{
						root: classes.iconRoot
					}}
				>
					{user.img ? <img src={user.img} alt="UserProfile" className={classes.img} /> : <Gravatar default="mp" email={user.email} className={classes.img} size={36} />}
				</IconButton>
				<Menu
					id="menu-appbar"
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
						<AccountBox className={classes.leftIcon}/>{t("users.menus.profile")}
					</MenuItem>
					<MenuItem onClick={this.handleProfileClose}>
						<Business className={classes.leftIcon} />{t("users.menus.account")}
					</MenuItem>
					<MenuItem onClick={this.logOut} className={classes.menuItem}>
						<Lock className={classes.leftIcon} />{t("users.menus.signout")}
					 </MenuItem>
				</Menu>
			</Grid>
		);
	}
}
const mapStateToProps = (state) => ({
	user: state.settings.user
})

const mapDispatchToProps = {
	
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(headerLinksStyle)(HeaderLinks)));
