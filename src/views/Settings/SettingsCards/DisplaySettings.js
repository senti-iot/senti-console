import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoCard, ItemGrid, DSelect, CircularLoader } from 'components';
import { Laptop } from 'variables/icons'
import { Grid, ListItem, List, ListItemText, withStyles, Switch } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import { connect } from 'react-redux'
import { changeTRP, changeTheme, changeDrawerState, changeSideBarLoc, changeDiscoverSenti, changeMapTheme, changeDetailsPanel,
	 changeSnackbarLocation, changeDrawerType, changeDrawerCloseOnNav, changeHeaderBorder, changeHoverTime } from 'redux/settings';
import { changeLanguage } from 'redux/localization';

class DisplaySettings extends Component {

	static propTypes = {
		language: PropTypes.string.isRequired
	}
	
	changeLang = (e) => this.props.changeLanguage(e.target.value)
	changeTRP = (e) => this.props.changeTRP(e.target.value)
	changeTheme = (e) => this.props.changeTheme(e.target.value)
	changeSideBarLoc = (e) => this.props.changeSideBarLoc(e.target.value)
	changeDiscoverSenti = e => this.props.changeDiscoverSenti(e.target.checked)
	changeMapTheme = e => this.props.changeMapTheme(e.target.value)
	changeSnackbarLocation = e => this.props.changeSnackbarLocation(e.target.value) 
	changeDetailsPanel = e => this.props.changeDetailsPanel(e.target.value)
	changeDrawerType = e => this.props.changeDrawerType(e.target.value)
	changeDrawerState = e => this.props.changeDrawerState(e.target.value)
	changeDrawerCloseOnNav = e => this.props.changeDrawerCloseOnNav(e.target.value)
	changeHeaderBorder = e => this.props.changeHeaderBorder(e.target.checked)
	changeHoverTime = e => this.props.changeHoverTime(e.target.value)

	render() {
		const { language, trp, sideBar, discSentiVal, theme, mapTheme, hoverTime, classes, t, snackbarLocation, detailsPanel, drawer, drawerState, drawerCloseOnNav, headerBorder } = this.props

		let languages = [
			{ value: 'en', label: t('settings.languages.en') },
			{ value: 'da', label: t('settings.languages.da') }
		]

		let mapThemes = [
			{ value: 0, label: this.props.t("map.themes.0") },
			{ value: 1, label: this.props.t("map.themes.1") },
			{ value: 2, label: this.props.t("map.themes.2") },
			{ value: 3, label: this.props.t("map.themes.3") },
			{ value: 4, label: this.props.t("map.themes.4") },
			{ value: 5, label: this.props.t("map.themes.5") },
			{ value: 6, label: this.props.t("map.themes.6") },
			{ value: 7, label: this.props.t("map.themes.7") }
		]

		let themes = [
			{ value: 1, label: t('settings.themes.dark') },
			{ value: 0, label: t('settings.themes.light') }
		]
		let trps = [
			{ value: 5, label: 5 },
			{ value: 7, label: 7 },
			{ value: 8, label: 8 },
			{ value: 10, label: 10 },
			{ value: 15, label: 15 },
			{ value: 20, label: 20 },
			{ value: 25, label: 25 },
			{ value: 50, label: 50 },
			{ value: 100, label: 100 }
		]

		let sideBarLocs = [
			{ value: 0, label: t('settings.sideBarLeft') },
			{ value: 1, label: t('settings.sideBarRight') }
		]
		let snackbarLocations = [
			{ value: 'left', label: t('settings.snackbarLocations.left') },
			{ value: 'right', label: t('settings.snackbarLocations.right') }
		]
		let detailsPanelState = [
			{ value: 0, label: t('settings.detailsPanelPos.closed') },
			{ value: 1, label: t('settings.detailsPanelPos.open') }
		]
		let drawerTypes = [
			{ value: 'permanent', label: t('settings.drawer.types.permanent') },
			{ value: 'persistent', label: t('settings.drawer.types.persistent') }
		]
		let drawerStates = [
			{ value: false, label: t('settings.drawer.states.hidden') },
			{ value: true, label: t('settings.drawer.states.open') }
		]
		let closeOnNavOpts = [
			{ value: true, label: t('settings.drawer.callbacks.closeOnNav') },
			{ value: false, label: t('settings.drawer.callbacks.notCloseOnNav') }
		]
		let hoverTimes = [
			{ value: 0, label: t('settings.hover.values.0') },
			{ value: 300,  label: t('settings.hover.values.300') },
			{ value: 500,  label: t('settings.hover.values.500') },
			{ value: 700,  label: t('settings.hover.values.700') },
			{ value: 1000, label: t('settings.hover.values.1000') },
			{ value: 2000, label: t('settings.hover.values.2000') },
			{ value: 3000, label: t('settings.hover.values.3000') },
		]
		return (
			discSentiVal !== null && language !== null && trp !== null && sideBar !== null && theme !== null ? 
				<InfoCard
					noExpand
					avatar={<Laptop />}
					title={t('settings.headers.display')}
					content={
						<Grid container>
							<List className={classes.list}>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.discoverSenti')}</ListItemText>
										<Switch 
											checked={discSentiVal}
											onChange={this.changeDiscoverSenti}/>
										{/* <DSelect menuItems={discSenti} value={discSentiVal} onChange={this.changeDiscoverSenti} /> */}
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.language')}</ListItemText>
										<DSelect menuItems={languages} value={language} onChange={this.changeLang} />
									</ItemGrid>
								</ListItem>
							
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText secondary={t('settings.justForMobile')}>{t('settings.sideBarLoc')}</ListItemText>
										<DSelect menuItems={sideBarLocs} value={sideBar} onChange={this.changeSideBarLoc} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.theme')}</ListItemText>
										<DSelect menuItems={themes} value={theme} onChange={this.changeTheme} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.map')}</ListItemText>
										<DSelect menuItems={mapThemes} value={mapTheme} onChange={this.changeMapTheme} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.snackbarLocation')}</ListItemText>
										<DSelect menuItems={snackbarLocations} value={snackbarLocation} onChange={this.changeSnackbarLocation} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.detailsPanel')}</ListItemText>
										<DSelect menuItems={detailsPanelState} value={detailsPanel} onChange={this.changeDetailsPanel} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.drawer.state')}</ListItemText>
										<DSelect menuItems={drawerStates} value={drawerState} onChange={this.changeDrawerState} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.drawer.type')}</ListItemText>
										<DSelect menuItems={drawerTypes} value={drawer} onChange={this.changeDrawerType} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.drawer.callback')}</ListItemText>
										<DSelect menuItems={closeOnNavOpts} value={drawerCloseOnNav} onChange={this.changeDrawerCloseOnNav} />
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText primary={t('settings.header.border')} />
										<Switch 
											checked={headerBorder}
											onChange={this.changeHeaderBorder}
										/>
									</ItemGrid>
								</ListItem>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText>{t('settings.tables.trp')}</ListItemText>
										<DSelect menuItems={trps} value={trp} onChange={this.changeTRP} />
									</ItemGrid>
								</ListItem>
								<ListItem>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ListItemText primary={t('settings.tables.hover')}/>
										<DSelect menuItems={hoverTimes} value={hoverTime} onChange={this.changeHoverTime}/>
									</ItemGrid>
								</ListItem>
							</List>
						</Grid>
					}
				/> : <CircularLoader notCentered/>
		)
	}
}
const mapStateToProps = state => {
	const s = state.settings
	return ({
		language: state.localization.language,
		theme: s.theme,
		trp: s.trp,
		sideBar: s.sideBar,
		discSentiVal: s.discSentiVal,
		mapTheme: s.mapTheme,
		snackbarLocation: s.snackbarLocation,
		detailsPanel: s.detailsPanel,
		drawer: s.drawer,
		drawerState: s.drawerState,
		drawerCloseOnNav: s.drawerCloseOnNav,
		headerBorder: s.headerBorder,
		hoverTime: s.hoverTime
	})
}
const mapDispatchToProps = (dispatch) => {
	return {
		changeDiscoverSenti: val => dispatch(changeDiscoverSenti(val)),
		changeLanguage: code => dispatch(changeLanguage(code)),
		changeTRP: nr => dispatch(changeTRP(nr)),
		changeTheme: t => dispatch(changeTheme(t)),
		changeSideBarLoc: loc => dispatch(changeSideBarLoc(loc)),
		changeMapTheme: t => dispatch(changeMapTheme(t)),
		changeSnackbarLocation: val => dispatch(changeSnackbarLocation(val)),
		changeDetailsPanel: val => dispatch(changeDetailsPanel(val)),
		changeDrawerType: val => dispatch(changeDrawerType(val)),
		changeDrawerState: val => dispatch(changeDrawerState(val)),
		changeDrawerCloseOnNav: val => dispatch(changeDrawerCloseOnNav(val)),
		changeHeaderBorder: val => dispatch(changeHeaderBorder(val)),
		changeHoverTime: val => dispatch(changeHoverTime(val))
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(settingsStyles)(DisplaySettings))