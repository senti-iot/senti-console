import React, { Component } from 'react'
import { InfoCard } from 'components';
import { Map } from 'variables/icons'
import { Grid } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class ProjectMap extends Component {
	render() {
		const { devices, t } = this.props
		return (
			<InfoCard
				title={t("devices.cards.map")}
				// subheader={t("devices.fields.coordsW", { lat: device.lat, long: device.long })}
				avatar={<Map />}
				noExpand
				content={
					<Grid container justify={'center'}>
						<Maps t={this.props.t} isMarkerShown markers={devices} zoom={10} />
					</Grid>
				} />

		)
	}
}
