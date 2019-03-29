import { Button, Grid, Paper, withStyles, Collapse } from '@material-ui/core';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { Component, Fragment } from 'react';
import { updateDevice } from 'variables/dataDevices';
import { ItemGrid, TextF, GridContainer, CircularLoader, } from 'components';
import { isFav, updateFav } from 'redux/favorites';
import { connect } from 'react-redux'
import { getDeviceLS, getDevices } from 'redux/data';

class EditDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true,
			updating: false,
			updated: false
		}
		let prevURL = props.location.state ? props.location.prevURL : `/devices/list`
		props.setHeader({ id: 'devices.editHardwareTitle', options: { deviceId: props.match.params.id } }, true, prevURL, 'devices')
	}
	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToDevice()
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { device } = this.props
		if ((!prevProps.device && device !== prevProps.device) || (this.state.device === null && device)) {
			  this.props.setBC('editdevicehardware', device.name, device.id)
			  this.setState({
				  device: device,
			  })
		  }
	  }
	
	componentDidMount = async () => {
		const { getDevice } = this.props
		window.addEventListener('keydown', this.keyHandler, false)
		let id = this.props.match.params.id
		await getDevice(id)

	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)
		clearTimeout(this.timer);
	}

	handleInput = (input) => e => {
		e.preventDefault()
		this.setState({
			device: {
				...this.state.device,
				[input]: e.target.value
			}
		})
	}
	handleUpdateFav = () => {
		const { isFav, updateFav } = this.props
		const { device } = this.state
		let favObj = {
			id: device.id,
			name: device.name,
			type: 'device',
			path: `/device/${device.id}`
		}
		if (isFav(favObj)) {
			updateFav(favObj)
		}
		this.setState({ updated: true, updating: false })
		this.props.s('snackbars.deviceUpdated', { device: this.state.device.id })
		this.goToDevice()
	}
	handleUpdateDevice = async () => {
		const { device } = this.state
		this.setState({ updating: true })
		let updateD = {
			...device,
			project: {
				id: 0
			}
		}
		await updateDevice(updateD).then(rs => rs ? this.handleUpdateFav() : null)
	}
	goToDevice = () => {
		const { location, history } = this.props
		this.props.getDevice(this.state.device.id)
		this.props.getDevices(true)
		history.push(location.prevURL ? location.prevURL : `/device/${this.props.match.params.id}`)
	}
	render() {
		const { loading, classes, t } = this.props
		const {  device } = this.state
		return !loading && device ? (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>

						<Grid container>
							<ItemGrid xs={6}>
								<TextF
									id={'rpimodel'}
									label={t('devices.fields.pcModel')}
									handleChange={this.handleInput('RPImodel')}
									value={device.RPImodel}

									autoFocus
								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'memory'}
									label={t('devices.fields.memory')}
									handleChange={this.handleInput('memory')}
									value={device.memory}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'mm'}
									label={t('devices.fields.memoryModel')}
									handleChange={this.handleInput('memoryModel')}
									value={device.memoryModel}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'powerAdapter'}
									label={t('devices.fields.adapter')}
									handleChange={this.handleInput('adapter')}
									value={device.adapter}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'wifiModule'}
									label={t('devices.fields.wifiModule')}
									handleChange={this.handleInput('wifiModule')}
									value={device.wifiModule}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'modemModel'}
									label={t('devices.fields.modemModel')}
									handleChange={this.handleInput('modemModel')}
									value={device.modemModel}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'modemIMEI'}
									label={t('devices.fields.modemIMEI')}
									handleChange={this.handleInput('modemIMEI')}
									value={device.modemIMEI.toString()}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'cellNumber'}
									label={t('devices.fields.cellNumber')}
									handleChange={this.handleInput('cellNumber')}
									value={device.cellNumber.toString()}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'SIMID'}
									label={t('devices.fields.simCard')}
									handleChange={this.handleInput('SIMID')}
									value={device.SIMID.toString()}

								/>
							</ItemGrid>
							<ItemGrid xs={6}>
								<TextF
									id={'SIMProvider'}
									label={t('devices.fields.simProvider')}
									handleChange={this.handleInput('SIMProvider')}
									value={device.SIMProvider}

								/>
							</ItemGrid>
							<ItemGrid xs={12} container justify={'center'}>
								<Collapse in={this.state.updating} timeout={100} unmountOnExit>
									<CircularLoader notCentered />
								</Collapse>
							</ItemGrid>
							<ItemGrid container style={{ margin: 16 }}>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										onClick={this.goToDevice}
										className={classes.redButton}
									>
										{t('actions.cancel')}
									</Button>
								</div>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										color='primary'
										disabled={this.state.updating || this.state.updated}
										onClick={this.handleUpdateDevice}
									>
										{this.state.updated ?
											<Fragment>
												{t('snackbars.redirect')}
											</Fragment> :
											<Fragment>
												{t('actions.save')}
											</Fragment>}
									</Button>
								</div>
							</ItemGrid>
						</Grid>
					</form>
				</Paper>
			</GridContainer>
		) : <CircularLoader /> 
	}
}
const mapStateToProps = (state) => ({
	device: state.data.device,
	loading: !state.data.gotDevice
})
const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getDevice: async id => dispatch(await getDeviceLS(id)),
	getDevices: reload => dispatch(getDevices())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(EditDetails))