import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createDeviceType } from 'variables/dataDeviceTypes'
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm'
import { getDeviceTypes } from 'redux/data'
import { useSnackbar, useLocation, useHistory, useEventListener, useLocalization } from 'hooks'
import { Danger } from 'components'

const CreateDeviceType = props => {
	//Hooks
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const history = useHistory()
	const location = useLocation()
	const t = useLocalization()

	//Redux
	const org = useSelector(state => state.settings.user.org)
	const cloudfunctions = useSelector(state => state.data.functions)
	const [errorMessage, setErrorMessage] = useState(null) // added
	const [error, setError] = useState(null) // added



	const [deviceType, setDeviceType] = useState({
		name: "",
		description: "",
		inbound: [],
		outbound: [],
	})
	const [sensorMetadata, setSensorMetadata] = useState({
		inbound: [],
		outbound: [],
		metadata: []
	})
	const [openCF, setOpenCF] = useState({
		open: false,
		where: null
	})
	const [select, setSelect] = useState(null)
	const [stateOrg, setStateOrg] = useState(org)
	const [openOrg, setOpenOrg] = useState(false)
	const [decoder, setDecoder] = useState({
		id: null,
		name: ""
	})
	//Const
	const { setHeader, setBC, setTabs } = props


	//useCallbacks
	const goToDeviceTypes = useCallback(() => history.push('/devicetypes'), [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToDeviceTypes()
		}
	}, [goToDeviceTypes])

	//useEventListener
	useEventListener('keydown', handleKeyPress)




	//useEffects
	useEffect(() => {
		let prevURL = location.prevURL ? location.prevURL : '/devicetypes/list'
		setHeader('menus.create.devicetype', true, prevURL, 'manage.devicetypes')
		setBC('createdevicetypes')
		setTabs({
			id: 'createDT',
			tabs: []
		})
		//eslint-disable-next-line
	}, [])
	//Handlers
	const handleValidation = () => {
		let errorCode = []
		const { name } = deviceType
		if (name === '') {
			errorCode.push(0)
		}
		// if (address === '') {
		// 	errorCode.push(1)
		// }
		// if (city === '') {
		// 	errorCode.push(2)
		// }
		// if (zip === '') {
		// 	errorCode.push(3)
		// }
		// if (country === '') {
		// 	errorCode.push(4)
		// }
		// if (selectedOrg === null) {
		// 	errorCode.push(5)
		// }
		setErrorMessage(errorCode.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))

		if (errorCode.length === 0) {
			setError(false)
			return true
		}
		else {
			setError(true)
			return false
		}
	}

	const errorMessages = code => {
		// const { t } = this.props
		switch (code) {
			case 0:
				return t('orgs.validation.noName')
			case 1:
				return t('orgs.validation.noAddress')
			case 2:
				return t('orgs.validation.noCity')
			case 3:
				return t('orgs.validation.noZip')
			case 4:
				return t('orgs.validation.noCountry')
			case 5:
				return t('orgs.validation.noParent')
			case 6:
				return t('orgs.validation.notWebsite')
			default:
				return ''
		}
	}
	const handleChange = (what) => e => {
		setDeviceType({
			...deviceType,
			[what]: e.target.value
		})
	}
	//#region Orgs

	const handleOrgChange = org => {
		setStateOrg(org)
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

	//#region Outbound function

	const handleAddKey = e => {
		setSensorMetadata({
			...sensorMetadata,
			outbound: [
				...sensorMetadata.outbound, { key: '', nId: -1, type: 0 }
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

	const handleRemoveKey = (index) => e => {
		let newMetadata = sensorMetadata.outbound.filter((v, i) => i !== index)
		setSensorMetadata({
			...sensorMetadata,
			outbound: newMetadata
		})
	}

	const handleRemoveFunction = (i) => e => {
		let mtd = sensorMetadata.outbound
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
	const handleChangeKey = (v, i) => e => {
		let mtd = sensorMetadata.outbound
		mtd[i].key = e.target.value
		setSensorMetadata({
			...sensorMetadata,
			outbound: mtd
		})
	}

	const handleChangeType = index => e => {
		e.preventDefault()
		let mtd = sensorMetadata.outbound
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

	//#region Create Device Type

	const createDeviceTypeFunc = async () => {
		let smtd = sensorMetadata.metadata
		let mtd = {}
		smtd.forEach((m) => {
			mtd[m.key] = m.value
		})
		let newDeviceType = {
			...deviceType,
			decoder: decoder.id,
			inbound: sensorMetadata.inbound,
			outbound: sensorMetadata.outbound,
			metadata: Object.keys(mtd).map(m => ({ key: m, value: mtd[m] })),
			org: stateOrg
		}
		return await createDeviceType(newDeviceType)
	}

	const handleCreate = async () => {
		if (handleValidation()) {
			// let rs = null
			let rs = await createDeviceTypeFunc()
			if (rs) {
				s('snackbars.create.devicetype', { dt: deviceType.name })
				dispatch(getDeviceTypes(true))
				history.push(`/devicetype/${rs.uuid}`)
			}
			else
				s('snackbars.createdFail')
		}
		else {
			s('snackbars.createdFail')
		}
	}


	//#endregion

	return (
		<CreateDeviceTypeForm

			error={error}
			errorMessage={errorMessage}

			org={stateOrg}
			decoder={decoder}
			handleOrgChange={handleOrgChange}
			openOrg={openOrg}
			handleOpenOrg={handleOpenOrg}
			handleCloseOrg={handleCloseOrg}

			handleRemoveDecoder={handleRemoveDecoder}
			deviceType={deviceType}
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
			handleChangeUnit={handleChangeUnit}
			handleChangeKeyLabel={handleChangeKeyLabel}
			handleChangeType={handleChangeType}
			handleAddSyntheticKey={handleAddSyntheticKey}
			handleChangeOriginKey={handleChangeOriginKey}

			handleChangeMetadataKey={handleChangeMetadataKey}
			handleChangeMetadata={handleChangeMetadata}
			handleRemoveMtdKey={handleRemoveMtdKey}
			handleAddMetadataKey={handleAddMetadataKey}

			handleChange={handleChange}
			handleCreate={handleCreate}

			goToDeviceTypes={goToDeviceTypes}
		/>
	)
}

export default CreateDeviceType
