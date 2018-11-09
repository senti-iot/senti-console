import React, { Component } from 'react'
import { InfoCard, Caption } from 'components';
import { Map } from 'variables/icons'
import { Grid } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class DeviceMap extends Component {
	render() {
		const { device, weather, t } = this.props
		return (
			<InfoCard
				title={t("devices.cards.map")}
				subheader={t("devices.fields.coordsW", { lat: device.lat, long: device.long })}
				avatar={<Map />}
				hiddenContent={
					<Grid container justify={'center'}>
						{device.lat && device.long ? <Maps t={t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} /> : <Caption>{t("devices.notCalibrated")}</Caption>}
						
					</Grid>
				} />

		)
	}
}
