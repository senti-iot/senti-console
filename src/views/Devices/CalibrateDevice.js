import React, { Component, Fragment } from 'react'
import { Paper, Typography, Button, StepContent, StepLabel, Step, Stepper, withStyles, Grid, TextField, FormControl, InputLabel, Select, Input, MenuItem, FormHelperText } from '@material-ui/core';
import { ItemGrid, Info, Danger } from 'components';
import { getDevice, calibrateDevice, uploadPictures } from 'variables/data';
import Caption from 'components/Typography/Caption';
import CounterModal from 'components/Devices/CounterModal';
import ImageUpload from './ImageUpload';
import { NavigateNext, NavigateBefore, Done, Restore, MyLocation, Router, Devices } from '@material-ui/icons'
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

function getSteps() {
	return ['Device name and description', 'Device location', 'Calibration', 'Picture of installation'];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return `To configure your Senti device, please enter a title and an informative description.`;
		case 1:
			return `To correctly deploy your Senti device you need to allow Senti Cloud to store the location of the device. Accept this when prompted to allow to store the location of your mobile device.
			Secondly select a location type to further pinpoint where your data is collected.`;
		case 2:
			return `To get the best data collection accuracy, you need to do a manual calibration. 
			The calibration hit target is set to 200 so you need to count 200 individual entities. When you are ready to start counting press “OPEN COUNTING WINDOW” and press "START". 
			Push the large button to count. When you have reached your hit target of 200 hits the timer automatically stops.`;
		case 3:
			return `You can store optional picture(s) of your device installation. This will enhance the Senti Cloud experience, and serve as a help for Senti service technicians in case your device needs on-site service.`
		default:
			return 'Unknown step';
	}
}
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
			locationType: ''
		}
		props.setHeader(props.match.params.id + ' Calibration')
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
			}, err => { console.log(err); this.setState({ error: err }) })
		}
	}
	uploadImgs = async () => {
		var success = await uploadPictures({
			device_id: this.state.device.device_id,
			files: this.state.images,
			// step: 3
		}).then(rs => rs)
		return success
	}
	renderDeviceNameDescriptionForms = () => {
		// const { device } = this.state
		const { classes } = this.props
		return <Grid container>
			<ItemGrid xs={12}>
				<TextField
					required={true}
					label={'Device Name'}
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
					label={'Description'}
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
		return ['Pedestrian street',
			'Park',
			'Path',
			'Square',
			'Crossroads',
			'Road',
			'Motorway',
			'Port',
			'Office',
			'Unspecified']
	}
	handleLocationTypeChange = (e) => {
		this.setState({ locationType: e.target.value })
	}
	renderDeviceLocation = () => {
		return <Fragment>
			<FormControl className={this.props.classes.formControl}>
				<InputLabel htmlFor="streetType-helper">{this.state.locationType ? '' : "Location Type"}</InputLabel>
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
				<FormHelperText>Select a location type for {this.state.device_name ? this.state.device_name : this.state.device_id}</FormHelperText>
			</FormControl>
			<div className={this.props.classes.latlong}>
				<Caption>
					Latitude &amp; Longitute
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
			> <MyLocation className={this.props.classes.iconButton} />Get Location </Button>
		</Fragment>
	}
	renderCalibration = () => {
		return <CounterModal handleFinish={this.handleCalibration} />

	}
	renderImageUpload = () => {
		return <ImageUpload imgUpload={this.getImages} />

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
		const { lat, long, device, locationType } = this.state
		var success = await calibrateDevice({
			step: 1,
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
		var success
		switch (activeStep) {
			case 0:
				success = this.updateNameAndDesc()
				break;
			case 1:
				success = this.updatePosition()
				break;
			case 2:
				success = this.updateCalibration()
				break;
			case 3:
				success = this.uploadImgs();
				break;
			default:
				break;
		}
		if (success)
			this.setState({
				activeStep: this.state.activeStep + 1,
			});
		else {
			this.setState({
				error: { message: "Network Error" }
			})
		}
	}


	handleBack = () => {
		this.setState({
			activeStep: this.state.activeStep - 1,
		});
	};
	handleGoToDeviceList = () => {
		this.props.history.push('/devices')
	}
	handleFinish = () => {
		this.props.history.push('/device/' + this.state.device.device_id)
	}
	handleReset = () => {
		this.setState({
			activeStep: 0,
		});
	};
	stepChecker = () => {
		/**
		 * Return false to NOT disable the Next Step Button
		 */
		const { activeStep, lat, long, device_name, calibration } = this.state;
		switch (activeStep) {
			case 0:
				return device_name.length > 0 ? false : true
			case 1:
				return lat > 0 && long > 0 ? false : true
			case 2:
				return calibration.startDate && calibration.endDate && calibration.timer ? false : true
			default:
				break;
		}
	}
	render() {
		const { classes } = this.props;
		const steps = getSteps();
		const { activeStep, device, error } = this.state;
		return (
			<Paper classes={{ root: classes.paper }}>
				{device ?
					<Stepper activeStep={activeStep} orientation="vertical">
						{steps.map((label, index) => {
							return (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
									<StepContent>
										<Typography paragraph>{getStepContent(index)}</Typography>
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
													<NavigateBefore className={classes.iconButton} />Back
												</Button>
												<Button
													variant="contained"
													color="primary"
													onClick={this.handleNext}
													className={classes.button}
													disabled={this.stepChecker()}
												>
													{activeStep === steps.length - 1 ? <Fragment>

														<Done className={classes.iconButton} />Finish
													</Fragment> :
														<Fragment>
															<NavigateNext className={classes.iconButton} />Next
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
						<Typography variant={'title'}>Success</Typography>
						<Typography paragraph>
							Your Senti device is now configured and calibrated and will produce better results when collecting data. To further enhance the accuracy of your data collection, return to the site of installation and do a new calibration on a regular basis. You can set a reminder for Device Calibration in the Settings section.
						</Typography>
						<Grid container>

							<ItemGrid xs>
								<Button onClick={this.handleFinish} color={"primary"} variant={"contained"} className={classes.buttonMargin}>
									<Router className={classes.iconButton} />Go to device {device.device_id}
								</Button>
								<Button onClick={this.handleGoToDeviceList} color={"primary"} variant={"contained"} className={classes.buttonMargin}>
									<Devices className={classes.iconButton} />Go to device list
								</Button>
							</ItemGrid>
							<ItemGrid xs>
								<Button onClick={this.handleReset} className={classes.button} >
									<Restore className={classes.iconButton} />Reset
								</Button>
							</ItemGrid>
						</Grid>
					</Paper>
				)}
			</Paper>
		)
	}
}

export default withStyles(styles)(CalibrateDevice)