import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFunctionLS, getFunctions } from 'redux/data';
import { updateFunction } from 'variables/dataFunctions';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm';
import { useSnackbar, useLocation, useParams, useEventListener, useHistory } from 'hooks';


const EditCloudFunction = props => {

	//Hooks
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const location = useLocation()
	const params = useParams()
	const history = useHistory()

	//Redux
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const orgId = useSelector(state => state.settings.user.org.id)
	const orgs = useSelector(state => state.data.orgs)
	const cloudfunction = useSelector(state => state.data.cloudfunction)

	//State
	const [loading, setLoading] = useState(true)
	const [stateCloudfunction, setStateCloudfunction] = useState(null)
	const [org, setOrg] = useState({ name: '' })

	//Const
	const { setHeader, setBC, setTabs } = props

	//useCallbacks
	const getData = useCallback(async () => {
		dispatch(await getFunctionLS(params.id))
	}, [dispatch, params.id])

	const goToRegistries = useCallback(() => history.push('/functions'), [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToRegistries()
		}
	}, [goToRegistries])

	//useEventListeners
	useEventListener('keydown', handleKeyPress)

	//useEffects
	useEffect(() => {
		const gData = async () => await getData()
		gData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (cloudfunction) {
			setStateCloudfunction(cloudfunction)
			setOrg(orgs[orgs.findIndex(o => o.id === cloudfunction.orgId)])
			setLoading(false)
			let prevURL = location.prevURL ? location.prevURL : `/function/${cloudfunction.id}`
			setHeader('menus.edits.cloudfunction', true, prevURL, 'manage.cloudfunctions')
			setBC('editcloudfunction', cloudfunction.name, cloudfunction.id)
			setTabs({
				id: "editCF",
				tabs: []
			})
		}

	}, [cloudfunction, location.prevURL, orgs, setBC, setHeader, setTabs])

	//Handlers

	const handleOrgChange = org => {
		setOrg(org)
		setStateCloudfunction({ ...stateCloudfunction, orgId: org.id })

	}
	const handleCodeChange = what => value => {
		setStateCloudfunction({ ...stateCloudfunction, [what]: value })

	}
	const handleChange = (what) => e => {
		setStateCloudfunction({ ...stateCloudfunction, [what]: e.target.value })

	}
	const updateFunctionFunc = async () => {
		return await updateFunction(stateCloudfunction)
	}
	const handleUpdate = async () => {
		let rs = await updateFunctionFunc()
		if (rs) {
			let favObj = {
				id: stateCloudfunction.id,
				name: stateCloudfunction.name,
				type: 'cloudfunction',
				path: `/function/${stateCloudfunction.id}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.cloudfunction', { cf: stateCloudfunction.name })
			dispatch(await getFunctions(true, orgId, accessLevel.apisuperuser ? true : false))
			history.push(`/function/${cloudfunction.id}`)
		}
		else
			s('snackbars.failed')
	}


	return (loading ? <CircularLoader /> :

		<CreateFunctionForm
			cloudfunction={stateCloudfunction}
			org={org}
			handleChange={handleChange}
			handleCreate={handleUpdate}
			handleCodeChange={handleCodeChange}
			handleOrgChange={handleOrgChange}
			goToRegistries={goToRegistries}
		/>
	)
}

export default EditCloudFunction
