import React, { useState, useEffect } from 'react'
import { createCollection, getEmptyCollection, assignDeviceToCollection } from 'variables/dataCollections';
import { /* useSelector, */ useDispatch } from 'react-redux'
import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { CircularLoader } from 'components';
import { getAvailableDevices } from 'variables/dataDevices';
import { getAllOrgs } from 'variables/dataOrgs';

import { getCollections, /* setDevices, setOrgs  */ } from 'redux/data';
import { useLocalization, useSnackbar, useHistory } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	orgId: state.settings.user.org.id
// })

// const mapDispatchToProps = dispatch => ({
// 	getCollections: (reload) => dispatch(getCollections(reload))
// })
//@Andrei

const CreateCollection = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const history = useHistory()
	const dispatch = useDispatch()
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	// const orgId = useSelector(state => state.settings.user.org.id)

	const [collection, setCollection] = useState(null)
	const [loading, setLoading] = useState(true)
	const [openDevice, setOpenDevice] = useState(false)
	const [openOrg, setOpenOrg] = useState(false)
	const [device, setDevice] = useState({ id: 0, name: t('no.device') })
	const [devices, setDevices] = useState(null) // added
	const [org, setOrg] = useState({ id: 0, name: t('users.fields.noOrg') })
	const [orgs, setOrgs] = useState(null) // added

	// let id = props.match.params.id
	let prevURL = props.location.prevURL ? props.location.prevURL : '/collections/list'
	props.setHeader('collections.createCollection', true, prevURL, 'collections')
	props.setBC('createcollection')
	props.setTabs({
		id: 'createCollection',
		tabs: []
	})
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		collection: null,
	// 		loading: true,
	// 		openDevice: false,
	// 		openOrg: false,
	// 		device: { id: 0, name: props.t('no.device') },
	// 		org: { id: 0, name: props.t('users.fields.noOrg') }
	// 	}
	// 	this.id = props.match.params.id
	// 	let prevURL = props.location.prevURL ? props.location.prevURL : '/collections/list'
	// 	props.setHeader('collections.createCollection', true, prevURL, 'collections')
	// 	props.setBC('createcollection')
	// 	props.setTabs({
	// 		id: 'createCollection',
	// 		tabs: []
	// 	})
	// }

	const createDC = async () => {
		let success = await createCollection(collection)
		if (success)
			return success
		else
			return false
	}
	const getAvailableDevicesFunc = async () => {
		// const { t } = this.props
		// const { org } = this.state
		let devices = dispatch(await getAvailableDevices(org.id))
		setDevices(devices ? [{ id: 0, name: t('no.device') }, ...devices] : [{ id: 0, name: t('no.freeDevices') }])
		// this.setState({
		// 	devices: devices ? [{ id: 0, name: t('no.device') }, ...devices] : [{ id: 0, name: t('no.freeDevices') }],
		// })
	}
	const getOrgs = async () => {
		// const { t } = this.props
		let orgs = await getAllOrgs()
		setOrgs(orgs ? [{ id: 0, name: t('users.fields.noOrg') }, ...orgs] : [{ id: 0, name: t('users.fields.noOrg') }])
		// this.setState({
		// 	orgs: orgs ? [{ id: 0, name: t('users.fields.noOrg') }, ...orgs] : [{ id: 0, name: t('users.fields.noOrg') }]
		// })
	}
	const getEmptyCollectionFunc = async () => {
		let emptyDC = dispatch(await getEmptyCollection())
		Object.keys(emptyDC).map(k => emptyDC[k] === null ? emptyDC[k] = '' : null)
		setLoading(false)
		setOrg(emptyDC.org)
		setCollection(emptyDC)
		// this.setState({
		// 	loading: false,
		// 	org: emptyDC.org,
		// 	collection: emptyDC
		// })
	}
	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToCollection()
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', keyHandler, false)
		const asyncFunc = async () => {
			await getEmptyCollectionFunc()
			getAvailableDevicesFunc()
			getOrgs()
		}
		asyncFunc()

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	window.addEventListener('keydown', this.keyHandler, false)

	// 	await this.getEmptyCollection()
	// 	this.getAvailableDevices()
	// 	this.getOrgs()
	// }
	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)

	// }

	const handleOpenOrg = () => {
		setOpenOrg(true)
		// this.setState({
		// 	openOrg: true
		// })
	}
	const handleCloseOrg = () => {
		setOpenOrg(false)
		// this.setState({
		// 	openOrg: false
		// })
	}
	const handleChangeOrg = (o) => e => {
		setOrg(o)
		setOpenOrg(false)
		setCollection({ ...collection, org: { ...o } })
		// this.setState({
		// 	org: o,
		// 	openOrg: false,
		// 	collection: {
		// 		...this.state.collection,
		// 		org: {
		// 			...o
		// 		}
		// 	}
		// }, async () => {
		// 	await this.getAvailableDevices() // it's already in useEffect
		// })
	}
	const handleOpenDevice = () => {
		setOpenDevice(true)
		// this.setState({
		// 	openDevice: true
		// })
	}
	const handleCloseDevice = () => {
		setOpenDevice(false)
		// this.setState({
		// 	openDevice: false
		// })
	}
	const handleChangeDevice = (o) => e => {
		setDevice(o)
		setOpenDevice(false)
		// this.setState({
		// 	device: o,
		// 	openDevice: false
		// })
	}
	const handleChange = (what) => e => {
		setCollection({ ...collection, [what]: e.target.value })
		// this.setState({
		// 	collection: {
		// 		...this.state.collection,
		// 		[what]: e.target.value
		// 	}
		// })
	}
	const handleCreate = async () => {
		// const { s, history } = this.props
		// const { device } = this.state
		let rs = await createDC()

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
			dispatch(getCollections(true))
		}
		else
			s('snackbars.failed')
	}
	const goToCollection = () => props.history.push('/collections')

	// const { t } = this.props
	// const { loading, collection, openDevice, devices, device, orgs, org, openOrg } = this.state
	return (
		loading ? <CircularLoader /> :
			<CreateCollectionForm
				collection={collection}
				handleChange={handleChange}
				openDevice={openDevice}
				devices={devices}
				device={device}
				handleCloseDevice={handleCloseDevice}
				handleOpenDevice={handleOpenDevice}
				handleChangeDevice={handleChangeDevice}
				handleCreate={handleCreate}
				orgs={orgs}
				org={org}
				openOrg={openOrg}
				goToCollection={goToCollection}
				handleCloseOrg={handleCloseOrg}
				handleOpenOrg={handleOpenOrg}
				handleChangeOrg={handleChangeOrg}
				t={t}
			/>
	)
}


export default CreateCollection
