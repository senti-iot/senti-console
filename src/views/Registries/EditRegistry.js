import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import UpdateRegistryForm from 'components/Collections/UpdateRegistryForm';
import { getRegistryLS, getRegistries } from 'redux/data';
import { updateRegistry } from 'variables/dataRegistry';
import UpdateRegistryForm from 'components/Registry/CreateRegistryForm';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import { useSnackbar, useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	orgId: state.settings.user.org.id,
// 	orgs: state.data.orgs,
// 	registry: state.data.registry
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	updateFav: (favObj) => dispatch(updateFav(favObj)),
// 	getRegistry: async id => dispatch(await getRegistryLS(1, id)),
// 	getRegistries: async (reload, orgId, ua) => dispatch(await getRegistries(reload, orgId, ua))
// })

// @Andrei, view line 77
const UpdateRegistry = props => {
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const orgId = useSelector(state => state.settings.user.org.id)
	const orgs = useSelector(state => state.data.orgs)
	const registry = useSelector(state => state.data.registry)

	const [loading, setLoading] = useState(true)
	const [stateRegistry, setStateRegistry] = useState(null)
	const [org, setOrg] = useState(null)

	let id = props.match.params.id
	let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
	props.setHeader('menus.edits.registry', true, prevURL, 'manage.registries')
	props.setBC('updateregistry')
	props.setTabs({
		id: 'editRegistry',
		tabs: []
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		registry: null,
	// 		org: null
	// 	}
	// 	this.id = props.match.params.id
	// 	let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
	// 	props.setHeader('menus.edits.registry', true, prevURL, 'manage.registries')
	// 	props.setBC('updateregistry')
	// 	props.setTabs({
	// 		id: 'editRegistry',
	// 		tabs: []
	// 	})
	// }

	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToRegistries()
		}
	}
	const getData = async () => {
		// const { getRegistry } = this.props
		dispatch(await getRegistryLS(1, id))
		// await getRegistry(this.id)
	}

	// TODO: I messed something up in this useEffect
	useEffect(() => {
		const { location } = props

		if (registry || (stateRegistry === null && registry)) {
			setStateRegistry(registry)
			setOrg(orgs[orgs.findIndex(o => o.id === registry.orgId)])
			setLoading(false)
			let prevURL = location.prevURL ? location.prevURL : `/registry/${id}`
			props.setHeader('menus.edits.registry', true, prevURL, 'manage.registries')
			props.setBC('editregistry', registry.name, registry.id)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [registry, stateRegistry])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	const { location, setHeader, setBC, registry } = this.props
	// 	if ((!prevProps.registry && registry !== prevProps.registry && registry) || (this.state.registry === null && registry)) {
	// 		let orgs = this.props.orgs
	// 		this.setState({
	// 			registry: registry,
	// 			org: orgs[orgs.findIndex(o => o.id === registry.orgId)],
	// 			loading: false
	// 		})
	// 		let prevURL = location.prevURL ? location.prevURL : `/registry/${this.id}`
	// 		setHeader('menus.edits.registry', true, prevURL, 'manage.registries')
	// 		setBC('editregistry', registry.name, registry.id)
	// 	}
	// }

	useEffect(() => {
		getData()
		window.addEventListener('keydown', keyHandler, false)

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this.getData()
	// 	window.addEventListener('keydown', this.keyHandler, false)

	// }
	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)
	// }
	const handleOrgChange = newOrg => {
		setOrg(newOrg)
		setStateRegistry({ ...stateRegistry, orgId: newOrg.id })
		// this.setState({
		// 	org,
		// 	registry: {
		// 		...this.state.registry,
		// 		orgId: org.id
		// 	}
		// })
	}
	const handleChange = (what) => e => {
		setStateRegistry({ ...stateRegistry, [what]: e.target.value })
		// this.setState({
		// 	registry: {
		// 		...this.state.registry,
		// 		[what]: e.target.value
		// 	}
		// })
	}
	const updateRegistryFunc = async () => {
		return await updateRegistry(stateRegistry)
	}
	const handleUpdate = async () => {
		const { history } = props
		// const { s, history, orgId, accessLevel } = this.props
		let rs = await updateRegistryFunc()
		if (rs) {
			// const { isFav, updateFav } = this.props
			// const { registry } = this.state
			let favObj = {
				id: stateRegistry.id,
				name: stateRegistry.name,
				type: 'registry',
				path: `/registry/${stateRegistry.id}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.registry', { reg: stateRegistry.name })
			dispatch(await getRegistries(true, orgId, accessLevel.apisuperuser ? true : false))
			// this.props.getRegistries(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/registry/${id}`)
		}
		else
			s('snackbars.failed')
	}
	const goToRegistries = () => props.history.push('/registries')

	// const { t } = this.props
	// const { loading, registry, org } = this.state
	return (loading ? <CircularLoader /> :

		<UpdateRegistryForm
			org={org}
			handleOrgChange={handleOrgChange}
			registry={stateRegistry}
			handleChange={handleChange}
			handleCreate={handleUpdate}
			goToRegistries={goToRegistries}
			t={t}
		/>
	)
}

export default UpdateRegistry
