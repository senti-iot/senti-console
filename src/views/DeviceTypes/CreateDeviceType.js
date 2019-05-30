import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createDeviceType } from 'variables/dataRegistry';
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm';

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
				outbound: []
			},
			openCF: {
				open: false,
				where: null
			},
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/devicetypes/list'
		props.setHeader('devicetypes.createDeviceType', true, prevURL, '')
		props.setBC('createdevicetypes')
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

	handleStrChange = (what) => e => {
		this.setState({
			[what]: e.target.value
		})
	}
	handleChange = (what) => e => {
		this.setState({
			deviceType: {
				...this.state.deviceType,
				[what]: e.target.value
			}
		})
	}
	createDeviceType = async () => { 
		let newDeviceType = {
			...this.state.deviceType,
			inbound: this.state.sensorMetadata.inbound.map(i => ({ order: i.order, nId: i.nId })),
			outbound: this.state.sensorMetadata.outbound.map(o => ({ key: o.key, nId: o.nId })),
			customer_id: this.props.orgId
		}
		console.log(newDeviceType)
		return await createDeviceType(newDeviceType)
	}
	handleCreate = async () => {
		const { s, history } = this.props
		let rs = await this.createDeviceType()
		if (rs) {
			s('snackbars.deviceTypeCreated')
			history.push(`/devicetype/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	handleRemoveInboundFunction = k => e => {
		let mtd = this.state.sensorMetadata.inbound
		mtd = mtd.filter(v => v.nId !== k.nId && v.id !== k.id)
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
	handleRemoveFunction = (k) => e => {
		let mtd = this.state.sensorMetadata.outbound
		mtd[mtd.findIndex(v => v.key === k.key && v.nId === k.nId)].nId = -1
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: mtd
			}
		})
	}
	handleChangeKey = (k) => e => {
		console.log(k, e.target.value)
		let mtd = this.state.sensorMetadata.outbound
		mtd[k.id].key = e.target.value
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: mtd
			}
		})
	}
	handleRemoveKey = (k) => e => {
		let newMetadata = this.state.sensorMetadata.outbound.filter((v) => v.key !== k.key)
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: newMetadata
			}
		})
	}
	handleAddKey = e => { 
		this.setState({
			sensorMetadata: {
				...this.state.sensorMetadata,
				outbound: [...this.state.sensorMetadata.outbound, { id: this.state.sensorMetadata.outbound.length, key: '', nId: -1 }]
			}
		})
	}
	handleOpenFunc = (p, where) => e => {
		console.log(p, where)
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
		let metadata = this.state.sensorMetadata[where]
		metadata[metadata.findIndex(f => f.id === this.state.select[where].id)].nId = o.id
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
	handleChangeInboundFunc = (o) => e => {
		let metadata = this.state.sensorMetadata.inbound
		metadata[this.state.select.inbound.id].nId = o.id
		this.setState({
			openCF: false,
			sensorMetadata: {
				...this.state.sensorMetadata,
				inbound: metadata
			}
		})
	}
	goToDeviceTypes = () => this.props.history.push('/devicetypes')
	render() {
		const { t, cloudfunctions } = this.props
		const { deviceType, keyName, value, sensorMetadata  } = this.state
		return (
			<CreateDeviceTypeForm
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

				handleChange={this.handleChange}
				handleStrChange={this.handleStrChange}
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

CreateDeviceType.propTypes = {
	match: PropTypes.object.isRequired,
	accessLevel: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	cloudfunctions: state.data.functions
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateDeviceType)
