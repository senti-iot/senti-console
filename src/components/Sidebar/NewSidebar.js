import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import { Drawer, /* IconButton, */ Divider, IconButton, Hidden, Link } from '@material-ui/core';
import { drawerWidth, transition, primaryColor, hoverColor, defaultFont } from 'assets/jss/material-dashboard-react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';
import { Menu } from 'variables/icons';
import { HeaderLinks } from 'components';

const styles = theme => ({
	root: {
		display: 'flex',
	},
	drawerPaper: {
		color: '#fff',
		backgroundColor: "#434351",
		top: 70,
		[theme.breakpoints.down('md')]: {
			top: 0
		},
		border: 'none'
	},
	drawer: {
		top: 70,
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		
	},
	drawerOpen: {
		width: drawerWidth,
		...transition
	},
	drawerClose: {
		...transition,
		overflowX: 'hidden',
		// width: theme.spacing.unit * 7 + 1,
		width: 60
	},
	whiteFont: {
		color: "#FFFFFF",
		...defaultFont,
		margin: "0",
		lineHeight: "30px",
		fontSize: "14px",
		// color: "#FFFFFF"
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		// justifyContent: 'flex-end',
		marginLeft: 4,
		// padding: '0 8px',
		minHeight: 48,
		// ...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
	},
	button: {
		color: '#fff',
		margin: '8px 0px',
		padding: 10,
		height: 44,
		"&:hover": {
			background: hoverColor
		},
		transition: "border-radius 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1), background 0.16s cubic-bezier(0.685, 0.0473, 0.346, 1) "
	},
	buttonOpen: {
		borderRadius: 3
	},
	buttonClose: {
		borderRadius: "50%"
	},
	buttonActiveRoute: {
		background: primaryColor
	},
	logo: {
		backgroundColor: '#1a1b32',
		position: "relative",
		padding: "15px 15px",
		minHeight: "40px",
		zIndex: "4",
		display: 'flex',
		"&:after": {
			content: '""',
			position: "absolute",
			bottom: "0",

			height: "0px",
			right: "15px",
			width: "calc(100% - 30px)",
			backgroundColor: "rgba(180, 180, 180, 0.3)"
		}
	},
	logoLink: {
		// ...defaultFont,
		textTransform: "uppercase",
		padding: "5px 0",
		display: "block",
		fontSize: "18px",
		textAlign: "left",
		fontWeight: "400",
		lineHeight: "30px",
		textDecoration: "none",
		backgroundColor: "transparent",
		"&,&:hover": {
			color: "#FFFFFF"
		}
	},
	logoImage: {
		// width: "50px",
		display: "inline-block",
		maxHeight: "50px",
		marginLeft: "50px",
		[theme.breakpoints.down("md")]: {
			marginLeft: "18px"
		},
		marginRight: "15px"
	},
	img: {
		// width: "35px",
		top: "10px",
		height: "50px",
		position: "absolute",
		verticalAlign: "middle",
		border: "0"
	},
});
class NewSidebar extends Component {

	activeRoute = (routeName) => this.props.menuRoute === routeName ? true : false;
	changeSmallMenu = () => this.props.changeSmallMenu(!this.props.smallMenu)

	render() {
		const { t, classes, smallMenu, routes, defaultView, defaultRoute, logo } = this.props;
		const { props } = this
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
			<Fragment>
				<Hidden mdDown>
					<Drawer
						variant="permanent"
						className={classNames(classes.drawer, {
							[classes.drawerOpen]: smallMenu,
							[classes.drawerClose]: !smallMenu,
						})}
						classes={{
							paper: classNames({
								[classes.drawerOpen]: smallMenu,
								[classes.drawerClose]: !smallMenu,
								[classes.drawerPaper]: true,
							}),
						}}
						open={smallMenu}
					>
						<div className={classes.toolbar}>
							<IconButton onClick={this.changeSmallMenu}>
								<Menu />
							</IconButton>
						</div>
						<Divider />
						<List style={{
							margin: '8px 8px',
							paddingTop: 0,
						}}>
							{routes.map((route, index) => {
								if (route.redirect) return null;
								if (route.hideFromSideBar) return null;
								return <ListItem component={NavLink}
									button
									to={route.path + (route.defaultView ? defaultView : '')}
									key={index}
									classes={{
										button: classNames({
											[classes.buttonOpen]: smallMenu,
											[classes.buttonClose]: !smallMenu,
											[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
											[classes.button]: true
										})
									}}>
									<ListItemIcon style={{ marginRight: 16 }} className={classes.whiteFont}><route.icon /></ListItemIcon>
									<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
								</ListItem>
							})}
						</List>
					</Drawer>
				</Hidden>
				<Hidden lgUp>
					<Drawer
						variant='temporary'
						anchor='right'
						open={props.open}
						classes={{
							// paper: classes.drawerPaper
							paper: classNames({ [classes.drawerPaper]: true, [classes.drawerOpen]: true })
						}}
						onClose={props.handleDrawerToggle}
						ModalProps={{
							keepMounted: true
						}}
					>
						{smallBrand}
						<div className={classes.sidebarWrapper}>
							<div className={classes.appBarWrapper}>
								<HeaderLinks t={t} onClose={this.props.handleDrawerToggle} />
							</div>
							<Divider/>
							<List style={{
								margin: '4px 4px',
								paddingTop: 0,
							}}>
								{routes.map((route, index) => {
									if (route.redirect) return null;
									if (route.hideFromSideBar) return null;
									return <ListItem component={NavLink}
										button
										to={route.path + (route.defaultView ? defaultView : '')}
										key={index}
										classes={{
											button: classNames({
												[classes.buttonOpen]: true,
												// [classes.buttonClose]: true,
												[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
												[classes.button]: true
											})
										}}>
										<ListItemIcon style={{ marginRight: 16 }} className={classes.whiteFont}><route.icon /></ListItemIcon>
										<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
									</ListItem>
								})}
							</List>
						</div>
						{/* {image !== undefined ? (
							<div
								className={classes.background}
								style={{ backgroundImage: 'url(' + image + ')' }}
							/>
						) : null} */}
					</Drawer>
				</Hidden>
			</Fragment>
		);
	}
}
const mapStateToProps = (state) => ({
	smallMenu: state.appState.smallMenu
})

const mapDispatchToProps = dispatch => ({
	changeSmallMenu: val => dispatch(changeSmallMenu(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NewSidebar))
