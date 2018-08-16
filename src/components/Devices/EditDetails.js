import { Button, Collapse, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, withStyles, Snackbar } from '@material-ui/core';
import { Check, Save } from '@material-ui/icons';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { Component, Fragment } from 'react';
import { getDevice, updateDeviceDetails } from 'variables/dataDevices';
import { CircularLoader, GridContainer, ItemGrid, TextF } from '..';
import { PlacesWithStandaloneSearchBox } from '../Map/SearchBox';

class EditDeviceDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			id: 0,
			name: '',
			description: '',
			address: '',
			locationType: '',
			loading: true,
			updating: false,
			updated: false,
			openSnackBar: false
		}
		props.setHeader(props.t("devices.editDetailsTitle", { deviceId: props.match.params.id }), true)
	}
	componentDidMount = async () => {
		let id = this.props.match.params.id
		await getDevice(id).then(rs => this.setState({ id: rs.device_id, name: rs.device_name, description: rs.description, address: rs.address, locationType: rs.locationType }))
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
		const { t } = this.props
		return [
			t("devices.locationTypes.pedStreet"),
			t("devices.locationTypes.park"),
			t("devices.locationTypes.path"),
			t("devices.locationTypes.square"),
			t("devices.locationTypes.crossroads"),
			t("devices.locationTypes.road"),
			t("devices.locationTypes.motorway"),
			t("devices.locationTypes.port"),
			t("devices.locationTypes.office"),
			t("devices.locationTypes.unspecified")]
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
			}).then(rs =>  rs ? this.setState({ updated: true, openSnackBar: true, updating: false }) : null )
		}, 2e3)

	}
	goToDevice = () => {
		this.props.history.push(`/device/${this.props.match.params.id}`)
	}
	render() {
		const { classes, t } = this.props
		const { loading, name, description, locationType } = this.state
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
									value={name}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<FormControl className={this.props.classes.formControl}>
									<InputLabel htmlFor="streetType-helper" classes={{ root: classes.label }}>{/* locationType ? '' : */ t("devices.fields.locType")}</InputLabel>
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
									label={t('devices.fields.description')}
									multiline
									rows={3}
									handleChange={this.handleInput('description')}
									value={description}
									noFullWidth
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<PlacesWithStandaloneSearchBox t={t} handleChange={this.handleInput('address')}/>
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
									disabled={this.state.updating}
									onClick={this.state.updated ? this.goToDevice : this.handleUpdateDevice}
								>
									{this.state.updated ? 
										<Fragment>
											<Check className={classes.leftIcon}/>{t("calibration.texts.viewDevice")}
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
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					open={this.state.openSnackBar}
					onClose={() => {this.setState({ openSnackBar: false })}}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					autoHideDuration={5000}
					message={
						<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
							<Check className={classes.leftIcon} color={'primary'} />{t("snackbars.deviceUpdated", { device: this.state.id })}
						</ItemGrid>
					}
				/>
			</GridContainer>
		)
	}
}
export default withStyles(createprojectStyles)(EditDeviceDetails)