import { Grid, IconButton, Menu, MenuItem, withStyles } from "@material-ui/core";
import { AccountBox, AccountCircle, Business, Lock } from '@material-ui/icons';
import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";
import React from "react";
import cookie from "react-cookies";
import { withRouter } from 'react-router-dom';
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
		const { classes } = this.props;
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
					<MenuItem onClick={this.handleProfileClose}>
						<Business className={classes.leftIcon} />Profile
					</MenuItem>
					<MenuItem onClick={this.handleProfileClose}>
						<AccountBox className={classes.leftIcon} />My account
					</MenuItem>
					<MenuItem onClick={this.logOut} className={classes.menuItem}>
						<Lock className={classes.leftIcon}/>Sign out
					 </MenuItem>
				</Menu>
			</Grid>
		);
	}
}

export default withRouter(withStyles(headerLinksStyle)(HeaderLinks));
