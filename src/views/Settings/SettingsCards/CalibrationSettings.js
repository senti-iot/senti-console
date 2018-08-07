import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { InfoCard } from 'components';
import { Build } from '@material-ui/icons'

//Method ( Time/ Hits) + how many minutes/hits
//Notifications
//
export default class CalibrationSettings extends Component {
	static propTypes = {
	}

	render() {
		return (
			<InfoCard
				noExpand
				avatar={<Build />}
				title={"Calibration"} />
		)
	}
}
