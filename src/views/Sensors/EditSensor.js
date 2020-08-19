/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
// import EditSensorForm from 'components/Collections/EditSensorForm';
import { getSensorLS, getSensors } from 'redux/data'
import { updateSensor } from 'variables/dataSensors'
import { updateFav, isFav } from 'redux/favorites'
import { CircularLoader } from 'components'
import CreateSensorForm from 'components/Sensors/CreateSensorForm'
import { getAddressByLocation } from 'variables/dataSensors'
import { useLocalization, useLocation, useEventListener, useDispatch, useSelector, useSnackbar } from 'hooks'
import { useParams, useHistory } from 'react-router-dom'
import { useCallback } from 'react'


const EditSensor = props => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	const location = useLocation()
	const dispatch = useDispatch()
	const params = useParams()
	const history = useHistory()

	//Redux
	const registries = useSelector(s => s.data.registries)
	const deviceTypes = useSelector(s => s.data.deviceTypes)
	const cloudfunctions = useSelector(s => s.data.functions)
	const sensor = useSelector(s => s.data.sensor)

	//State
	const [loading, setLoading] = useState(true)
	const [stateSensor, setSensor] = useState({
		description: '',
		lat: 56.2639,
		lng: 9.5018,
		address: '',
		locType: 0,
		name: '',
		customer_id: 1,
		communication: 1
	})
	const [openCF, setOpenCF] = useState({
		open: false,
		where: null
	})
	const [openReg, setOpenReg] = useState(false)
	const [openDT, setOpenDT] = useState(false)
	const [select, setSelect] = useState({
		dt: { name: "" },
		reg: { name: "" }
	})
	const [sensorMetadata, setSensorMetadata] = useState({
		metadata: [],
		outbound: [],
		inbound: []
	})
	//Const
	const { setHeader, setBC, setTabs } = props

	//useCallbacks

	const getData = async () => {
		let id = params.id
		dispatch(await getSensorLS(id))
	}

	const goToSensors = useCallback(() => history.push('/sensors'), [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToSensors()
		}
	}, [goToSensors])
	//useEventListener

	useEventListener('keydown', handleKeyPress)

	//useEffects
	// componentDidUpdate = (prevProps, prevState) => {
	// 	const { location, setHeader, setBC, sensor, deviceTypes, registries } = this.props
	// 	if ((!prevProps.sensor && sensor !== prevProps.sensor && sensor) || (this.state.registry === null && sensor)) {
	// 	}
	// }
	useEffect(() => {
		if (sensor && deviceTypes.length > 0 && registries.length > 0) {
			console.log('EditSensor', sensor)
			setSensor(sensor)

			let dt = deviceTypes[deviceTypes.findIndex(dt => dt.uuid === sensor.deviceType.uuid)]
			let reg = registries[registries.findIndex(r => r.uuid === sensor.registry.uuid)]
			let metadata = sensor.metadata
			setSensorMetadata({
				metadata: metadata?.metadata ? Object.keys(metadata?.metadata).map(m => ({ key: m, value: metadata?.metadata[m] })) : [],
				outbound: dt ? dt.outbound : [],
				inbound: dt ? dt.inbound : []
			})
			if (dt && reg) {

				setSelect({
					dt: dt,
					reg: reg
				})
			}
			setLoading(false)
		}
	}, [sensor, registries, deviceTypes])
	useEffect(() => {
		if (sensor) {
			let prevURL = location.prevURL ? location.prevURL : `/sensor/${params.id}`
			setHeader('menus.edits.device', true, prevURL, 'manage.sensors')
			setBC('editsensor', sensor.name, sensor.uuid)
			// setBC('editsensor')
			setTabs({
				id: 'editSensor',
				tabs: []
			})
		}
	})
	useEffect(() => {
		return () => {
			setSensorMetadata({
				metadata: [],
				outbound: [],
				inbound: []
			})		}
	}, [])
	useEffect(() => {
		let gData = async () => await getData()
		gData()
	}, [])

	//Handlers

	const handleGetLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let lng = e.target._latlng.lng
		let newAddress = await getAddressByLocation(lat, lng)
		let address = sensor.address
		if (newAddress) {
			if (!address || !address.includes(newAddress.vejnavn)) {
				address = `${newAddress.vejnavn} ${newAddress.husnr}, ${newAddress.postnr} ${newAddress.postnrnavn}`
			}
		}
		setSensor({
			...sensor,
			lat, lng, address
		})

	}

	const handleChange = (what) => e => {
		setSensor({
			...sensor,
			[what]: e.target.value
		})
	}
	//#region Device Types
	const handleOpenDT = () => setOpenDT(true)
	const handleCloseDT = () => setOpenDT(false)

	const handleChangeDT = (dt) => {
		setSensor({
			...stateSensor,
			deviceType: dt
		})
		setSensorMetadata({
			inbound: dt.inbound ? dt.inbound : [],
			outbound: dt.outbound ? dt.outbound : [],
			metadata: dt.metadata ? dt.metadata : []
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
			outbound: [...otbd, { key: '', nId: -1, type: 0 }]
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
		setSensorMetadata({ ...sensorMetadata, metadata: mtd })

	}

	const handleRemoveMtdKey = index => e => {
		let newMetadata = sensorMetadata.metadata.filter((v, i) => i !== index)
		setSensorMetadata({ ...sensorMetadata, metadata: newMetadata })
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

	const handleOpenReg = () => {
		setOpenReg(true)
	}
	const handleCloseReg = () => {
		setOpenReg(false)
	}
	const handleChangeReg = (o) => {
		setSensor({
			...stateSensor,
			registry: o
		})
		setOpenReg(false)
		setSelect({
			...select,
			reg: o
		})
	}

	//#endregion

	//#region Create Sensor

	const handleUpdateDevice = async () => {
		let smtd = sensorMetadata.metadata
		let mtd = {}
		smtd.forEach((m) => {
			mtd[m.key] = m.value
		})
		let newSensor = {
			...stateSensor,
			tags: [],
			metadata: {
				...sensorMetadata,
				metadata: mtd
			}
		}
		return await updateSensor(newSensor)
	}
	const handleUpdate = async () => {
		let rs = await handleUpdateDevice()
		if (rs) {
			let favObj = {
				id: stateSensor.uuid,
				name: stateSensor.name,
				type: 'sensor',
				path: `/sensor/${stateSensor.uuid}`
			}
			if (isFav(favObj)) {
				updateFav(favObj)
			}
			s('snackbars.edit.device', { device: stateSensor.name })
			dispatch(await getSensors(true))
			history.push(`/sensor/${rs.uuid}`)
		}
		else
			s('snackbars.failed')
	}


	return (loading ? <CircularLoader /> :

		<CreateSensorForm
			sensor={stateSensor}
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

			handleChangeType={handleChangeType}

			handleChange={handleChange}
			handleCreate={handleUpdate}

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
			getLatLngFromMap={handleGetLatLngFromMap}
			t={t}
		/>
	)
}



export default EditSensor
