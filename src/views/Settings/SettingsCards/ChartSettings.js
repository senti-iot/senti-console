import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BarChart } from '@material-ui/icons'
import { InfoCard } from 'components';

export default class ChartSettings extends Component {
	static propTypes = {
		prop: PropTypes
	}

	render() {
		const { t } = this.props
		return (
			<InfoCard
				noExpand
				avatar={<BarChart />}
				title={t("settings.headers.charts")} />
		)
	}
}
