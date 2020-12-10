import React, { useEffect, useState, useCallback } from 'react'
// import CreateSensorForm from 'components/Collections/CreateSensorForm';
import { createSensor } from 'variables/dataSensors'
import CreateSensorForm from 'components/Sensors/CreateSensorForm'
import { getAddressByLocation } from 'variables/dataDevices'
import { getSensors } from 'redux/data'
import { useLocalization, useHistory, useLocation, useEventListener, useDispatch, useSnackbar, useSelector } from 'hooks'
import { camelCase } from 'lodash'
import { shortHashGen } from 'variables/functions'

const CreateSensor = props => {
	//Hooks
	const t = useLocalization()
	const location = useLocation()
	const history = useHistory()
	const dispatch = useDispatch()
	const s = useSnackbar().s

	//Redux
	const registries = useSelector(state => state.data.registries)
	const deviceTypes = useSelector(state => state.data.deviceTypes)
	const cloudfunctions = useSelector(state => state.data.functions)

	//State
	const [openReg, setOpenReg] = useState(false)
	const [openDT, setOpenDT] = useState(false)
	// const [openCF, setOpenCF] = useState({ open: false, where: null })
	const [select, setSelect] = useState({ dt: { name: "" }, reg: { name: "" } })
	const [stateSensor, setSensor] = useState({
		uuname: '',
		lat: 56.2639,
		lng: 9.5018,
		address: '',
		locType: 0,
		name: '',
		communication: 1
	})
	const [sensorMetadata, setSensorMetadata] = useState([])
	const [sensorDataKeys, setSensorDataKeys] = useState([])
	const [sensorDecoder, setSensorDecoder] = useState([])

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
		if (what === 'name') {
			setSensor({
				...stateSensor,
				[what]: e.target.value,
				uuname: camelCase(e.target.value) + '-' + shortHashGen(e.target.value)
			})
		}
		else {

			setSensor({
				...stateSensor,
				[what]: e.target.value
			})
		}

	}
	//#endregion

	//#region Device Types
	const handleOpenDT = () => setOpenDT(true)
	const handleCloseDT = () => setOpenDT(false)

	const handleChangeDT = (dt) => {
		setSensor({
			...stateSensor,
			deviceType: dt,
		})
		// setSensorMetadata(dt.metadata ? dt.metadata : [])
		setSensorDataKeys(dt.outbound)
		setSensorDecoder(dt.inbound)

		setSelect({
			...select,
			dt: dt
		})
		handleCloseDT()
	}
	//#endregion

	//#region Registry selector

	const handleOpenReg = () => {
		setOpenReg(true)
	}
	const handleCloseReg = () => {
		setOpenReg(false)
	}
	const handleChangeReg = (o) => {
		setSensor({
			...stateSensor,
			registry: o,
		})
		setOpenReg(false)
		setSelect({
			...select,
			reg: o
		})
	}

	//#endregion


	//#region Metadata

	const handleAddMetadataKey = e => {
		let mtd = [...sensorMetadata]
		mtd.push({ key: "", value: "" })
		setSensorMetadata(mtd)
	}

	const handleRemoveMtdKey = index => e => {
		let newMetadata = sensorMetadata.filter((v, i) => i !== index)
		setSensorMetadata(newMetadata)
	}

	const handleChangeMetadataKey = (i) => e => {
		let mtd = [...sensorMetadata]
		mtd[i].key = e.target.value
		setSensorMetadata(mtd)

	}

	const handleChangeMetadata = (i) => e => {
		let mtd = [...sensorMetadata]
		mtd[i].value = e.target.value
		setSensorMetadata(mtd)
	}

	//#endregion

	//#region Function selector

	// const handleOpenFunc = (p, where) => e => {
	// 	setSelect({
	// 		...select,
	// 		[where]: p
	// 	})
	// 	setOpenCF({
	// 		open: true,
	// 		where: where
	// 	})
	// }

	// const handleCloseFunc = () => {
	// 	setOpenCF({
	// 		open: false,
	// 		where: null
	// 	})
	// }

	// const handleChangeFunc = (o, where) => {
	// 	let metadata = sensorMetadata[where]
	// 	metadata[select[where]].nId = o.id
	// 	handleCloseFunc()
	// 	setSensorMetadata({
	// 		...sensorMetadata,
	// 		[where]: metadata
	// 	})
	// }

	//#endregion





	//#region Create Sensor
	const createSensorFunc = async () => {
		let smtd = sensorMetadata
		let mtd = {}
		smtd.forEach((m) => {
			mtd[m.key] = m.value
		})

		let newSensor = {
			...stateSensor,
			tags: [],
			metadata: mtd
		}
		return await createSensor(newSensor)
	}
	const handleCreate = async () => {
		// const { s, history, orgId, accessLevel } = this.props
		let rs = await createSensorFunc()
		if (rs) {
			s('snackbars.create.device', { device: stateSensor.name })
			dispatch(getSensors(true))
			history.push(`/sensor/${rs.uuid}`)
		}
		else
			s('snackbars.failed')
	}


	//#endregion


	return (

		<CreateSensorForm
			sensor={stateSensor}
			sensorMetadata={sensorMetadata}
			sensorDataKeys={sensorDataKeys}
			sensorDecoder={sensorDecoder}
			cfunctions={cloudfunctions}
			// handleOpenFunc={handleOpenFunc}
			// handleCloseFunc={handleCloseFunc}
			// handleChangeFunc={handleChangeFunc}

			// handleRemoveFunction={handleRemoveFunction}
			// handleRemoveInboundFunction={handleRemoveInboundFunction}
			// handleAddInboundFunction={handleAddInboundFunction}
			// openCF={openCF}

			// handleAddKey={handleAddKey}
			// handleRemoveKey={handleRemoveKey}
			// handleChangeKey={handleChangeKey}

			handleChange={handleChange}
			handleCreate={handleCreate}

			// handleChangeType={handleChangeType}

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
