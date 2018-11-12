import React, { Component } from 'react'
import { InfoCard, Caption, Dropdown, DateFilterMenu } from 'components';
import { Map } from 'variables/icons'
import { Grid, Checkbox } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class DeviceMap extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 heatMap: false
	  }
	}
	renderDateFilter = () => {
		const { classes, t } = this.props
		const { dateFilterInputID, to, from } = this.state
		return <DateFilterMenu
			classes={classes}
			t={t}
			dateFilterInputID={dateFilterInputID}
			from={from}
			to={to}
			handleDateFilter={this.handleDateFilter}
		/>
	}
	renderMenu = () => {
		const { t } = this.props
		return <Dropdown menuItems={
			[{ label: t("actions.heatMap"), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) },
				{ label: <div>text</div>, icon: null, func: () => { } }]
		} />
	}
	render() {
		const { device, weather, t } = this.props
		return (
			<InfoCard
				title={t("devices.cards.map")}
				subheader={`${t("devices.fields.coordsW", { lat: device.lat, long: device.long })}, Heatmap ${this.state.heatMap ? "ON" : "OFF"}`}
				avatar={<Map />}
				topAction={device.lat && device.long ? this.renderMenu() : null}
				hiddenContent={
					<Grid container justify={'center'}>
						{device.lat && device.long ? <Maps heatMap={this.state.heatMap} t={t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} /> : <Caption>{t("devices.notCalibrated")}</Caption>}
						
					</Grid>
				} />

		)
	}
}
