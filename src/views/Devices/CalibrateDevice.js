import React, { Component, Fragment } from 'react'
import { Paper, Typography, Button, StepContent, StepLabel, Step, Stepper, withStyles, Grid, TextField, FormControl, InputLabel, Select, Input, MenuItem, FormHelperText } from '@material-ui/core';
import { ItemGrid, Info, Danger } from 'components'
import { getDevice, calibrateDevice, uploadPictures } from 'variables/dataDevices'
import Caption from 'components/Typography/Caption'
import CounterModal from 'components/Devices/CounterModal'
import ImageUpload from './ImageUpload'
import { NavigateNext, NavigateBefore, Done, Restore, MyLocation, Router, Devices } from '@material-ui/icons'
import GridContainer from 'components/Grid/GridContainer';
import { PlacesWithStandaloneSearchBox } from 'components/Map/SearchBox'

const styles = theme => ({
	button: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
	actionsContainer: {
		marginTop: theme.spacing.unit * 2,
		// marginBottom: theme.spacing.unit * 2,
	},
	resetContainer: {
		padding: theme.spacing.unit * 3,
	},
	input: {
		minWidth: 300
	},
	latlong: {
		margin: theme.spacing.unit * 2 + "px 0px"
	},
	buttonMargin: {
		margin: theme.spacing.unit
	},
	iconButton: {
		marginRight: theme.spacing.unit
	},
	iconButtonRight: {
		marginLeft: theme.spacing.unit
	},
	paper: {
		margin: '8px',
		borderRadius: "3px",
		overflow: "hidden"
	}
});

class CalibrateDevice extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeStep: 0,
			device_name: '',
			description: '',
			device: null,
			error: false,
			lat: 0,
			long: 0,
			calibration: {
				startDate: null,
				endDate: null,
				count: 0,
				timer: 0
			},
			images: null,
			locationType: '',
			address: ''
		}
		props.setHeader(this.props.t("calibration.header") + props.match.params.id, true)
	}

	getSteps() {
		const { t } = this.props
		return [t("calibration.name"), t("calibration.location"), t("calibration.calibration"), t("calibration.images")]
	}

	getStepContent(step) {
		const { t } = this.props
		switch (step) {
			case 0:
				return t("calibration.steps.0")
			case 1:
				return t("calibration.steps.1")
			case 2:
				return t("calibration.steps.2")
			case 3:
				return t("calibration.steps.3")
			default:
				return t("calibration.steps.unknown")
		}
	}

	handleInput = (input) => e => {
		this.setState({ [input]: e.target.value })
	}

	getImages = (imgs) => {
		this.setState({ images: imgs })
	}

	handleCalibration = (result) => {
		this.setState({
			...this.state,
			calibration: {
				startDate: result.timestamp,
				endDate: result.timestampFinish,
				count: result.count,
				timer: result.timer
			}
		})
	}

	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id)
				await getDevice(id).then(rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.setState({
							device: rs, loading: false,
							device_name: rs.device_name ? rs.device_name : '',
							description: rs.description ? rs.description : '',
							locationType: rs.location_type ? rs.locationType : ''
						})
					}
				})
		}
		else {
			this.props.history.push('/404')
		}
	}

	getCoords = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(rs => {
				let lat = rs.coords.latitude
				let long = rs.coords.longitude
				this.setState({ lat, long, error: false })
			}, err => { this.setState({ error: err }) })
		}
	}

	uploadImgs = async () => {
		let success = false
		if (this.state.images) {
			success = await uploadPictures({
				device_id: this.state.device.device_id,
				files: this.state.images,
				// step: 3
			}).then(rs => rs)
		}
		return success
	}

	renderDeviceNameDescriptionForms = () => {
		// const { device } = this.state
		const { classes, t } = this.props
		return <Grid container>
			<ItemGrid xs={12}>
				<TextField
					required={true}
					label={t("calibration.fields.deviceName")}
					onChange={this.handleInput('device_name')}
					value={this.state.device_name}
					InputProps={{
						classes: {
							root: classes.input
						}
					}}
				/>
			</ItemGrid>
			<ItemGrid xs={12}>
				<TextField
					multiline
					rows={4}
					label={t("calibration.fields.description")}
					onChange={this.handleInput('description')}
					value={this.state.description}
					InputProps={{
						classes: {
							root: classes.input
						}
					}}
				/>
			</ItemGrid>
		</Grid>
	}

	LocationTypes = () => {
		const { t } = this.props
		return [
			t("devices.locationTypes.pedStreet"),
			t("devices.locationTypes.park"),
			t("devices.locationTypes.path"),
			t("devices.locationTypes.square"),
			t("devices.locationTypes.crossroads"),
			t("devices.locationTypes.road"),
			t("devices.locationTypes.motorway"),
			t("devices.locationTypes.port"),
			t("devices.locationTypes.office"),
			t("devices.locationTypes.unspecified")]
	}

	handleLocationTypeChange = (e) => {
		this.setState({ locationType: e.target.value })
	}

	handleSetAddress = (e) => {
		this.setState({ address: e.target.value })
	}

	renderDeviceLocation = () => {
		const { t } = this.props
		return <Grid container>
			<ItemGrid xs={12}>
				<PlacesWithStandaloneSearchBox handleChange={this.handleSetAddress} t={t}/>
			</ItemGrid>
			<ItemGrid xs={12}>
				<FormControl className={this.props.classes.formControl}>
					<InputLabel htmlFor="streetType-helper">{this.state.locationType ? '' : t("devices.fields.locType")}</InputLabel>
					<Select
						value={this.state.locationType}
						onChange={this.handleLocationTypeChange}
						input={<Input name="streetType" id="streetType-helper" />}
					>
						{this.LocationTypes().map((loc, i) => {
							return <MenuItem key={i} value={loc}>
								{loc}
							</MenuItem>
						})}
					</Select>
					<FormHelperText>{t("calibration.selectLocationType")} {this.state.device_name ? this.state.device_name : this.state.device_id}</FormHelperText>
				</FormControl>
				<div className={this.props.classes.latlong}>
					<Caption>
						{t("calibration.texts.lat")} &amp; {t("calibration.texts.long")}
					</Caption>
					<Info>
						{this.state.lat + " " + this.state.long}
					</Info>
				</div>
				<Button
					variant="contained"
					color="primary"
					onClick={this.getCoords}
					className={this.props.classes.button}
				> <MyLocation className={this.props.classes.iconButton} />{t("calibration.texts.getLocation")}</Button>
			</ItemGrid>
		</Grid>
	}

	renderCalibration = () => {
		return <CounterModal t={this.props.t} handleFinish={this.handleCalibration} />
	}

	renderImageUpload = () => {
		return <ImageUpload t={this.props.t} imgUpload={this.getImages} dId={this.state.device.device_id}/>
	}

	renderStep = (step) => {
		switch (step) {
			case 0:
				return this.renderDeviceNameDescriptionForms()
			case 1:
				return this.renderDeviceLocation()
			case 2:
				return this.renderCalibration()
			case 3:
				return this.renderImageUpload()
			default:
				break;
		}
	}

	updateCalibration = async () => {
		const { startDate, endDate, count, timer } = this.state.calibration
		const { device } = this.state
		var success = await calibrateDevice({
			step: 2,
			startDate: startDate,
			endDate: endDate,
			count: count,
			timer: timer,
			device_id: device.device_id
		}).then(rs => rs)
		return success
	}

	updatePosition = async () => {
		const { lat, long, device, locationType, address } = this.state
		var success = await calibrateDevice({
			step: 1,
			address: address,
			lat: lat,
			long: long,
			locationType: locationType,
			device_id: device.device_id
		}).then(rs => rs)
		return success
	}

	updateNameAndDesc = async () => {
		const { device_name, description } = this.state
		var success = await calibrateDevice({
			device_name: device_name,
			description: description,
			device_id: this.state.device.device_id,
			step: 0
		}).then(rs => rs)
		return success
	}

	handleNext = () => {
		const { activeStep } = this.state
		const { t } = this.props
		var success = false
		if (activeStep === 3) {
			let s1 = this.updateNameAndDesc()
			let s2 = this.updatePosition()
			let s3 = this.updateCalibration()
			let s4 = this.uploadImgs()
			if (s1 && s2 && s3 && s4)
			{
				success = true
			}
		}
		else
		{
			success = true
		}
		if (success)
			this.setState({
				activeStep: this.state.activeStep + 1,
			});
		else {
			this.setState({
				error: { message: t("calibration.texts.networkError") }
			})
		}
	}


	handleBack = () => {
		this.setState({
			activeStep: this.state.activeStep - 1,
		})
	}

	handleGoToDeviceList = () => {
		this.props.history.push('/devices')
	}

	handleFinish = () => {
		this.props.history.push('/device/' + this.state.device.device_id)
	}

	handleReset = () => {
		this.setState({
			activeStep: 0,
		})
	}

	stepChecker = () => {
		/**
		 * Return false to NOT disable the Next Step Button
		 */
		const { activeStep, lat, long, device_name, calibration, address } = this.state;
		switch (activeStep) {
			case 0:
				return device_name.length > 0 ? false : true
			case 1:
				return lat > 0 && long > 0 && address ? false : true
			case 2:
				return calibration.startDate && calibration.endDate && calibration.timer ? false : true
			default:
				break;
		}
	}

	render() {
		const { t, classes } = this.props;
		const steps = this.getSteps();
		const { activeStep, device, error } = this.state;
		return (
			<GridContainer>

				<Paper classes={{ root: classes.paper }}>
					{device ?
						<Stepper activeStep={activeStep} orientation="vertical" >
							{steps.map((label, index) => {
								return (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
										<StepContent>
											<Typography paragraph>{this.getStepContent(index)}</Typography>
											{/* <Divider/> */}

											<Grid>
												{error ? <Danger >{error.message}</Danger> : null}
												{this.renderStep(index)}
											</Grid>
											<div className={classes.actionsContainer}>
												<Grid container>
													<Button
														disabled={activeStep === 0}
														onClick={this.handleBack}
														className={classes.button}
													>
														<NavigateBefore className={classes.iconButton} />{t("calibration.texts.back")}
													</Button>
													<Button
														variant="contained"
														color="primary"
														onClick={this.handleNext}
														className={classes.button}
														disabled={this.stepChecker()}
													>
														{activeStep === steps.length - 1 ? <Fragment>

															<Done className={classes.iconButton} />{t("calibration.texts.finish")}
														</Fragment> :
															<Fragment>
																<NavigateNext className={classes.iconButton} />{t("calibration.texts.next")}
															</Fragment>}
													</Button>
												</Grid>
											</div>
										</StepContent>
									</Step>
								);
							})}
						</Stepper> : null}
					{activeStep === steps.length && device && (
						<Paper square elevation={0} className={classes.resetContainer}>
							<Typography variant={'title'}>{t("calibration.texts.success")}</Typography>
							<Typography paragraph>
								{t("calibration.texts.successMessage")}
							</Typography>
							<Grid container>

								<ItemGrid xs>
									<Button onClick={this.handleFinish} color={"primary"} variant={"contained"} className={classes.buttonMargin}>
										<Router className={classes.iconButton} />{t("calibration.texts.viewDevice")} {device.device_id}
									</Button>
									<Button onClick={this.handleGoToDeviceList} color={"primary"} variant={"contained"} className={classes.buttonMargin}>
										<Devices className={classes.iconButton} />{t("calibration.texts.viewDeviceList")}
									</Button>
								</ItemGrid>
								<ItemGrid xs>
									<Button onClick={this.handleReset} className={classes.button} >
										<Restore className={classes.iconButton} />{t("calibration.texts.reset")}
									</Button>
								</ItemGrid>
							</Grid>
						</Paper>
					)}
				</Paper>
			</GridContainer>
		)
	}
}

export default withStyles(styles)(CalibrateDevice)