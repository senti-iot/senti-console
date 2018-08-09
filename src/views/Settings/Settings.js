import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { InfoCard, GridContainer, ItemGrid } from 'components';
// import { changeLang } from 'redux/settings';
// import { Button, Icon } from '@material-ui/core';
import { Notifications, Devices, BarChart } from '@material-ui/icons'
import CalibrationSettings from './SettingsCards/CalibrationSettings';
import DisplaySettings from './SettingsCards/DisplaySettings';
import { changeLanguage } from 'redux/localization';
import withLocalization from 'components/Localization/T';
import { changeTRP, changeTheme } from 'redux/settings';
class Settings extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 
		}
		props.setHeader(props.t("settings.pageTitle"), false)
	}
	

	render() {
		const { t } = this.props 
		const { language, changeLanguage, trp, changeTRP, theme, changeTheme  } = this.props
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
						t={t}
					/>
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<CalibrationSettings />
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<InfoCard
						noExpand
						avatar={<Notifications/>}
						title={"Notifications"} />
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<InfoCard
						noExpand
						avatar={<BarChart/>}
						title={"Charts"} />
				</ItemGrid>
				<ItemGrid xs={12} noMargin>
					<InfoCard
						noExpand
						avatar={<Devices/>}
						title={"Devices"} />
				</ItemGrid>
			</GridContainer>
		)
	}
}

const mapStateToProps = state => {
	return {
		language: state.localization.language,
		theme: state.settings.theme,
		trp: state.settings.trp
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeLanguage: code => dispatch(changeLanguage(code)),
		changeTRP: nr => dispatch(changeTRP(nr)),
		changeTheme: t => dispatch(changeTheme(t))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(Settings))
