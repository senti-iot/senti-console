import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GridContainer, ItemGrid } from 'components';
// import { changeLang } from 'redux/settings';
// import { Button, Icon } from '@material-ui/core';
import CalibrationSettings from './SettingsCards/CalibrationSettings';
import DisplaySettings from './SettingsCards/DisplaySettings';
import { changeLanguage } from 'redux/localization';
import withLocalization from 'components/Localization/T';
import { changeTRP, changeTheme, changeCalType, changeSideBarLoc, changeCount, changeCalNotif, changeDiscoverSenti, changeAlerts, changeDidKnow } from 'redux/settings';
import NotificationSettings from './SettingsCards/NotificationSettings';
import DeviceSettings from './SettingsCards/DeviceSettings';
import ChartSettings from './SettingsCards/ChartSettings';
class Settings extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 
		}
		props.setHeader(props.t("settings.pageTitle"), false)
	}
	

	render() {
		const { t } = this.props 
		const { language, changeLanguage, sideBar, changeSideBarLoc, trp, changeTRP, theme, changeTheme, changeDiscoverSenti, discSentiVal  } = this.props
		const { calibration, changeCalType, count, changeCount, calNotifications, changeCalNotif } = this.props
		const {	alerts, didKnow, changeAlerts, changeDidKnow } = this.props
		return (
			<GridContainer>
				<ItemGrid xs={12} noMargin>
					<DisplaySettings
						trp={trp}
						changeTRP={changeTRP}
						theme={theme}
						changeTheme={changeTheme}
						language={language}
						changeLanguage={changeLanguage}
						sideBar={sideBar}
						changeSideBarLoc={changeSideBarLoc}
						discSentiVal={discSentiVal}
						changeDiscoverSenti={changeDiscoverSenti}
						t={t}
					/>
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<CalibrationSettings
						calibration={calibration}
						changeCalType={changeCalType}
						count={count}
						changeCount={changeCount}
						calNotifications={calNotifications}
						changeCalNotif={changeCalNotif}
						t={t}/>
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<NotificationSettings
						didKnow={didKnow}
						changeDidKnow={changeDidKnow}
						alerts={alerts}
						changeAlerts={changeAlerts}
						t={t}
					/>
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<ChartSettings
						t={t}
					/>
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<DeviceSettings
						t={t}
					/>
				</ItemGrid>
			</GridContainer>
		)
	}
}

const mapStateToProps = state => {
	const s = state.settings
	return {
		language: state.localization.language,
		theme: s.theme,
		trp: s.trp,
		sideBar: s.sideBar,
		discSentiVal: s.discSentiVal,

		calibration: s.calibration,
		count: s.count,
		calNotifications: s.calNotifications,

		alerts: s.alerts,
		didKnow: s.didKnow
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeDiscoverSenti: val => dispatch(changeDiscoverSenti(val)),
		changeLanguage: code => dispatch(changeLanguage(code)),
		changeTRP: nr => dispatch(changeTRP(nr)),
		changeTheme: t => dispatch(changeTheme(t)),
		changeSideBarLoc: loc => dispatch(changeSideBarLoc(loc)),
		
		changeCalType: type => dispatch(changeCalType(type)),
		changeCount: count => dispatch(changeCount(count)),
		changeCalNotif: type => dispatch(changeCalNotif(type)),

		changeAlerts: t => dispatch(changeAlerts(t)),
		changeDidKnow: t => dispatch(changeDidKnow(t))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(Settings))
