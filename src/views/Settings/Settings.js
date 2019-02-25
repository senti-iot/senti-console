import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { GridContainer, ItemGrid } from 'components';
import CalibrationSettings from './SettingsCards/CalibrationSettings';
import DisplaySettings from './SettingsCards/DisplaySettings';
import { changeLanguage } from 'redux/localization';
import withLocalization from 'components/Localization/T';
import { changeTRP, changeDefaultRoute, changeTheme, changeChartType, changeCalType, changeSideBarLoc, changeCount, changeCalNotif, changeDiscoverSenti, changeAlerts, changeDidKnow, saveSettingsOnServ, finishedSaving, changeChartDataType, changeTCount, changeMapTheme, removeChartPeriod, updateChartPeriod } from 'redux/settings';
import ChartSettings from './SettingsCards/ChartSettings';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Toolbar from 'components/Toolbar/Toolbar';
import { Laptop, Build, Notifications, BarChart, Assignment } from 'variables/icons';
import TermsAndConditionsSettings from './SettingsCards/TermsAndConditionsSettings';

class Settings extends Component {
	constructor(props) {
		super(props)

		this.state = {

		}
		props.setHeader('settings.pageTitle', false, '', 'settings')
	}
	tabs = [
		{ id: 0, title: '', label: <Laptop />, url: `#display` },
		{ id: 1, title: '', label: <Build />, url: `#calibration` },
		{ id: 2, title: '', label: <Notifications />, url: `#notifications` },
		{ id: 3, title: '', label: <BarChart />, url: `#charts` },
		{ id: 4, title: '', label: <Assignment />, url: '#termsAndConditions' }
	]
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.saved === true) {
			this.props.s('snackbars.settingsSaved')
			this.props.finishedSaving()
		}
	}

	render() {
		const { t } = this.props
		const { language, sideBar, changeSideBarLoc, trp, changeTRP, theme, changeTheme, changeDiscoverSenti, discSentiVal, changeLanguage, changeChartType } = this.props
		const { calibration, changeCalType, count, changeCount, changeTCount, calNotifications, changeCalNotif, rawData, changeDefaultRoute, defaultRoute } = this.props
		const { updateChartPeriod, removeChartPeriod, chartType, changeChartDataType, tcount, mapTheme, changeMapTheme, periods } = this.props
		return (
			<Fragment>
				<Toolbar
					noSearch
					history={this.props.history}
					match={this.props.match}
					tabs={this.tabs}
				/>
				<GridContainer>
					<ItemGrid xs={12} noMargin id={'display'}>
						<DisplaySettings
							changeDefaultRoute={changeDefaultRoute}
							defaultRoute={defaultRoute}
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
							mapTheme={mapTheme}
							changeMapTheme={changeMapTheme}
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
							chartType={chartType}
							chartDataType={rawData}
							changeChartType={changeChartType}
							changeChartDataType={changeChartDataType}
							updateChartPeriod={updateChartPeriod}
							removeChartPeriod={removeChartPeriod}
							t={t}
							periods={periods}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'termsAndConditions'}>
						<TermsAndConditionsSettings t={t}/>
					</ItemGrid>
				</GridContainer>
			</Fragment>

		)
	}
}

const mapStateToProps = state => {
	const s = state.settings
	return {
		saved: s.saved,
		settings: s,
		language: state.localization.language,
		theme: s.theme,
		trp: s.trp,
		sideBar: s.sideBar,
		discSentiVal: s.discSentiVal,
		mapTheme: s.mapTheme,
		defaultRoute: s.defaultRoute,

		calibration: s.calibration,
		count: s.count,
		tcount: s.tcount,
		calNotifications: s.calNotifications,
		
		chartType: s.chartType,
		rawData: s.rawData,
		periods: s.periods,

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
		changeMapTheme: t => dispatch(changeMapTheme(t)),
		changeDefaultRoute: route => dispatch(changeDefaultRoute(route)),

		changeCalType: type => dispatch(changeCalType(type)),
		changeCount: count => dispatch(changeCount(count)),
		changeTCount: tcount => dispatch(changeTCount(tcount)),
		changeCalNotif: type => dispatch(changeCalNotif(type)),

		changeAlerts: t => dispatch(changeAlerts(t)),
		changeDidKnow: t => dispatch(changeDidKnow(t)),

		changeChartType: type => dispatch(changeChartType(type)),
		changeChartDataType: type => dispatch(changeChartDataType(type)),
		
		removeChartPeriod: pId => dispatch(removeChartPeriod(pId)),
		updateChartPeriod: p => dispatch(updateChartPeriod(p)),

		saveSettings: () => dispatch(saveSettingsOnServ()),
		finishedSaving: () => dispatch(finishedSaving())
	}
}
const Setting = compose(withLocalization(), withSnackbar())(Settings)
export default connect(mapStateToProps, mapDispatchToProps)(Setting)
