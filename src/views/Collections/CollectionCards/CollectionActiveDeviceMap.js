import React, { PureComponent, Fragment } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader, ItemG } from 'components';
import { Map, Layers } from 'variables/icons'
import { Grid, Checkbox, IconButton, Menu, MenuItem } from '@material-ui/core';
// import { Maps } from 'components/Map/Maps';
import OpenStreetMap from 'components/Map/OpenStreetMap';

export default class ActiveDeviceMap extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			heatMap: false,
			actionAnchorVisibility: null,
			mapTheme: props.mapTheme
		}
	}
	visibilityOptions = [
		{ id: 0, icon: "", label: "Humanitarian" },
		{ id: 1, icon: "", label: "Luftphoto 2018" },
		{ id: 2, icon: "", label: "Dark" },
		{ id: 3, icon: "", label: "Stamen Toner" },
		{ id: 4, icon: "", label: "Stamen Watercolor" },
		{ id: 5, icon: "", label: "Carto" },
		{ id: 6, icon: "", label: "OpenStreetMap" }
	]
	handleVisibility = e => (event) => {
		if (event)
			event.preventDefault()
		this.setState({ mapTheme: e, actionAnchorVisibility: null })
	}
	handleOpenMenu = e => {
		this.setState({ actionAnchorVisibility: e.currentTarget })
	}
	handleCloseMenu = e => {
		this.setState({ actionAnchorVisibility: null })
	}
	renderMenu = () => {
		const { t } = this.props
		const { actionAnchorVisibility, mapTheme } = this.state
		return <Fragment>
			<ItemG>
				<IconButton title={'Map layer'} variant={'fab'} onClick={this.handleOpenMenu}>
					<Layers />
				</IconButton>
				<Menu
					id='long-menu2'
					anchorEl={actionAnchorVisibility}
					open={Boolean(actionAnchorVisibility)}
					onClose={this.handleCloseMenu}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					{this.visibilityOptions.map(op => {
						return <MenuItem key={op.id} value={op.id} button onClick={this.handleVisibility(op.id)} selected={mapTheme === op.id ? true : false}>
							{op.label}
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
		const { mapTheme } = this.state
		return (
			<InfoCard
				title={t('devices.cards.map')}
				subheader={device ? `${t('devices.fields.coordsW', { lat: device.lat, long: device.long })}, Heatmap ${this.state.heatMap ? t('actions.on') : t('actions.off')}` : null}
				avatar={<Map />}
				topAction={device ? (device.lat && device.long ? this.renderMenu() : null) : null}
				hiddenContent={
					loading ? <CircularLoader /> :
						<Grid container justify={'center'}>
							{/* {device ? device.lat && device.long ? <Maps heatMap={this.state.heatMap} t={t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} /> : <Caption>{t('devices.notCalibrated')}</Caption> : null} */}
							{device ? device.lat && device.long ? <OpenStreetMap mapTheme={mapTheme} heatMap={this.state.heatMap} t={t} markers={[{ ...device, weather: weather }]} heatData={[{ ...device, weather: weather }]}/> : <Caption>{t('devices.notCalibrated')}</Caption> : null}

						</Grid>
				} />

		)
	}
}
