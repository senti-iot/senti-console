import { Button, /* Chip, */ Collapse, FormControl, Grid, /* Input, */ InputLabel, MenuItem, Paper, Select, withStyles } from '@material-ui/core'
import { KeyboardArrowLeft as KeyArrLeft, KeyboardArrowRight as KeyArrRight, Save } from 'variables/icons'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import classNames from 'classnames'
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import React, { Component, Fragment } from 'react'
import { createProject } from 'variables/dataProjects'
import { /* Caption, */ CircularLoader, GridContainer, ItemGrid, TextF, Danger, Warning } from 'components'
import { getAllOrgs } from 'variables/dataOrgs';
import { getAvailableDevices } from 'variables/dataDevices';
import { getCreateProject } from 'variables/dataProjects'
import { connect } from 'react-redux'
import moment from 'moment';

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
			errorMessage: ''
		}
		props.setHeader('menus.create.project', true, '/projects/list', 'projects')
	}

	componentDidMount = () => {
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
					this.setState({
						availableDevices: devices ? devices : null,
						devices: [], 
						orgs: rs,
						selectedOrg: this.props.userOrg
					})
				}
			}
		})
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleValidation = () => {
		let errorCode = [];
		const { title, startDate, endDate } = this.state
		if (title === '')
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
				return t('projects.validation.noTitle')
			case 2: 
				return t('projects.validation.noStartDate')
			case 3: 
				return t('projects.validation.noEndDate')
			case 4:
				return t('projects.validation.startDateBiggerThanEndDate')
			default: 
				return ''	
		}

	}
	handleDeviceChange = event => {
		this.setState({ devices: event.target.value })
	}
	handleSelectedOrgs = async e => {
		this.setState({ selectedOrg: e.target.value })
		// var devices = await getAvailableDevices(e.target.value).then(rs => rs)
		// this.setState({ availableDevices: devices ? devices : null, devices: [] })
	}
	handleDateChange = id => value => {
		this.setState({
			error: false,
			[id]: moment(value).local().format('YYYY-MM-DDTHH:ss')
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
		this.setState({ created: true, id: rs.id })
		this.props.s('snackbars.projectCreated', { project: this.state.title })			
		this.props.history.push(`/project/${rs.id}`)
	}
	handleCreateProject = async () => {
		const { /* availableDevices, */ title, description, startDate, endDate } = this.state
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
						// devices: availableDevices ? availableDevices.filter(a => this.state.devices.some(b => a.id === b)) : []
					}
					await createProject(newProject).then(rs => rs ? this.handleFinishCreateProject(rs) : this.setState({ create: false, creating: false, id: 0 })
					)
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

	render() {
		const { classes, theme, t } = this.props
		const { /* availableDevices, */ created, orgs, selectedOrg, error } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})
		return (
			<GridContainer justify={'center'}>
				<Paper className={classes.paper}> : 
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
									id={'title'}
									label={t('projects.fields.name')}
									value={this.state.title}
									className={classes.textField}
									handleChange={this.handleChange('title')}
									margin='normal'
									
									error={error}

								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'multiline-flexible'}
									label={t('projects.fields.description')}
									multiline
									rows={4}
									// rowsMax={'4'}
									color={'secondary'}
									className={classes.textField}
									value={this.state.description}
									handleChange={this.handleChange('description')}
									margin='normal'
									
									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<DatePicker
									autoOk
									label={t('projects.fields.startDate')}
									clearable
									labelFunc={(date, invalidLabel) => date === null ? '' : moment(date).format('LL')}
									format='YYYY-MM-DDTHH:mm'
									value={this.state.startDate}
									onChange={this.handleDateChange('startDate')}
									animateYearScrolling={false}
									color='primary'
									rightArrowIcon={<KeyArrRight />}
									leftArrowIcon={<KeyArrLeft />}
									InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
									InputProps={{ classes: { underline: classes.underline } }}
									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<DatePicker
									color='primary'
									autoOk
									label={t('projects.fields.endDate')}
									clearable
									labelFunc={(date, invalidLabel) => date === null ? '' : moment(date).format('LL')}
									format='YYYY-MM-DDTHH:mm'
									value={this.state.endDate}
									onChange={this.handleDateChange('endDate')}
									animateYearScrolling={false}
									rightArrowIcon={<KeyArrRight />}
									leftArrowIcon={<KeyArrLeft />}
									InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
									InputProps={{ classes: { underline: classes.underline } }}
									error={error}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<FormControl className={classes.formControl}>
									{orgs ?
										<Fragment>
											<InputLabel
												FormLabelClasses={{ root: classes.label }}
												color={'primary'}
												htmlFor='select-org'>
												{t('projects.fields.selectOrganisation')}
											</InputLabel>

											<Select
												color={'primary'}
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
						</form>
						<ItemGrid xs={12} container justify={'center'}>
							<Collapse in={this.state.creating} timeout='auto' unmountOnExit>
								<CircularLoader notCentered />
							</Collapse>
						</ItemGrid>
						<Grid container justify={'center'}>
							<div className={classes.wrapper}>
								<Button
									variant='contained'
									color='primary'
									className={buttonClassname}
									disabled={this.state.creating || this.state.created}
									onClick={this.handleCreateProject}
								>
									{this.state.created ? t('snackbars.redirect')
										: <Fragment>
											<Save className={classes.leftIcon} />{t('menus.create.project')}
										</Fragment>}
								</Button>
							</div>
						</Grid>
					</MuiPickersUtilsProvider>
				</Paper>
			</GridContainer> 
		)
	}
}
const mapStateToProps = (state) => ({
	userOrg: state.settings.user.org.id
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles, { withTheme: true })(CreateProject))