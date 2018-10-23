import { Button, Collapse, Grid, Paper, withStyles } from '@material-ui/core';
import { Check, Save } from 'variables/icons';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { Component, Fragment } from 'react';
import { getDevice, updateDevice } from 'variables/dataDevices';
import { CircularLoader, GridContainer, ItemGrid, TextF } from 'components';
import { PlacesWithStandaloneSearchBox } from 'components/Map/SearchBox';
import DSelect from 'components/CustomInput/DSelect';

class EditDeviceDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			updating: false,
			updated: false
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/devices/list'
		props.setHeader({ id: "devices.editDetailsTitle", options: { deviceId: props.match.params.id } }, true, prevURL, "devices")
	}
	componentDidMount = async () => {
		let id = this.props.match.params.id
		await getDevice(id).then(rs =>
			this.setState({
				device: rs
			}))
		this.setState({ loading: false })
	}
	componentWillUnmount = () => {
		clearTimeout(this.timer);
	}
	handleGoogleInput = (address) => {
		this.setState({
			device: {
				...this.state.device,
				address
			}
		})
	}
	handleInput = (input) => e => {
		if (e.preventDefault)
			e.preventDefault()
		this.setState({
			device: {
				...this.state.device,
				[input]: e.target.value
			}
		})
	}
	LocationTypes = () => {
		const { t } = this.props
		return [
			{ value: 0, label: t("devices.locationTypes.unspecified") },
			{ value: 1, label: t("devices.locationTypes.pedStreet") },
			{ value: 2, label: t("devices.locationTypes.park") },
			{ value: 3, label: t("devices.locationTypes.path") },
			{ value: 4, label: t("devices.locationTypes.square") },
			{ value: 5, label: t("devices.locationTypes.crossroads") },
			{ value: 6, label: t("devices.locationTypes.road") },
			{ value: 7, label: t("devices.locationTypes.motorway") },
			{ value: 8, label: t("devices.locationTypes.port") },
			{ value: 9, label: t("devices.locationTypes.office") }]
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
		await updateDevice(updateD).then(rs =>  rs ?  this.goToDevice() : null )
	}
	goToDevice = () => {
		this.setState({ updated: true, updating: false })
		this.props.s("snackbars.deviceUpdated", { device: this.state.device.id })
		this.props.history.push(`/device/${this.props.match.params.id}`)
	}
	render() {
		const { classes, t } = this.props
		const { loading, device } = this.state
		// let mobile = isWidthUp("md", this.props.width)
		// console.log(mobile)
		return loading ? <CircularLoader /> : (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'name'}
									label={t("devices.fields.name")}
									handleChange={this.handleInput('name')}
									value={device.name}
									autoFocus
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<DSelect
									value={device.locationType}
									onChange={this.handleInput('locationType')}
									menuItems={this.LocationTypes()}
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'description'}
									label={t('devices.fields.description')}
									multiline
									rows={4}
									handleChange={this.handleInput('description')}
									value={device.description}
						
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<PlacesWithStandaloneSearchBox
									address={device.address}
									t={t} handleChange={this.handleGoogleInput} />
							</ItemGrid>
							<ItemGrid xs={12} container justify={'center'}>
								<Collapse in={this.state.updating} timeout={100} unmountOnExit>
									<CircularLoader notCentered />
								</Collapse>
							</ItemGrid>
							<ItemGrid xs={12} container justify={'center'}>
								{/* <ItemGrid /* xs={12} > */}
							
								{/* </ItemGrid> */}
								{/* <ItemGrid> */}
								<Button
									variant="contained"
									color="primary"
									disabled={this.state.updating || this.state.updated}
									onClick={this.handleUpdateDevice}
								>
									{this.state.updated ? 
										<Fragment>
											<Check className={classes.leftIcon}/>{t("snackbars.redirect")}
										</Fragment> : 
										<Fragment>
											<Save className={classes.leftIcon} />{t("calibration.texts.updateDevice")}
										</Fragment>}
								</Button>
								{/* </ItemGrid> */}
							</ItemGrid>
						</Grid>
					</form>
				</Paper>
			</GridContainer>
		)
	}
}
export default withStyles(createprojectStyles)(EditDeviceDetails)