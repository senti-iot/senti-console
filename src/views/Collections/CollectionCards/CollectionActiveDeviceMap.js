import React, { PureComponent, Fragment } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader, ItemG } from 'components';
import { Map, Layers, Smartphone } from 'variables/icons'
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
		{ id: 0, label: this.props.t("map.themes.0") },
		{ id: 1, label: this.props.t("map.themes.1") },
		{ id: 2, label: this.props.t("map.themes.2") },
		{ id: 3, label: this.props.t("map.themes.3") },
		{ id: 4, label: this.props.t("map.themes.4") },
		{ id: 5, label: this.props.t("map.themes.5") },
		{ id: 6, label: this.props.t("map.themes.6") },
		{ id: 7, label: this.props.t('map.themes.7') }
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
	componentDidUpdate = (prevProps, prevState) => {
	  console.log(this.map)
	}
	
	renderMenu = () => {
		const { t } = this.props
		const { actionAnchorVisibility, mapTheme } = this.state
		console.log(this.map)
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
				[{ label: t('actions.heatMap'), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) },
					{ label: t('actions.goToDevice'), icon: <Smartphone style={{ padding: "0px 12px" }} />, func: () => this.flyToMarkers() }]
			} />
		</Fragment>
	}
	getRef = (ref) => { 
		this.map = ref
	}
	flyToMarkers = () => { 
		if (this.map) { 
			this.map.leafletElement.flyToBounds([[this.props.device.lat, this.props.device.long]])
		}
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
							{device ? device.lat && device.long ? <OpenStreetMap iRef={this.getRef} mapTheme={mapTheme} heatMap={this.state.heatMap} t={t} markers={[{ ...device, weather: weather }]} heatData={[{ ...device, weather: weather }]}/> : <Caption>{t('devices.notCalibrated')}</Caption> : null}

						</Grid>
				} />

		)
	}
}
