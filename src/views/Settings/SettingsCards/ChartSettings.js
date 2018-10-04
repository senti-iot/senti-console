import React, { Component } from 'react'
import { BarChart } from 'variables/icons'
import { InfoCard } from 'components';

export default class ChartSettings extends Component {

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
