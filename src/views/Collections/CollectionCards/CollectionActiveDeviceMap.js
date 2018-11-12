import React, { Component } from 'react'
import { InfoCard, Caption, Dropdown } from 'components';
import { Map } from 'variables/icons'
import { Grid, Checkbox } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class ActiveDeviceMap extends Component {
	constructor(props) {
		super(props)

		this.state = {
			heatMap: false
		}
	}

	renderMenu = () => {
		const { t } = this.props
		return <Dropdown menuItems={
			[
				{ label: t("actions.heatMap"), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) },
			]
		} />
	}
	render() {
		const { device, t, weather } = this.props
		return (
			<InfoCard
				title={t("devices.cards.map")}
				subheader={`${t("devices.fields.coordsW", { lat: device.lat, long: device.long })}, Heatmap ${this.state.heatMap ? "ON" : "OFF"}`}
				avatar={<Map />}
				topAction={device.lat && device.long ? this.renderMenu() : null}
				hiddenContent={
					<Grid container justify={'center'}>
						{device.lat && device.long ? <Maps heatMap={this.state.heatMap} t={this.props.t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={18} /> : <Caption>{t("devices.notCalibrated")}</Caption>}
					</Grid>
				} />

		)
	}
}
