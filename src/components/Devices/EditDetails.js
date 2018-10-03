import { Button, Collapse, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, withStyles } from '@material-ui/core';
import { Check, Save } from 'variables/icons';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { Component, Fragment } from 'react';
import { getDevice, updateDevice } from 'variables/dataDevices';
import { CircularLoader, GridContainer, ItemGrid, TextF } from '..';
import { PlacesWithStandaloneSearchBox } from '../Map/SearchBox';

class EditDeviceDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			updating: false,
			updated: false
		}		
		props.setHeader({ id: "devices.editDetailsTitle", options: { deviceId: props.match.params.id } }, true, props.history.location.state ? props.history.location.state['backurl'] : '/devices/list', "devices")
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
			{ id: 0, label: t("devices.locationTypes.unspecified") },
			{ id: 1, label: t("devices.locationTypes.pedStreet") },
			{ id: 2, label: t("devices.locationTypes.park") },
			{ id: 3, label: t("devices.locationTypes.path") },
			{ id: 4, label: t("devices.locationTypes.square") },
			{ id: 5, label: t("devices.locationTypes.crossroads") },
			{ id: 6, label: t("devices.locationTypes.road") },
			{ id: 7, label: t("devices.locationTypes.motorway") },
			{ id: 8, label: t("devices.locationTypes.port") },
			{ id: 9, label: t("devices.locationTypes.office") }]
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
		return loading ? <CircularLoader /> : (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid>
								<TextF
									id={'name'}
									label={t("devices.fields.name")}
									handleChange={this.handleInput('name')}
									value={device.name}
									autoFocus
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<FormControl className={this.props.classes.formControl}>
									<InputLabel htmlFor="streetType-helper" classes={{ root: classes.label }}>{t("devices.fields.locType")}</InputLabel>
									<Select
										value={device.locationType}
										onChange={this.handleInput('locationType')}
										input={<Input name="streetType" id="streetType-helper" classes={{ root: classes.label }} />}
									>
										{this.LocationTypes().map((loc, i) => {
											return <MenuItem key={i} value={loc.id}>
												{loc.label}
											</MenuItem>
										})}
									</Select>
								</FormControl>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'description'}
									label={t('devices.fields.description')}
									multiline
									rows={4}
									handleChange={this.handleInput('description')}
									value={device.description}
									noFullWidth
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
				{/* <Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					open={this.state.openSnackBar}
					onClose={() => {this.setState({ openSnackBar: false })}}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					autoHideDuration={5000}
					message={
						<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
							<Check className={classes.leftIcon} color={'primary'} />{t("snackbars.deviceUpdated", { device: this.state.device.id })}
						</ItemGrid>
					}
				/> */}
			</GridContainer>
		)
	}
}
export default withStyles(createprojectStyles)(EditDeviceDetails)