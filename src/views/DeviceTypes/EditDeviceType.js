import React, { Component } from 'react'
import { connect } from 'react-redux'
// import CreateDeviceTypeForm from 'components/Collections/CreateDeviceTypeForm';
import { getDeviceTypeLS, getDeviceTypes } from 'redux/data';
import { updateDeviceType } from 'variables/dataRegistry';
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';

class CreateDeviceType extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			openCF: {
				open: false,
				where: null
			},
			deviceType: null,
			keyName: '',
			value: '',
			org: null
		}
		this.id = props.match.params.id
		// let prevURL = props.location.prevURL ? props.location.prevURL : '/devicetypes/list'
		props.setBC('createdevicetype')
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToRegistries()
		}
	}
	getData = async () => {
		const { getDeviceType } = this.props
		await getDeviceType(this.id)
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { location, setHeader, setBC, devicetype, orgs } = this.props
		if (!this.state.deviceType && devicetype !== prevProps.devicetype && devicetype) {
			this.setState({
				devicetype: devicetype,
				sensorMetadata: {
					metadata: devicetype.metadata ? Object.keys(devicetype.metadata).map(m => ({ key: m, value: devicetype.metadata[m] })) : [],
					outbound: devicetype.outbound ? devicetype.outbound : [],
					inbound: devicetype.inbound ? devicetype.inbound : []
				},
				org: orgs[orgs.findIndex(o => o.id === devicetype.orgId)],
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/devicetype/${this.id}`
			setHeader('menus.edits.devicetype', true, prevURL, 'devicetypes')
			setBC('editdevicetype', devicetype.name, devicetype.id)
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
			devicetype: {
				...this.state.devicetype,
				[what]: e.target.value
			}
		})
	}
	createDeviceType = async () => {
		let deviceType = {
			...this.state.devicetype,
			outbound: this.state.sensorMetadata.outbound,
			inbound: this.state.sensorMetadata.inbound,
			metadata: this.state.sensorMetadata.metadata,
			orgId: this.state.org.id
		}
		return await updateDeviceType(deviceType)
	}
	handleCreate = async () => {
		const { s, history, orgId, accessLevel } = this.props
		let rs = await this.createDeviceType()
		if (rs) {
			const { isFav, updateFav } = this.props
			const { devicetype } = this.state
			let favObj = {
				id: devicetype.id,
				name: devicetype.name,
				type: 'devicetype',
				path: `/devicetype/${devicetype.id}`
			}
			if (isFav(favObj)) {
				updateFav(favObj)
			}
			s('snackbars.edit.devicetype', { dt: devicetype.name })
			this.props.getDeviceTypes(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/devicetype/${rs}`)
		}
		else
			s('snackbars.failed')
	}
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
	handleOrgChange = org => {
		this.setState({
			org: org
		})
	}
	//#endregion

	goToDeviceTypes = () => this.props.history.push('/devicetypes')

	render() {
		const { t, cloudfunctions } = this.props
		const { devicetype, sensorMetadata, loading, org } = this.state

		return ( loading ? <CircularLoader/> :

			<CreateDeviceTypeForm
				org={org}
				handleOrgChange={this.handleOrgChange}
				deviceType={devicetype}
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

				handleChangeMetadataKey={this.handleChangeMetadataKey}
				handleChangeMetadata={this.handleChangeMetadata}
				handleRemoveMtdKey={this.handleRemoveMtdKey}
				handleAddMetadataKey={this.handleAddMetadataKey}

				handleChange={this.handleChange}
				handleCreate={this.handleCreate}
				handleAddKeyToStructure={this.handleAddKeyToStructure}

				goToDeviceTypes={this.goToDeviceTypes}
				t={t}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	cloudfunctions: state.data.functions,
	devicetype: state.data.deviceType,
	orgs: state.data.orgs
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getDeviceType: async id => dispatch(await getDeviceTypeLS(id)),
	getDeviceTypes: async (reload, orgId, ua) => dispatch(await getDeviceTypes(reload, orgId, ua))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateDeviceType)
