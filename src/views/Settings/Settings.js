import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { GridContainer, ItemGrid } from 'components';
import CalibrationSettings from './SettingsCards/CalibrationSettings';
import DisplaySettings from './SettingsCards/DisplaySettings';
import withLocalization from 'components/Localization/T';
import { changeCalType, changeCount, changeCalNotif, changeAlerts, changeDidKnow, saveSettingsOnServ, finishedSaving, changeTCount } from 'redux/settings';
import ChartSettings from './SettingsCards/ChartSettings';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
// import Toolbar from 'components/Toolbar/Toolbar';
import { Laptop, Build, /* Notifications, */ BarChart, Assignment, Public } from 'variables/icons';
import TermsAndConditionsSettings from './SettingsCards/TermsAndConditionsSettings';
import NavigationSettings from './SettingsCards/NavigationSettings';
import ResetSettings from './SettingsCards/ResetSettings';

class Settings extends Component {
	constructor(props) {
		super(props)

		this.state = {

		}
		props.setHeader('settings.pageTitle', false, '', 'settings')
		props.setTabs({
			id: 'settings',
			tabs: this.tabs,
			hashLinks: true,
			route: 0
		})
	}
	tabs = [
		{ id: 0, title: '', label: <Laptop />, url: `#display` },
		{ id: 1, title: '', label: <Public />, url: `#navigation` },
		{ id: 2, title: '', label: <Build />, url: `#calibration` },
		// { id: 2, title: '', label: <Notifications />, url: `#notifications` },
		{ id: 3, title: '', label: <BarChart />, url: `#charts` },
		{ id: 4, title: '', label: <Assignment />, url: '#termsAndConditions' }
	]
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			this.props.s('snackbars.settingsSaved')
			this.props.finishedSaving()
		}
	}

	render() {
		const { t } = this.props
		const { calibration, changeCalType, count, changeCount, changeTCount, calNotifications, changeCalNotif, history } = this.props
		const { tcount } = this.props
		const reset = this.props.location.pathname.includes('reset') ? true : false
		return (
			<Fragment>
				<GridContainer>
					{reset ? <ItemGrid xs={12} noMargin>
						<ResetSettings history={history} t={t}/>
					</ItemGrid> : <Fragment>
						<ItemGrid xs={12} noMargin id={'display'}>
							<DisplaySettings
								t={t}/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id={'navigation'}>
							<NavigationSettings
								t={t}
							/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id={'calibration'}>
							<CalibrationSettings
								calibration={calibration}
								changeCalType={changeCalType}
								count={count}
								tcount={tcount}
								changeCount={changeCount}
								changeTCount={changeTCount}
								calNotifications={calNotifications}
								changeCalNotif={changeCalNotif}
								t={t} />
						</ItemGrid>
						<ItemGrid xs={12} noMargin id={'charts'}>
							<ChartSettings
								t={t}
							/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id={'termsAndConditions'}>
							<TermsAndConditionsSettings history={history} t={t}/>
						</ItemGrid>
					</Fragment>}
				</GridContainer>
			</Fragment>

		)
	}
}

const mapStateToProps = state => {
	const s = state.settings
	return {
		saved: s.saved,

		calibration: s.calibration,
		count: s.count,
		tcount: s.tcount,
		calNotifications: s.calNotifications,

		alerts: s.alerts,
		didKnow: s.didKnow
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		// changeDiscoverSenti: val => dispatch(changeDiscoverSenti(val)),
		// changeLanguage: code => dispatch(changeLanguage(code)),
		// changeTRP: nr => dispatch(changeTRP(nr)),
		// changeTheme: t => dispatch(changeTheme(t)),
		// changeSideBarLoc: loc => dispatch(changeSideBarLoc(loc)),
		// changeMapTheme: t => dispatch(changeMapTheme(t)),
		// changeDefaultRoute: route => dispatch(changeDefaultRoute(route)),

		changeCalType: type => dispatch(changeCalType(type)),
		changeCount: count => dispatch(changeCount(count)),
		changeTCount: tcount => dispatch(changeTCount(tcount)),
		changeCalNotif: type => dispatch(changeCalNotif(type)),

		changeAlerts: t => dispatch(changeAlerts(t)),
		changeDidKnow: t => dispatch(changeDidKnow(t)),

		// changeChartType: type => dispatch(changeChartType(type)),
		// changeChartDataType: type => dispatch(changeChartDataType(type)),
		
		// removeChartPeriod: pId => dispatch(removeChartPeriod(pId)),
		// updateChartPeriod: p => dispatch(updateChartPeriod(p)),

		saveSettings: () => dispatch(saveSettingsOnServ()),
		finishedSaving: () => dispatch(finishedSaving())
	}
}
const Setting = compose(withLocalization(), withSnackbar())(Settings)
export default connect(mapStateToProps, mapDispatchToProps)(Setting)
