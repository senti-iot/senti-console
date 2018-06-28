import React, { Component, Fragment } from 'react'
import { Paper, TextField, withStyles, Grid, FormControl, InputLabel, Select, Input, Chip, MenuItem, Collapse, CircularProgress, Button } from '@material-ui/core';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import KeyArrRight from '@material-ui/icons/KeyboardArrowRight';
import KeyArrLeft from '@material-ui/icons/KeyboardArrowLeft';
// import { ItemGrid } from 'components';
import { getAvailableDevices, createOneProject } from 'variables/data';
import Save from '@material-ui/icons/Save'
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { withRouter } from 'react-router-dom'

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
			availableDevices: [],
			creating: false,
			created: false
		}
	}
	componentDidMount = () => {
		getAvailableDevices().then(rs => {
			this.setState({
				availableDevices: rs
			})
		})
		this.props.setHeader("Create new project")
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
		let newProject = {
			project: {
				title: this.state.title,
				description: this.state.description,
				open_date: this.state.open_date,
				close_date: this.state.close_date
			},
			devices: this.state.devices
		}
		// console.log(Object.keys(newProject.project).map(p => newProject.project[p] !== null ? false : true))
		this.setState({ creating: true })
		createOneProject(newProject).then(rs => {
			// console.log(rs)
			this.setState({ created: rs ? true : false, creating: false, id: rs })
		})
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

			<Grid container justify={'center'}>
				{/* <ItemGrid xs={12} sm={12} md={12}> */}
				<Paper className={classes.paper}>
					<MuiPickersUtilsProvider utils={MomentUtils}>

						<form className={classes.form}>

							<TextField
								id={"title"}
								label={"Title"}
								fullWidth
								value={this.state.title}
								className={classes.textField}
								onChange={this.handleChange("title")}
								InputLabelProps={
									{
										FormLabelClasses: {
											root: classes.label,
											focused: classes.focused,
										},
									}
								}
								InputProps={{
									classes: {
										underline: classes.underline,
									}
								}}
								margin="normal" />

							<TextField
								fullWidth
								id={"multiline-flexible"}
								label={"Description"}
								multiline
								rows={"4"}
								rowsMax={"4"}
								color={"secondary"}
								className={classes.textField}
								value={this.state.description}
								onChange={this.handleChange("description")}
								InputLabelProps={{
									FormLabelClasses: {
										root: classes.label,
										focused: classes.focused,
									}
								}}
								InputProps={{ classes: { underline: classes.underline } }}
								margin="normal" />
							<div className={classes.datepicker}>

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
									InputLabelProps={{
										FormLabelClasses: {
											root: classes.label,
											focused: classes.focused,
										}
									}}
									InputProps={{ classes: { underline: classes.underline } }}

								/>
							</div>
							<div className={classes.datepicker}>
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
									InputLabelProps={{
										FormLabelClasses: {
											root: classes.label,
											focused: classes.focused,
										}
									}}
									InputProps={{ classes: { underline: classes.underline } }}

								/>
							</div>
							<FormControl className={classes.formControl}>
								<InputLabel FormLabelClasses={{
									root: classes.label,
									focused: classes.focused
								}} color={"primary"} htmlFor="select-multiple-chip">Devices</InputLabel>
								<Select
									color={"primary"}
									multiple
									value={this.state.devices}
									onChange={this.handleDeviceChange}
									input={<Input id="select-multiple-chip" classes={{
										underline: classes.underline
									}} />}
									renderValue={selected => (
										<div className={classes.chips}>
											{selected.map(value => <Chip key={value} label={availableDevices[availableDevices.findIndex(d => d.device_id === value)].device_name} className={classes.chip} />)}
										</div>
									)}
									MenuProps={MenuProps}
								// inputProps={{ classes: { underline: classes.underline } }}


								>
									{availableDevices.map(name => (
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
							</FormControl>
						</form>
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
									{this.state.created ? "Go to new Project" : <Fragment><Save className={classes.leftIcon} />Create Project</Fragment>}
								</Button>
								{this.state.creating && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
							{/* <div className={classes.button}>
									<Button variant={"contained"} color="primary" size="medium" onClick={this.handleCreateProject}>
										<Save/>Create Project
                     		 		</Button>
							  	</div> */}
						</Grid>
						<Collapse in={this.state.loggingIn} timeout="auto" unmountOnExit>

							<Grid container><CircularProgress className={classes.loader} /></Grid>

						</Collapse>

					</MuiPickersUtilsProvider>
				</Paper>
				{/* </ItemGrid> */}
			</Grid>
		)
	}
}

export default withRouter(withStyles(createprojectStyles, { withTheme: true })(CreateProject))