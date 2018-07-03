import React, { Component, Fragment } from 'react'
import { withStyles, Paper, Grid, FormControl, Button, InputLabel, Select, Input, MenuItem, Collapse, /* FormHelperText */ } from '@material-ui/core';
import { ItemGrid } from '..';
import TextF from '../CustomInput/TextF';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { getDevice, updateDeviceDetails } from 'variables/dataDevices';
import CircularLoader from '../Loader/CircularLoader';
import { Save, Check } from '@material-ui/icons'
import GridContainer from '../Grid/GridContainer';
class EditDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: '',
			description: '',
			address: '',
			locationType: '',
			loading: true,
			updating: false,
			updated: false
		}
		props.setHeader("Edit Details of " + props.match.params.id)
	}
	componentDidMount = async () => {
		let id = this.props.match.params.id
		await getDevice(id).then(rs => this.setState({ id: rs.device_id, name: rs.device_name, description: rs.description, address: rs.address, locationType: rs.locationType }))
		this.setState({ loading: false })
		// console.log(this.state)
	}
	componentWillUnmount = () => {
		clearTimeout(this.timer);
	}
	
	handleInput = (input) => e => {
		e.preventDefault()
		this.setState({ [input]: e.target.value })
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
	handleUpdateDevice = async () => {
		clearTimeout(this.timer);
		const { id, address, description, locationType, name } = this.state
		this.setState({ updating: true })
		this.timer = setTimeout(async () => {
		 await updateDeviceDetails({
				device_id: id,
				device_name: name,
				address: address,
				description: description,
				locationType: locationType
			}).then(rs =>  rs ? this.setState({ updated: true, updating: false }) : null )
		}, 2e3)

	}
	goToDevice = () => {
		this.props.history.push(`/device/${this.props.match.params.id}`)
	}
	render() {
		const { classes } = this.props
		const { loading, name, description, address, locationType } = this.state
		return loading ? <CircularLoader /> : (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>

						<Grid container>
							<ItemGrid>
								<TextF
									id={'name'}
									label={"Name"}
									handleChange={this.handleInput('name')}
									value={name}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid>
								<FormControl className={this.props.classes.formControl}>
									<InputLabel htmlFor="streetType-helper" classes={{ root: classes.label }}>{locationType ? '' : "Location Type"}</InputLabel>
									<Select
										value={locationType}
										onChange={this.handleInput('locationType')}
										input={<Input name="streetType" id="streetType-helper" classes={{ root: classes.label }} />}
									>
										{this.LocationTypes().map((loc, i) => {
											return <MenuItem key={i} value={loc}>
												{loc}
											</MenuItem>
										})}
									</Select>
								</FormControl>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'description'}
									label={'Description'}
									multiline
									rows={3}
									handleChange={this.handleInput('description')}
									value={description}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'address'}
									label={'Address'}
									handleChange={this.handleInput('address')}
									value={address}
									noFullWidth
								/>
							</ItemGrid>

							<ItemGrid xs={12} container justify={'center'}>
								<ItemGrid xs={12}>
									<Collapse in={this.state.updating} timeout={100} unmountOnExit>
										<CircularLoader notCentered />
									</Collapse>
								</ItemGrid>
								<ItemGrid>
									<Button
										variant="contained"
										color="primary"
										disabled={this.state.updating}
										onClick={this.state.updated ? this.goToDevice : this.handleUpdateDevice}
									>
										{this.state.updated ? <Fragment><Check className={classes.leftIcon}/> Go to Device </Fragment> : <Fragment><Save className={classes.leftIcon} />Update Device</Fragment>}
									</Button>
								</ItemGrid>
							</ItemGrid>
						</Grid>
					</form>
				</Paper>
			</GridContainer>
		)
	}
}
export default withStyles(createprojectStyles)(EditDetails)