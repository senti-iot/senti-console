import { Grid, Menu, MenuItem, Divider, Tooltip, Button, Hidden } from '@material-ui/core';
import { AccountBox, Business, PowerSettingsNew, SettingsRounded, ExpandMore, /* Notifications */ } from 'variables/icons';
import headerLinksStyles from 'assets/jss/components/header/headerLinksStyles';
import React, { useState } from 'react';
import cookie from 'react-cookies';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Gravatar from 'react-gravatar'

import { logOut } from 'variables/dataLogin';
// import moment from 'moment'
// import christmas from 'assets/img/christmas'
import { /* ItemG, */ T, Muted } from 'components';
import { GoogleLogout } from 'react-google-login';
import cx from 'classnames'
import { useLocalization } from 'hooks';
// import Search from 'components/Search/Search';
// import GlobalSearch from 'components/Search/GlobalSearch';

const HeaderLinks = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	const history = useHistory()
	const classes = headerLinksStyles()
	//Redux
	const user = useSelector(state => state.settings.user)

	//State
	const [anchorProfile, setAnchorProfile] = useState(null)

	//Const

	//useCallbacks

	//useEffects

	//Handlers

	const handleProfileOpen = e => {
		setAnchorProfile(e.currentTarget)
	}

	const handleRedirectToOwnProfile = () => {
		handleProfileClose()
		if (user)
			history.push(`/management/user/${user.id}`)

	}
	const handleRedirectToOwnOrg = () => {
		handleProfileClose()
		if (user)
			history.push(`/management/org/${user.org.id}`)
	}
	const handleProfileClose = () => {
		setAnchorProfile(null)
		if (props.onClose)
			props.onClose()
	}
	const logOutFunc = async () => {
		try {
			await logOut().then(() => { })
		}
		catch (e) {
		}
		if (!cookie.load('SESSION')) {
			setAnchorProfile(null)
			history.push('/login')
			dispatch({ type: "RESET_APP" })
		}
	}
	const handleSettingsOpen = () => {
		handleProfileClose()
		if (user)
			history.push(`/settings`)
	}
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
				className={classes.dropdown}
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
					render={renderProps => (<MenuItem onClick={() => { renderProps.onClick(); logOutFunc() }}>
						<PowerSettingsNew className={classes.leftIcon} />{t('menus.user.signout')}
					</MenuItem>)}
				>

				</GoogleLogout>
			</Menu>
		</div>
	}
	return (
		<Grid container justify={'center'}>
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

export default HeaderLinks
