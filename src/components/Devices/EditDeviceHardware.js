import { Button, Grid, Paper, withStyles, Collapse } from '@material-ui/core';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { useState, useEffect, Fragment } from 'react';
import { updateDevice } from 'variables/dataDevices';
import { ItemGrid, TextF, GridContainer, CircularLoader, } from 'components';
import { isFav, updateFav } from 'redux/favorites';
import { useSelector, useDispatch } from 'react-redux'
import { getDeviceLS, getDevices } from 'redux/data';
import { useLocation, useMatch, useLocalization, useSnackbar, useHistory } from 'hooks'

/**
 * Unused
 */

const EditDetails = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()
	const match = useMatch()
	const device = useSelector(state => state.data.device)
	const loading = useSelector(state => !state.data.gotDevice)

	const [stateDevice, setStateDevice] = useState(null)
	// const [stateLoading, setStateLoading] = useState(true)
	const [updating, setUpdating] = useState(false)
	const [updated, setUpdated] = useState(false)

	let prevURL = location.state ? location.prevURL : `/devices/list`
	props.setHeader({ id: 'devices.editHardwareTitle', options: { deviceId: match.params.id } }, true, prevURL, 'devices')

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		device: null,
	// 		loading: true,
	// 		updating: false,
	// 		updated: false
	// 	}
	// 	let prevURL = props.location.state ? props.location.prevURL : `/devices/list`
	// 	props.setHeader({ id: 'devices.editHardwareTitle', options: { deviceId: props.match.params.id } }, true, prevURL, 'devices')
	// }
	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToDevice()
		}
	}

	// TODO (check)
	useEffect(() => {
		if (device && stateDevice === null) {
			props.setBC('editdevicehardware', device.name, device.id)
			setStateDevice(device)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [device])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	const { device } = this.props
	// 	if ((!prevProps.device && device !== prevProps.device) || (this.state.device === null && device)) {
	// 		this.props.setBC('editdevicehardware', device.name, device.id)
	// 		this.setState({
	// 			device: device,
	// 		})
	// 	}
	// }

	useEffect(() => {
		const asyncFunc = async () => {
			window.addEventListener('keydown', keyHandler, false)
			let id = match.params.id
			dispatch(await getDeviceLS(id))
		}
		asyncFunc()

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
			// clearTimeout(timer)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	const { getDevice } = this.props
	// 	window.addEventListener('keydown', this.keyHandler, false)
	// 	let id = this.props.match.params.id
	// 	await getDevice(id)

	// }
	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)
	// 	clearTimeout(this.timer);
	// }

	const handleInput = (input) => e => {
		e.preventDefault()
		setStateDevice({ ...stateDevice, [input]: e.target.value })
		// this.setState({
		// 	device: {
		// 		...this.state.device,
		// 		[input]: e.target.value
		// 	}
		// })
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
			...stateDevice,
			project: {
				id: 0
			}
		}
		await updateDevice(updateD).then(rs => rs ? handleUpdateFav() : null)
	}
	const goToDevice = async () => {
		// const { location, history } = this.props
		dispatch(await getDeviceLS(stateDevice.id))
		// this.props.getDevice(this.state.device.id)
		dispatch(getDevices(true))
		// this.props.getDevices(true)
		history.push(location.prevURL ? location.prevURL : `/device/${match.params.id}`)
	}

	const { classes } = props
	// const { device } = this.state
	return !loading && stateDevice ? (
		<GridContainer>
			<Paper className={classes.paper}>
				<form className={classes.form}>

					<Grid container>
						<ItemGrid xs={6}>
							<TextF
								id={'rpimodel'}
								label={t('devices.fields.RPImodel')}
								onChange={handleInput('RPImodel')}
								value={stateDevice.RPImodel}

								autoFocus
							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'memory'}
								label={t('devices.fields.memory')}
								onChange={handleInput('memory')}
								value={stateDevice.memory}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'mm'}
								label={t('devices.fields.memoryModel')}
								onChange={handleInput('memoryModel')}
								value={stateDevice.memoryModel}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'powerAdapter'}
								label={t('devices.fields.adapter')}
								onChange={handleInput('adapter')}
								value={stateDevice.adapter}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'wifiModule'}
								label={t('devices.fields.wifiModule')}
								onChange={handleInput('wifiModule')}
								value={stateDevice.wifiModule}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'modemModel'}
								label={t('devices.fields.modemModel')}
								onChange={handleInput('modemModel')}
								value={stateDevice.modemModel}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'modemIMEI'}
								label={t('devices.fields.modemIMEI')}
								onChange={handleInput('modemIMEI')}
								value={stateDevice.modemIMEI.toString()}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'cellNumber'}
								label={t('devices.fields.cellNumber')}
								onChange={handleInput('cellNumber')}
								value={stateDevice.cellNumber.toString()}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'SIMID'}
								label={t('devices.fields.SIMID')}
								onChange={handleInput('SIMID')}
								value={stateDevice.SIMID.toString()}

							/>
						</ItemGrid>
						<ItemGrid xs={6}>
							<TextF
								id={'SIMProvider'}
								label={t('devices.fields.SIMProvider')}
								onChange={handleInput('SIMProvider')}
								value={stateDevice.SIMProvider}

							/>
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
									disabled={updating || updated}
									onClick={handleUpdateDevice}
								>
									{updated ?
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
		</GridContainer>
	) : <CircularLoader />
}

export default withStyles(createprojectStyles)(EditDetails)