import React, { Component } from 'react'
import { InfoCard } from 'components';
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
				noExpand
				content={
					<Grid container justify={'center'}>
						<Maps t={this.props.t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} />
					</Grid>
				} />

		)
	}
}
