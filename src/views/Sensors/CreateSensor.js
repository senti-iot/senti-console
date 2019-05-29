import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { createSensor } from 'variables/dataRegistry';
import CreateSensorForm from 'components/Sensors/CreateSensorForm';
import { getAddressByLocation } from 'variables/dataDevices';

class CreateCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			openReg: false,
			openDT: false,
			select: {
				dt: {
					name: ""
				},
				reg: {
					name: ""
				}
			},
			sensor: {
				reg_id: 0,
				type_id: 0,
				lat: 56.2639,
				long: 9.5018,
				address: '',
				locType: 0,
				name: '',
				customer_id: 1,
				communication: 1
			},
			sensorMetadata: {
				inbound: [],
				outbound: []
			}
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/sensors/list'
		props.setHeader('menus.create.device', true, prevURL, '')
		props.setBC('createsensor')
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToSensors()
		}
	}
	componentDidMount = async () => {
		window.addEventListener('keydown', this.keyHandler, false)
	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)
	}
	getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let long = e.target._latlng.lng
		let newAddress = await getAddressByLocation(lat, long)
		let address = this.state.sensor.address
		if (newAddress) {
			if (!address.includes(newAddress.vejnavn)) {
				address = `${newAddress.vejnavn} ${newAddress.husnr}, ${newAddress.postnr} ${newAddress.postnrnavn}`
			}
		}
		this.setState({
			sensor: {
				...this.state.sensor,
				lat,
				long,
				address }
		})

	}
	handleChange = (what) => e => {
		this.setState({
			sensor: {
				...this.state.sensor,
				[what]: e.target.value
			}
		})
	}
	handleOpenDT = () => {
		this.setState({
			openDT: true
		})
	}
	handleCloseDT = () => {
		this.setState({
			openDT: false
		})
	}
	handleChangeDT = (o) => e => {
		this.setState({
			sensor: {
				...this.state.sensor,
				type_id: o.id
			},
			sensorMetadata: {
				// ...this.state.sensorMetadata,
				inbound: o.inbound ? o.inbound.map(n => ({ key: n, nId: -1 })) : [],
				outbound: o.outbound ? o.outbound : []	
			},
			openDT: false,
			select: {
				...this.state.select,
				dt: o
			}
		})
	}
	handleRemoveKey = (k) => e => {
		let newMetadata = this.state.sensorMetadata.outbound.filter((v) => v.key !== k)
		console.log(newMetadata)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: newMetadata
			}
		})
	}
	handleOpenReg = () => {
		this.setState({
			openReg: true
		})
	}
	handleCloseReg = () => {
		this.setState({
			openReg: false
		})
	}
	handleChangeReg = (o) => e => {
		this.setState({
			sensor: {
				...this.state.sensor,
				reg_id: o.id
			},
			openReg: false,
			select: {
				...this.state.select,
				reg: o
			}
		})
	}
	createSensor = async () => { 
		return await createSensor(this.state.sensor)
	}
	handleCreate = async () => {
		const { s, history } = this.props
		let rs = await this.createSensor()
		if (rs) {
			s('snackbars.collectionCreated')
			history.push(`/sensor/${rs.id}`)
		}
		else
			s('snackbars.failed')
	}
	goToSensors = () => this.props.history.push('/sensors')
	render() {
		const { t, cloudfunctions } = this.props
		const { sensor, sensorMetadata } = this.state
		return (
		
			<CreateSensorForm
				sensor={sensor}
				sensorMetadata={sensorMetadata}
				cfunctions={cloudfunctions}
				handleRemoveKey={this.handleRemoveKey}
				handleChange={this.handleChange}
				handleCreate={this.handleCreate}
				handleOpenDT={this.handleOpenDT}
				handleCloseDT={this.handleCloseDT}
				handleChangeDT={this.handleChangeDT}
				openDT={this.state.openDT}
				deviceTypes={this.props.deviceTypes}
				registries={this.props.registries}
				handleOpenReg={this.handleOpenReg}
				handleCloseReg={this.handleCloseReg}
				handleChangeReg={this.handleChangeReg}
				openReg={this.state.openReg}
				goToSensors={this.goToSensors}
				select={this.state.select}
				getLatLngFromMap={this.getLatLngFromMap}
				t={t}
			/>
		)
	}
}

CreateCollection.propTypes = {
	match: PropTypes.object.isRequired,
	accessLevel: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	registries: state.data.registries,
	deviceTypes: state.data.deviceTypes,
	cloudfunctions: state.data.functions
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
