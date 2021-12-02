import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDeviceTypeLS, getDeviceTypes, getOrgs } from 'redux/data'
import { updateDeviceType } from 'variables/dataDeviceTypes'
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm'
import { updateFav, isFav } from 'redux/favorites'
import { CircularLoader } from 'components'
import { useHistory, useSnackbar, useEventListener } from 'hooks'
import { useParams, useLocation } from 'react-router-dom'


const EditDeviceType = props => {
	//Hooks
	const dispatch = useDispatch()

	const s = useSnackbar().s
	const history = useHistory()
	const location = useLocation()
	const params = useParams()

	//Redux
	const accessLevel = useSelector(store => store.settings.user.privileges)
	const cloudfunctions = useSelector(store => store.data.functions)
	const devicetype = useSelector(store => store.data.deviceType)
	const orgs = useSelector(store => store.data.orgs)

	//State
	const [loading, setLoading] = useState(true)
	const [openCF, setOpenCF] = useState({ open: false, where: null })
	const [deviceType, setDeviceType] = useState(null)
	const [org, setOrg] = useState(null)
	const [sensorMetadata, setSensorMetadata] = useState(null)
	const [select, setSelect] = useState(null)
	const [openOrg, setOpenOrg] = useState(false)
	const [decoder, setDecoder] = useState({
		id: null,
		name: ""
	})
	//Const
	const { setHeader, setBC, setTabs } = props

	//useCallbacks
	const keyHandler = useCallback((e) => {
		if (e.key === 'Escape') {
			let prevURL = location.prevURL ? location.prevURL : `/devicetype/${params.id}`
			history.push(prevURL)
		}
	}, [history, location, params])

	//useEventListeners
	useEventListener('keydown', keyHandler)


	//useEffects
	useEffect(() => {
		let getDT = async () => {
			await dispatch(await getDeviceTypeLS(params.id))
			if (orgs.length === 0) {
				await dispatch(await getOrgs(true))
			}
		}
		getDT()
		console.log('Getting DT')
	}, [dispatch, orgs.length, params])


	useEffect(() => {
		console.log(devicetype, orgs)
		if (devicetype && orgs.length > 0) {
			setDeviceType(devicetype)
			setDecoder(devicetype.decoder ? cloudfunctions[cloudfunctions.findIndex(f => f.id === devicetype.decoder)] : { id: null, name: "" })
			setSensorMetadata({
				metadata: devicetype.metadata ? devicetype.metadata : [],
				outbound: devicetype.outbound ? devicetype.outbound : [],
				inbound: devicetype.inbound ? devicetype.inbound : []
			})
			setOrg(devicetype.org)

			setLoading(false)
			let prevURL = location.prevURL ? location.prevURL : `/devicetype/${params.id}`
			setHeader('menus.edits.devicetype', true, prevURL, 'manage.devicetypes')

			setTabs({
				id: 'createDT',
				tabs: []
			})
			setBC('createdevicetype')
		}
	}, [devicetype, params.id, location.prevURL, orgs, setBC, setHeader, setTabs, cloudfunctions])

	//handlers

	const handleChange = (what) => e => {
		setDeviceType({
			...deviceType,
			[what]: e.target.value
		})
	}
	//#region Orgs

	const handleOrgChange = org => {
		setOrg(org)
	}
	const handleOpenOrg = () => setOpenOrg(true)
	const handleCloseOrg = () => setOpenOrg(false)

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
			inbound: [
				...mtd,
				{ id: mtd.length, order: mtd.length, nId: -1 }
			]
		})
	}

	//#endregion

	//#region Outbound DataKeys

	/**
	 * Add a new dataKey
	 */
	const handleAddKey = e => {
		setSensorMetadata({
			...sensorMetadata,
			outbound: [
				...sensorMetadata.outbound, { key: '', nId: -1, type: 0, label: "", unit: "" }
			]
		})
	}
	/**
	 * Add synthetic dataKey
	 */
	const handleAddSyntheticKey = e => {
		setSensorMetadata({
			...sensorMetadata,
			outbound: [
				...sensorMetadata.outbound, { key: '', nId: -1, type: 0, label: "", unit: "", originalKey: "" }
			]
		})
	}
	/**
	 * Remove dataKey
	 */
	const handleRemoveKey = (index) => e => {
		let newMetadata = sensorMetadata.outbound.filter((v, i) => i !== index)
		setSensorMetadata({
			...sensorMetadata,
			outbound: newMetadata
		})
	}
	/**
	 * Remove Cloud function from dataKey
	 */
	const handleRemoveFunction = (i) => e => {
		let mtd = [...sensorMetadata.outbound]
		mtd[i].nId = -1
		setSensorMetadata({
			...sensorMetadata,
			outbound: mtd
		})
	}
	/**
	 * Change measure unit from dataKey
	 */
	const handleChangeUnit = (v, i) => e => {
		let mtd = [...sensorMetadata.outbound]
		mtd[i].unit = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: mtd
		})
	}
	/**
	 * Change key from dataKey
	 */
	const handleChangeKey = (v, i) => e => {
		let mtd = [...sensorMetadata.outbound]
		mtd[i].key = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: mtd
		})
	}
	/**
	 * Change key label from dataKey
	 */
	const handleChangeKeyLabel = (v, i) => e => {
		let mtd = [...sensorMetadata.outbound]
		mtd[i].label = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: mtd
		})
	}
	/**
	 * Change type of dataKey
	 */
	const handleChangeType = index => e => {
		e.preventDefault()
		let mtd = [...sensorMetadata.outbound]
		mtd[index].type = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: mtd
		})
	}
	const handleChangeOriginKey = index => e => {
		e.preventDefault()
		let mtd = [...sensorMetadata.outbound]
		mtd[index].originalKey = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: mtd
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
	}

	const handleRemoveMtdKey = index => e => {
		let newMetadata = sensorMetadata.metadata.filter((v, i) => i !== index)
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
		setSelect({ ...select, [where]: p })
		setOpenCF({
			open: true,
			where
		})
	}

	const handleCloseFunc = () => {
		setOpenCF({
			open: false,
			where: null
		})
	}
	const handleRemoveDecoder = () => {
		setDecoder({
			id: null,
			name: ""
		})
	}
	const handleChangeFunc = (o, where) => {
		if (where === 'decoder') {
			setDecoder(o)
		}
		else {
			let metadata = sensorMetadata[where]
			metadata[select[where]].nId = o.id
			setSensorMetadata({
				...sensorMetadata,
				[where]: metadata
			})
		}
		setOpenCF({
			open: false,
			where: null
		})
	}
	//#endregion

	//#region Update Device Type

	const updtDeviceType = async () => {
		let nDeviceType = {
			...deviceType,
			decoder: decoder.id,
			outbound: sensorMetadata.outbound,
			inbound: sensorMetadata.inbound,
			metadata: sensorMetadata.metadata,
			org: org
		}
		return await updateDeviceType(nDeviceType)
	}

	const handleCreate = async () => {
		let rs = await updtDeviceType()
		if (rs) {
			let favObj = {
				id: deviceType.uuid,
				name: deviceType.name,
				type: 'devicetype',
				path: `/devicetype/${deviceType.uuid}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.devicetype', { dt: deviceType.name })
			dispatch(await getDeviceTypes(true, org.aux?.odeumId, accessLevel.apisuperuser ? true : false))
			history.push(`/devicetype/${rs.uuid}`)
		}
		else
			s('snackbars.failed')
	}

	//#region



	const goToDeviceTypes = () => history.push('/devicetypes')

	return (loading ? <CircularLoader /> :

		<CreateDeviceTypeForm
			org={org}
			handleOrgChange={handleOrgChange}
			openOrg={openOrg}
			handleOpenOrg={handleOpenOrg}
			handleCloseOrg={handleCloseOrg}



			deviceType={deviceType}
			decoder={decoder}
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
			handleAddSyntheticKey={handleAddSyntheticKey}
			handleRemoveKey={handleRemoveKey}
			handleChangeKey={handleChangeKey}
			handleChangeUnit={handleChangeUnit}
			handleChangeKeyLabel={handleChangeKeyLabel}
			handleChangeType={handleChangeType}
			handleChangeOriginKey={handleChangeOriginKey}

			handleChangeMetadataKey={handleChangeMetadataKey}
			handleChangeMetadata={handleChangeMetadata}
			handleRemoveMtdKey={handleRemoveMtdKey}
			handleAddMetadataKey={handleAddMetadataKey}

			handleRemoveDecoder={handleRemoveDecoder}
			handleChange={handleChange}
			handleCreate={handleCreate}

			goToDeviceTypes={goToDeviceTypes}
		/>
	)
}

export default EditDeviceType
