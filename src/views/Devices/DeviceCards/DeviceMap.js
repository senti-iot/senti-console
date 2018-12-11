import React, { PureComponent } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader } from 'components';
import { Map } from 'variables/icons'
import { Grid, Checkbox } from '@material-ui/core';
// import { Maps } from 'components/Map/Maps';
import OpenStreetMap from 'components/Map/OpenStreetMap';

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
			[{ label: t('actions.heatMap'), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) }]
		} />
	}
	render() {
		const { device, weather, t, loading } = this.props
		return (
			<InfoCard
				title={t('devices.cards.map')}
				subheader={device ? `${t('devices.fields.coordsW', { lat: device.lat, long: device.long })}, Heatmap ${this.state.heatMap ? t('actions.on') : t('actions.off')}` : null}
				avatar={<Map />}
				topAction={device ? (device.lat && device.long ? this.renderMenu() : null) : null}
				content={
					loading ? <CircularLoader /> :  
						<Grid container justify={'center'}>
							{/* {device.lat && device.long ? <Maps heatMap={this.state.heatMap} t={t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} /> : <Caption>{t('devices.notCalibrated')}</Caption>} */}
							{device.lat && device.long ? <OpenStreetMap heatMap={this.state.heatMap} t={t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} /> : <Caption>{t('devices.notCalibrated')}</Caption>}
						</Grid>
				} />

		)
	}
}
