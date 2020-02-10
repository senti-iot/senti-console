import React, { Component, useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
// import CreateSensorForm from 'components/Collections/CreateSensorForm';
import { createSensor } from 'variables/dataSensors';
import CreateSensorForm from 'components/Sensors/CreateSensorForm';
import { getAddressByLocation } from 'variables/dataDevices';
import { getSensors } from 'redux/data';
import { useLocalization, useMatch, useHistory, useLocation, useEventListener } from 'hooks';

const CreateSensor = props => {
	//Hooks
	const t = useLocalization()
	const match = useMatch()
	const location = useLocation()
	const history = useHistory()
	//Redux

	//State
	const [loading, setLoading] = useState(true)
	const [openReg, setOpenReg] = useState(false)
	const [openDT, setOpenDT] = useState(false)
	const [openCF, setOpenCF] = useState({ open: false, where: null })
	const [select, setSelect] = useState({ dt: { name: "" }, reg: { name: "" } })
	const [stateSensor, setSensor] = useState({
		reg_id: 0,
		type_id: 0,
		lat: 56.2639,
		lng: 9.5018,
		address: '',
		locType: 0,
		name: '',
		customer_id: 1,
		communication: 1
	})
	const [sensorMetadata, setSensorMetadata] = useState({
		inbound: [],
		outbound: [],
		metadata: []
	})
	//Const

	//useCallbacks
	const goToSensors = useCallback(() => history.push('/sensors'), [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToSensors()
		}
	}, [goToSensors])
	//useEvent

	useEventListener('keydown', handleKeyPress)

	//useEffects
	useEffect(() => {
		let prevURL = location.prevURL ? location.prevURL : '/sensors/list'
		props.setHeader('menus.create.device', true, prevURL, 'manage.sensors')
		props.setBC('createsensor')
		props.setTabs({
			id: 'createSensor',
			tabs: []
		})
	})

	//Handlers

	//#region Common Fields
	const getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let lng = e.target._latlng.lng
		let newAddress = await getAddressByLocation(lat, lng)
		let address = stateSensor.address
		if (newAddress) {
			if (!address.includes(newAddress.vejnavn)) {
				address = `${newAddress.vejnavn} ${newAddress.husnr}, ${newAddress.postnr} ${newAddress.postnrnavn}`
			}
		}
		setSensor({
			...stateSensor,
			lat,
			lng,
			address
		})
	}
	const handleChange = (what) => e => {
		setSensor({
			...stateSensor,
			[what]: e.target.value
		})

	}
	//#endregion

	//#region Device Types
	const handleOpenDT = () => setOpenDT(true)
	const handleCloseDT = () => setOpenDT(false)

	const handleChangeDT = (dt) => {
		setSensor({
			...stateSensor,
			type_id: dt.id
		})
		setSensorMetadata({
			inbound: dt.inbound ? dt.inbound : [],
			outbound: dt.outbound ? dt.outbound : [],
			metadata: dt.metadata ? dt.metadata : {}
		})
		setSelect({
			...select,
			dt: dt
		})
		handleCloseDT()
	}
	//#endregion

	//#region Inbound Function

	const handleRemoveInboundFunction = index => e => {

		let mtd = sensorMetadata.inbound
		mtd = mtd.filter((v, i) => index !== i)
		setSensorMetadata({
			...sensorMetadata,
			inbound: mtd
		})
	}
	const handleAddInboundFunction = e => {
		let mtd = sensorMetadata.inbound
		setSensorMetadata({
			...sensorMetadata,
			inbound: [...mtd, { id: mtd.length, order: mtd.length, nId: -1 }]
		})
	}

	//#endregion

	//#region Outbound function

	const handleAddKey = e => {
		let otbd = sensorMetadata.outbound
		setSensorMetadata({
			...sensorMetadata,
			outbound: [...otbd, { key: '', nId: -1 }]
		})
	}

	const handleRemoveKey = (index) => e => {
		let otbd = sensorMetadata.outbound
		let newMetadata = otbd.filter((v, i) => i !== index)

		setSensorMetadata({
			...sensorMetadata,
			outbound: newMetadata
		})
	}

	const handleRemoveFunction = (i) => e => {
		let otbd = sensorMetadata.outbound
		otbd[i].nId = -1
		setSensorMetadata({
			...sensorMetadata,
			outbound: otbd
		})
	}

	const handleChangeKey = (v, i) => e => {
		let otbd = sensorMetadata.outbound
		otbd[i].key = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: otbd
		})
	}

	const handleChangeType = index => e => {
		let otbd = sensorMetadata.outbound
		otbd[index].type = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: otbd
		})
	}

	//#endregion

	//#region Metadata

	const handleAddMetadataKey = e => {
		let mtd = sensorMetadata.metadata
		mtd.push({ key: "", value: "" })
		setSensorMetadata({
			...sensorMetadata,
			metadata: mtd
		})
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				metadata: mtd
			}
		})
	}

	const handleRemoveMtdKey = index => e => {
		let mtd = sensorMetadata.metadata
		let newMetadata = mtd.filter((v, i) => i !== index)
		setSensorMetadata({
			...sensorMetadata,
			metadata: newMetadata
		})
	}

	const handleChangeMetadataKey = (i) => e => {
		let mtd = sensorMetadata.metadata
		mtd[i].key = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			metadata: mtd
		})

	}

	const handleChangeMetadata = (i) => e => {
		let mtd = sensorMetadata.metadata
		mtd[i].value = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			metadata: mtd
		})
	}

	//#endregion

	//#region Function selector

	const handleOpenFunc = (p, where) => e => {
		setSelect({
			...select,
			[where]: p
		})
		setOpenCF({
			open: true,
			where: where
		})
	}

	const handleCloseFunc = () => {
		setOpenCF({
			open: false,
			where: null
		})
	}

	const handleChangeFunc = (o, where) => {
		let metadata = sensorMetadata[where]
		metadata[select[where]].nId = o.id
		handleCloseFunc()
		setSensorMetadata({
			...sensorMetadata,
			[where]: metadata
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
		if (smtd.length > 0)
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


	//#endregion


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
