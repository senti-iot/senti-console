import { AppBar, Button, Hidden, IconButton, Toolbar, withStyles, /* Link, */ ButtonBase } from '@material-ui/core';
import { KeyboardArrowLeft, Menu } from 'variables/icons';
import headerStyle from 'assets/jss/material-dashboard-react/headerStyle.js';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import HeaderLinks from './HeaderLinks';
import { useDispatch } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';
import { useHistory, useSelector, useTheme, useLocalization } from 'hooks'
import logo from 'logo.svg';

const Brand = (props) => {

	const defaultRoute = useSelector(s => s.settings.defaultRoute)

	const theme = useTheme()
	const history = useHistory()

	const { classes } = props
	console.log(theme)
	return <ButtonBase
		focusRipple
		className={classes.image}
		focusVisibleClassName={classes.focusVisible}
		style={{
			width: '120px'
		}}
		onClick={() => history.push(defaultRoute ? defaultRoute : '/')}
	>
		<span
			className={classes.imageSrc}
			style={{
				backgroundImage: `url(${theme.logo ? theme.logo : logo})`
			}}
		/>
	</ButtonBase>
}

function Header({ ...props }) {

	const headerBorder = useSelector(s => s.settings.headerBorder)
	const menuPos = useSelector(s => s.settings.sideBar)
	const smallMenu = useSelector(s => s.appState.smallMenu)
	const { classes, goBackButton, gbbFunc } = props;

	const t = useLocalization()
	const dispatch = useDispatch()

	const changeMenu = () => dispatch(changeSmallMenu(!smallMenu))


	const renderSearch = () => {
		// const { globalSearch } = props
		// return globalSearch ? <GlobalSearch /> : null
		return null
	}
	return (
		<AppBar className={classes.appBar} >

			<Toolbar className={classes.container}>
				{!menuPos ? <Hidden lgUp>
					<IconButton
						className={classes.appResponsive}
						color='primary'
						aria-label='open drawer'
						onClick={props.handleDrawerToggle}
					>
						<Menu />
					</IconButton>
				</Hidden> : null
				}
				<Hidden mdDown>
					<IconButton onClick={changeMenu} className={classes.drawerButton}>
						<Menu />
					</IconButton>
					<div className={classes.logoContainer}>
						<Brand classes={classes} />
					</div>
					{headerBorder && <div style={{ height: 'calc(100% - 30%)', width: 1, background: '#555555' }} />}
				</Hidden>
				<div className={classes.flex}>
					{goBackButton && <IconButton onClick={gbbFunc} variant={'fab'} className={classes.goBackButton}>
						<KeyboardArrowLeft width={40} height={40} />
					</IconButton>}
					<Button className={classes.title}>
						{props.headerTitle ? t(props.headerTitle, props.headerOptions) ? t(props.headerTitle, props.headerOptions) : props.headerTitle : ''}
					</Button>
				</div>
				<Hidden mdDown implementation='css'>
					<HeaderLinks t={t} />
				</Hidden>
				<Hidden lgUp>
					{menuPos ?
						<Fragment>
							{renderSearch()}
							<IconButton
								className={classes.appResponsive}
								color='primary'
								aria-label='open drawer'
								onClick={props.handleDrawerToggle}
							>
								<Menu />
							</IconButton>
						</Fragment>
						: renderSearch()
					}</Hidden>
			</Toolbar>
		</AppBar>
	);
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger'])
};


export default withStyles(headerStyle)(Header)
