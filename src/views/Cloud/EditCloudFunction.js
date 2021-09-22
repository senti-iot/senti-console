import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFunctionLS, getFunctions, getOrgs } from 'redux/data'
import { updateFunction } from 'variables/dataFunctions'
import { updateFav, isFav } from 'redux/favorites'
import { CircularLoader } from 'components'
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm'
import { useSnackbar, useLocation, useParams, useEventListener, useHistory } from 'hooks'


const EditCloudFunction = props => {

	//Hooks
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const location = useLocation()
	const params = useParams()
	const history = useHistory()

	//Redux
	const orgs = useSelector(state => state.data.orgs)
	const cloudfunction = useSelector(state => state.data.cloudfunction)

	//State
	const [loading, setLoading] = useState(true)
	const [stateCloudfunction, setStateCloudfunction] = useState({
		name: "",
		description: "",
		js: "",
		type: 0
	})
	const [org, setOrg] = useState({ name: '' })

	//Const
	const { setHeader, setBC, setTabs } = props

	//useCallbacks
	const getData = useCallback(async () => {
		await dispatch(await getOrgs(true))
		await dispatch(await getFunctionLS(params.id))
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
		if (cloudfunction && !stateCloudfunction.uuid && orgs.length > 0) {
			setStateCloudfunction(cloudfunction)
			setOrg(cloudfunction.org)
			setLoading(false)

		}

	}, [cloudfunction, getData, orgs, stateCloudfunction.uuid])

	useEffect(() => {
		if (cloudfunction) {

			let prevURL = location.prevURL ? location.prevURL : `/function/${cloudfunction.uuid}`
			setHeader('menus.edits.cloudfunction', true, prevURL, 'manage.cloudfunctions')
			setBC('editcloudfunction', cloudfunction.name, cloudfunction.uuid)
			setTabs({
				id: "editCF",
				tabs: []
			})
		}
	}, [cloudfunction, location.prevURL, setBC, setHeader, setTabs])
	//Handlers

	const handleOrgChange = org => {
		setOrg(org)
		setStateCloudfunction({ ...stateCloudfunction, org: org })

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
				id: stateCloudfunction.uuid,
				name: stateCloudfunction.name,
				type: 'cloudfunction',
				path: `/function/${stateCloudfunction.uuid}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.cloudfunction', { cf: stateCloudfunction.name })
			dispatch(await getFunctions(true))
			history.push(`/function/${cloudfunction.uuid}`)
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
