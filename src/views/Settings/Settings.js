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
class Settings extends Component {


	render() {
		const { language, changeLanguage } = this.props
		return (
			<GridContainer>
				<ItemGrid xs={12} noMargin>
					<DisplaySettings
						language={language}
						changeLanguage={changeLanguage}
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
		language: state.localization.language
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeLanguage: code => dispatch(changeLanguage(code))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
