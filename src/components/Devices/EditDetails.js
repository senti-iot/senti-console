import React, { Component, Fragment } from 'react'
import { withStyles, Paper, Grid, FormControl, Button, InputLabel, Select, Input, MenuItem, /* FormHelperText */ } from '@material-ui/core';
import { ItemGrid } from '..';
import TextF from '../CustomInput/TextF';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { getDevice } from 'variables/dataDevices';
import CircularLoader from '../Loader/CircularLoader';
import { Save, Check } from '@material-ui/icons'

class EditDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: '',
			description: '',
			address: '',
			locationType: '',
			loading: true
		}
		props.setHeader("Edit " + props.match.params.id)
	}
	componentDidMount = async () => {
		let id = this.props.match.params.id
		await getDevice(id).then(rs => this.setState({ name: rs.device_name, description: rs.description, address: rs.address, locationType: rs.locationType }))
		this.setState({ loading: false })
		console.log(this.state)
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
	handleUpdateDevice = () => {
		// await updateDevice
	}
	render() {
		const { classes } = this.props
		const { loading, name, description, address, locationType } = this.state
		console.log(name)
		return loading ? <CircularLoader/> : (
			<Grid container>
				<Paper className={classes.paper}>
					<form className={classes.form}>

						<Grid container>
							{/* <ItemGrid xs={12}>
						<Typography variant={"title"}>Edit {this.props.match.params.id}</Typography>
					</ItemGrid> */}
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
								<Button
									variant="contained"
									color="primary"
									// className={buttonClassname}
									disabled={this.state.creating}
									onClick={this.state.created ? this.goToDevice : this.handleUpdateDevice}
								>
									{this.state.created ? <Fragment><Check /> Go to Device </Fragment> : <Fragment><Save className={classes.leftIcon} />Update Device</Fragment>}
								</Button>
							</ItemGrid>
						</Grid>
					</form>
				</Paper>
			</Grid>
		)
	}
}
export default withStyles(createprojectStyles)(EditDetails)