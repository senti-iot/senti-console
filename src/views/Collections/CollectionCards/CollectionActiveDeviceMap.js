import React, { Component } from 'react'
import { InfoCard } from 'components';
import { Map } from 'variables/icons'
import { Grid } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class ActiveDeviceMap extends Component {
	render() {
		const { device, t, weather } = this.props
		return (
			<InfoCard
				title={t("devices.cards.map")}
				subheader={t("devices.fields.coordsW", { lat: device.lat, long: device.long })}
				avatar={<Map />}
				collapsable
				cardExpanded={false}
				noExpand
				content={
					<Grid container justify={'center'}>
						{device.lat && device.long ? <Maps t={this.props.t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={18} /> : null}
					</Grid>
				} />

		)
	}
}
