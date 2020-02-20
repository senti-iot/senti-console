import React, { Fragment, useState } from 'react'
import classNames from 'classnames'
import { Drawer, /* IconButton, */ Divider, Hidden, ButtonBase, Tooltip, Collapse, useTheme } from '@material-ui/core';
import { NavLink as Link, useHistory } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch, useSelector } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';
// import { Menu } from 'variables/icons';
import { HeaderLinks } from 'components';
import sidebarStyles from 'assets/jss/components/sidebar/sidebarStyles';
import logo from 'logo.svg'
import { useLocalization } from 'hooks';

const NavLink = React.forwardRef((props, ref) => <Link {...props} innerRef={ref} />)

const Sidebar = (props) => {
	//Hooks
	const dispatch = useDispatch()
	const history = useHistory()
	const t = useLocalization()
	const theme = useTheme()
	//Redux
	const smallMenu = useSelector(s => s.appState.smallMenu)
	const drawer = useSelector(s => s.settings.drawer)
	const drawerCloseOnNav = useSelector(s => s.settings.drawerCloseOnNav)
	const headerBorder = useSelector(s => s.settings.headerBorder)
	const sideBar = useSelector(s => s.settings.sideBar)

	//State
	const [dropdown, setDropdown] = useState([])

	//Const
	const { defaultRoute, defaultView, routes, handleDrawerToggle, open, menuRoute } = props
	const classes = sidebarStyles()
	//Handlers

	const isActiveRoute = (routeName) => menuRoute === routeName ? true : false;

	const handleDropdown = e => key => {
		let nDropdown = [...dropdown]
		if (dropdown.indexOf(key) > -1) {
			nDropdown.splice(dropdown.indexOf(key), 1)
		}
		else {
			nDropdown.push(key)
		}
		setDropdown(nDropdown)
	}

	const handleCloseDrawer = () => {
		dispatch(changeSmallMenu(false))
	}

	//Render
	const SmallBrand = () => {
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
						backgroundImage: `url(${theme.logo ? theme.logo : logo})`
					}}
				/>
			</ButtonBase>
		</div>

	}

	const renderMobileDrawer = () => {
		return <Drawer
			variant='temporary'
			anchor={sideBar ? 'right' : 'left'}
			open={open}
			classes={{
				paper: classNames({ [classes.drawerPaper]: true, [classes.drawerOpen]: true })
			}}
			onClose={handleDrawerToggle}
			ModalProps={{
				keepMounted: true
			}}
		>
			{SmallBrand()}
			<div className={classes.sidebarWrapper}>
				<div className={classes.appBarWrapper}>
					<HeaderLinks t={t} onClose={handleDrawerToggle} />
				</div>
				<Divider />
				<List style={{
					margin: '16px',
					paddingTop: 0,
				}}>
					{routes.map((route, index) => {
						if (route.divider) {
							return <Divider key={index} />
						}
						if (route.redirect) return null;
						if (route.hideFromSideBar) return null;
						if (route.dropdown) {
							return <Fragment key={index}>

								<ListItem /* component={Button */
									button
									onClick={(e) => { handleDropdown(e)(route.menuRoute) }}
									to={route.path + (route.defaultView ? defaultView : '')}
									classes={{
										button: classNames({
											[classes.buttonOpen]: true,
											[classes.buttonClose]: !true,
											[classes.buttonActiveRoute]: menuRoute.includes(route.menuRoute) ? true : false,
											[classes.button]: true
										})
									}}>
									<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
									<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
								</ListItem>
								<Collapse in={dropdown.indexOf(route.menuRoute) > -1 ? true : false}>
									{route.items.map((i, ind) =>
										<ListItem component={NavLink}
											key={ind}
											button
											onClick={drawerCloseOnNav ? handleCloseDrawer : undefined}
											to={i.path + (i.defaultView ? defaultView : '')}
											classes={{
												button: classNames({
													[classes.buttonOpen]: true,
													[classes.buttonClose]: !true,
													[classes.buttonActiveRoute]: isActiveRoute(i.menuRoute),
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
							onClick={handleDrawerToggle}
							key={index}
							classes={{
								button: classNames({
									[classes.buttonOpen]: true,
									// [classes.buttonClose]: true,
									[classes.buttonActiveRoute]: isActiveRoute(route.menuRoute),
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
	const renderDrawer = (drawer) => {  //Hide Completely
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
					if (route.divider) {
						return <Divider key={index} />
					}
					if (route.redirect) return null;
					if (route.hideFromSideBar) return null;
					if (route.dropdown) {
						return <Fragment key={index}>
							<Tooltip key={index}
								placement={'right'} title={!smallMenu ? t(route.sidebarName) : ''}>
								<ListItem
									button
									onClick={(e) => { handleDropdown(e)(route.menuRoute) }}
									to={route.path + (route.defaultView ? defaultView : '')}
									classes={{
										button: classNames({
											[classes.buttonOpen]: smallMenu,
											[classes.buttonClose]: !smallMenu,
											[classes.buttonActiveRoute]: isActiveRoute(route.menuRoute),
											[classes.button]: true
										})
									}}>
									<ListItemIcon className={classes.whiteFont}><route.icon /></ListItemIcon>
									<ListItemText disableTypography={true} className={classes.whiteFont} primary={t(route.sidebarName)} />
								</ListItem>
							</Tooltip>
							<Collapse in={dropdown.indexOf(route.menuRoute) > -1 ? true : false} >
								<div style={{ height: 44 * route.items.length + 88 }}>
									{route.items.map((i, index) => <Tooltip key={index + i.menuRoute}
										placement={'right'} title={!smallMenu ? t(i.sidebarName) : ''}>
										<ListItem component={NavLink}
											button
											onClick={drawerCloseOnNav ? handleCloseDrawer : undefined}
											to={i.path + (i.defaultView ? defaultView : '')}
											classes={{
												button: classNames({
													[classes.buttonOpen]: smallMenu,
													[classes.buttonClose]: !pers && !smallMenu,
													[classes.buttonActiveRoute]: isActiveRoute(i.menuRoute),
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
							onClick={drawerCloseOnNav ? handleCloseDrawer : undefined}
							classes={{
								button: classNames({
									[classes.buttonOpen]: smallMenu,
									[classes.buttonClose]: !pers && !smallMenu,
									[classes.buttonActiveRoute]: isActiveRoute(route.menuRoute),
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


	return (
		<Fragment>
			<Hidden mdDown>
				{renderDrawer(drawer)}
			</Hidden>
			<Hidden lgUp>
				{renderMobileDrawer()}
			</Hidden>
		</Fragment>
	);

}

export default Sidebar
