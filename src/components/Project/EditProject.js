import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Grid, Collapse, Button } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { KeyboardArrowRight as KeyArrRight, KeyboardArrowLeft as KeyArrLeft, Save, Check } from 'variables/icons';
// import { getAvailableDevices } from 'variables/dataDevices';
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { updateProject, getProject } from 'variables/dataProjects';
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning } from 'components'
// import { dateFormatter } from 'variables/functions';
var moment = require('moment')
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
			project: {},
			availableDevices: [],
			selectedDevices: [],
			allDevices: [],
			creating: false,
			created: false,
			loading: true
		}
	}
	handleValidation = () => {
		let errorCode = [];
		const { title, startDate, endDate } = this.state.project
		if (title === '') {
			errorCode.push(1)
		}
		if (!moment(startDate).isValid()) {
			errorCode.push(2)
		}
		if (!moment(endDate).isValid()) {
			errorCode.push(3)
		}
		if (moment(startDate).isAfter(endDate)) {
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
	componentDidMount = async () => {
		this._isMounted = 1
		let id = this.props.match.params.id
		const { location } = this.props
		// let projectOrgID = 0
		await getProject(id).then(p => {
			if (p && this._isMounted) {
				// projectOrgID = p.org.id
				this.setState({
					project: p,
					// devices: p.devices,
					// selectedDevices: p.devices,
				})
			}
		})
		// await getAvailableDevices(projectOrgID).then(rs => {
		// 	if (this._isMounted) {
		// 		let allDev = []
		// 		allDev = this.state.project.devices ? allDev.concat(this.state.project.devices) : allDev
		// 		allDev = rs ? allDev.concat(rs) : allDev
		// 		this.setState({
		// 			availableDevices: rs ? rs : [],
		// 			allDevices: allDev
		// 		})

		// 	}
		// })
		this.setState({
			loading: false
		})
		let prevURL = location.prevURL ? location.prevURL : '/projects/list'
		this.props.setHeader('projects.updateProject', true, prevURL, 'projects')
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		clearTimeout(this.timer)
	}

	handleDeviceChange = event => {
		// let newDevices = this.state.selectedDevices.push({ id: event.target.value })
		this.setState({ selectedDevices: event.target.value.map(d => ({ id: d })) });
	};

	handleDateChange = id => value => {
		// )
		// .format('YYYY MM DD HH:ss'))
		// .local().format('YYYY MM DD HH:ss'))
		this.setState({
			error: false,
			project: {
				...this.state.project,
				[id]: moment(value).local().format('YYYY-MM-DDTHH:ss')
			}
		})
	}
	handleChange = (id) => e => {
		e.preventDefault()
		this.setState({
			error: false,
			project: {
				...this.state.project,
				[id]: e.target.value
			}
		})
	}
	handleUpdateProject = () => {
		
		let newProject = {
			...this.state.project,
			devices: this.state.selectedDevices,
		}
		this.setState({ creating: true })
		if (this.handleValidation())
			return updateProject(newProject).then(rs => rs ?
				this.close() :
				this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t('projects.validation.networkError') })
			)
		else {
			this.setState({
				creating: false,
				error: true,
			})
		}
	}

	close = () => {
		this.setState({ created: true, creating: false })
		const { s, history } = this.props
		s('snackbars.projectUpdated', { project: this.state.project.title })
		history.push('/project/' + this.props.match.params.id)
	}

	render() {
		const { classes, /* theme, */ t } = this.props
		const { /* availableDevices, */ created, error, loading, /* selectedDevices, project, allDevices */ } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})

		return (
			!loading ?
				<GridContainer justify={'center'}>
					<Paper className={classes.paper}>
						<MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
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
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={'title'}
										label={t('projects.fields.name')}
										value={this.state.project.title}
										className={classes.textField}
										handleChange={this.handleChange('title')}
										margin='normal'
										
										error={error}
									/>
								</ItemGrid>
								<ItemGrid xs={12} md={6} sm={12}>
									<TextF
										id={'multiline-flexible'}
										label={t('projects.fields.description')}
										multiline
										rows={'4'}
										color={'secondary'}
										className={classes.textField}
										value={this.state.project.description}
										handleChange={this.handleChange('description')}
										margin='normal'
										
										error={error}
									/>
								</ItemGrid>
								<ItemGrid xs={12} md={6}>
									<DatePicker
										autoOk
										// ampm={false}
										label={t('projects.fields.startDate')}
										clearable
										labelFunc={(date, invalidLabel) => date === null ? '' : moment(date).format('LL')}
										format='YYYY-MM-DDTHH:mm'
										// format='LL'
										value={this.state.project.startDate}
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
								<ItemGrid xs={12} md={6}>
									<DatePicker
										color='primary'
										// ampm={false}
										autoOk
										label={t('projects.fields.endDate')}
										clearable
										labelFunc={(date, invalidLabel) => date === null ?  '' : date.format('LL') }
										format='YYYY-MM-DDTHH:mm'
										// format='LL'
										value={this.state.project.endDate}
										onChange={this.handleDateChange('endDate')}
										animateYearScrolling={false}
										rightArrowIcon={<KeyArrRight />}
										leftArrowIcon={<KeyArrLeft />}
										InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
										InputProps={{ classes: { underline: classes.underline } }}
										error={error}
									/>
								</ItemGrid>
								{/* <ItemGrid xs={12}>
									<FormControl className={classes.formControl}>
										<Fragment>
											<InputLabel FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
												{t('projects.fields.assignDevices')}
											</InputLabel>
											<Select
												color={'primary'}
												multiple
												value={selectedDevices.map(d => d.id)}
												onChange={this.handleDeviceChange}
												input={<Input id='select-multiple-chip' classes={{ underline: classes.underline }} />}
												renderValue={selected => (
													<div className={classes.chips}>
														{selected.map(value => {
															if (availableDevices.findIndex(d => d.id === value) > -1)
																return <Chip key={value}
																	label={availableDevices[availableDevices.findIndex(d => d.id === value)].id}
																	className={classes.chip} />
															else
															if (project.devices.findIndex(d => d.id === value) > -1)
																return <Chip key={value}
																	label={project.devices[project.devices.findIndex(d => d.id === value)].id}
																	className={classes.chip} />
															else return null
														})}

													</div>)}
											>
												{allDevices.map(device => (
													<MenuItem
														key={device.id}
														value={device.id}
														style={{
															fontWeight:
																this.state.project.devices.indexOf(device.id) === -1
																	? theme.typography.fontWeightRegular
																	: theme.typography.fontWeightMedium,
														}}>
														{device.id + ' - ' + (device.name ? device.name : t('devices.noName'))}
													</MenuItem>
												))}
											</Select>
										</Fragment>
									</FormControl>
								</ItemGrid> */}
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
										onClick={ this.handleUpdateProject}>
										{this.state.created ?
											<Fragment><Check className={classes.leftIcon} />{t('snackbars.redirect')}</Fragment>
											: <Fragment><Save className={classes.leftIcon} />{t('projects.updateProject')}</Fragment>}
									</Button>
								</div>
							</Grid>

						</MuiPickersUtilsProvider>
					</Paper>
				</GridContainer>
				: <CircularLoader />
		)
	}
}

export default withStyles(createprojectStyles/* , { withTheme: true } */)(EditProject)
