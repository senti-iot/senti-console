import { Grid, Menu, MenuItem, withStyles, Divider, Tooltip, Button, Hidden } from '@material-ui/core';
import { AccountBox, Business, PowerSettingsNew, SettingsRounded, ExpandMore, /* Notifications */ } from 'variables/icons';
import headerLinksStyle from 'assets/jss/material-dashboard-react/headerLinksStyle';
import React, { useState } from 'react';
import cookie from 'react-cookies';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Gravatar from 'react-gravatar'
// eslint-disable-next-line no-unused-vars
import { logOut } from 'variables/dataLogin';
// import moment from 'moment'
// import christmas from 'assets/img/christmas'
import { /* ItemG, */ T, Muted } from 'components';
import { GoogleLogout } from 'react-google-login';
import cx from 'classnames'
import { useLocalization } from 'hooks';
// import Search from 'components/Search/Search';
// import GlobalSearch from 'components/Search/GlobalSearch';

// const mapStateToProps = (state) => ({
// 	user: state.settings.user,
// 	globalSearch: state.settings.globalSearch
// })

// const mapDispatchToProps = dispatch => ({
// 	resetRedux: () => dispatch({ type: "RESET_APP" })
// })

const HeaderLinks = props => {
	const t = useLocalization()
	const dispatch = useDispatch()
	const user = useSelector(state => state.settings.user)
	// const globalSearch = useSelector(state => state.settings.globalSearch)

	const [anchorProfile, setAnchorProfile] = useState(null)
	// state = {
	// 	anchorProfile: null
	// };

	const handleProfileOpen = e => {
		setAnchorProfile(e.currentTarget)
		// this.setState({ anchorProfile: e.currentTarget })
	}
	// const handleRedirectToChristmas = () => {
	// 	props.history.push(`/holiday`)
	// }
	const handleRedirectToOwnProfile = () => {
		handleProfileClose()
		if (props.user)
			props.history.push(`/management/user/${props.user.id}`)

	}
	const handleRedirectToOwnOrg = () => {
		handleProfileClose()
		if (props.user)
			props.history.push(`/management/org/${props.user.org.id}`)
	}
	const handleProfileClose = () => {
		setAnchorProfile(null)
		// this.setState({ anchorProfile: null })
		if (props.onClose)
			props.onClose()
	}
	const logOut = async () => {
		try {
			await logOut().then(() => { })
		}
		catch (e) {
		}
		if (!cookie.load('SESSION')) {
			setAnchorProfile(null)
			// this.setState({ anchorPofile: null })
			props.history.push('/login')
			dispatch({ type: "RESET_APP" })
		}
		// this.setState({ anchorProfile: null })
	}
	const handleSettingsOpen = () => {
		handleProfileClose()
		if (props.user)
			props.history.push(`/settings`)
	}
	// renderChristmasIcon = () => {
	// 	const { classes } = this.props
	// 	if (moment().format('MM') === '12') {
	// 		let today = moment().format('DD')
	// 		return today
	// 	}
	// 	else
	// 	{
	// 		if (moment().format('MM') === '11') {
	// 			return <IconButton onClick={this.handleRedirectToChristmas}>
	// 				<img src={christmas[0]} className={classes.img} alt={'christmas'} />
	// 			</IconButton>
	// 		}
	// 		return null
	// 	}

	// }
	const renderSearch = () => {
		// const { globalSearch } = this.props
		// return globalSearch ? <GlobalSearch /> : null
		return null
	}
	// renderNotifications = () => {
	// 	return <ItemG container style={{ width: 'auto', alignItems: 'center', marginLeft: 8, marginRight: 8, }}>
	// 		<Notifications />
	// 	</ItemG>
	// }
	const renderUserMenu = () => {
		const { classes } = props;
		const openProfile = Boolean(anchorProfile)

		return <div>
			<Tooltip title={t('menus.user.profile')}>

				<Button
					aria-owns={openProfile ? 'menu-appbar' : null}
					aria-haspopup='true'
					onClick={handleProfileOpen}
					classes={{
						root: classes.iconRoot
					}}
				>
					<ExpandMore className={cx(classes.expand, {
						[classes.expandOpen]: openProfile,
					})} />
					{user ? <T className={classes.userDropdown}>{`${user.firstName}`}</T> : null}
					{user ? user.img ? <img src={user.img} alt='UserProfile' className={classes.img} /> : <Gravatar default='mp' email={user.email} className={classes.img} size={36} /> : null}
				</Button>
			</Tooltip>
			<Menu

				style={{ marginTop: 50 }}
				id='menu-appbar'
				anchorEl={anchorProfile}
				// anchorOrigin={{
				// 	// vertical: 'bottom',
				// 	horizontal: 'right',
				// }}
				className={classes.dorpdown}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={openProfile}
				onClose={handleProfileClose}
				disableAutoFocusItem
			>
				{user ?
					<MenuItem disableRipple component={'div'} className={classes.nameAndEmail}>
						<T style={{ fontSize: '1rem' }}>{`${user.firstName} ${user.lastName}`}</T>
						<Muted style={{ fontSize: '0.875rem' }}>{user.email}</Muted>
					</MenuItem>
					: null}
				<Divider />
				<MenuItem onClick={handleRedirectToOwnProfile}>
					<AccountBox className={classes.leftIcon} />{t('menus.user.profile')}
				</MenuItem>
				{user ? user.privileges.apiorg.editusers ? <MenuItem onClick={handleRedirectToOwnOrg}>
					<Business className={classes.leftIcon} />{t('menus.user.account')}
				</MenuItem> : null : null}
				<MenuItem onClick={handleSettingsOpen}>
					<SettingsRounded className={classes.leftIcon} />{t('sidebar.settings')}
				</MenuItem>
				<GoogleLogout
					// onLogoutSuccess={() => this.logOut()}
					clientId="1038408973194-qcb30o8t7opc83k158irkdiar20l3t2a.apps.googleusercontent.com"
					render={renderProps => (<MenuItem onClick={() => { renderProps.onClick(); logOut() }}>
						<PowerSettingsNew className={classes.leftIcon} />{t('menus.user.signout')}
					</MenuItem>)}
				>

				</GoogleLogout>
			</Menu>
		</div>
	}
	const { classes } = props;

	return (
		<Grid container justify={'center'} classes={{ container: classes.headerMargin }}>
			{/* <ItemG>
					{this.renderChristmasIcon()}
				</ItemG> */}
			<Hidden mdDown>
				{renderSearch()}
			</Hidden>
			{renderUserMenu()}
			{/* {this.renderNotifications()} */}
		</Grid>
	);
}

export default withRouter(withStyles(headerLinksStyle)(HeaderLinks))
