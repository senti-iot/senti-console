import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import { Drawer, /* IconButton, */ Divider, Hidden, ButtonBase } from '@material-ui/core';
import { drawerWidth, transition, primaryColor, hoverColor, defaultFont } from 'assets/jss/material-dashboard-react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';
// import { Menu } from 'variables/icons';
import { HeaderLinks } from 'components';

const styles = theme => ({
	appBarWrapper: {
		backgroundColor: "#767684"
	},
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
		width: drawerWidth,
		border: 'none',
		// ...transition,
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
	drawerPersClose: {
		...transition,
		overflowX: 'hidden',
		// width: theme.spacing.unit * 7 + 1,
		width: 0
	},
	whiteFont: {
		color: "#FFFFFF",
		...defaultFont,
		margin: "0",
		lineHeight: "30px",
		fontSize: "14px",
		// color: "#FFFFFF"
	},
	border: {
		width: '100%',
		background: '#555',
		height: 1
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		// justifyContent: 'flex-end',
		// marginLeft: 4,
		// borderBottom: '1px solid #555',
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
		background: primaryColor,
		"&:focus": {
			background: primaryColor
		}
	},
	logo: {
		backgroundColor: '#1a1b32',
		position: "relative",
		padding: "8px 16px",
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
		top: "10px",
		height: "50px",
		verticalAlign: "middle",
		border: "0"
	},
	image: {
		backgroundColor: '#1a1b32',
		position: "relative",
		height: 48,
		// marginLeft: 48,
		borderRadius: 4,
		[theme.breakpoints.down("xs")]: {
			// width: "100% !important", // Overrides inline-style
			height: 48
		},
		"&:hover, &$focusVisible": {
			zIndex: 1,
		}
	},
	focusVisible: {},
	imageSrc: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundSize: "100px 50px",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "50% 50%",
	},
});
class NewSidebar extends Component {

	activeRoute = (routeName) => this.props.menuRoute === routeName ? true : false;
	changeSmallMenu = () => {
		this.props.changeSmallMenu(!this.props.smallMenu)
	}
	closeDrawer = () => { 
		this.props.changeSmallMenu(false)
	}
	renderPersistentDrawer = () => { 
		const { classes, smallMenu, routes, defaultView, t } = this.props
		return <Drawer
			variant="permanent"
			className={classNames(classes.drawer, {
				[classes.drawerOpen]: smallMenu,
				[classes.drawerPersClose]: !smallMenu,
			})}
			classes={{
				paper: classNames({
					[classes.drawerOpen]: smallMenu,
					[classes.drawerPersClose]: !smallMenu,
					[classes.drawerPaper]: true,
				}),
			}}
			open={smallMenu}
		>
			<div className={classes.toolbar}>
			</div>
			<List style={{
				margin: '8px',
				paddingTop: 0,
			}}>
				{routes.map((route, index) => {
					if (route.redirect) return null;
					if (route.hideFromSideBar) return null;
					return <ListItem component={NavLink}
						button
						to={route.path + (route.defaultView ? defaultView : '')}
						key={index}
						onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
						classes={{
							button: classNames({
								// [classes.buttonOpen]: smallMenu,
								// [classes.buttonClose]: !smallMenu,
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
	}
	renderPermanentDrawer = () => { 
		const { classes, smallMenu, routes, defaultView, t, headerBorder } = this.props

		return <Drawer
			variant="permanent"
			className={classNames(classes.drawer, {
				[classes.drawerOpen]: smallMenu,
				[classes.drawerClose]: !smallMenu,
			})}
			// onMouseEnter={() => this.props.changeSmallMenu(true)}
			// onMouseLeave={() => this.props.changeSmallMenu(false)}
			classes={{
				paper: classNames({
					[classes.drawerOpen]: smallMenu,
					[classes.drawerClose]: !smallMenu,
					[classes.drawerPaper]: true,
				}),
			}}
			open={smallMenu}
		>
			<div className={classes.toolbar} />
			{headerBorder && <div className={classes.border} />}
			<List
				// onMouseLeave={this.props.changeSmallMenu(false)}
				style={{
					margin: '8px',
					paddingTop: 0,
				}}>
				{routes.map((route, index) => {
					if (route.redirect) return null;
					if (route.hideFromSideBar) return null;
					return <ListItem component={NavLink}
						button
						onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
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
	}
	renderMobileDrawer = () => { 
		const { open, classes, handleDrawerToggle, t, routes, defaultView, sideBar } = this.props
		return <Drawer
			variant='temporary'
			anchor={sideBar ? 'right' : 'left'}
			open={open}
			classes={{
				// paper: classes.drawerPaper
				paper: classNames({ [classes.drawerPaper]: true, [classes.drawerOpen]: true })
			}}
			onClose={handleDrawerToggle}
			ModalProps={{
				keepMounted: true
			}}
		>
			{this.smallBrand()}
			<div className={classes.sidebarWrapper}>
				<div className={classes.appBarWrapper}>
					<HeaderLinks t={t} onClose={this.props.handleDrawerToggle} />
				</div>
				<Divider />
				<List style={{
					margin: '16px',
					paddingTop: 0,
				}}>
					{routes.map((route, index) => {
						if (route.redirect) return null;
						if (route.hideFromSideBar) return null;
						return <ListItem component={NavLink}
							button
							to={route.path + (route.defaultView ? defaultView : '')}
							onClick={this.props.handleDrawerToggle}
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
		</Drawer>
	}	
	smallBrand = () => {
		const { classes, logo, defaultRoute, handleDrawerToggle, history } = this.props
		return <div className={classes.logo}>
			<ButtonBase
				focusRipple
				className={classes.image}
				focusVisibleClassName={classes.focusVisible}
				style={{
					width: '120px'
				}}
				onClick={() => {handleDrawerToggle();history.push(defaultRoute ? defaultRoute : '/')}}
			// component={Link}
			// to={}
			>
				<span
					className={classes.imageSrc}
					style={{
						backgroundImage: `url(${logo})`
					}}
				/>
			</ButtonBase>
		</div>
		// return (<div className={classes.logo}>
		// 	<Link to={defaultRoute ? defaultRoute : '/'} className={classes.logoLink}>
		// 		<img src={logo} alt='logo' className={classes.img} /* onClick={handleDrawerToggle} */ />
		// 	</Link>
		// </div>
		// )
	}
	render() {
		const { drawer } = this.props
		return (
			<Fragment>
				<Hidden mdDown>
					{drawer === 'persistent' ? this.renderPersistentDrawer() : this.renderPermanentDrawer()}
				</Hidden>
				<Hidden lgUp>
					{this.renderMobileDrawer()}
				</Hidden>
			</Fragment>
		);
	}
}
const mapStateToProps = (state) => ({
	smallMenu: state.appState.smallMenu,
	drawer: state.settings.drawer,
	drawerCloseOnNav: state.settings.drawerCloseOnNav,
	headerBorder: state.settings.headerBorder,
	sideBar: state.settings.sideBar
})

const mapDispatchToProps = dispatch => ({
	changeSmallMenu: val => dispatch(changeSmallMenu(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NewSidebar))
