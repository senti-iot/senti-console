import { Button, Collapse, Grid, Paper, withStyles } from '@material-ui/core';
import { Check, Save } from '@material-ui/icons';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { Component, Fragment } from 'react';
import { getDevice, updateDeviceHardware } from 'variables/dataDevices';
import { ItemGrid, TextF, GridContainer, CircularLoader, } from '..';

class EditDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			// name: '',
			// description: '',
			// address: '',
			// locationType: '',
			RPImodel: '', //PC Model
			SIMID: 0, //SIM-Card ID
			SIMProvider: '', // SIM Provider
			adapter: '', // Power Adapter
			cellNumber: '', // Cell Number
			memory: '', // Memory + Memory Model
			memoryModel: '',
			modemIMEI: 0, // Modem IMEI
			modemModel: '', // Modem Model
			wifiModule: '', // Wifi Module
			loading: true,
			updating: false,
			updated: false
		}
		props.setHeader("Edit HW info of " + props.match.params.id, true)
	}
	componentDidMount = async () => {
		let id = this.props.match.params.id
		await getDevice(id).then(rs => this.setState({
			id: rs.device_id,
			RPImodel: rs.RPImodel,  
			SIMID: rs.SIMID,
			SIMProvider: rs.SIMProvider,  
			adapter: rs.adapter,
			cellNumber: rs.cellNumber,  
			memory: rs.memory,  
			memoryModel: rs.memoryModel,
			modemIMEI: rs.modemIMEI,  
			modemModel: rs.modemModel,
			wifiModule: rs.wifiModule,
		}))
		this.setState({ loading: false })
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
		const { id, RPImodel, SIMID, SIMProvider, adapter, cellNumber, memory, memoryModel, modemIMEI, modemModel, wifiModule, } = this.state
		this.setState({ updating: true })
		this.timer = setTimeout(async () => {
			await updateDeviceHardware({
				device_id: id,
				RPImodel: RPImodel,
				SIMID: SIMID,
				SIMProvider: SIMProvider,
				adapter: adapter,
				cellNumber: cellNumber,
				memory: memory,
				memoryModel: memoryModel,
				modemIMEI: modemIMEI,
				modemModel: modemModel,
				wifiModule: wifiModule,
			}).then(rs => rs ? this.setState({ updated: true, updating: false }) : null)
		}, 2e3)

	}
	goToDevice = () => {
		this.props.history.push(`/device/${this.props.match.params.id}`)
	}
	render() {
		const { classes } = this.props
		const { loading, RPImodel, SIMID, SIMProvider, adapter, cellNumber, memory, memoryModel, modemIMEI, modemModel, wifiModule, } = this.state
		return loading ? <CircularLoader /> : (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>

						<Grid container>
							<ItemGrid xs={6}>
								<TextF
									id={'rpimodel'}
									label={"PC Model"}
									handleChange={this.handleInput('RPImodel')}
									value={RPImodel}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'memory'}
									label={"Memory Size (in GB)"}
									handleChange={this.handleInput('memory')}
									value={memory}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'mm'}
									label={"Memory Model"}
									handleChange={this.handleInput('memoryModel')}
									value={memoryModel}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'powerAdapter'}
									label={"Power Adapter"}
									handleChange={this.handleInput('adapter')}
									value={adapter}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'wifiModule'}
									label={"WIFI Module"}
									handleChange={this.handleInput('wifiModule')}
									value={wifiModule}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'modemModel'}
									label={"Modem Model"}
									handleChange={this.handleInput('modemModel')}
									value={modemModel}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'modemIMEI'}
									label={"Modem IMEI"}
									handleChange={this.handleInput('modemIMEI')}
									value={modemIMEI.toString()}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'cellNumber'}
									label={"Cell Number"}
									handleChange={this.handleInput('cellNumber')}
									value={cellNumber.toString()}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'SIMID'}
									label={"SIM ID"}
									handleChange={this.handleInput('SIMID')}
									value={SIMID.toString()}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'SIMProvider'}
									label={"SIM Provider"}
									handleChange={this.handleInput('SIMProvider')}
									value={SIMProvider}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={12} container justify={'center'}>
					
								<Collapse in={this.state.updating} timeout={100} unmountOnExit>
									<CircularLoader notCentered />
								</Collapse>
								<ItemGrid>
									<Button
										variant="contained"
										color="primary"
										disabled={this.state.updating}
										onClick={this.state.updated ? this.goToDevice : this.handleUpdateDevice}
									>
										{this.state.updated ? <Fragment><Check className={classes.leftIcon} /> Go to Device </Fragment> : <Fragment><Save className={classes.leftIcon} />Update Device Hardware</Fragment>}
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