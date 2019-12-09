import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeviceType } from 'variables/dataDeviceTypes';
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm';
import { getDeviceTypes } from 'redux/data';

class CreateDeviceType extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			keyName: '',
			value: '',
			deviceType: {
				name: "",
				inbound: [],
				outbound: [],
				customer_id: 1
			},
			sensorMetadata: {
				inbound: [],
				outbound: [],
				metadata: []
			},
			openCF: {
				open: false,
				where: null
			},
			org: props.org
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/devicetypes/list'
		props.setHeader('menus.create.devicetype', true, prevURL, 'manage.devicetypes')
		props.setBC('createdevicetypes')
		props.setTabs({
			id: 'createDT',
			tabs: []
		})
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToDeviceTypes()
		}
	}
	componentDidMount = async () => {
		window.addEventListener('keydown', this.keyHandler, false)
	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)
	}

	handleChange = (what) => e => {
		this.setState({
			deviceType: {
				...this.state.deviceType,
				[what]: e.target.value
			}
		})
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

	//#endregion

	//#region Create Device Type

	createDeviceType = async () => {
		let smtd = this.state.sensorMetadata.metadata
		let mtd = {}
		smtd.forEach((m) => {
			mtd[m.key] = m.value
		})
		let newDeviceType = {
			...this.state.deviceType,
			inbound: this.state.sensorMetadata.inbound,
			outbound: this.state.sensorMetadata.outbound,
			metadata: Object.keys(mtd).map(m => ({ key: m, value: mtd[m] })),
			// customer_id: this.props.orgId
			orgId: this.state.org.id
		}

		return await createDeviceType(newDeviceType)
	}
	handleOrgChange = org => {
		this.setState({ org })
	}
	handleCreate = async () => {
		const { s, history } = this.props
		const { orgId, accessLevel } = this.props
		let rs = await this.createDeviceType()
		if (rs) {
			s('snackbars.create.devicetype', { dt: this.state.deviceType.name })
			this.props.getDeviceTypes(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/devicetype/${rs}`)
		}
		else
			s('snackbars.failed')
	}

	goToDeviceTypes = () => this.props.history.push('/devicetypes')

	//#endregion

	render() {
		const { t, cloudfunctions } = this.props
		const { deviceType, keyName, value, sensorMetadata, org } = this.state
		return (
			<CreateDeviceTypeForm
				org={org}
				handleOrgChange={this.handleOrgChange}
				deviceType={deviceType}
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

				onChange={this.handleChange}
				handleCreate={this.handleCreate}
				handleAddKeyToStructure={this.handleAddKeyToStructure}
				keyName={keyName}
				value={value}
				goToDeviceTypes={this.goToDeviceTypes}
				t={t}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	org: state.settings.user.org,
	cloudfunctions: state.data.functions,
})

const mapDispatchToProps = dispatch => ({
	getDeviceTypes: async (reload, orgId, ua) => dispatch(await getDeviceTypes(reload, orgId, ua))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateDeviceType)
