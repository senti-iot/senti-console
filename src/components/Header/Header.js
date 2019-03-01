import { AppBar, Button, Hidden, IconButton, Toolbar, withStyles, /* Link, */ ButtonBase } from '@material-ui/core';
import { KeyboardArrowLeft, Menu } from 'variables/icons';
import headerStyle from 'assets/jss/material-dashboard-react/headerStyle.js';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderLinks from './HeaderLinks';
import { connect } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';




function Header({ ...props }) {
	const { classes, goBackButton, gbbFunc, defaultRoute, logo, t } = props;
	var brand = (


		<ButtonBase
			focusRipple
			className={classes.image}
			focusVisibleClassName={classes.focusVisible}
			style={{
				width: '150px'
			}}
			onClick={() => props.history.push(defaultRoute ? defaultRoute : '/')}
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
		// {/* 			
		// <ButtonBase className={classes.image} component={Link} to={defaultRoute ? defaultRoute : '/'}>
		// 	<span style={{ backgroundImage: `url(${logo})` }} alt='logo' className={classes.imageButton}/>
		// </ButtonBase> */}
	);
	// const changeSmallMenu = () => props.changeSmallMenu(!props.smallMenu)
	return (
		<AppBar className={classes.appBar} >
		
			<Toolbar className={classes.container}>
				{/* 
					<IconButton onClick={changeSmallMenu}>
						<Menu />
					</IconButton>

				</Hidden> */}
				<Hidden mdDown>
					<div className={classes.logoContainer}>
						{brand}
					</div>
				</Hidden>
				<div style={{ height: 'calc(100% - 30%)', width: 1, background: '#555555' }}/>
				<div className={classes.flex}>
					<div style={{ minWidth: 53, display: 'flex', alignItems: 'center' }}>
						{goBackButton && <IconButton onClick={gbbFunc} variant={'fab'} className={classes.goBackButton}>
							<KeyboardArrowLeft width={40} height={40} />
						</IconButton>}
					</div>
					<Button className={classes.title}>
						{props.headerTitle ? t(props.headerTitle.id, props.headerTitle.options) ? t(props.headerTitle.id, props.headerTitle.options) : props.headerTitle.id : ''}
					</Button>
				</div>
				<Hidden mdDown implementation='css'>
					<HeaderLinks t={t} />
				</Hidden>
				<Hidden lgUp>
					<IconButton
						className={classes.appResponsive}
						color='primary'
						aria-label='open drawer'
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
	color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger'])
};
const mapStateToProps = (state) => ({
	smallMenu: state.appState.smallMenu
})

const mapDispatchToProps = dispatch => ({
	changeSmallMenu: smallMenu => dispatch(changeSmallMenu(smallMenu))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(headerStyle)(Header))
