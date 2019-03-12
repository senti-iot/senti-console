import { Button, Collapse, Grid, Paper, withStyles, Fade } from '@material-ui/core';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import React, { Component, Fragment } from 'react';
import { getDevice, updateDevice, getGeoByAddress, getAddress } from 'variables/dataDevices';
import { CircularLoader, GridContainer, ItemGrid, TextF, AddressInput } from 'components';
import DSelect from 'components/CustomInput/DSelect';
import { isFav, updateFav } from 'redux/favorites';
import { connect } from 'react-redux'

class EditDeviceDetails extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			updating: false,
			updated: false
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/devices/list'
		props.setHeader({ id: 'devices.editDetailsTitle', options: { deviceId: props.match.params.id } }, true, prevURL, 'devices')
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
	setMapCoords = (data) => {
		let coords = { lat: data.adgangsadresse.vejpunkt.koordinater[1], long: data.adgangsadresse.vejpunkt.koordinater[0] }
		if (coords) {
			this.setState({
				device: {
					...this.state.device,
					lat: coords.lat,
					long: coords.long,
				}
			})
		}
	}
	getLatLng = async (suggestion) => {
		let data
		if (suggestion.id) {
			data = await getGeoByAddress(suggestion.id)
			if (data) {
				return this.setMapCoords(data)
			}
		}
		else {
			data = await getAddress(this.state.device.address)
			return this.setMapCoords(data)
		}
	}
	componentWillUnmount = () => {
		clearTimeout(this.timer);
	}
	handleSetAddress = (address) => {
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
			{ value: 0, label: t('devices.locationTypes.unspecified') },
			{ value: 1, label: t('devices.locationTypes.pedStreet') },
			{ value: 2, label: t('devices.locationTypes.park') },
			{ value: 3, label: t('devices.locationTypes.path') },
			{ value: 4, label: t('devices.locationTypes.square') },
			{ value: 5, label: t('devices.locationTypes.crossroads') },
			{ value: 6, label: t('devices.locationTypes.road') },
			{ value: 7, label: t('devices.locationTypes.motorway') },
			{ value: 8, label: t('devices.locationTypes.port') },
			{ value: 9, label: t('devices.locationTypes.office') }]
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
		this.props.history.push(`/device/${this.props.match.params.id}`)
	}
	render() {
		const { classes, t } = this.props
		const { loading, device } = this.state
		return loading ? <CircularLoader /> : (
			<GridContainer>
				<Fade in={true}>
					<Paper className={classes.paper}>
						<form className={classes.form}>
							<Grid container>
								<ItemGrid xs={12}>
									<TextF
										id={'name'}
										label={t('devices.fields.name')}
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
									<AddressInput
										onBlur={this.getLatLng}
										handleSuggestionSelected={this.getLatLng}
										value={device.address}
										handleChange={this.handleSetAddress} />
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
				</Fade>
			</GridContainer>
		)
	}
}

const mapStateToProps = (state) => ({

})
const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj))
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(EditDeviceDetails))