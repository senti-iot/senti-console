import React, { Component, Fragment } from 'react'
import { Paper, Typography, Button, StepContent, StepLabel, Step, Stepper, withStyles, Grid, TextField } from '@material-ui/core';
import { ItemGrid, Info } from 'components';
import { getDevice } from 'variables/data';
import Caption from 'components/Typography/Caption';
import Geolocation from 'components/Geolocation/Geolocation';

const styles = theme => ({
	root: {
		width: '90%',
	},
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
			return `To correctly deploy your Senti device you need to allow Senti.Cloud to store the location of the device. Accept this when prompted to allow to store the location of your mobile device.
			Secondly select a location type to further pinpoint where your data is collected.`;
		case 2:
			return `To get the best accuracy with Senti data collection, you need to do a manual calibration. 
			The calibration hit target is set to 200 so you need to count 200 individual entities from your entity target group. When you are ready to start counting press “Start” and when you have reached 200 hits press “Stop”.`;
		case 3:
			return `You can store an optional picture of your device installation. This will enhance the Senti.Cloud experience, and serve as a help for Senti service technicians in case your device needs on-site service.`
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
		  device_description: '',
		  device: null,
		  lat: 0,
		  long: 0,
	  }
		props.setHeader(props.match.params.id + ' Calibration')
	}
	handleInput = (input) => e => {
		this.setState({ [input]: e.target.value })
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
							device_name: rs.device_name,
							device_description: rs.device_description })
						// this.props.setHeader(rs.device_name ? rs.device_name : rs.device_id)
					}
				})
		}
		else {
			this.props.history.push('/404')
		}
	}
	getCoords = () => { 
		// if (navigator.geolocation) {
		// // {	var geo = new Geolocation()
		// 	// Geolocation.requestAuthorization()
		// 	navigator.geolocation.getCurrentPosition(rs => {
		// 		let lat = rs.coords.latitude
		// 		let long = rs.coords.longitude
		// 		this.setState({ lat, long })
		// 	})
		// }
	}
	renderDeviceNameDescriptionForms = () => {
		// const { device } = this.state
		const { classes } = this.props
		return <Grid container>
			<ItemGrid xs={12}>
				{/* <Caption>Device Name:</Caption> */}
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
					onChange={this.handleInput('device_description')}
					value={this.state.device_description}
					InputProps={{
						classes: {
							root: classes.input
						}
					}}
				/>
			</ItemGrid>
		</Grid>
	}
	renderDeviceLocation = () => {
		return <Fragment>
			<Geolocation/>
			<Button
				variant="contained"
				color="primary"
				onClick={this.getCoords}
				className={this.props.classes.button}
			> Get Coordinates </Button>
			<Caption>
				Latitude &amp; Longitute
			</Caption>
			<Info>
				{this.state.lat + " " + this.state.long}
			</Info>
		</Fragment>
	}
	renderStep = (step) => { 
		switch (step) {
			case 0:
				return this.renderDeviceNameDescriptionForms()
			case 1: 
				return this.renderDeviceLocation()
			default:
				break;
		}
	}
	handleNext = () => {
		this.setState({
			activeStep: this.state.activeStep + 1,
		});
	};

	handleBack = () => {
		this.setState({
			activeStep: this.state.activeStep - 1,
		});
	};

	handleReset = () => {
		this.setState({
			activeStep: 0,
		});
	};
	render() {
		const { classes } = this.props;
		const steps = getSteps();
		const { activeStep, device } = this.state;
		return (
			<Paper>
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
											{this.renderStep(index)}
										</Grid>
										<div className={classes.actionsContainer}>
											<div>
												<Button
													disabled={activeStep === 0}
													onClick={this.handleBack}
													className={classes.button}
												>
												Back
												</Button>
												<Button
													variant="contained"
													color="primary"
													onClick={this.handleNext}
													className={classes.button}
												>
													{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
												</Button>
											</div>
										</div>
									</StepContent>
								</Step>
							);
						})}
					</Stepper> : null}
				{activeStep === steps.length && (
					<Paper square elevation={0} className={classes.resetContainer}>
						<Typography variant={'title'}>Success</Typography>
						<Typography paragraph>
						Your Senti device is now configured and calibrated and will produce better results when collecting data. To further enhance the accuracy of your data collection, return to the site of installation and do a new calibration on a regular basis. You can set a reminder for Device Calibration in the Settings section. 
						</Typography>
						<Button onClick={this.handleReset} className={classes.button}>
							Reset
						</Button>
					</Paper>
				)}
	 	 </Paper>
		)
	}
}

export default withStyles(styles)(CalibrateDevice)