import { AppBar, Button, Hidden, IconButton, Toolbar, withStyles, /* Link, */ ButtonBase } from '@material-ui/core';
import { KeyboardArrowLeft, Menu } from 'variables/icons';
import headerStyle from 'assets/jss/material-dashboard-react/headerStyle.js';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import HeaderLinks from './HeaderLinks';
import { connect } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';
import { useHistory, useSelector } from 'hooks'

// import GlobalSearch from 'components/Search/GlobalSearch';




function Header({ ...props }) {
	const { classes, goBackButton, gbbFunc, logo, t, headerBorder, menuPos } = props;

	const defaultRoute = useSelector(s => s.settings.defaultRoute)
	const history = useHistory()

	var brand = (
		<ButtonBase
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
					backgroundImage: `url(${logo})`
				}}
			/>
		</ButtonBase>
	);
	const renderSearch = () => {
		// const { globalSearch } = props
		// return globalSearch ? <GlobalSearch /> : null
		return null
	}
	const changeSmallMenu = () => props.changeSmallMenu(!props.smallMenu)
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
					<IconButton onClick={changeSmallMenu} className={classes.drawerButton}>
						<Menu />
					</IconButton>
					<div className={classes.logoContainer}>
						{brand}
					</div>
					{headerBorder && <div style={{ height: 'calc(100% - 30%)', width: 1, background: '#555555' }} />}
				</Hidden>
				<div className={classes.flex}>

					{/* <div style={{ minWidth: 53, display: 'flex', alignItems: 'center' }}> */}
					{goBackButton && <IconButton onClick={gbbFunc} variant={'fab'} className={classes.goBackButton}>
						<KeyboardArrowLeft width={40} height={40} />
					</IconButton>}
					{/* </div> */}
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
const mapStateToProps = (state) => ({
	smallMenu: state.appState.smallMenu,
	headerBorder: state.settings.headerBorder,
	menuPos: state.settings.sideBar,
	globalSearch: state.settings.globalSearch
})

const mapDispatchToProps = dispatch => ({
	changeSmallMenu: smallMenu => dispatch(changeSmallMenu(smallMenu))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(headerStyle)(Header))
