import React, { Fragment, useEffect, useState } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader, ItemG, TextF, AddressInput, Danger } from 'components';
import { Map, Layers, Smartphone, Save, Clear, EditLocation, WhatsHot } from 'variables/icons'
import { Grid/*,  Checkbox, */, IconButton, Menu, MenuItem, Collapse, Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { red, teal } from "@material-ui/core/colors"
import OpenStreetMap from 'components/Map/OpenStreetMap';
import { getAddressByLocation, updateDevice } from 'variables/dataDevices';
import { useSelector, useDispatch } from 'react-redux'
import { changeMapTheme, changeHeatMap } from 'redux/appState';
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	mapTheme: state.appState.mapTheme ? state.appState.mapTheme : state.settings.mapTheme,
// 	heatMap: state.appState.heatMap ? state.appState.heatMap : false
// })

// const mapDispatchToProps = (dispatch) => ({
// 	changeMapTheme: (value) => dispatch(changeMapTheme(value)),
// 	changeHeatMap: (value) => dispatch(changeHeatMap(value))
// })

// @Andrei
const DeviceMap = React.memo(props => {
	const t = useLocalization()
	const dispatch = useDispatch()
	let map

	const mapTheme = useSelector(state => state.appState.mapTheme ? state.appState.mapTheme : state.settings.mapTheme)
	const heatMap = useSelector(state => state.appState.heatMap ? state.appState.heatMap : false)

	const [actionAnchorVisibility, setActionAnchorVisibility] = useState(null)
	const [editLocation, setEditLocation] = useState(false)
	const [openModalEditLocation, setOpenModalEditLocation] = useState(false)
	const [markers, setMarkers] = useState([])
	const [error, setError] = useState(null) // added
	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		actionAnchorVisibility: null,
	// 		editLocation: false,
	// 		openModalEditLocation: false,
	// 		markers: []
	// 	}
	// }
	let visibilityOptions = [
		{ id: 0, label: t("map.themes.0") },
		{ id: 1, label: t("map.themes.1") },
		{ id: 2, label: t("map.themes.2") },
		{ id: 3, label: t("map.themes.3") },
		{ id: 4, label: t("map.themes.4") },
		{ id: 5, label: t("map.themes.5") },
		{ id: 6, label: t("map.themes.6") },
		{ id: 7, label: t('map.themes.7') }
	]

	useEffect(() => {
		if (props.device && props.device.lat && props.device.long) {
			setMarkers([{ ...props.device, weather: props.weather }])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.device])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (this.props.device && prevProps.device !== this.props.device && this.props.device.lat && this.props.device.long) {
	// 		this.setState({
	// 			markers: [{ ...this.props.device, weather: this.props.weather }]
	// 		})
	// 	}
	// }

	const handleVisibility = e => (event) => {
		if (event)
			event.preventDefault()
		dispatch(changeMapTheme(e))
		// this.props.changeMapTheme(e)
		setActionAnchorVisibility(null)
		// this.setState({ actionAnchorVisibility: null })
	}
	const handleSaveEditAddress = async () => {
		let device = markers[0]
		delete device['weather']
		//obsolete, will be removed in future version
		device.project = {
			id: 0
		}
		let saved = await updateDevice(device)
		if (saved)
			props.reload(5)//msgId = 5 - Device Updated
		else {
			setError(true)
			// this.setState({ error: true })
		}
	}
	const handleOpenMenu = e => {
		setActionAnchorVisibility(e.currentTarget)
		// this.setState({ actionAnchorVisibility: e.currentTarget })
	}
	const handleCloseMenu = e => {
		setActionAnchorVisibility(null)
		// this.setState({ actionAnchorVisibility: null })
	}
	const handleEditLocation = () => {
		setEditLocation(!editLocation)
		// this.setState({ editLocation: !this.state.editLocation })
	}
	const handleCancelConfirmEditLocation = () => {
		setOpenModalEditLocation(false)
		// this.setState({
		// 	openModalEditLocation: false
		// })
	}
	const handleCancelEditLocation = () => {
		setEditLocation(false)
		setMarkers([{ ...props.device, weather: props.weather }])
		// this.setState({
		// 	editLocation: false,
		// 	markers: [{ ...this.props.device, weather: this.props.weather }]
		// })
	}
	const handleOpenConfirmEditLocation = () => {
		setOpenModalEditLocation(true)
		// this.setState({
		// 	openModalEditLocation: true
		// })
	}
	const renderMenu = () => {
		// const { t, mapTheme } = this.props
		// const { actionAnchorVisibility } = this.state
		return <Fragment>
			<Collapse in={editLocation}>
				<ItemG container>
					<ItemG>
						<IconButton onClick={handleOpenConfirmEditLocation}>
							<Save style={{ color: teal[500] }} />
						</IconButton>
					</ItemG>
					<ItemG>
						<IconButton onClick={handleCancelEditLocation}>
							<Clear style={{ color: red[400] }} />
						</IconButton>
					</ItemG>
				</ItemG>
			</Collapse>
			<ItemG>
				<IconButton title={'Map layer'} variant={'fab'} onClick={handleOpenMenu}>
					<Layers />
				</IconButton>
				<Menu
					id='long-menu2'
					anchorEl={actionAnchorVisibility}
					open={Boolean(actionAnchorVisibility)}
					onClose={handleCloseMenu}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					{visibilityOptions.map(op => {
						return <MenuItem key={op.id} value={op.id} button onClick={handleVisibility(op.id)} selected={mapTheme === op.id ? true : false}>
							{op.label}
						</MenuItem>
					})}
					{/* </List> */}
				</Menu>
			</ItemG>

			<Dropdown menuItems={
				[
					{ label: t('actions.heatMap'), selected: heatMap, icon: WhatsHot, func: () => dispatch(changeHeatMap(heatMap)) },
					{ label: t('actions.goToDevice'), icon: Smartphone, func: () => flyToMarkers() },
					{ label: t('actions.editLocation'), selected: editLocation, icon: EditLocation, func: () => handleEditLocation() }]
			} />

		</Fragment>
	}
	const getRef = (r) => {
		map = r
	}
	const flyToMarkers = () => {
		// const { device } = this.props
		if (map) {
			map.leafletElement.flyToBounds([[props.device.lat, props.device.long]])
		}
	}
	const getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let long = e.target._latlng.lng
		let address = await getAddressByLocation(lat, long)
		let addressStr = address.vejnavn + ' ' + address.husnr + ', ' + address.postnr + ' ' + address.postnrnavn
		setMarkers([{
			...props.device,
			address: addressStr,
			lat,
			long,
			weather: props.weather
		}])
		// this.setState({
		// 	markers: [{
		// 		...this.props.device,
		// 		address: addressStr,
		// 		lat,
		// 		long,
		// 		weather: this.props.weather
		// 	}]
		// })
	}
	const handleChangeAddress = e => {
		setMarkers([{
			...markers[0],
			address: e
		}])
		// this.setState({
		// 	markers: [{
		// 		...this.state.markers[0],
		// 		address: e
		// 	}]
		// })
	}
	const renderModal = () => {
		// const { t } = this.props
		// const { openModalEditLocation, markers, error } = this.state
		return <Dialog
			onClose={handleCancelConfirmEditLocation}
			open={openModalEditLocation}
			PaperProps={{
				style: {
					overflowY: "visible"
				}
			}}
		>
			<DialogTitle disableTypography> </DialogTitle>
			<DialogContent style={{ overflowY: "visible" }}>
				{error ? <Danger>{t('404.networkError')}</Danger> : null}
				{markers.length > 0 ? markers.map(m => {
					return <ItemG key={m.id} container direction={'column'}>
						<TextF id={'lat'} label={'Latitude'} value={m.lat ? m.lat.toString() : ""} disabled />
						<TextF id={'long'} label={'Longitude'} value={m.long ? m.long.toString() : ""} disabled />
						<AddressInput value={m.address} onChange={handleChangeAddress} />
					</ItemG>
				}) : null
				}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSaveEditAddress}>
					<Save /> {t('actions.save')}
				</Button>
				<Button onClick={handleCancelConfirmEditLocation}>
					<Clear /> {t('actions.cancel')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	const { device, loading } = props
	return (
		<InfoCard
			noPadding
			noHiddenPadding
			title={t('devices.cards.map')}
			subheader={device ? <Caption>{`${t('devices.fields.coordsW', { lat: device.lat, long: device.long })}, Heatmap ${heatMap ? t('actions.on') : t('actions.off')}`} </Caption> : null}
			avatar={<Map />}
			topAction={device ? (device.lat && device.long ? renderMenu() : null) : null}
			hiddenContent={
				loading ? <CircularLoader /> :
					<Grid container justify={'center'}>
						{renderModal()}
						{markers[0].lat && markers[0].long ?
							<OpenStreetMap
								calibrate={editLocation}
								getLatLng={getLatLngFromMap}
								iRef={getRef}
								mapTheme={mapTheme}
								heatMap={heatMap}
								heatData={markers}
								t={t}
								markers={markers}
							/> : <Caption>{t('devices.notCalibrated')}</Caption>}
					</Grid>
			} />
	)
})

export default DeviceMap