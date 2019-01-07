import React, { PureComponent, Fragment } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader, ItemG, TextF, AddressInput, Danger } from 'components';
import { Map, Layers, Smartphone, Save, Clear, EditLocation } from 'variables/icons'
import { Grid, Checkbox, IconButton, Menu, MenuItem, Collapse, Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { red, teal } from "@material-ui/core/colors"
import OpenStreetMap from 'components/Map/OpenStreetMap';
import { getAddressByLocation, updateDevice } from 'variables/dataDevices';

export default class DeviceMap extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			heatMap: false,
			actionAnchorVisibility: null,
			mapTheme: props.mapTheme,
			editLocation: false,
			openModalEditLocation: false,
			markers: []
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
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.device && prevProps.device !== this.props.device && this.props.device.lat && this.props.device.long) {
			this.setState({
				markers: [{ ...this.props.device, weather: this.props.weather }]
			})
		}
	}
	
	handleVisibility = e => (event) => {
		if (event)
			event.preventDefault()
		this.setState({ mapTheme: e, actionAnchorVisibility: null })
	}
	handleSaveEditAddress = async () => {
		let device = this.state.markers[0]
		delete device['weather']
		//obsolete, will be removed in future version
		device.project = {
			id: 0
		}
		let saved = await updateDevice(device)
		if (saved)
			this.props.reload(5)//msgId = 5 - Device Updated
		else { 
			this.setState({ error: true })
		}
	}
	handleOpenMenu = e => {
		this.setState({ actionAnchorVisibility: e.currentTarget })
	}
	handleCloseMenu = e => {
		this.setState({ actionAnchorVisibility: null })
	}
	handleEditLocation = () => {
		this.setState({ editLocation: !this.state.editLocation })
	}
	handleCancelConfirmEditLocation = () => {
		this.setState({
			openModalEditLocation: false
		})
	}
	handleCancelEditLocation = () => {
		this.setState({
			editLocation: false,
			markers: [{ ...this.props.device, weather: this.props.weather }]
		})
	}
	handleOpenConfirmEditLocation = () => { 
		this.setState({
			openModalEditLocation: true
		})
	}
	renderMenu = () => {
		const { t } = this.props
		const { actionAnchorVisibility, mapTheme } = this.state
		return <Fragment>
			<Collapse in={this.state.editLocation}>
				<ItemG container>
					<ItemG>
						<IconButton onClick={this.handleOpenConfirmEditLocation}>
							<Save style={{ color: teal[500] }}/>
						</IconButton>
					</ItemG>
					<ItemG>
						<IconButton onClick={this.handleCancelEditLocation}>
							<Clear style={{ color: red[400] }}/>
						</IconButton>
					</ItemG>
				</ItemG>
			</Collapse>
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
				[
					{ label: t('actions.heatMap'), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) },
					{ label: t('actions.goToDevice'), icon: <Smartphone style={{ padding: "0px 12px" }} />, func: () => this.flyToMarkers() },
					{ label: t('actions.editLocation'), selected: this.state.editLocation, icon: <EditLocation style={{ padding: '0px 12px' }}/>, func: () => this.handleEditLocation() }]
			} />

		</Fragment>
	}
	getRef = (r) => { 
		this.map = r
	}
	flyToMarkers = () => { 
		const { device } = this.props
		if (this.map) { 
			this.map.leafletElement.flyToBounds([[device.lat, device.long]])
		}
	}
	getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let long = e.target._latlng.lng
		let address = await getAddressByLocation(lat, long)
		let addressStr = address.vejnavn + ' ' + address.husnr + ', ' + address.postnr + ' ' + address.postnrnavn
		this.setState({
			markers: [{
				...this.props.device,
				address: addressStr,
				lat,
				long,
				 weather: this.props.weather
			}]
		})
	}
	handleChangeAddress = e => {
		this.setState({
			markers: [{
				...this.state.markers[0],
				address: e
			}]
		})
	}
	renderModal = () => {
		const { t } = this.props
		const { openModalEditLocation, markers, error } = this.state
		return <Dialog
			onClose={this.handleCancelConfirmEditLocation}
			open={openModalEditLocation}
			PaperProps={{
				style: {
					overflowY: "visible"
				}
			}}
		>
			<DialogTitle> </DialogTitle>
			<DialogContent style={{ overflowY: "visible" }}>
				{error ? <Danger>{t('404.networkError')}</Danger> : null}
				{markers.length > 0 ? markers.map(m =>
					<ItemG key={m.id} container direction={'column'}>
						<TextF id={'lat'} label={'Latitude'} value={m.lat ? m.lat.toString() : ""} disabled />
						<TextF id={'long'} label={'Longitude'} value={m.long ? m.long.toString() : ""} disabled />
						<AddressInput value={m.address} handleChange={this.handleChangeAddress} />
					</ItemG>) : null
				}
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleSaveEditAddress}>
					<Save /> {t('actions.save')}
				</Button>
				<Button onClick={this.handleCancelConfirmEditLocation}>
					<Clear /> {t('actions.cancel')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	render() {
		const { device, t, loading } = this.props
		const { mapTheme } = this.state
		return (
			<InfoCard
				title={t('devices.cards.map')}
				subheader={device ? `${t('devices.fields.coordsW', { lat: device.lat, long: device.long })}, Heatmap ${this.state.heatMap ? t('actions.on') : t('actions.off')}` : null}
				avatar={<Map />}
				topAction={device ? (device.lat && device.long ? this.renderMenu() : null) : null}
				content={
					loading ? <CircularLoader /> :
						<Grid container justify={'center'}>
							{this.renderModal()}
							{/* {device.lat && device.long ? <Maps heatMap={this.state.heatMap} t={t} isMarkerShown markers={[{ ...device, weather: weather }]} zoom={10} /> : <Caption>{t('devices.notCalibrated')}</Caption>} */}
							{this.state.markers.length > 0 ? <OpenStreetMap
								calibrate={this.state.editLocation}
								getLatLng={this.getLatLngFromMap}
								iRef={this.getRef}
								mapTheme={mapTheme}
								heatMap={this.state.heatMap}
								heatData={this.state.markers}
								t={t}
								markers={this.state.markers}
							/> : <Caption>{t('devices.notCalibrated')}</Caption>}
						</Grid>
				} />

		)
	}
}
