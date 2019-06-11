import React, { Component } from 'react'
import { connect } from 'react-redux'
// import EditSensorForm from 'components/Collections/EditSensorForm';
import { getSensorLS } from 'redux/data';
import { updateSensor } from 'variables/dataRegistry';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import CreateSensorForm from 'components/Sensors/CreateSensorForm';
import { getAddressByLocation } from 'variables/dataDevices';

class EditSensor extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
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
			openCF: {
				open: false,
				where: null
			},
			openReg: false,
			openDT: false,
			select: {
				dt: {
					name: ""
				},
				reg: {
					name: ""
				},

			},
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/sensors/list'
		props.setHeader('menus.edit.sensor', true, prevURL, '')
		props.setBC('editsensor')
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToSensors()
		}
	}
	getData = async () => {
		const { getSensor } = this.props
		await getSensor(this.id)
	}
	getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let lng = e.target._latlng.lng
		let newAddress = await getAddressByLocation(lat, lng)
		let address = this.state.sensor.address
		if (newAddress) {
			if (!address || !address.includes(newAddress.vejnavn)) {
				address = `${newAddress.vejnavn} ${newAddress.husnr}, ${newAddress.postnr} ${newAddress.postnrnavn}`
			}
		}
		this.setState({
			sensor: {
				...this.state.sensor,
				lat,
				lng,
				address }
		})

	}
	componentDidUpdate = (prevProps, prevState) => {
		const { location, setHeader, sensor, deviceTypes, registries } = this.props
		if ((!prevProps.sensor && sensor !== prevProps.sensor && sensor) || (this.state.registry === null && sensor)) {
			this.setState({
				sensor: { ...sensor },
				sensorMetadata: {
					metadata: Object.keys(sensor.metadata).map(m => ({ key: m, value: sensor.metadata[m] })),
					outbound: sensor.dataKeys ? sensor.dataKeys : [],
					inbound: sensor.inbound ? sensor.inbound : []
				},
				select: {
					dt: {
						...deviceTypes[deviceTypes.findIndex(dt => dt.id === sensor.type_id)]
					},
					reg: {
						...registries[registries.findIndex(r => r.id === sensor.reg_id)]
					}
				},
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/sensor/${this.id}`
			setHeader('menu.edit.sensor', true, prevURL, 'sensors')
			this.props.setBC('editsensor', sensor.name, sensor.id)
		}
	}
	componentDidMount = async () => {
		this.getData()
		window.addEventListener('keydown', this.keyHandler, false)

	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)
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
				metadata: Object.keys(o.metadata).map(m => ({ key: m, value: o.metadata[m] })),
				// ...this.state.sensorMetadata,
				inbound: o.inbound ? o.inbound : [],
				outbound: o.outbound ? o.outbound : []	
			},
			openDT: false,
			select: {
				...this.state.select,
				dt: o
			}
		})
	}
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
	handleRemoveKey = (index) => e => {
		let newMetadata = this.state.sensorMetadata.outbound.filter((v, i) => i !== index)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: newMetadata
			}
		})
	}
	handleAddKey = e => { 
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: [...this.state.sensorMetadata.outbound, { key: '', nId: -1 }]
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
	handleAddMetadataKey = () => e => {
		let mtd = this.state.sensorMetadata.metadata
		mtd.push({ key: "", value: "" })
		this.setState({
			sensorMetadata: { 
				...this.state.sensorMetadata,
				metadata: mtd
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
	handleRemoveMtdKey = index => e => {
		let newMetadata = this.state.sensorMetadata.metadata.filter((v, i) => i !== index)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				metadata: newMetadata
			}
		})
	}
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
	updateDevice = async () => {
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
		// console.log(newSensor)
		return await updateSensor(newSensor)
	}
	handleCreate = async () => {
		const { s, history } = this.props
		let rs = await this.updateDevice()
		if (rs) {
			s('snackbars.edit.device')
			history.push(`/sensor/${rs}`)
		}
		else
			s('snackbars.failed')
	}

	goToSensors = () => this.props.history.push('/sensors')
	render() {
		const { t, cloudfunctions } = this.props
		const { sensor, sensorMetadata, loading } = this.state
		return ( loading ? <CircularLoader/> :

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

				handleChangeType={this.handleChangeType}

				handleChange={this.handleChange}
				handleCreate={this.handleCreate}
			
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
	cloudfunctions: state.data.functions,
	sensor: state.data.sensor
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getSensor: async (id, customerID, ua) => dispatch(await getSensorLS(id, customerID, ua)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSensor)
