import { Button, Chip, Collapse, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, withStyles, Snackbar } from '@material-ui/core'
import { Check, KeyboardArrowLeft as KeyArrLeft, KeyboardArrowRight as KeyArrRight, Save } from '@material-ui/icons'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import classNames from 'classnames'
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
// import { getAvailableDevices } from 'variables/dataDevices'
import { createProject } from 'variables/dataProjects'
import { Caption, CircularLoader, GridContainer, ItemGrid, TextF, Danger } from '..'
import { getAllOrgs } from 'variables/dataUsers';
import { getAvailableDevices } from 'variables/dataDevices';
import { getCreateProject } from '../../variables/dataProjects'
import { connect } from 'react-redux'
import Warning from '../Typography/Warning';
// import moment from 'moment';
var moment = require('moment')
// moment.locale('dk')
const ITEM_HEIGHT = 32
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
}

class CreateProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			// project: {},
			title: '',
			description: '',
			startDate: null,
			endDate: null,
			devices: [],
			orgs: [],
			selectedOrg: '',
			availableDevices: null,
			creating: false,
			created: false,
			openSnackBar: false,
			error: false,
			errorMessage: ""
		}
	}

	componentDidMount = () => {
		const { t } = this.props
		this._isMounted = 1

		getAllOrgs().then(async rs => {
			if (this._isMounted) {
				if (rs.length === 1)
					this.setState({
						orgs: rs,
						selectedOrg: rs[0].id
					})
				else {
					var devices = await getAvailableDevices(this.props.userOrg.id).then(rs => rs)
					this.setState({})
					this.setState({
						availableDevices: devices ? devices : null,
						devices: [], 
						orgs: rs,
						selectedOrg: this.props.userOrg
					})
				}
			}
		})
		this.props.setHeader(t("projects.new"), true, "/projects/list")
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		clearTimeout(this.timer)
		clearTimeout(this.redirect)
	}
	handleValidation = () => {
		let errorCode = [];
		const { title, startDate, endDate } = this.state
		if (title === "")
		{
			errorCode.push(1)
		}
		if (!moment(startDate).isValid())
		{
			errorCode.push(2)
		}
		if (!moment(endDate).isValid()) 
		{
			errorCode.push(3)
		}
		if ( moment(startDate).isAfter(endDate) )
		{
			errorCode.push(4)
		}
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>)
		})	
		if (errorCode.length === 0)
			return true
		else 
			return false
	}
	errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 1:
				return t("projects.validation.noTitle")
			case 2: 
				return t("projects.validation.noStartDate")
			case 3: 
				return t("projects.validation.noEndDate")
			case 4:
				return t("projects.validation.startDateBiggerThanEndDate")
			default: 
				return ""	
		}

	}
	handleDeviceChange = event => {
		this.setState({ devices: event.target.value })
	}
	handleSelectedOrgs = async e => {
		this.setState({ selectedOrg: e.target.value })
		var devices = await getAvailableDevices(e.target.value).then(rs => rs)
		this.setState({ availableDevices: devices ? devices : null, devices: [] })
	}
	handleDateChange = id => value => {
		this.setState({
			error: false,
			[id]: value
		})
	}

	handleChange = (id) => e => {
		e.preventDefault()
		this.setState({
			error: false,
			[id]: e.target.value
		})
	}
	handleFinishCreateProject = (rs) => {
		this.setState({ created: true, id: rs.id, openSnackBar: true })
		this.redirect = setTimeout(() => this.props.history.push(`/project/${rs.id}`), 1000)
	}
	handleCreateProject = async () => {
		const { availableDevices, title, description, startDate, endDate } = this.state
		clearTimeout(this.timer)
		this.setState({ creating: true })
		if (this.handleValidation())
		{
			await getCreateProject().then(async rs => {
				// let isCreated = false
				if (this._isMounted) {
					let newProject = {
						...rs,
						title: title,
						description: description,
						startDate: startDate,
						endDate: endDate,
						devices: availableDevices ? availableDevices.filter(a => this.state.devices.some(b => a.id === b)) : []
					}
					this.timer = await setTimeout(async () => await createProject(newProject).then(rs => rs ? this.handleFinishCreateProject(rs) : this.setState({ create: false, creating: false, id: 0 })
					), 2e3)
				}
			})
		}
		else {
			this.setState({
				creating: false,
				error: true,
			})
		}
	}

	goToNewProject = () => {
		if (this.state.id)
			this.props.history.push('/project/' + this.state.id)
	}

	render() {
		const { classes, theme, t } = this.props
		const { availableDevices, created, orgs, selectedOrg, error } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})
		return (
			<GridContainer justify={'center'}>
				<Paper className={classes.paper}>
					<MuiPickersUtilsProvider utils={MomentUtils}>
					
						<form className={classes.form}>
							<ItemGrid xs={12}>
								<Collapse in={this.state.error}>
									<Warning>
										<Danger>
											{this.state.errorMessage}
										</Danger>
									</Warning>
								</Collapse>
							</ItemGrid>
							<ItemGrid container xs={12}>
								<TextF
									autoFocus
									id={"title"}
									label={t("projects.fields.name")}
									value={this.state.title}
									className={classes.textField}
									handleChange={this.handleChange("title")}
									margin="normal"
									noFullWidth
									error={error}

								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={"multiline-flexible"}
									label={t("projects.fields.description")}
									multiline
									rows={"4"}
									// rowsMax={"4"}
									color={"secondary"}
									className={classes.textField}
									value={this.state.description}
									handleChange={this.handleChange("description")}
									margin="normal"
									noFullWidth
									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{/* <div className={classes.datepicker}> */}
								<DatePicker
									autoOk
									label={t("projects.fields.startDate")}
									clearable
									format="DD.MM.YYYY"
									value={this.state.startDate}
									onChange={this.handleDateChange("startDate")}
									animateYearScrolling={false}
									color="primary"
									rightArrowIcon={<KeyArrRight />}
									leftArrowIcon={<KeyArrLeft />}
									InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
									InputProps={{ classes: { underline: classes.underline } }}
									error={error}

								/>
								{/* </div> */}
							</ItemGrid>
							<ItemGrid xs={12}>
								{/* <div className={classes.datepicker}> */}
								<DatePicker
									color="primary"
									autoOk
									label={t("projects.fields.endDate")}
									clearable
									format="DD.MM.YYYY"
									value={this.state.endDate}
									onChange={this.handleDateChange("endDate")}
									animateYearScrolling={false}
									rightArrowIcon={<KeyArrRight />}
									leftArrowIcon={<KeyArrLeft />}
									InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
									InputProps={{ classes: { underline: classes.underline } }}
									error={error}

								/>
								{/* </div> */}
							</ItemGrid>
							<ItemGrid xs={12}>
								<FormControl className={classes.formControl}>
									{orgs ?
										<Fragment>
											<InputLabel
												FormLabelClasses={{ root: classes.label }}
												color={"primary"}
												htmlFor="select-org">
												{t("projects.fields.selectOrganisation")}
											</InputLabel>

											<Select
												color={"primary"}
												value={this.state.selectedOrg}
												onChange={this.handleSelectedOrgs}
												MenuProps={MenuProps}
												inputProps={{
													name: 'org',
													id: 'select-org',
												}}
											>
												{orgs.map(org =>
													<MenuItem
														key={org.id}
														value={org.id}
														style={{ fontWeight: selectedOrg === org.id ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular }}>
														{org.name}
													</MenuItem>

												)}
											</Select>
										</Fragment> : <CircularLoader notCentered />}
								</FormControl>
							</ItemGrid>
							<ItemGrid xs={12}>
								<FormControl className={classes.formControl}>
									{availableDevices ?
										<Fragment>
											<InputLabel FormLabelClasses={{
												root: classes.label,
												// focused: classes.focused
											}} color={"primary"} htmlFor="select-multiple-chip">{t("projects.fields.assignDevices")}</InputLabel>
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
														{selected.map(value => { return <Chip key={value} label={availableDevices[availableDevices.findIndex(d => d.id === value)].name} className={classes.chip} /> })}
													</div>
												)}
												MenuProps={MenuProps}
											>
												{availableDevices.map(name => (
													<MenuItem
														key={name.id}
														value={name.id}
														style={{
															fontWeight:
																this.state.devices.indexOf(name.id) === -1
																	? theme.typography.fontWeightRegular
																	: theme.typography.fontWeightMedium,
														}}
													>
														{name.id + " - " + (name.name ? name.name : t("devices.noName"))}
													</MenuItem>
												))}
											</Select>
										</Fragment> : selectedOrg ? <Caption>{t("devices.noDevices")}</Caption> : <Caption>{t("projects.noOrganisationSelected")}</Caption>}
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
								<Button
									variant="contained"
									color="primary"
									className={buttonClassname}
									disabled={this.state.creating}
									onClick={this.state.created ? this.goToNewProject : this.handleCreateProject}
								>
									{this.state.created ? <Fragment><Check className={classes.leftIcon} />{t("projects.redirecting")}</Fragment>
										: <Fragment>
											<Save className={classes.leftIcon} />{t("projects.new")}
										</Fragment>}
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
							<Check className={classes.leftIcon} color={'primary'} />{t("projects.projectCreated")}
						</ItemGrid>
					}
				/>			</GridContainer>
		)
	}
}
const mapStateToProps = (state) => ({
	userOrg: state.settings.user.org.id
})

const mapDispatchToProps = {

}
const CP = withStyles(createprojectStyles, { withTheme: true })(CreateProject)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CP))