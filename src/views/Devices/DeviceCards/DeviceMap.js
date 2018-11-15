import React, { PureComponent } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader } from 'components';
import { Map } from 'variables/icons'
import { Grid, Checkbox } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class DeviceMap extends PureComponent {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 heatMap: false
	  }
	}
	renderMenu = () => {
		const { t } = this.props
		return <Dropdown menuItems={
			[{ label: t("actions.heatMap"), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) },
				{ label: <div>text</div>, icon: null, func: () => { } }]
		} />
	}
	render() {
		const { device, weather, t, heatData, loading } = this.props
		console.log(heatData)
		return (
			<InfoCard
				title={t("devices.cards.map")}
				subheader={`${t("devices.fields.coordsW", { lat: device.lat, long: device.long })}, Heatmap ${this.state.heatMap ? "ON" : "OFF"}`}
				avatar={<Map />}
				topAction={device.lat && device.long ? this.renderMenu() : null}
				hiddenContent={
					loading ? <CircularLoader /> :  
						<Grid container justify={'center'}>
							{device.lat && device.long ? <Maps heatMap={this.state.heatMap} t={t} isMarkerShown markers={[{ ...device, weather: weather, heatData }]} zoom={10} /> : <Caption>{t("devices.notCalibrated")}</Caption>}
						</Grid>
				} />

		)
	}
}
