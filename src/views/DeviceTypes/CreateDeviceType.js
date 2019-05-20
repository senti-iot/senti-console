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
				structure: {
				},
				customer_id: 1
			}
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
	handleAddKeyToStructure = e => {
		this.setState({
			deviceType: {
				...this.state.deviceType,
				structure: {
					...this.state.deviceType.structure,
					[this.state.key]: this.state.value
				}
			},
			key: '',
			value: 'string'
		})
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
		return await createDeviceType(this.state.deviceType)
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
	goToDeviceTypes = () => this.props.history.push('/devicetypes')
	render() {
		const { t } = this.props
		const { deviceType, keyName, value } = this.state
		return (
		
			<CreateDeviceTypeForm
				deviceType={deviceType}
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
	orgId: state.settings.user.org.id
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateDeviceType)
