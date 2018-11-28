import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import cx from 'classnames';
import {
	withStyles,
	Drawer,
	Hidden,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core';

import { HeaderLinks } from 'components';

import sidebarStyle from 'assets/jss/material-dashboard-react/sidebarStyle.js';

const Sidebar = ({ ...props }) => {

	function activeRoute(routeName) {
		return props.menuRoute === routeName ? true : false;
	}

	const { classes, color, logo, image, logoText, routes, t  } = props;
	var links = (
		<List className={classes.list}>
			{routes.map((prop, key) => {
				if (prop.redirect) return null;
				if (prop.hideFromSideBar) return null;

				const listItemClasses = cx({
					[' ' + classes[color]]: activeRoute(prop.menuRoute)
				});
				const whiteFontClasses = cx({
					[' ' + classes.whiteFont]: activeRoute(prop.menuRoute)
				});
				return (
					<NavLink
						to={prop.path}
						className={classes.item}
						activeClassName='active'
						key={key}
					>
						<ListItem button className={classes.itemLink + listItemClasses} onClick={props.handleDrawerToggle}>
							<ListItemIcon className={classes.itemIcon + whiteFontClasses}>
								<prop.icon />
							</ListItemIcon>
							<ListItemText
								primary={t(prop.sidebarName)}
								className={classes.itemText + whiteFontClasses}
								disableTypography={true}
							/>
						</ListItem>
					</NavLink>
				);
			})}
		</List>
	);
	var brand = (
		<div className={classes.logo}>
			<Link to={'/'} className={classes.logoLink}>
				<div className={classes.logoImage}>
					<img src={logo} alt='logo' className={classes.img} />
				</div>
				{logoText}
			</Link>
		</div>
	);
	var smallBrand = (
		<div className={classes.logo}>
			<Link to={'/'} onClick={props.handleDrawerToggle} className={classes.logoLink}>
				<div className={classes.logoImage}>
					<img src={logo} alt='logo' className={classes.img}/>
				</div>
			</Link>
		</div>
	)
	return (
		<div>
			<Hidden lgUp>
				<Drawer
					variant='temporary'
					anchor='right'
					open={props.open}
					classes={{
						paper: classes.drawerPaper
					}}
					onClose={props.handleDrawerToggle}
					ModalProps={{
						keepMounted: true 
					}}
				>
					{smallBrand}
					<div className={classes.sidebarWrapper}>
						<div className={classes.appBarWrapper}>
							<HeaderLinks t={t} onClose={props.handleDrawerToggle}/>
						</div>
						{links}
					</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: 'url(' + image + ')' }}
						/>
					) : null}
				</Drawer>
			</Hidden>
			<Hidden mdDown>
				<Drawer
					anchor='left'
					variant='permanent'
					open
					classes={{
						paper: classes.drawerPaper
					}}
				>
					{brand}
					<div className={classes.sidebarWrapper}>{links}</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: 'url(' + image + ')' }}
						/>
					) : null}
				</Drawer>
			</Hidden>
		</div>
	);
};

Sidebar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(sidebarStyle)(Sidebar);
