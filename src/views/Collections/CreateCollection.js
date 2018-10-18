import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createCollection, getEmptyCollection, assignDeviceToCollection } from 'variables/dataCollections';
import { connect } from 'react-redux'
// import { getAllOrgs } from 'variables/dataOrgs';
import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { CircularLoader } from 'components';
import { getAvailableDevices } from 'variables/dataDevices';


class CreateCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collection: null,
			loading: true,
			openDevice: false,
			device: { id: 0, name: props.t("collections.noDevice") }
		}
		this.id = props.match.params.id
		// props.setHeader('', true, `/collections/list`, "collections")
	}
	createDC = async () => {
		let success = await createCollection(this.state.collection)
		// console.log(success);
		if (success)
			return success
		else
			return false
	}
	getAvailableDevices = async () => {
		const { t, orgId } = this.props
		let devices = await getAvailableDevices(orgId)
		this.setState({
			devices: [{ id: 0, name: t("collections.noDevice") }, ...devices],
			// loading: false
		})
	}
	getEmptyCollection = async () => {
		// console.log("Entered")
		let emptyDC = await getEmptyCollection()
		// console.log(emptyDC)
		this.setState({
			loading: false,
			collection: emptyDC
		})
	}
	componentDidMount = async () => {
		await this.getEmptyCollection()
		this.getAvailableDevices()
	}
	handleOpenDevice = () => {
		this.setState({
			openDevice: true
		})
	}
	handleCloseDevice = () => {
		this.setState({
			openDevice: false
		})
	}
	handleChangeDevice = (o) => e => {
		this.setState({
			device: o,
			openDevice: false
		})
	}
	handleChange = (what) => e => {
		// if (e)
		// 	e.preventDefault()
		this.setState({
			collection: {
				...this.state.collection,
				[what]: e.target.value
			}
		})
	}
	handleCreate = async () => {
		// console.log(this.props.s)
		const { s, t, history } = this.props
		const { device } = this.state
		let rs = await this.createDC()
		
		if (rs) {
			if (device.id > 0) {
				let assignRs = await assignDeviceToCollection({
					id: rs.id,
					deviceId: device.id
				})
				if (assignRs) { 
					s(t("snackbars.collectionCreated"))
					history.push(`/collection/${rs.id}`)
				}
			}
			else { 
				s(t("snackbars.collectionCreated"))
				history.push(`/collection/${rs.id}`)
			}
		}
		else
			s(t("snackbars.failed"))
	}
	render() {
		const { t } = this.props
		const { loading, collection, openDevice, devices, device } = this.state
		return (
			loading ? <CircularLoader /> : 
				<CreateCollectionForm
					collection={collection}
					handleChange={this.handleChange}
					open={openDevice}
					devices={devices}
					device={device}
					handleCloseDevice={this.handleCloseDevice}
					handleOpenDevice={this.handleOpenDevice}
					handleChangeDevice={this.handleChangeDevice}
					handleCreate={this.handleCreate}
					t={t}
				/> 
		)
	}
}

CreateCollection.propTypes = {
	match: PropTypes.object.isRequired,
	accessLevel: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
