import React, { Component } from 'react'
import { connect } from 'react-redux'
// import CreateSensorForm from 'components/Collections/CreateSensorForm';
import { createSensor } from 'variables/dataRegistry';
import CreateSensorForm from 'components/Sensors/CreateSensorForm';
import { getAddressByLocation } from 'variables/dataDevices';
import { getSensors } from 'redux/data';

class CreateSensor extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			openReg: false,
			openDT: false,
			openCF: {
				open: false,
				where: null
			},
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
				lng: 9.5018,
				address: '',
				locType: 0,
				name: '',
				customer_id: 1,
				communication: 1
			},
			sensorMetadata: {
				inbound: [],
				outbound: [],
				metadata: []
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

	//#region Common Fields
	getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let lng = e.target._latlng.lng
		let newAddress = await getAddressByLocation(lat, lng)
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
				lng,
				address
			}
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
	//#endregion

	//#region Device Types
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
	handleChangeDT = (o) => {
		// console.log(o)
		this.setState({
			sensor: {
				...this.state.sensor,
				type_id: o.id
			},
			sensorMetadata: {
				// ...this.state.sensorMetadata,
				inbound: o.inbound ? o.inbound : [],
				outbound: o.outbound ? o.outbound : [],
				metadata: o.metadata ? o.metadata : {}
			},
			openDT: false,
			select: {
				...this.state.select,
				dt: o
			}
		})
	}
	//#endregion

	//#region Inbound Function

	handleRemoveInboundFunction = index => e => {
		let mtd = this.state.sensorMetadata.inbound
		mtd = mtd.filter((v, i) => index !== i)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				inbound: mtd
			}
		})
	}
	handleAddInboundFunction = e => {
		let mtd = this.state.sensorMetadata.inbound
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				inbound: [...mtd, { id: mtd.length, order: mtd.length, nId: -1 }]
			}
		})
	}

	//#endregion

	//#region Outbound function

	handleAddKey = e => {
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: [...this.state.sensorMetadata.outbound, { key: '', nId: -1 }]
			}
		})
	}

	handleRemoveKey = (index) => e => {
		let newMetadata = this.state.sensorMetadata.outbound.filter((v, i) => i !== index)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: newMetadata
			}
		})
	}

	handleRemoveFunction = (i) => e => {
		let mtd = this.state.sensorMetadata.outbound
		mtd[i].nId = -1
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: mtd
			}
		})
	}

	handleChangeKey = (v, i) => e => {
		let mtd = this.state.sensorMetadata.outbound
		mtd[i].key = e.target.value
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: mtd
			}
		})
	}

	handleChangeType = index => e => {
		let mtd = this.state.sensorMetadata.outbound
		mtd[index].type = e.target.value
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: mtd
			}
		})
	}

	//#endregion

	//#region Metadata

	handleAddMetadataKey = e => {
		let mtd = this.state.sensorMetadata.metadata
		mtd.push({ key: "", value: "" })
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				metadata: mtd
			}
		})
	}

	handleRemoveMtdKey = index => e => {
		let newMetadata = this.state.sensorMetadata.metadata.filter((v, i) => i !== index)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				metadata: newMetadata
			}
		})
	}

	handleChangeMetadataKey = (i) => e => {
		let mtd = this.state.sensorMetadata.metadata
		mtd[i].key = e.target.value
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				metadata: mtd
			}
		})
	}

	handleChangeMetadata = (i) => e => {
		let mtd = this.state.sensorMetadata.metadata
		mtd[i].value = e.target.value
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				metadata: mtd
			}
		})
	}

	//#endregion

	//#region Function selector

	handleOpenFunc = (p, where) => e => {
		this.setState({
			select: {
				...this.state.select,
				[where]: p
			},
			openCF: {
				open: true,
				where: where
			}
		})
	}

	handleCloseFunc = () => {
		this.setState({
			openCF: {
				open: false,
				where: null
			}
		})
	}
	handleChangeFunc = (o, where) => e => {
		const { select } = this.state
		let metadata = this.state.sensorMetadata[where]
		metadata[select[where]].nId = o.id
		this.setState({
			openCF: {
				open: false,
				where: null
			},
			sensorMetadata: {
				...this.state.sensorMetadata,
				[where]: metadata
			}
		})
	}

	//#endregion

	//#region Registry selector

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
	handleChangeReg = (o) => {
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

	//#endregion



	//#region Create Sensor
	createSensor = async () => {
		let smtd = this.state.sensorMetadata.metadata
		let mtd = {}
		smtd.forEach((m) => {
			mtd[m.key] = m.value
		})
		let newSensor = {
			...this.state.sensor,
			tags: [],
			metadata: {
				...this.state.sensorMetadata,
				metadata: mtd
			}
		}
		return await createSensor(newSensor)
	}
	handleCreate = async () => {
		const { s, history, orgId, accessLevel } = this.props
		let rs = await this.createSensor()
		if (rs) {
			s('snackbars.create.device', { device: this.state.sensor.name })
			this.props.getSensors(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/sensor/${rs}`)
		}
		else
			s('snackbars.failed')
	}

	goToSensors = () => this.props.history.push('/sensors')

	//#endregion

	render() {
		const { t, cloudfunctions } = this.props
		const { sensor, sensorMetadata } = this.state
		return (

			<CreateSensorForm
				sensor={sensor}
				sensorMetadata={sensorMetadata}
				cfunctions={cloudfunctions}
				handleOpenFunc={this.handleOpenFunc}
				handleCloseFunc={this.handleCloseFunc}
				handleChangeFunc={this.handleChangeFunc}
				handleRemoveFunction={this.handleRemoveFunction}
				handleRemoveInboundFunction={this.handleRemoveInboundFunction}
				handleAddInboundFunction={this.handleAddInboundFunction}
				openCF={this.state.openCF}

				handleAddKey={this.handleAddKey}
				handleRemoveKey={this.handleRemoveKey}
				handleChangeKey={this.handleChangeKey}

				handleChange={this.handleChange}
				handleCreate={this.handleCreate}

				handleChangeType={this.handleChangeType}

				handleChangeMetadataKey={this.handleChangeMetadataKey}
				handleChangeMetadata={this.handleChangeMetadata}
				handleRemoveMtdKey={this.handleRemoveMtdKey}
				handleAddMetadataKey={this.handleAddMetadataKey}

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


const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	registries: state.data.registries,
	deviceTypes: state.data.deviceTypes,
	cloudfunctions: state.data.functions
})

const mapDispatchToProps = dispatch => ({
	getSensors: async (reload, orgId, ua) => dispatch(await getSensors(reload, orgId, ua))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateSensor)
