import React from "react";
// import classNames from "classnames";
// import { Manager, Reference, Popper } from "react-popper";
import {
	withStyles,
	IconButton,
	MenuItem,
	Menu,
	// MenuList,
	// Grow,
	// Paper,
	// ClickAwayListener,
	Hidden,
	// ClickAwayListener
} from "@material-ui/core";
import { /* Person, */ Dashboard } from "@material-ui/icons";
import { withRouter } from 'react-router-dom'
import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";
import cookie from "react-cookies";
import AccountCircle from '@material-ui/icons/AccountCircle'

class HeaderLinks extends React.Component {
	state = {
		anchorProfile: null
	};

	handleProfileOpen = e => {
		this.setState({ anchorProfile: e.currentTarget })
	}
	handleProfileClose = () => {
		this.setState({ anchorProfile: null })
	}
	logOut = () => {
		cookie.remove("SESSION")
		this.setState({ anchorProfile: null })
		this.props.history.push('/login')
	}
	render() {
		const { classes } = this.props;
		const { anchorProfile } = this.state;
		const openProfile = Boolean(anchorProfile)
		return (
			<div>
				<IconButton
					color="inherit"
					aria-label="Dashboard"
					className={classes.buttonLink}
				>
					<Dashboard className={classes.links} />
					<Hidden mdUp>
						<p className={classes.linkText}>Dashboard</p>
					</Hidden>
				</IconButton>
				<IconButton
					aria-owns={openProfile ? 'menu-appbar' : null}
					aria-haspopup="true"
					onClick={this.handleProfileOpen}
					color="inherit"
				>
					<AccountCircle />
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
					<MenuItem onClick={this.handleProfileClose}>Profile</MenuItem>
					<MenuItem onClick={this.handleProfileClose}>My account</MenuItem>
					<MenuItem onClick={this.logOut} className={classes.menuItem}>Log out</MenuItem>
				</Menu>
			</div>
		);
	}
}

export default withRouter(withStyles(headerLinksStyle)(HeaderLinks));
