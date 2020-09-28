import React from 'react'
import { InfoCard, ItemGrid, DSelect } from 'components'
import { Public } from 'variables/icons'
import { Grid, ListItem, List, ListItemText, Switch } from '@material-ui/core'
import settingsStyles from 'assets/jss/components/settings/settingsStylesHooks'
import { changeDefaultRoute, changeDefaultView, changeBreadCrumbs, changeAutoDashboard } from 'redux/settings'
import { useLocalization, useDispatch, useSelector } from 'hooks'

const NavigationSettings = (props) => {

	//Hooks
	const dispatch = useDispatch()
	const classes = settingsStyles()
	const t = useLocalization()
	//Redux
	const autoDashboard = useSelector(s => s.settings.autoDashboard)
	const defaultRoute = useSelector(s => s.settings.defaultRoute)
	const defaultView = useSelector(s => s.settings.defaultView)
	const user = useSelector(s => s.settings.user)
	const breadcrumbs = useSelector(s => s.settings.breadcrumbs)
	const userDashboards = useSelector(s => s.settings.user?.internal?.senti?.dashboards)

	const rChangeDefaultRoute = e => dispatch(changeDefaultRoute(e.target.value))
	const rChangeDefaultView = e => dispatch(changeDefaultView(e.target.value))
	const rChangeBreadCrumbs = e => dispatch(changeBreadCrumbs(e.target.checked))
	const rChangeAutoDashboard = e => dispatch(changeAutoDashboard(e.target.value))
	//State

	//Const

	//useCallbacks

	//useEffects

	//Handlers


	let defaultRoutes = [
		{ value: '/favorites', label: t('sidebar.favorites') },
		{ value: '/dashboard', label: t('sidebar.dashboard') },
		{ value: '/projects', label: t('sidebar.projects') },
		{ value: '/devices', label: t('sidebar.devices') },
		{ value: '/collections', label: t('sidebar.collections') },
		{ value: '/management/orgs', label: t('sidebar.orgs') },
		{ value: `/management/org/${user.org.id}`, label: t('menus.user.account') },
		{ value: '/management/users', label: t('sidebar.users') },
		{ value: `/management/user/${user.id}`, label: t('menus.user.profile') },
	]
	let defaultViews = [
		{ value: '/list', label: t('settings.defaultViews.list') },
		{ value: '/grid', label: t('settings.defaultViews.grid') },
		{ value: '/favorites', label: t('settings.defaultViews.favorites') }
	]
	return (
		<InfoCard
			noExpand
			avatar={<Public />}
			title={t('settings.headers.navigation')}
			content={
				<Grid container>
					<List className={classes.list}>
						<ListItem divider>
							<ItemGrid container zeroMargin noPadding alignItems={'center'}>
								<ListItemText>{t('settings.defaultRoute')}</ListItemText>
								<DSelect menuItems={defaultRoutes} value={defaultRoute} onChange={rChangeDefaultRoute} />
							</ItemGrid>
						</ListItem>
						<ListItem divider>
							<ItemGrid container zeroMargin noPadding alignItems={'center'}>
								<ListItemText secondary={t('settings.autoOpenDashboardDesc')}>{t('settings.autoOpenDashboard')}</ListItemText>
								<DSelect
									onChange={rChangeAutoDashboard}
									value={autoDashboard}
									menuItems={userDashboards ?
										[{ value: false, label: t('no.autoDashboard') },
											...userDashboards.map(d => ({
												value: d.id, label: d.name
											}))]
										: []} />
							</ItemGrid>
						</ListItem>
						<ListItem divider>
							<ItemGrid container zeroMargin noPadding alignItems={'center'}>
								<ListItemText>{t('settings.defaultView')}</ListItemText>
								<DSelect menuItems={defaultViews} value={defaultView} onChange={rChangeDefaultView} />
							</ItemGrid>
						</ListItem>
						<ListItem>
							<ItemGrid container zeroMargin noPadding alignItems={'center'}>
								<ListItemText>{t('settings.breadcrumbs')}</ListItemText>
								<Switch
									checked={breadcrumbs}
									onChange={rChangeBreadCrumbs}
								/>
							</ItemGrid>
						</ListItem>
					</List>
				</Grid>
			}
		/>)
}

/* const mapStateToProps = state => {
	const s = state.settings
	return ({
		defaultRoute: s.defaultRoute,
		defaultView: s.defaultView,
		user: s.user,
		breadcrumbs: s.breadcrumbs

	})
}
const mapDispatchToProps = (dispatch) => {
	return {
		changeDefaultRoute: route => dispatch(changeDefaultRoute(route)),
		changeDefaultView: route => dispatch(changeDefaultView(route)),
		changeBreadCrumbs: val => dispatch(changeBreadCrumbs(val))

	}
}*/
// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(settingsStyles)(NavigationSettings))
export default NavigationSettings