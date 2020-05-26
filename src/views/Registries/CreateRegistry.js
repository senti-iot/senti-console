import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createRegistry } from 'variables/dataRegistry'
import CreateRegistryForm from 'components/Registry/CreateRegistryForm'
import { getRegistries } from 'redux/data'
import { useSnackbar, useLocation, useHistory, useEventListener } from 'hooks'

const CreateRegistry = props => {
	//Hooks
	const s = useSnackbar().s
	const location = useLocation()
	const dispatch = useDispatch()
	const history = useHistory()

	//Redux
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const org = useSelector(state => state.settings.user.org)

	//State
	const [registry, setRegistry] = useState({
		name: "",
		region: "Europe",
		protocol: 0,
		ca_certificate: 0,
		orgId: org.aux?.odeumId
	})
	const [stateOrg, setStateOrg] = useState(org)

	//Const

	//useCallbacks
	const goToRegistries = useCallback(() => history.push('/registries'), [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToRegistries()
		}
	}, [goToRegistries])

	//useEffects
	useEffect(() => {
		let prevURL = location.prevURL ? location.prevURL : '/registries/list'
		props.setHeader('menus.create.registry', true, prevURL, 'manage.registries')
		props.setBC('createregistry')
		props.setTabs({
			id: 'createRegistry',
			tabs: []
		})

	}, [location.prevURL, props])

	//useEventListener

	useEventListener('keypress', handleKeyPress)

	//Handlers

	const handleChange = (what) => e => {
		setRegistry({ ...registry, [what]: e.target.value })
	}
	const handleOrgChange = newOrg => {
		setStateOrg(newOrg)
		setRegistry({ ...registry, orgId: newOrg.aux.odeumId })
	}
	const createRegistryFunc = async () => {
		return await createRegistry(registry)
	}
	const handleCreate = async () => {
		let rs = await createRegistryFunc()
		if (rs) {
			s('snackbars.create.registry', { reg: registry.name })
			dispatch(await getRegistries(true, org.aux?.odeumId, accessLevel.apisuperuser ? true : false))
			history.push(`/registry/${rs}`)
		}
		else
			s('snackbars.failed')
	}

	return (
		<CreateRegistryForm
			org={stateOrg}
			handleOrgChange={handleOrgChange}
			registry={registry}
			handleChange={handleChange}
			handleCreate={handleCreate}
			goToRegistries={goToRegistries}
		/>
	)
}


export default CreateRegistry
