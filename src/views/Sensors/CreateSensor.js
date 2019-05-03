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
			}
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
		props.setHeader('registries.createSensor', true, prevURL, '')
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
		console.log(o)
		this.setState({
			sensor: {
				...this.state.sensor,
				type_id: o.id
			},
			openDT: false,
			select: {
				...this.state.select,
				dt: o
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
		}, () => console.log(this.state))
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
		const { t } = this.props
		const { sensor } = this.state
		return (
		
			<CreateSensorForm
				sensor={sensor}
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
	deviceTypes: state.data.deviceTypes
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
