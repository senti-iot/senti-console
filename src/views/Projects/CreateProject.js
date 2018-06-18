import React, { Component } from 'react'
import { Paper, TextField, withStyles, Typography, Grid, FormControl, InputLabel, Select, Input, Chip, MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import KeyArrRight from '@material-ui/icons/KeyboardArrowRight';
import KeyArrLeft from '@material-ui/icons/KeyboardArrowLeft';
import { Button } from 'components';
import { getAvailableDevices } from 'variables/data';

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
const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing.unit * 2,
		minWidth: 120,
		// maxWidth: 300,
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: theme.spacing.unit / 8,
	},
	datepicker: {
		margin: theme.spacing.unit,
		padding: theme.spacing.unit
	},
	textField: {
		margin: theme.spacing.unit * 2
	},
	form: {
		margin: theme.spacing.unit,
		padding: theme.spacing.unit,
		display: 'flex',
		flexWrap: 'wrap',
	}
})

class CreateProject extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		  title: '',
		  description: '',
		  open_date: null,
		  close_date: null,
		  devices: [],
		  availableDevices: []
	  }
	}
	componentDidMount = () => {
		getAvailableDevices().then(rs => {
		  this.setState({
			  availableDevices: rs
		  })
	  })
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
	render() {
		const { classes, theme } = this.props
		const { availableDevices } = this.state
		return (
		  <Paper>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					
					<form className={classes.form}>
						<Typography variant={"display1"}>
							Create New Project
						</Typography>
						<TextField
							id={"title"}
							label={"Title"}
							fullWidth
							// className={classes.textField}
							value={this.state.title}
							onChange={this.handleChange("title")}
							classes={{
								root: classes.textField
							}}
							margin="normal" />
						
						<TextField
							fullWidth
							id={"multiline-flexible"}
							label={"Description"}
							multiline
							rows={"4"}
							rowsMax={"4"}
							// className={classes.textField}
							value={this.state.description}
							onChange={this.handleChange("description")}
							classes={{
								root: classes.textField
							}}
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
							/>
						</div>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="select-multiple-chip">Devices</InputLabel>
							<Select
								multiple
								value={this.state.devices}
								onChange={this.handleDeviceChange}
								input={<Input id="select-multiple-chip" />}
								renderValue={selected => (
									<div className={classes.chips}>
										{selected.map(value => <Chip key={value} label={availableDevices[availableDevices.findIndex(d => d.device_id === value)].device_name} className={classes.chip} /> )}
									</div>
								)}
								MenuProps={MenuProps}
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
										{name.device_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</form>
					<Grid container justify={"center"}>
						<Button color="primary" size="large" onClick={() => alert("not implemented")}>
							Create
                     	 </Button>
						  </Grid>
				</MuiPickersUtilsProvider>

		  </Paper>
		)
	}
}

export default withStyles(styles, { withTheme: true })(CreateProject)