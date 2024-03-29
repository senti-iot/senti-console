import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRegistryLS, getRegistries, getOrgs } from 'redux/data'
import { updateRegistry } from 'variables/dataRegistry'
import UpdateRegistryForm from 'components/Registry/CreateRegistryForm'
import { updateFav, isFav } from 'redux/favorites'
import { CircularLoader } from 'components'
import { useSnackbar, useLocation, useMatch, useHistory, useEventListener } from 'hooks'

const UpdateRegistry = props => {
	//Hooks
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const location = useLocation()
	const match = useMatch()
	const history = useHistory()

	//Redux
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const orgId = useSelector(state => state.settings.user.org.id)
	const orgs = useSelector(state => state.data.orgs)
	const registry = useSelector(state => state.data.registry)

	//State
	const [loading, setLoading] = useState(true)
	const [stateRegistry, setStateRegistry] = useState(null)
	const [org, setOrg] = useState(null)

	//Const

	//useCallbacks
	const goToRegistries = useCallback(() => history.push('/registries'), [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToRegistries()
		}
	}, [goToRegistries])

	const getData = useCallback(async () => {
		await dispatch(await getOrgs(true))
		await dispatch(await getRegistryLS(match.params.id))
	}, [dispatch, match.params.id])

	//useEventListener

	useEventListener('keydown', handleKeyPress)


	//useEffects
	useEffect(() => {
		if ((stateRegistry === null && registry) && orgs.length > 0) {
			setStateRegistry(registry)
			setOrg(registry.org)
			setLoading(false)
		}
	}, [orgs, registry, stateRegistry])

	useEffect(() => {
		let prevURL = location.prevURL ? location.prevURL : '/registries/list'
		props.setHeader('menus.edits.registry', true, prevURL, 'manage.registries')
		props.setBC('updateregistry')
		props.setTabs({
			id: 'editRegistry',
			tabs: []
		})

	}, [location, props])

	useEffect(() => {
		const getReg = async () => await getData()
		getReg()
	}, [getData])

	//Handlers

	const handleOrgChange = newOrg => {
		setOrg(newOrg)
		setStateRegistry({
			...stateRegistry, org: {
				uuid: newOrg.uuid
			}
		})
	}
	const handleChange = (what) => e => {
		setStateRegistry({ ...stateRegistry, [what]: e.target.value })
	}
	const updateRegistryFunc = async () => {
		return await updateRegistry(stateRegistry)
	}
	const handleUpdate = async () => {
		let rs = await updateRegistryFunc()
		if (rs) {
			let favObj = {
				id: stateRegistry.uuid,
				name: stateRegistry.name,
				type: 'registry',
				path: `/registry/${stateRegistry.uuid}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.registry', { reg: stateRegistry.name })
			dispatch(await getRegistries(true, orgId, accessLevel.apisuperuser ? true : false))
			history.push(`/registry/${stateRegistry.uuid}`)
		}
		else
			s('snackbars.failed')
	}

	return (loading ? <CircularLoader /> :

		<UpdateRegistryForm
			org={org}
			handleOrgChange={handleOrgChange}
			registry={stateRegistry}
			handleChange={handleChange}
			handleCreate={handleUpdate}
			goToRegistries={goToRegistries}
		/>
	)
}

export default UpdateRegistry
