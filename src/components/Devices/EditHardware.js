import { Button, Grid, Paper, withStyles, Collapse } from '@material-ui/core';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { Component, Fragment } from 'react';
import { getDevice, updateDevice } from 'variables/dataDevices';
import { ItemGrid, TextF, GridContainer, CircularLoader, } from 'components';

class EditDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			updating: false,
			updated: false
		}
		let prevURL = props.location.state ? props.location.prevURL : `/devices/list`
		props.setHeader({ id: 'devices.editHardwareTitle', options: { deviceId: props.match.params.id } }, true, prevURL, 'devices')
	}
	componentDidMount = async () => {
		let id = this.props.match.params.id
		await getDevice(id).then(rs => {
			if (rs === null)
				this.props.history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				})
			this.setState({
				device: rs,
				loading: false
			})
		})
	}
	componentWillUnmount = () => {
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
	handleUpdateDevice = async () => {
		clearTimeout(this.timer);
		const { device } = this.state
		this.setState({ updating: true })
		this.timer = setTimeout(async () => {
			await updateDevice(device).then(rs => rs ? this.setState({ updated: true, updating: false }) : null)
		}, 2e3)

	}
	goToDevice = () => {
		this.props.history.push(`/device/${this.props.match.params.id}`)
	}
	render() {
		const { classes, t } = this.props
		const { loading, device } = this.state
		return loading ? <CircularLoader /> : (
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
		)
	}
}
export default withStyles(createprojectStyles)(EditDetails)