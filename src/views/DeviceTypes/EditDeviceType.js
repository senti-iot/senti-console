import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import CreateDeviceTypeForm from 'components/Collections/CreateDeviceTypeForm';
import { getDeviceTypeLS, getDeviceTypes } from 'redux/data';
import { updateDeviceType } from 'variables/dataDeviceTypes';
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	orgId: state.settings.user.org.id,
// 	cloudfunctions: state.data.functions,
// 	devicetype: state.data.deviceType,
// 	orgs: state.data.orgs
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	updateFav: (favObj) => dispatch(updateFav(favObj)),
// 	getDeviceType: async id => dispatch(await getDeviceTypeLS(id)),
// 	getDeviceTypes: async (reload, orgId, ua) => dispatch(await getDeviceTypes(reload, orgId, ua))
// })

const CreateDeviceType = props => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()

	//Redux
	const accessLevel = useSelector(store => store.settings.user.privileges)
	const orgId = useSelector(store => store.settings.user.org.id)
	const cloudfunctions = useSelector(store => store.data.functions)
	const devicetype = useSelector(store => store.data.deviceType)
	const orgs = useSelector(store => store.data.orgs)

	//State
	const [loading, setLoading] = useState(true)
	const [openCF, setOpenCF] = useState({ open: false, where: null })
	const [deviceType, setDeviceType] = useState(null)
	const [keyName, setKeyName] = useState('')
	const [value, setValue] = useState('')
	const [org, setOrg] = useState(null)
	const [sensorMetadata, setSensorMetadata] = useState(null)
	const [select, setSelect] = useState(null)

	//Const
	const { setTabs, setBC, location, setHeader, match } = props
	const id = match.params.id

	// const id = props.match.params.id
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		openCF: {
	// 			open: false,
	// 			where: null
	// 		},
	// 		deviceType: null,
	// 		keyName: '',
	// 		value: '',
	// 		org: null
	// 	}
	// 	this.id = props.match.params.id

	// }

	useEffect(() => {
		if (devicetype) {
			let prevURL = location.prevURL ? location.prevURL : '/devicetypes/list'

			setHeader('menus.edits.devicetype', true, prevURL, 'manage.devicetypes')

			setBC('createdevicetype')
			setTabs({
				id: 'createDT',
				tabs: []
			})
		}
	}, [devicetype, location.prevURL, setBC, setHeader, setTabs])


	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			// TODO
			// goToRegistries()
		}
	}
	const getData = useCallback(async () => {
		await dispatch(await getDeviceTypeLS(id))
	}, [dispatch, id])

	useEffect(() => {
		if (devicetype && orgs && orgs.length > 0) {
			console.log(devicetype)
			setDeviceType(devicetype)
			setSensorMetadata({
				metadata: devicetype.metadata ? Object.keys(devicetype.metadata).map(m => ({ key: m, value: devicetype.metadata[m] })) : [],
				outbound: devicetype.outbound ? devicetype.outbound : [],
				inbound: devicetype.inbound ? devicetype.inbound : []
			})
			console.log(orgs)
			setOrg(orgs[orgs.findIndex(o => o.id === devicetype.orgId)])
			setLoading(false)
		}
	}, [devicetype, orgs])

	// const componentDidUpdate = (prevProps, prevState) => {
	// 	const { location, setHeader, setBC, devicetype, orgs } = props
	// 	if (!deviceType && devicetype !== prevProps.devicetype && devicetype) {
	// 		setDeviceType(devicetype)
	// 		setSensorMetadata({
	// 			metadata: devicetype.metadata ? Object.keys(devicetype.metadata).map(m => ({ key: m, value: devicetype.metadata[m] })) : [],
	// 			outbound: devicetype.outbound ? devicetype.outbound : [],
	// 			inbound: devicetype.inbound ? devicetype.inbound : []
	// 		})
	// 		setOrg(orgs[orgs.findIndex(o => o.id === devicetype.orgId)])
	// 		setLoading(false)
	// this.setState({
	// 	devicetype: devicetype,
	// 	sensorMetadata: {
	// 		metadata: devicetype.metadata ? Object.keys(devicetype.metadata).map(m => ({ key: m, value: devicetype.metadata[m] })) : [],
	// 		outbound: devicetype.outbound ? devicetype.outbound : [],
	// 		inbound: devicetype.inbound ? devicetype.inbound : []
	// 	},
	// 	org: orgs[orgs.findIndex(o => o.id === devicetype.orgId)],
	// 	loading: false
	// })

	// let prevURL = location.prevURL ? location.prevURL : `/devicetype/${id}`
	// setBC('editdevicetype', devicetype.name, devicetype.id)


	//TODO
	/* 		window.addEventListener('keydown', keyHandler, false)

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
		} */
	useEffect(() => {
		getData()

	}, [getData])
	// const componentDidMount = async () => {
	// 	getData()
	// 	window.addEventListener('keydown', keyHandler, false)

	// }
	// const componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', keyHandler, false)
	// }

	const handleChange = (what) => e => {
		setDeviceType({
			...deviceType,
			[what]: e.target.value
		})
		// this.setState({
		// 	devicetype: {
		// 		...this.state.devicetype,
		// 		[what]: e.target.value
		// 	}
		// })
	}
	const createDeviceType = async () => {
		let deviceTypee = {
			...deviceType,
			outbound: sensorMetadata.outbound,
			inbound: sensorMetadata.inbound,
			metadata: sensorMetadata.metadata,
			orgId: org.id
		}
		return await updateDeviceType(deviceTypee)
	}
	// TODO - fix this.state (conflicting 'devicetype' and 'deviceType')
	const handleCreate = async () => {
		const { s, history } = props
		let rs = await createDeviceType()
		if (rs) {
			const { devicetype } = this.state
			let favObj = {
				id: devicetype.id,
				name: devicetype.name,
				type: 'devicetype',
				path: `/devicetype/${devicetype.id}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.devicetype', { dt: devicetype.name })
			dispatch(await getDeviceTypes(true, orgId, accessLevel.apisuperuser ? true : false))
			history.push(`/devicetype/${rs}`)
		}
		else
			s('snackbars.failed')
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
		setOpenCF({
			open: false,
			where: null
		})
		// this.setState({
		// 	openCF: {
		// 		open: false,
		// 		where: null
		// 	}
		// })
	}
	const handleChangeFunc = (o, where) => e => {
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
	const handleOrgChange = org => {
		setOrg(org)
	}
	//#endregion

	const goToDeviceTypes = () => props.history.push('/devicetypes')

	return (loading ? <CircularLoader /> :

		<CreateDeviceTypeForm
			org={org}
			handleOrgChange={handleOrgChange}
			deviceType={devicetype}
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
			// TODO
			// handleAddKeyToStructure={handleAddKeyToStructure}

			goToDeviceTypes={goToDeviceTypes}
			t={t}
		/>
	)
}

export default CreateDeviceType
