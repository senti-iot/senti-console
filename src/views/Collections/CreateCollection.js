import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createCollection, getEmptyCollection, assignDeviceToCollection } from 'variables/dataCollections';
import { connect } from 'react-redux'
import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { CircularLoader } from 'components';
import { getAvailableDevices } from 'variables/dataDevices';
import { getAllOrgs } from 'variables/dataOrgs';
import { getCollections } from 'redux/data';

class CreateCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collection: null,
			loading: true,
			openDevice: false,
			openOrg: false,
			device: { id: 0, name: props.t('no.device') },
			org: { id: 0, name: props.t('users.fields.noOrg') }
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/collections/list'
		props.setHeader('collections.createCollection', true, prevURL, 'collections')
		props.setBC('createcollection')
		props.setTabs({
			id: 'createCollection',
			tabs: []
		})
	}

	createDC = async () => {
		let success = await createCollection(this.state.collection)
		if (success)
			return success
		else
			return false
	}
	getAvailableDevices = async () => {
		const { t } = this.props
		const { org } = this.state
		let devices = await getAvailableDevices(org.id)
		this.setState({
			devices: devices ? [{ id: 0, name: t('no.device') }, ...devices] : [{ id: 0, name: t('no.freeDevices') }],
		})
	}
	getOrgs = async () => {
		const { t } = this.props
		let orgs = await getAllOrgs()
		this.setState({
			orgs: orgs ? [{ id: 0, name: t('users.fields.noOrg') }, ...orgs] : [{ id: 0, name: t('users.fields.noOrg') }]
		})
	}
	getEmptyCollection = async () => {
		let emptyDC = await getEmptyCollection()
		Object.keys(emptyDC).map(k => emptyDC[k] === null ? emptyDC[k] = '' : null)
		this.setState({
			loading: false,
			org: emptyDC.org,
			collection: emptyDC
		})
	}
	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToCollection()
		}
	}
	componentDidMount = async () => {
		window.addEventListener('keydown', this.keyHandler, false)

		await this.getEmptyCollection()
		this.getAvailableDevices()
		this.getOrgs()
	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)

	}

	handleOpenOrg = () => {
		this.setState({
			openOrg: true
		})
	}
	handleCloseOrg = () => {
		this.setState({
			openOrg: false
		})
	}
	handleChangeOrg = (o) => e => {
		this.setState({
			org: o,
			openOrg: false,
			collection: {
				...this.state.collection,
				org: {
					...o
				}
			}
		}, async () => {
			await this.getAvailableDevices()
		})
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
		this.setState({
			collection: {
				...this.state.collection,
				[what]: e.target.value
			}
		})
	}
	handleCreate = async () => {
		const { s, history } = this.props
		const { device } = this.state
		let rs = await this.createDC()

		if (rs) {
			if (device.id > 0) {
				let assignRs = await assignDeviceToCollection({
					id: rs.id,
					deviceId: device.id
				})
				if (assignRs) {
					s('snackbars.collectionCreated')
					history.push(`/collection/${rs.id}`)
				}
			}
			else {
				s('snackbars.collectionCreated')
				history.push(`/collection/${rs.id}`)
			}
			this.props.getCollections(true)
		}
		else
			s('snackbars.failed')
	}
	goToCollection = () => this.props.history.push('/collections')
	render() {
		const { t } = this.props
		const { loading, collection, openDevice, devices, device, orgs, org, openOrg } = this.state
		return (
			loading ? <CircularLoader /> :
				<CreateCollectionForm
					collection={collection}
					handleChange={this.handleChange}
					openDevice={openDevice}
					devices={devices}
					device={device}
					handleCloseDevice={this.handleCloseDevice}
					handleOpenDevice={this.handleOpenDevice}
					handleChangeDevice={this.handleChangeDevice}
					handleCreate={this.handleCreate}
					orgs={orgs}
					org={org}
					openOrg={openOrg}
					goToCollection={this.goToCollection}
					handleCloseOrg={this.handleCloseOrg}
					handleOpenOrg={this.handleOpenOrg}
					handleChangeOrg={this.handleChangeOrg}
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

const mapDispatchToProps = dispatch => ({
	getCollections: (reload) => dispatch(getCollections(reload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
