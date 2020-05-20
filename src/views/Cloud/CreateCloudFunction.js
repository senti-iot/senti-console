import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFunction } from 'variables/dataFunctions'
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm'
import { getFunctions } from 'redux/data'
import { useSnackbar, useLocation, useEventListener, useHistory } from 'hooks'


const CreateCloudFunction = props => {

	//Hooks
	const s = useSnackbar().s
	const location = useLocation()
	const dispatch = useDispatch()
	const history = useHistory()

	//Redux
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const org = useSelector(state => state.settings.user.org)
	const orgId = useSelector(state => state.settings.user.org)
	console.log('Org', org)
	//State
	const [cloudfunction, setCloudfunction] = useState({
		name: '',
		js: `(args) => {
	return args;
}`,
		type: 0,
		description: ''
	})
	const [stateOrg, setStateOrg] = useState(org)

	//Const

	//useCallbacks
	const goToRegistries = useCallback(() => history.push('/functions'), [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToRegistries()
		}
	}, [goToRegistries])

	//useEventListener
	useEventListener('keydown', handleKeyPress)

	//useEffects
	useEffect(() => {
		let prevURL = location.prevURL ? location.prevURL : '/functions/list'
		props.setHeader('menus.create.cloudfunction', true, prevURL, 'manage.cloudfunctions')
		props.setBC('createcloudfunction')
		props.setTabs({
			id: 'createCF',
			tabs: []
		})

	})
	//Handlers

	const handleCodeChange = what => value => {
		setCloudfunction({ ...cloudfunction, [what]: value })
	}
	const handleOrgChange = org => {
		setStateOrg(org)
	}
	const handleChange = (what) => e => {
		setCloudfunction({ ...cloudfunction, [what]: e.target.value })
	}
	const createFunctionFunc = async () => {

		let res = await createFunction({ ...cloudfunction, orgId: stateOrg.id })
		dispatch(await getFunctions(true, orgId, accessLevel.apisuperuser ? true : false))
		return res
	}
	const handleCreate = async () => {
		let rs = await createFunctionFunc()
		if (rs) {
			s('snackbars.create.cloudfunction', { cf: cloudfunction.name })
			dispatch(await getFunctions(true, orgId, accessLevel.apisuperuser ? true : false))
			history.push(`/function/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	return (

		<CreateFunctionForm
			cloudfunction={cloudfunction}
			org={stateOrg}
			handleChange={handleChange}
			handleCreate={handleCreate}
			handleCodeChange={handleCodeChange}
			handleOrgChange={handleOrgChange}
			goToRegistries={goToRegistries}
		/>
	)
}


export default CreateCloudFunction
