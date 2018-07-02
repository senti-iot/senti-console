import React from "react";
import {
	withStyles,
	IconButton,
	MenuItem,
	Menu,
	Grid,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { withRouter } from 'react-router-dom'
import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";
import cookie from "react-cookies";
import { Lock, AccountBox, Business } from '@material-ui/icons'
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
		this.setState({ anchorProfile: null })
		cookie.remove("SESSION")
		if (!cookie.load('SESSION'))
		{
			this.props.history.push('/login')
		}
	}
	render() {
		const { classes } = this.props;
		const { anchorProfile } = this.state;
		const openProfile = Boolean(anchorProfile)
		return (
			<Grid container>
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
						<Lock className={classes.leftIcon}/>Log out
					 </MenuItem>
				</Menu>
			</Grid>
		);
	}
}

export default withRouter(withStyles(headerLinksStyle)(HeaderLinks));
