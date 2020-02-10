import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createDeviceType } from 'variables/dataDeviceTypes';
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm';
import { getDeviceTypes } from 'redux/data';
import { useLocalization, useSnackbar, /* useMatch, */ useLocation, useHistory } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	orgId: state.settings.user.org.id,
// 	org: state.settings.user.org,
// 	cloudfunctions: state.data.functions,
// })

// const mapDispatchToProps = dispatch => ({
// 	getDeviceTypes: async (reload, orgId, ua) => dispatch(await getDeviceTypes(reload, orgId, ua))
// })

// @Andrei
const CreateDeviceType = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	// const match = useMatch()
	const location = useLocation()
	const history = useHistory()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	const orgId = useSelector(state => state.settings.user.org.id)
	const org = useSelector(state => state.settings.user.org)
	const cloudfunctions = useSelector(state => state.data.functions)

	// const [loading, setLoading] = useState(true)
	const [keyName, /* setKeyName */] = useState('')
	const [value, /* setValue */] = useState('')
	const [deviceType, setDeviceType] = useState({
		name: "",
		inbound: [],
		outbound: [],
		customer_id: 1
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
	const [stateOrg, /* setStateOrg */] = useState(org)
	const [select, setSelect] = useState(null) // added

	// let id = match.params.id
	let prevURL = location.prevURL ? location.prevURL : '/devicetypes/list'
	props.setHeader('menus.create.devicetype', true, prevURL, 'manage.devicetypes')
	props.setBC('createdevicetypes')
	props.setTabs({
		id: 'createDT',
		tabs: []
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		keyName: '',
	// 		value: '',
	// 		deviceType: {
	// 			name: "",
	// 			inbound: [],
	// 			outbound: [],
	// 			customer_id: 1
	// 		},
	// 		sensorMetadata: {
	// 			inbound: [],
	// 			outbound: [],
	// 			metadata: []
	// 		},
	// 		openCF: {
	// 			open: false,
	// 			where: null
	// 		},
	// 		org: props.org
	// 	}
	// 	this.id = props.match.params.id
	// 	let prevURL = props.location.prevURL ? props.location.prevURL : '/devicetypes/list'
	// 	props.setHeader('menus.create.devicetype', true, prevURL, 'manage.devicetypes')
	// 	props.setBC('createdevicetypes')
	// 	props.setTabs({
	// 		id: 'createDT',
	// 		tabs: []
	// 	})
	// }

	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToDeviceTypes()
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

	const handleChange = (what) => e => {
		setDeviceType({ ...deviceType, [what]: e.target.value })
		// this.setState({
		// 	deviceType: {
		// 		...this.state.deviceType,
		// 		[what]: e.target.value
		// 	}
		// })
	}

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
	const handleChangeFunc = (o, where) => e => {
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

	//#region Create Device Type

	const createDeviceTypeFunc = async () => {
		let smtd = sensorMetadata.metadata
		let mtd = {}
		smtd.forEach((m) => {
			mtd[m.key] = m.value
		})
		let newDeviceType = {
			...deviceType,
			inbound: sensorMetadata.inbound,
			outbound: sensorMetadata.outbound,
			metadata: Object.keys(mtd).map(m => ({ key: m, value: mtd[m] })),
			// customer_id: this.props.orgId
			orgId: stateOrg.id
		}

		return await createDeviceType(newDeviceType)
	}
	const handleOrgChange = org => {
		stateOrg(org)
		// this.setState({ org })
	}
	const handleCreate = async () => {
		// const { s, history } = this.props
		// const { orgId, accessLevel } = this.props
		let rs = await createDeviceTypeFunc()
		if (rs) {
			s('snackbars.create.devicetype', { dt: deviceType.name })
			dispatch(getDeviceTypes(true, orgId, accessLevel.apisuperuser ? true : false))
			history.push(`/devicetype/${rs}`)
		}
		else
			s('snackbars.failed')
	}

	const goToDeviceTypes = () => history.push('/devicetypes')

	//#endregion

	// const { t, cloudfunctions } = this.props
	// const { value, sensorMetadata, org } = this.state
	return (
		<CreateDeviceTypeForm
			org={stateOrg}
			handleOrgChange={handleOrgChange}
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

			handleChangeType={handleChangeType}

			handleChangeMetadataKey={handleChangeMetadataKey}
			handleChangeMetadata={handleChangeMetadata}
			handleRemoveMtdKey={handleRemoveMtdKey}
			handleAddMetadataKey={handleAddMetadataKey}

			handleChange={handleChange}
			handleCreate={handleCreate}
			// handleAddKeyToStructure={handleAddKeyToStructure}
			keyName={keyName}
			value={value}
			goToDeviceTypes={goToDeviceTypes}
			t={t}
		/>
	)
}

export default CreateDeviceType
