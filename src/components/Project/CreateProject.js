import { Button, Chip, Collapse, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, withStyles, Snackbar } from '@material-ui/core';
import { Check, KeyboardArrowLeft as KeyArrLeft, KeyboardArrowRight as KeyArrRight, Save } from '@material-ui/icons';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import classNames from 'classnames';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { getAvailableDevices } from 'variables/dataDevices';
import { createOneProject } from 'variables/dataProjects';
import { Caption, CircularLoader, GridContainer, ItemGrid, TextF } from '..';

const ITEM_HEIGHT = 32;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

class CreateProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			title: '',
			description: '',
			open_date: null,
			close_date: null,
			devices: [],
			availableDevices: null,
			creating: false,
			created: false,
			openSnackBar: false
		}
	}
	componentDidMount = () => {
		this._isMounted = 1
		getAvailableDevices().then(rs => {
			if (this._isMounted)
				this.setState({
					availableDevices: rs
				})
		})
		this.props.setHeader("Create new project", true)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		clearTimeout(this.timer)

	}
	
	handleDeviceChange = event => {
		this.setState({ devices: event.target.value });
	};

	handleDateChange = id => value => {
		this.setState({
			[id]: value
		})
	}
	handleChange = (id) => e => {
		e.preventDefault()
		this.setState({
			[id]: e.target.value
		})
	}
	handleCreateProject = () => {
		clearTimeout(this.timer)
		let newProject = {
			project: {
				title: this.state.title,
				description: this.state.description,
				open_date: this.state.open_date,
				close_date: this.state.close_date
			},
			devices: this.state.devices
		}
		this.setState({ creating: true })
		this.timer = setTimeout(async () => createOneProject(newProject).then(rs => rs ? 
			this.setState({ created: true, creating: false, id: rs, openSnackBar: true }) : this.setState({ create: false, creating: false, id: 0 })
		), 2e3)
	}
	goToNewProject = () => {
		if (this.state.id)
			this.props.history.push('/project/' + this.state.id)
	}
	render() {
		const { classes, theme } = this.props
		const { availableDevices, created } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		});
		return (
			<GridContainer justify={'center'}>
				<Paper className={classes.paper}>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<form className={classes.form}>
							{/* <Grid container justify={'center'}> */}
							<ItemGrid container xs={12}>
								<TextF
									id={"title"}
									label={"Title"}
									value={this.state.title}
									className={classes.textField}
									handleChange={this.handleChange("title")}
									margin="normal"
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={"multiline-flexible"}
									label={"Description"}
									multiline
									rows={"4"}
									// rowsMax={"4"}
									color={"secondary"}
									className={classes.textField}
									value={this.state.description}
									handleChange={this.handleChange("description")}
									margin="normal"
									noFullWidth/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{/* <div className={classes.datepicker}> */}
								<DatePicker
									autoOk
									label="Start Date"
									clearable
									format="DD.MM.YYYY"
									value={this.state.open_date}
									onChange={this.handleDateChange("open_date")}
									animateYearScrolling={false}
									color="primary"
									rightArrowIcon={<KeyArrRight />}
									leftArrowIcon={<KeyArrLeft />}
									InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
									InputProps={{ classes: { underline: classes.underline } }}
								/>
								{/* </div> */}
							</ItemGrid>
							<ItemGrid xs={12}>
								{/* <div className={classes.datepicker}> */}
								<DatePicker
									color="primary"
									autoOk
									label="End Date"
									clearable
									format="DD.MM.YYYY"
									value={this.state.close_date}
									onChange={this.handleDateChange("close_date")}
									animateYearScrolling={false}
									rightArrowIcon={<KeyArrRight />}
									leftArrowIcon={<KeyArrLeft />}
									InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
									InputProps={{ classes: { underline: classes.underline } }}
								/>
								{/* </div> */}
							</ItemGrid>
							<ItemGrid xs={12}>
								<FormControl className={classes.formControl}>
									{availableDevices ?
										<Fragment>
											<InputLabel FormLabelClasses={{
												root: classes.label,
											// focused: classes.focused
											}} color={"primary"} htmlFor="select-multiple-chip">Devices</InputLabel>
											<Select
												color={"primary"}
												multiple
												value={this.state.devices}
												// autoWidth
												onChange={this.handleDeviceChange}
												input={<Input id="select-multiple-chip" classes={{
													underline: classes.underline
												}} />}
												renderValue={selected => (
													<div className={classes.chips}>
														{selected.map(value => { return <Chip key={value} label={availableDevices[availableDevices.findIndex(d => d.device_id === value)].device_name} className={classes.chip} /> })}
													</div>
												)}
												MenuProps={MenuProps}
											>
												{ availableDevices.map(name => (
													<MenuItem
														key={name.device_id}
														value={name.device_id}
														style={{
															fontWeight:
													this.state.devices.indexOf(name.device_id) === -1
														? theme.typography.fontWeightRegular
														: theme.typography.fontWeightMedium,
														}}
													>
														{name.device_id + " - " + (name.device_name ? name.device_name : "No Name")}
													</MenuItem>
												))}
											</Select>
										</Fragment> : <Caption>There are no available Devices</Caption>}
								</FormControl>
							</ItemGrid>
							{/* </Grid> */}

						</form>
						<ItemGrid xs={12} container justify={'center'}>
							<Collapse in={this.state.creating} timeout="auto" unmountOnExit>
								<CircularLoader notCentered />
							</Collapse>
						</ItemGrid>
						<Grid container justify={"center"}>
							<div className={classes.wrapper}>
								{/* <Save />  */}
								<Button
									variant="contained"
									color="primary"
									className={buttonClassname}
									disabled={this.state.creating}
									onClick={this.state.created ? this.goToNewProject : this.handleCreateProject}
								>
									{this.state.created ? <Fragment><Check className={classes.leftIcon}/> Go to new Project </Fragment> : <Fragment><Save className={classes.leftIcon} />Create Project</Fragment>}
								</Button>
								{/* {this.state.creating && <CircularProgress size={24} className={classes.buttonProgress} />} */}
							</div>
							{/* <div className={classes.button}>
									<Button variant={"contained"} color="primary" size="medium" onClick={this.handleCreateProject}>
										<Save/>Create Project
                     		 		</Button>
							  	</div> */}
						</Grid>
		

					</MuiPickersUtilsProvider>
				</Paper>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					open={this.state.openSnackBar}
					onClose={() => { this.setState({ openSnackBar: false }) }}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					message={
						<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
							<Check className={classes.leftIcon} color={'primary'} />Project {this.state.title} has been successfully created!
						</ItemGrid>
					}
				/>			</GridContainer>
		)
	}
}

export default withRouter(withStyles(createprojectStyles, { withTheme: true })(CreateProject))