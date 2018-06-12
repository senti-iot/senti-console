import React from "react";
import PropTypes from "prop-types";
import { Menu } from "@material-ui/icons";
import {
	withStyles,
	AppBar,
	Toolbar,
	IconButton,
	Hidden,
	Button
} from "@material-ui/core";
import cx from "classnames";

import headerStyle from "assets/jss/material-dashboard-react/headerStyle.js";

import HeaderLinks from "./HeaderLinks";


function Header({ ...props }) {
	const { classes, color } = props;
	const appBarClasses = cx({
		[" " + classes[color]]: color
	});
	return (
		<AppBar position={'absolute'} className={classes.appBar + appBarClasses}>
			<Toolbar className={classes.container}>
				<div className={classes.flex}>
					<Button href="/" className={classes.title}>
						{props.headerTitle}
					</Button>
				</div>
				<Hidden smDown implementation="css">
					<HeaderLinks />
				</Hidden>
				<Hidden mdUp>
					<IconButton
						className={classes.appResponsive}
						color="primary"
						aria-label="open drawer"
						onClick={props.handleDrawerToggle}
					>
						<Menu />
					</IconButton>
				</Hidden>
			</Toolbar>
		</AppBar>
	);
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(headerStyle)(Header);
