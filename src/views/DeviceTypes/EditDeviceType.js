import React, { Component } from 'react'
import { connect } from 'react-redux'
// import CreateDeviceTypeForm from 'components/Collections/CreateDeviceTypeForm';
import { getDeviceTypeLS } from 'redux/data';
import { updateDeviceType } from 'variables/dataRegistry';
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';

class CreateDeviceType extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			deviceType: {
				name: "",
				structure: {
				},
				customer_id: 1
			},
			keyName: '',
			value: '',
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/devicetypes/list'
		props.setHeader('menus.edit.devicetype', true, prevURL, '')
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
		const { location, setHeader, devicetype } = this.props
		console.log(devicetype, ((!prevProps.devicetype && devicetype !== prevProps.devicetype && devicetype) || (this.state.devicetype === null && devicetype)))
		if ((!prevProps.devicetype && devicetype !== prevProps.devicetype && devicetype) || (this.state.devicetype === null && devicetype)) {

			this.setState({
				devicetype: devicetype,
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/devicetype/${this.id}`
			setHeader('devicetypes.editCollection', true, prevURL, 'devicetypes')
			this.props.setBC('editdevicetype', devicetype.name, devicetype.id)
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
		return await updateDeviceType(this.state.devicetype)
	}
	handleCreate = async () => {
		const { s, history } = this.props
		let rs = await this.createDeviceType()
		if (rs) {
			s('snackbars.devicetypeCreated')
			history.push(`/devicetype/${rs.id}`)
		}
		else
			s('snackbars.failed')
	}
	handleAddKeyToStructure = e => {
		console.log(this.state.keyName)
		this.setState({
			devicetype: {
				...this.state.devicetype,
				structure: {
					...this.state.devicetype.structure,
					[this.state.keyName]: this.state.value
				}
			},
			keyName: '',
			value: 'string'
		})
	}
	handleStrChange = (what) => e => {
		console.log(what, e.target.value)
		this.setState({
			[what]: e.target.value
		})
	}
	goToDeviceTypes = () => this.props.history.push('/devicetypes')
	render() {
		const { t } = this.props
		const { loading, devicetype, keyName, value  } = this.state
		console.log(loading, devicetype)
		return ( loading ? <CircularLoader/> :

			<CreateDeviceTypeForm
				deviceType={devicetype}
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

const mapStateToProps = (state) => ({
	// accessLevel: state.settings.user.privileges,
	// orgId: state.settings.user.org.id
	devicetype: state.data.deviceType
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getDeviceType: async id => dispatch(await getDeviceTypeLS(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateDeviceType)
