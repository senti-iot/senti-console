import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Grid, FormControl, InputLabel, Select, Input, Chip, MenuItem, Collapse, Button, Snackbar } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { KeyboardArrowRight as KeyArrRight, KeyboardArrowLeft as KeyArrLeft, Save, Check } from '@material-ui/icons';
import { getAvailableDevices } from 'variables/dataDevices';
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { updateProject, getProject } from 'variables/dataProjects';
import { Caption, TextF, ItemGrid, CircularLoader, GridContainer } from '..'

// const ITEM_HEIGHT = 32;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
// 	PaperProps: {
// 		style: {
// 			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
// 			width: 250,
// 		},
// 	},
// };

class EditProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			id: 0,
			title: '',
			description: '',
			open_date: null,
			close_date: null,
			devices: [],
			availableDevices: [],
			creating: false,
			created: false,
			loading: true,
			openSnackBar: false,
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		let id = this.props.match.params.id
		await getProject(id).then(p => {
			if (p && this._isMounted)
				this.setState({
					title: p.title,
					description: p.description,
					open_date: p.open_date,
					close_date: p.close_date,
					devices: p.devices.map(d => d.device_id)
				})
		})
		await getAvailableDevices().then(rs => {
			if (this._isMounted) {
				if (rs) {
					this.setState({
						availableDevices: rs
					})
				}
			}
		})
		this.setState({
			loading: false
		})
		this.props.setHeader("Update project " + this.state.title, true)
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
	handleUpdateProject = () => {
		clearTimeout(this.timer)
		let newProject = {
			project: {
				id: this.props.match.params.id,
				title: this.state.title,
				description: this.state.description,
				open_date: this.state.open_date,
				close_date: this.state.close_date
			},
			devices: this.state.devices
		}
		this.setState({ creating: true })
		this.timer = setTimeout( async () => updateProject(newProject).then(rs => rs ? 
			this.setState({ created: true, creating: false, openSnackBar: true }) : this.setState({ created: false, creating: false }))
			, 2e3)
	}
	goToNewProject = () => {
		this.props.history.push('/project/' + this.props.match.params.id)
	}
	render() {
		const { classes, theme } = this.props
		const { availableDevices, created, loading } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		});
		return (
			!loading ?
				<GridContainer justify={'center'}>
					<Paper className={classes.paper}>
						<MuiPickersUtilsProvider utils={MomentUtils}>
							<form className={classes.form}>
								<ItemGrid container xs={12} md={6}>
									<TextF
										id={"title"}
										label={"Title"}
										value={this.state.title}
										className={classes.textField}
										handleChange={this.handleChange("title")}
										margin="normal"
									/>
								</ItemGrid>
								<ItemGrid xs={12} md={6} sm={12}>
									<TextF
										id={"multiline-flexible"}
										label={"Description"}
										multiline
										rows={"4"}
										color={"secondary"}
										className={classes.textField}
										value={this.state.description}
										handleChange={this.handleChange("description")}
										margin="normal"
									/>
								</ItemGrid>
								<ItemGrid xs={12} md={6}>
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
								</ItemGrid>
								<ItemGrid xs={12} md={6}>
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
								</ItemGrid>
								<ItemGrid xs={12}>
									<FormControl className={classes.formControl}>
										{availableDevices.length > 0 ?
											<Fragment>
												<InputLabel FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select-multiple-chip">
													Assign more devices
												</InputLabel>
												<Select
													color={"primary"}s
													multiple
													value={this.state.devices}
													onChange={this.handleDeviceChange}
													input={<Input id="select-multiple-chip" classes={{ underline: classes.underline }} />}
													renderValue={selected => (
														<div className={classes.chips}>
															{selected.map(value => {
																return <Chip key={value}
																	label={availableDevices[availableDevices.findIndex(d => d.device_id === value)].device_name}
																	className={classes.chip} />})}
														</div>)}
													/* MenuProps={MenuProps} */>
													{availableDevices.map(name => (
														<MenuItem
															key={name.device_id}
															value={name.device_id}
															style={{
																fontWeight:
														this.state.devices.indexOf(name.device_id) === -1
															? theme.typography.fontWeightRegular
															: theme.typography.fontWeightMedium,
															}}>
															{name.device_id + " - " + (name.device_name ? name.device_name : "No Name")}
														</MenuItem>
													))}
												</Select>
											</Fragment> : <Caption>There are no available Devices</Caption>}
									</FormControl>
								</ItemGrid>							
							</form>
							<ItemGrid xs={12} container justify={'center'}>
								<Collapse in={this.state.creating} timeout="auto" unmountOnExit>
									<CircularLoader notCentered />
								</Collapse>
							</ItemGrid>
							<Grid container justify={"center"}>
								<div className={classes.wrapper}>
									<Button
										variant="contained"
										color="primary"
										className={buttonClassname}
										disabled={this.state.creating}
										onClick={this.state.created ? this.goToNewProject : this.handleUpdateProject}>
										{this.state.created ?
											<Fragment><Check className={classes.leftIcon} /> Go to Project </Fragment>
											: <Fragment><Save className={classes.leftIcon} />Update Project</Fragment>}
									</Button>
								</div>
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
						autoHideDuration={5000}
						message={
							<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
								<Check className={classes.leftIcon} color={'primary'} />Project {this.state.title} has been successfully updated!
							</ItemGrid>
						}
					/>
				</GridContainer>
				: <CircularLoader />
		)
	}
}

export default withStyles(createprojectStyles, { withTheme: true })(EditProject)
