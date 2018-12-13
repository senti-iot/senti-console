import React, { PureComponent, Fragment } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader, ItemG } from 'components';
import { Map, Layers } from 'variables/icons'
import { Grid, Checkbox, IconButton, Menu, ListItemText, MenuItem } from '@material-ui/core';
import OpenStreetMap from 'components/Map/OpenStreetMap';

export default class DeviceMap extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			heatMap: false,
			actionAnchorVisibility: null,
			activeLayer: 0
		}
	}
	visibilityOptions = [
		{ id: 0, icon: "", label: "Theme 1" },
		{ id: 1, icon: "", label: "Theme 2" },
		{ id: 2, icon: "", label: "Theme 3" },
		{ id: 3, icon: "", label: "Theme 4" }
	]
	handleVisibility = e => (event) => {
		if (event)
			event.preventDefault()
		console.log('activeLayer', e)
		this.setState({ activeLayer: e, actionAnchorVisibility: null })
	}
	renderMenu = () => {
		const { t } = this.props
		const { actionAnchorVisibility } = this.state
		return <Fragment>
			<ItemG>
				<IconButton title={'Map layer'} variant={'fab'} onClick={(e) => { this.setState({ actionAnchorVisibility: e.currentTarget }) }}>
					<Layers />
				</IconButton>
				<Menu
					id='long-menu2'
					anchorEl={actionAnchorVisibility}
					open={Boolean(actionAnchorVisibility)}
					onClose={() => this.setState({ actionAnchorVisibility: null })}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					{this.visibilityOptions.map(op => {
						return <MenuItem key={op.id} value={op.id} button onClick={this.handleVisibility(op.id)}>
							<ListItemText primary={op.label} />
						</MenuItem>
					})}
					{/* </List> */}
				</Menu>
			</ItemG>
			<Dropdown menuItems={
				[{ label: t('actions.heatMap'), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) }]
			} />
		</Fragment>
	}
	render() {
		const { device, weather, t, loading } = this.props
		const { activeLayer } = this.state
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
							{device.lat && device.long ? <OpenStreetMap activeLayer={activeLayer} heatMap={this.state.heatMap} t={t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} /> : <Caption>{t('devices.notCalibrated')}</Caption>}
						</Grid>
				} />

		)
	}
}
