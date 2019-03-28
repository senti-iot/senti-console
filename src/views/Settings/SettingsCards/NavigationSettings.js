import React, { Component } from 'react'
import { InfoCard, ItemGrid, DSelect } from 'components';
import { Public } from 'variables/icons'
import { Grid, ListItem, List, ListItemText, withStyles, Switch } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import { connect } from 'react-redux'
import { changeDefaultRoute, changeDefaultView, changeBreadCrumbs } from 'redux/settings';

class NavigationSettings extends Component {

	changeDefaultRoute = e => this.props.changeDefaultRoute(e.target.value)
	changeDefaultView = e => this.props.changeDefaultView(e.target.value)
	changeBreadCrumbs = e => this.props.changeBreadCrumbs(e.target.checked)

	render() {
		const { classes, t, defaultRoute, defaultView, user, breadcrumbs, } = this.props
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
									<DSelect menuItems={defaultRoutes} value={defaultRoute} onChange={this.changeDefaultRoute} />
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.defaultView')}</ListItemText>
									<DSelect menuItems={defaultViews} value={defaultView} onChange={this.changeDefaultView}/>
								</ItemGrid>
							</ListItem>
							<ListItem>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.breadcrumbs')}</ListItemText>
									<Switch
										checked={breadcrumbs}
										onChange={this.changeBreadCrumbs} 
									/>
									{/* <DSelect menuItems={onOff} value={breadcrumbs} onChange={this.changeBreadCrumbs} /> */}
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				}
			/> 
		)
	}
}
const mapStateToProps = state => {
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
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(settingsStyles)(NavigationSettings))