import { Button, Collapse, Grid, Paper, withStyles, Fade } from '@material-ui/core';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { useState, Fragment, useEffect } from 'react';
import { updateDevice, getGeoByAddress, getAddress } from 'variables/dataDevices';
import { CircularLoader, GridContainer, ItemGrid, TextF, AddressInput } from 'components';
import DSelect from 'components/CustomInput/DSelect';
import { isFav, updateFav } from 'redux/favorites';
import { useSelector, useDispatch } from 'react-redux'
import { getDeviceLS, getDevices } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';


// const mapStateToProps = (state) => ({
// 	device: state.data.device,
// 	loading: !state.data.gotDevice
// })
// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	updateFav: (favObj) => dispatch(updateFav(favObj)),
// 	getDevice: async id => dispatch(await getDeviceLS(id)),
// 	getDevices: reload => dispatch(getDevices(reload))
// })

const EditDeviceDetails = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const device = useSelector(store => store.data.device)
	const loading = useSelector(store => !store.data.gotDevice)

	// const [stateLoading, setStateLoading] = useState(true)
	const [updating, setUpdating] = useState(false)
	const [updated, setUpdated] = useState(false)
	const [stateDevice, setStateDevice] = useState(null)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		updating: false,
	// 		updated: false,
	// 		device: null
	// 	}
	let prevURL = props.location.prevURL ? props.location.prevURL : '/devices/list'
	props.setHeader({ id: 'devices.editDetailsTitle', options: { deviceId: props.match.params.id } }, true, prevURL, 'devices')

	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToDevice()
		}
	}

	useEffect(() => {
		props.setBC('editdevicedetails', device.name, device.id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [device, stateDevice])
	// const componentDidUpdate = (prevProps, prevState) => {
	// 	if ((!prevProps.device && device !== prevProps.device) || (this.state.device === null && device)) {
	// 		this.props.setBC('editdevicedetails', device.name, device.id)

	// 		// this.setState({
	// 		// 	device: device,
	// 		// })
	// 	}
	// }

	useEffect(() => {
		const asyncFunc = async () => {
			let id = props.match.params.id
			dispatch(await getDeviceLS(id))
			window.addEventListener('keydown', keyHandler, false)
		}
		asyncFunc()

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
			// clearTimeout(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// const componentDidMount = async () => {
	// 	let id = props.match.params.id
	// 	const { getDevice } = this.props
	// 	await getDevice(id)
	// 	window.addEventListener('keydown', keyHandler, false)
	// }
	// const componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', keyHandler, false)
	// 	clearTimeout(timer);
	// }
	const setMapCoords = (data) => {
		let coords = { lat: data.adgangsadresse.vejpunkt.koordinater[1], long: data.adgangsadresse.vejpunkt.koordinater[0] }
		if (coords) {
			setStateDevice({ ...stateDevice, lat: coords.lat, lang: coords.lang })
			// this.setState({
			// 	device: {
			// 		...stateDevice,
			// 		lat: coords.lat,
			// 		long: coords.long,
			// 	}
			// })
		}
	}
	const getLatLng = async (suggestion) => {
		let data
		if (suggestion.id) {
			data = await getGeoByAddress(suggestion.id)
			if (data) {
				return setMapCoords(data)
			}
		}
		else {
			data = await getAddress(stateDevice.address)
			return setMapCoords(data)
		}
	}
	const handleSetAddress = (address) => {
		setStateDevice({ ...stateDevice, address })
		// this.setState({
		// 	device: {
		// 		...this.state.device,
		// 		address
		// 	}
		// })
	}
	const handleInput = (input) => e => {
		if (e.preventDefault)
			e.preventDefault()
		setStateDevice({ ...stateDevice, [input]: e.target.value })
		// this.setState({
		// 	device: {
		// 		...stateDevice,
		// 		[input]: e.target.value
		// 	}
		// })
	}
	const LocationTypes = () => {
		return [
			{ value: 0, label: t('devices.locationTypes.unspecified') },
			{ value: 1, label: t('devices.locationTypes.pedStreet') },
			{ value: 2, label: t('devices.locationTypes.park') },
			{ value: 3, label: t('devices.locationTypes.path') },
			{ value: 4, label: t('devices.locationTypes.square') },
			{ value: 5, label: t('devices.locationTypes.crossroads') },
			{ value: 6, label: t('devices.locationTypes.road') },
			{ value: 7, label: t('devices.locationTypes.motorway') },
			{ value: 8, label: t('devices.locationTypes.port') },
			{ value: 9, label: t('devices.locationTypes.office') }]
	}
	const handleUpdateFav = () => {
		// const { isFav, updateFav } = this.props
		// const { device } = this.state
		let favObj = {
			id: stateDevice.id,
			name: stateDevice.name,
			type: 'device',
			path: `/device/${stateDevice.id}`
		}
		if (dispatch(isFav(favObj))) {
			dispatch(updateFav(favObj))
		}
		setUpdated(true)
		setUpdating(false)
		// this.setState({ updated: true, updating: false })
		s('snackbars.deviceUpdated', { device: stateDevice.id })
		goToDevice()
	}
	const handleUpdateDevice = async () => {
		// const { device } = this.state
		setUpdating(true)
		// this.setState({ updating: true })
		let updateD = {
			...device,
			project: {
				id: 0
			}
		}
		await updateDevice(updateD).then(rs => rs ? handleUpdateFav() : null)
	}

	const goToDevice = async () => {
		const { location, history } = props
		dispatch(await getDeviceLS(stateDevice.id))
		dispatch(getDevices(true))
		history.push(location.prevURL ? location.prevURL : `/device/${props.match.params.id}`)
	}

	const { classes } = props
	// const { device } = this.state
	return !loading && device ? (
		<GridContainer>
			<Fade in={true}>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'name'}
									label={t('devices.fields.name')}
									onChange={handleInput('name')}
									value={device.name}
									autoFocus
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<DSelect
									label={t('devices.fields.locType')}
									value={device.locationType}
									onChange={handleInput('locationType')}
									menuItems={LocationTypes()}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'description'}
									label={t('devices.fields.description')}
									multiline
									rows={4}
									onChange={handleInput('description')}
									value={device.description}

								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<AddressInput
									onBlur={getLatLng}
									handleSuggestionSelected={getLatLng}
									value={device.address}
									handleChange={handleSetAddress} />
							</ItemGrid>
							<ItemGrid xs={12} container justify={'center'}>
								<Collapse in={updating} timeout={100} unmountOnExit>
									<CircularLoader fill />
								</Collapse>
							</ItemGrid>
							<ItemGrid container style={{ margin: 16 }}>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										onClick={goToDevice}
										className={classes.redButton}
									>
										{t('actions.cancel')}
									</Button>
								</div>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										color='primary'
										disabled={updating || updated /* this.state.updated */}
										onClick={handleUpdateDevice}
									>
										{/* this.state. */updated ?
											<Fragment>
												{t('snackbars.redirect')}
											</Fragment> :
											<Fragment>
												{t('actions.save')}
											</Fragment>}
									</Button>
								</div>
							</ItemGrid>
						</Grid>
					</form>
				</Paper>
			</Fade>
		</GridContainer>
	) : <CircularLoader />
}

export default withStyles(createprojectStyles)(EditDeviceDetails)