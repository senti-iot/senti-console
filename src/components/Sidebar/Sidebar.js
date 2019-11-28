import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import { Drawer, /* IconButton, */ Divider, Hidden, ButtonBase, Tooltip, Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { NavLink as Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';
// import { Menu } from 'variables/icons';
import { HeaderLinks } from 'components';
import sidebarStyle from 'assets/jss/material-dashboard-react/sidebarStyle';
import logo from 'logo.svg'

const NavLink = React.forwardRef((props, ref) => <Link {...props} innerRef={ref} />)
class Sidebar extends Component {
	constructor(props) {
		super(props)

		this.state = {

		}
	}
	dropdown = e => key => {
		this.setState({
			[key]: !this.state[key]
		})
	}
	activeRoute = (routeName) => this.props.menuRoute === routeName ? true : false;

	changeSmallMenu = () => {
		this.props.changeSmallMenu(!this.props.smallMenu)
	}
	closeDrawer = () => {
		this.props.changeSmallMenu(false)
	}
	renderPersistentDrawer = () => {  //Hide Completely
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
					if (route.dropdown) {
						return <Fragment key={index}>
							<Tooltip key={index}
								placement={'right'} title={!smallMenu ? t(route.sidebarName) : ''}>
								<ListItem
									button
									onClick={(e) => { this.dropdown(e)(route.menuRoute) }}
									to={route.path + (route.defaultView ? defaultView : '')}
									classes={{
										button: classNames({
											[classes.buttonOpen]: smallMenu,
											[classes.buttonClose]: !smallMenu,
											[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
											[classes.button]: true
										})
									}}>
									{/* <div> */}
									<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
									<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
									{/* </div> */}
								</ListItem>
							</Tooltip>
							<Collapse in={this.state[route.menuRoute]} >
								<div style={{ height: 44 * route.items.length + 88 }}>
									{route.items.map((i, index) => <Tooltip key={index + i.menuRoute}
										placement={'right'} title={!smallMenu ? t(i.sidebarName) : ''}>
										<ListItem component={NavLink}
											button
											onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
											to={i.path + (i.defaultView ? defaultView : '')}
											classes={{
												button: classNames({
													[classes.buttonOpen]: smallMenu,
													// [classes.buttonClose]: !smallMenu,
													[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
													[classes.button]: true,
													[classes.nested]: smallMenu
												})
											}}>
											<ListItemIcon className={classes.whiteFont}><i.icon /></ListItemIcon>
											<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(i.sidebarName)} />
										</ListItem>
									</Tooltip>)}
								</div>
							</Collapse>
						</Fragment>
					}
					return <ListItem component={NavLink}
						button
						to={route.path + (route.defaultView ? defaultView : '')}
						key={index}
						onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
						classes={{
							button: classNames({
								[classes.buttonOpen]: smallMenu,
								// [classes.buttonClose]: !smallMenu,
								[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
								[classes.button]: true
							})
						}}>
						<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
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
				style={{
					margin: '8px',
					paddingTop: 0,
				}}>
				{routes.map((route, index) => {

					if (route.redirect) return null;
					if (route.hideFromSideBar) return null;
					if (route.dropdown) {
						return <Fragment key={index}>
							<Tooltip key={index}
								placement={'right'} title={!smallMenu ? t(route.sidebarName) : ''}>
								<ListItem /* component={Button */
									button
									onClick={(e) => { this.dropdown(e)(route.menuRoute) }}
									to={route.path + (route.defaultView ? defaultView : '')}
									classes={{
										button: classNames({
											[classes.buttonOpen]: smallMenu,
											[classes.buttonClose]: !smallMenu,
											[classes.buttonActiveRoute]: this.props.menuRoute.includes(route.menuRoute) ? true : false,
											[classes.button]: true
										})
									}}>
									<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
									<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
								</ListItem>
							</Tooltip>
							<Collapse in={this.state[route.menuRoute]}>
								<div style={{ height: 44 * route.items.length + 88 }}>

									{route.items.map((i, index) => <Tooltip key={index + i.menuRoute}
										placement={'right'} title={!smallMenu ? t(i.sidebarName) : ''}>
										<ListItem component={NavLink}
											button
											onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
											to={i.path + (i.defaultView ? defaultView : '')}
											classes={{
												button: classNames({
													[classes.buttonOpen]: smallMenu,
													[classes.buttonClose]: !smallMenu,
													[classes.buttonActiveRoute]: this.activeRoute(i.menuRoute),
													[classes.button]: true,
													[classes.nested]: smallMenu
												})
											}}>
											<ListItemIcon className={classes.whiteFont}><i.icon /></ListItemIcon>
											<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(i.sidebarName)} />
										</ListItem>
									</Tooltip>)}
								</div>
							</Collapse>
						</Fragment>
					}
					return <Tooltip key={index}
						placement={'right'} title={!smallMenu ? t(route.sidebarName) : ''}>
						<ListItem component={NavLink}
							button
							onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
							to={route.path + (route.defaultView ? defaultView : '')}
							classes={{
								button: classNames({
									[classes.buttonOpen]: smallMenu,
									[classes.buttonClose]: !smallMenu,
									[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
									[classes.button]: true
								})
							}}>
							<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
							<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
						</ListItem>
					</Tooltip>
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
						if (route.dropdown) {
							return <Fragment key={index}>

								<ListItem /* component={Button */
									button
									onClick={(e) => { this.dropdown(e)(route.menuRoute) }}
									to={route.path + (route.defaultView ? defaultView : '')}
									classes={{
										button: classNames({
											[classes.buttonOpen]: true,
											[classes.buttonClose]: !true,
											[classes.buttonActiveRoute]: this.props.menuRoute.includes(route.menuRoute) ? true : false,
											[classes.button]: true
										})
									}}>
									<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
									<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
								</ListItem>
								<Collapse in={this.state[route.menuRoute]}>
									{route.items.map((i, ind) =>
										<ListItem component={NavLink}
											key={ind}
											button
											onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
											to={i.path + (i.defaultView ? defaultView : '')}
											classes={{
												button: classNames({
													[classes.buttonOpen]: true,
													[classes.buttonClose]: !true,
													[classes.buttonActiveRoute]: this.activeRoute(i.menuRoute),
													[classes.button]: true,
													[classes.nested]: true
												})
											}}>
											<ListItemIcon /*  */ className={classes.whiteFont}><i.icon /></ListItemIcon>
											<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(i.sidebarName)} />
										</ListItem>
									)}
								</Collapse>
							</Fragment>
						}
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
							<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
							<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
						</ListItem>
					})}
				</List>
			</div>
		</Drawer>
	}
	renderDrawer = (drawer) => {  //Hide Completely
		const { classes, smallMenu, routes, defaultView, t, headerBorder } = this.props
		const pers = drawer === 'persistent' ? true : false
		return <Drawer
			variant="permanent"
			className={classNames(classes.drawer, {
				[classes.drawerOpen]: smallMenu,
				[classes.drawerPersClose]: pers && !smallMenu,
				[classes.drawerClose]: !pers && !smallMenu,
			})}
			classes={{
				paper: classNames({
					[classes.drawerOpen]: smallMenu,
					[classes.drawerPersClose]: pers && !smallMenu,
					[classes.drawerClose]: !pers && !smallMenu,
					[classes.drawerPaper]: true,
				}),
			}}
			open={smallMenu}
		>
			<div className={classes.toolbar} />
			{headerBorder && !pers && <div className={classes.border} />}
			<List style={{
				margin: '8px',
				paddingTop: 0,
			}}>
				{routes.map((route, index) => {
					if (route.redirect) return null;
					if (route.hideFromSideBar) return null;
					if (route.dropdown) {
						return <Fragment key={index}>
							<Tooltip key={index}
								placement={'right'} title={!smallMenu ? t(route.sidebarName) : ''}>
								<ListItem
									button
									onClick={(e) => { this.dropdown(e)(route.menuRoute) }}
									to={route.path + (route.defaultView ? defaultView : '')}
									classes={{
										button: classNames({
											[classes.buttonOpen]: smallMenu,
											[classes.buttonClose]: !smallMenu,
											[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
											[classes.button]: true
										})
									}}>
									<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
									<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
								</ListItem>
							</Tooltip>
							<Collapse in={this.state[route.menuRoute]} >
								<div style={{ height: 44 * route.items.length + 88 }}>
									{route.items.map((i, index) => <Tooltip key={index + i.menuRoute}
										placement={'right'} title={!smallMenu ? t(i.sidebarName) : ''}>
										<ListItem component={NavLink}
											button
											onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
											to={i.path + (i.defaultView ? defaultView : '')}
											classes={{
												button: classNames({
													[classes.buttonOpen]: smallMenu,
													[classes.buttonClose]: !pers && !smallMenu,
													[classes.buttonActiveRoute]: this.activeRoute(i.menuRoute),
													[classes.button]: true,
													[classes.nested]: smallMenu
												})
											}}>
											<ListItemIcon className={classes.whiteFont}><i.icon /></ListItemIcon>
											<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(i.sidebarName)} />
										</ListItem>
									</Tooltip>)}
								</div>
							</Collapse>
						</Fragment>
					}
					return <Tooltip key={index}
						placement={'right'} title={!smallMenu ? t(route.sidebarName) : ''}>
						<ListItem component={NavLink}
							button
							to={route.path + (route.defaultView ? defaultView : '')}
							onClick={this.props.drawerCloseOnNav ? this.closeDrawer : undefined}
							classes={{
								button: classNames({
									[classes.buttonOpen]: smallMenu,
									[classes.buttonClose]: !pers && !smallMenu,
									[classes.buttonActiveRoute]: this.activeRoute(route.menuRoute),
									[classes.button]: true
								})
							}}>
							<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
							<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
						</ListItem>
					</Tooltip>
				})}
			</List>
		</Drawer>
	}
	smallBrand = () => {
		const { classes, defaultRoute, handleDrawerToggle, history } = this.props
		return <div className={classes.logo}>
			<ButtonBase
				focusRipple
				className={classes.image}
				focusVisibleClassName={classes.focusVisible}
				style={{
					width: '120px'
				}}
				onClick={() => { handleDrawerToggle(); history.push(defaultRoute ? defaultRoute : '/') }}
			>
				<span
					className={classes.imageSrc}
					style={{
						backgroundImage: `url(${logo})`
					}}
				/>
			</ButtonBase>
		</div>

	}
	render() {
		const { drawer } = this.props
		return (
			<Fragment>
				<Hidden mdDown>
					{this.renderDrawer(drawer)}
					{/* {drawer === 'persistent' ? this.renderPersistentDrawer() : this.renderPermanentDrawer()} */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(sidebarStyle)(Sidebar))
