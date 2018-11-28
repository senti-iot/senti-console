import React, { Component } from 'react'
import { InfoCard } from 'components';
import { Devices } from 'variables/icons'
export default class DeviceSettings extends Component {
	render() {
		const { t } = this.props
		return (
			<InfoCard
				noExpand
				avatar={<Devices />}
				title={t('settings.headers.devices')} />
		)
	}
}
