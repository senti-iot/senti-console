import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoCard } from 'components';
import { Devices } from '@material-ui/icons'
export default class DeviceSettings extends Component {
	static propTypes = {
		prop: PropTypes
	}

	render() {
		const { t } = this.props
		return (
			<InfoCard
				noExpand
				avatar={<Devices />}
				title={t("settings.headers.devices")} />
		)
	}
}
