import React, { useState } from 'react';
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
	// IconButton,
	Button,
} from '@material-ui/core';

import { HeaderLinks } from 'components';

import sidebarStyle from 'assets/jss/material-dashboard-react/sidebarStyle.js';
import { Menu } from 'variables/icons';

const Sidebar = ({ ...props }) => {
	const [small, setSmall] = useState(false);

	function activeRoute(routeName) {
		return props.menuRoute === routeName ? true : false;
	}
	const { classes, color, image, logo, routes, t, defaultRoute, defaultView } = props;
	const itemClasses = cx({
		[true]: classes.itemLink + ' ' + classes[color],
		[small]: classes.itemLinkSmall,

	})
	var links = (
		<List className={classes.list}>
			<NavLink
				to={"#"}
				className={classes.item}
				activeClassName='active'
			>
				<ListItem button className={itemClasses} onClick={() => setSmall(!small)}>
					<ListItemIcon className={classes.itemIcon + ' ' + classes.whiteFont}>
						<Menu />
					</ListItemIcon>
					{small ? null : <ListItemText
						primary={"Burger Menu"}
						className={classes.itemText + ' ' + classes.whiteFont}
						disableTypography={true}
					/>
					}
				</ListItem>
			</NavLink>
			{routes.map((prop, key) => {
				if (prop.redirect) return null;
				if (prop.hideFromSideBar) return null;

				const listItemClasses = cx({
					[' ' + classes[color]]: activeRoute(prop.menuRoute) && !small
				});
				const whiteFontClasses = cx({
					[' ' + classes.whiteFont]: activeRoute(prop.menuRoute) && !small
				});
				const whiteFontClassesSmall = cx({
					[' ' + classes.whiteFont]: activeRoute(prop.menuRoute) && small
				});
				const smallItem = cx({
					[' ' + classes.itemLinkSmall]: small
				})

				return (
					<NavLink
						to={prop.path + defaultView}
						className={classes.item}
						activeClassName='active'
						key={key}
					>
					 <Button className={classes.itemLink + listItemClasses + smallItem}>
							<ListItemIcon className={classes.itemIcon + whiteFontClasses + whiteFontClassesSmall}>
								<prop.icon />
							</ListItemIcon>
							<ListItemText
								primary={t(prop.sidebarName)}
								className={classes.itemText + whiteFontClasses}
								disableTypography={true}
								style={{ textTransform: 'none', textAlign: 'left' }}
							/>
						</Button>
					</NavLink>
					// 	<ListItem button className={classes.itemLink + listItemClasses} onClick={props.handleDrawerToggle}>
					// 		<ListItemIcon className={classes.itemIcon + whiteFontClasses}>
					// 			<prop.icon />
					// 		</ListItemIcon>
					// 		{small ? null : <ListItemText
					// 			primary={t(prop.sidebarName)}
					// 			className={classes.itemText + whiteFontClasses}
					// 			disableTypography={true}
					// 		/> }
					// 	</ListItem>
				);
			})}
		</List>
	);
	// var brand = (
	// 	<div className={classes.logo}>
	// 		<Link to={defaultRoute ? defaultRoute : '/'} className={classes.logoLink}>
	// 			<div className={classes.logoImage}>
	// 				<img src={logo} alt='logo' className={classes.img} />
	// 			</div>
	// 			{logoText}
	// 		</Link>
	// 	</div>
	// );
	var smallBrand = (
		<div className={classes.logo}>
			<Link to={defaultRoute ? defaultRoute : '/'} onClick={props.handleDrawerToggle} className={classes.logoLink}>
				<div className={classes.logoImage}>
					<img src={logo} alt='logo' className={classes.img} />
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
							<HeaderLinks t={t} onClose={props.handleDrawerToggle} />
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
						paper: (small ? classes.drawerPaperSmall : '') + ' ' + classes.drawerPaper 
					}}
				>
					{/* {brand} */}
					{links}
					{/* </div> */}
					{/* <div className={classes.sidebarWrapper}> */}
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
