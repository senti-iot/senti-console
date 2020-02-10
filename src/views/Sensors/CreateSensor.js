import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import CreateSensorForm from 'components/Collections/CreateSensorForm';
import { createSensor } from 'variables/dataSensors';
import CreateSensorForm from 'components/Sensors/CreateSensorForm';
import { getAddressByLocation } from 'variables/dataDevices';
import { getSensors } from 'redux/data';
import { useLocalization, useSnackbar, /* useMatch, */ useLocation, useHistory } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	orgId: state.settings.user.org.id,
// 	registries: state.data.registries,
// 	deviceTypes: state.data.deviceTypes,
// 	cloudfunctions: state.data.functions
// })

// const mapDispatchToProps = dispatch => ({
// 	getSensors: async (reload, orgId, ua) => dispatch(await getSensors(reload, orgId, ua))
// })

// @Andrei
const CreateSensor = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	// const match = useMatch()
	const location = useLocation()
	const history = useHistory()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	const orgId = useSelector(state => state.settings.user.org.id)
	const registries = useSelector(state => state.data.registries)
	const deviceTypes = useSelector(state => state.data.deviceTypes)
	const cloudfunctions = useSelector(state => state.data.functions)

	// const [loading, setLoading] = useState(true)
	const [openReg, setOpenReg] = useState(false)
	const [openDT, setOpenDT] = useState(false)
	const [openCF, setOpenCF] = useState({
		open: false,
		where: null
	})
	const [select, setSelect] = useState({
		dt: {
			name: ""
		},
		reg: {
			name: ""
		}
	})
	const [sensor, setSensor] = useState({
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

	// let id = match.params.id
	let prevURL = location.prevURL ? location.prevURL : '/sensors/list'
	props.setHeader('menus.create.device', true, prevURL, 'manage.sensors')
	props.setBC('createsensor')
	props.setTabs({
		id: 'createSensor',
		tabs: []
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		openReg: false,
	// 		openDT: false,
	// 		openCF: {
	// 			open: false,
	// 			where: null
	// 		},
	// 		select: {
	// 			dt: {
	// 				name: ""
	// 			},
	// 			reg: {
	// 				name: ""
	// 			}
	// 		},
	// 		sensor: {
	// 			reg_id: 0,
	// 			type_id: 0,
	// 			lat: 56.2639,
	// 			lng: 9.5018,
	// 			address: '',
	// 			locType: 0,
	// 			name: '',
	// 			customer_id: 1,
	// 			communication: 1
	// 		},
	// 		sensorMetadata: {
	// 			inbound: [],
	// 			outbound: [],
	// 			metadata: []
	// 		}
	// 	}
	// 	this.id = props.match.params.id
	// 	let prevURL = props.location.prevURL ? props.location.prevURL : '/sensors/list'
	// 	props.setHeader('menus.create.device', true, prevURL, 'manage.sensors')
	// 	props.setBC('createsensor')
	// 	props.setTabs({
	// 		id: 'createSensor',
	// 		tabs: []
	// 	})
	// }

	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToSensors()
		}
	}
	useEffect(() => {
		window.addEventListener('keydown', keyHandler, false)

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	window.addEventListener('keydown', this.keyHandler, false)
	// }
	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)
	// }

	//#region Common Fields
	const getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let lng = e.target._latlng.lng
		let newAddress = await getAddressByLocation(lat, lng)
		let address = sensor.address
		if (newAddress) {
			if (!address.includes(newAddress.vejnavn)) {
				address = `${newAddress.vejnavn} ${newAddress.husnr}, ${newAddress.postnr} ${newAddress.postnrnavn}`
			}
		}
		setSensor({ ...sensor, lat, lng, address })
		// this.setState({
		// 	sensor: {
		// 		...this.state.sensor,
		// 		lat,
		// 		lng,
		// 		address
		// 	}
		// })
	}
	const handleChange = (what) => e => {
		setSensor({ ...sensor, [what]: e.target.value })
		// this.setState({
		// 	sensor: {
		// 		...this.state.sensor,
		// 		[what]: e.target.value
		// 	}
		// })
	}
	//#endregion

	//#region Device Types
	const handleOpenDT = () => {
		setOpenDT(true)
		// this.setState({
		// 	openDT: true
		// })
	}
	const handleCloseDT = () => {
		setOpenDT(false)
		// this.setState({
		// 	openDT: false
		// })
	}
	const handleChangeDT = (o) => {
		setSensor({ ...sensor, type_id: o.id })
		setSensorMetadata({
			inbound: o.inbound ? o.inbound : [],
			outbound: o.outbound ? o.outbound : [],
			metadata: o.metadata ? o.metadata : {}
		})
		setOpenDT(false)
		setSelect({ ...select, dt: o })
		// this.setState({
		// 	sensor: {
		// 		...this.state.sensor,
		// 		type_id: o.id
		// 	},
		// 	sensorMetadata: {
		// 		// ...this.state.sensorMetadata,
		// 		inbound: o.inbound ? o.inbound : [],
		// 		outbound: o.outbound ? o.outbound : [],
		// 		metadata: o.metadata ? o.metadata : {}
		// 	},
		// 	openDT: false,
		// 	select: {
		// 		...this.state.select,
		// 		dt: o
		// 	}
		// })
	}
	//#endregion

	//#region Inbound Function

	const handleRemoveInboundFunction = index => e => {
		let mtd = sensorMetadata.inbound
		mtd = mtd.filter((v, i) => index !== i)
		setSensorMetadata({ ...sensorMetadata, inbound: mtd })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		inbound: mtd
		// 	}
		// })
	}
	const handleAddInboundFunction = e => {
		let mtd = sensorMetadata.inbound
		setSensorMetadata({ ...sensorMetadata, inbound: [...mtd, { id: mtd.length, order: mtd.length, nId: -1 }] })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		inbound: [...mtd, { id: mtd.length, order: mtd.length, nId: -1 }]
		// 	}
		// })
	}

	//#endregion

	//#region Outbound function

	const handleAddKey = e => {
		setSensorMetadata({ ...sensorMetadata, outbound: [...sensorMetadata.outbound, { key: '', nId: -1 }] })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		outbound: [...this.state.sensorMetadata.outbound, { key: '', nId: -1 }]
		// 	}
		// })
	}

	const handleRemoveKey = (index) => e => {
		let newMetadata = sensorMetadata.outbound.filter((v, i) => i !== index)
		setSensorMetadata({ ...sensorMetadata, outbound: newMetadata })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		outbound: newMetadata
		// 	}
		// })
	}

	const handleRemoveFunction = (i) => e => {
		let mtd = sensorMetadata.outbound
		mtd[i].nId = -1
		setSensorMetadata({ ...sensorMetadata, outbound: mtd })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		outbound: mtd
		// 	}
		// })
	}

	const handleChangeKey = (v, i) => e => {
		let mtd = sensorMetadata.outbound
		mtd[i].key = e.target.value
		setSensorMetadata({ ...sensorMetadata, outbound: mtd })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		outbound: mtd
		// 	}
		// })
	}

	const handleChangeType = index => e => {
		let mtd = sensorMetadata.outbound
		mtd[index].type = e.target.value
		setSensorMetadata({ ...sensorMetadata, outbound: mtd })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		outbound: mtd
		// 	}
		// })
	}

	//#endregion

	//#region Metadata

	const handleAddMetadataKey = e => {
		let mtd = sensorMetadata.metadata
		mtd.push({ key: "", value: "" })
		setSensorMetadata({ ...sensorMetadata, metadata: mtd })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		metadata: mtd
		// 	}
		// })
	}

	const handleRemoveMtdKey = index => e => {
		let newMetadata = sensorMetadata.metadata.filter((v, i) => i !== index)
		setSensorMetadata({ ...sensorMetadata, metadata: newMetadata })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		metadata: newMetadata
		// 	}
		// })
	}

	const handleChangeMetadataKey = (i) => e => {
		let mtd = sensorMetadata.metadata
		mtd[i].key = e.target.value
		setSensorMetadata({ ...sensorMetadata, metadata: mtd })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		metadata: mtd
		// 	}
		// })
	}

	const handleChangeMetadata = (i) => e => {
		let mtd = sensorMetadata.metadata
		mtd[i].value = e.target.value
		setSensorMetadata({ ...sensorMetadata, metadata: mtd })
		// this.setState({
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		metadata: mtd
		// 	}
		// })
	}

	//#endregion

	//#region Function selector

	const handleOpenFunc = (p, where) => e => {
		setSelect({ ...select, [where]: p })
		setOpenCF({ open: true, where })
		// this.setState({
		// 	select: {
		// 		...this.state.select,
		// 		[where]: p
		// 	},
		// 	openCF: {
		// 		open: true,
		// 		where: where
		// 	}
		// })
	}

	const handleCloseFunc = () => {
		setOpenCF({ open: false, where: null })
		// this.setState({
		// 	openCF: {
		// 		open: false,
		// 		where: null
		// 	}
		// })
	}
	const handleChangeFunc = (o, where) => {
		// const { select } = this.state
		let metadata = sensorMetadata[where]
		metadata[select[where]].nId = o.id
		setOpenCF({ open: false, where: null })
		setSensorMetadata({ ...sensorMetadata, [where]: metadata })
		// this.setState({
		// 	openCF: {
		// 		open: false,
		// 		where: null
		// 	},
		// 	sensorMetadata: {
		// 		...this.state.sensorMetadata,
		// 		[where]: metadata
		// 	}
		// })
	}

	//#endregion

	//#region Registry selector

	const handleOpenReg = () => {
		setOpenReg(true)
		// this.setState({
		// 	openReg: true
		// })
	}
	const handleCloseReg = () => {
		setOpenReg(false)
		// this.setState({
		// 	openReg: false
		// })
	}
	const handleChangeReg = (o) => {
		setSensor({ ...sensor, reg_id: o.id })
		setOpenReg(false)
		setSelect({ ...select, reg: o })
		// this.setState({
		// 	sensor: {
		// 		...this.state.sensor,
		// 		reg_id: o.id
		// 	},
		// 	openReg: false,
		// 	select: {
		// 		...this.state.select,
		// 		reg: o
		// 	}
		// })
	}

	//#endregion



	//#region Create Sensor
	const createSensorFunc = async () => {
		let smtd = sensorMetadata.metadata
		let mtd = {}
		if (smtd.length > 0)
			smtd.forEach((m) => {
				mtd[m.key] = m.value
			})
		let newSensor = {
			...sensor,
			tags: [],
			metadata: {
				...sensorMetadata,
				metadata: mtd
			}
		}
		return await createSensor(newSensor)
	}
	const handleCreate = async () => {
		// const { s, history, orgId, accessLevel } = this.props
		let rs = await createSensorFunc()
		if (rs) {
			s('snackbars.create.device', { device: sensor.name })
			dispatch(getSensors(true, orgId, accessLevel.apisuperuser ? true : false))
			history.push(`/sensor/${rs}`)
		}
		else
			s('snackbars.failed')
	}

	const goToSensors = () => history.push('/sensors')

	//#endregion

	// const { t, cloudfunctions } = this.props
	// const { sensor, sensorMetadata } = this.state
	return (

		<CreateSensorForm
			sensor={sensor}
			sensorMetadata={sensorMetadata}
			cfunctions={cloudfunctions}
			handleOpenFunc={handleOpenFunc}
			handleCloseFunc={handleCloseFunc}
			handleChangeFunc={handleChangeFunc}
			handleRemoveFunction={handleRemoveFunction}
			handleRemoveInboundFunction={handleRemoveInboundFunction}
			handleAddInboundFunction={handleAddInboundFunction}
			openCF={openCF}

			handleAddKey={handleAddKey}
			handleRemoveKey={handleRemoveKey}
			handleChangeKey={handleChangeKey}

			handleChange={handleChange}
			handleCreate={handleCreate}

			handleChangeType={handleChangeType}

			handleChangeMetadataKey={handleChangeMetadataKey}
			handleChangeMetadata={handleChangeMetadata}
			handleRemoveMtdKey={handleRemoveMtdKey}
			handleAddMetadataKey={handleAddMetadataKey}

			handleOpenDT={handleOpenDT}
			handleCloseDT={handleCloseDT}
			handleChangeDT={handleChangeDT}
			openDT={openDT}
			deviceTypes={deviceTypes}

			registries={registries}
			handleOpenReg={handleOpenReg}
			handleCloseReg={handleCloseReg}
			handleChangeReg={handleChangeReg}
			openReg={openReg}


			goToSensors={goToSensors}
			select={select}
			getLatLngFromMap={getLatLngFromMap}
			t={t}
		/>
	)
}

export default CreateSensor
