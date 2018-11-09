import React, { Component } from 'react'
import { InfoCard, Caption } from 'components';
import { Map } from 'variables/icons'
import { Grid } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class ProjectMap extends Component {
	render() {
		const { devices, t } = this.props
		console.log(devices)
		return (
			<InfoCard
				title={t("devices.cards.map")}
				// subheader={t("devices.fields.coordsW", { lat: device.lat, long: device.long })}
				avatar={<Map />}
				// noExpand
				// collapsable
				cardExpanded={false}
				content={
					<Grid container justify={'center'}>
						{devices.length > 0 ? <Maps t={t} isMarkerShown markers={devices} zoom={10} /> : <Caption>{t("projects.noAvailableDevices")}</Caption>}
					</Grid>
				} />

		)
	}
}
