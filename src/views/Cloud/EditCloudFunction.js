import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import EditCloudFunctionForm from 'components/Collections/EditCloudFunctionForm';
import { getFunctionLS, getFunctions } from 'redux/data';
import { updateFunction } from 'variables/dataFunctions';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm';
import { useSnackbar, useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	orgId: state.settings.user.org.id,
// 	orgs: state.data.orgs,
// 	cloudfunction: state.data.cloudfunction
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	updateFav: (favObj) => dispatch(updateFav(favObj)),
// 	getFunction: async id => dispatch(await getFunctionLS(id)),
// 	getFunctions: async (reload, orgId, ua) => dispatch(await getFunctions(reload, orgId, ua))
// })

const EditCloudFunction = props => {
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const orgId = useSelector(state => state.settings.user.org.id)
	const orgs = useSelector(state => state.data.orgs)
	const cloudfunction = useSelector(state => state.data.cloudfunction)

	const [loading, setLoading] = useState(true)
	const [stateCloudfunction, setStateCloudfunction] = useState(null)
	const [org, setOrg] = useState({ name: '' })

	let id = props.match.params.id
	let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
	props.setHeader('menus.edits.cloudfunction', true, prevURL, 'manage.cloudfunctions')
	props.setBC('updatecloudfunction')
	props.setTabs({
		id: "editCF",
		tabs: []
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		cloudfunction: null,
	// 		org: {
	// 			name: ''
	// 		}
	// 	}
	// 	this.id = props.match.params.id
	// 	let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
	// 	props.setHeader('menus.edits.cloudfunction', true, prevURL, 'manage.cloudfunctions')
	// 	props.setBC('updatecloudfunction')
	// 	props.setTabs({
	// 		id: "editCF",
	// 		tabs: []
	// 	})
	// }

	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToRegistries()
		}
	}
	const getData = async () => {
		// const { getFunction } = this.props
		dispatch(await getFunctionLS(id))
	}
	useEffect(() => {
		const { location, setHeader, setBC } = props

		setStateCloudfunction(cloudfunction)
		setOrg(orgs[orgs.findIndex(o => o.id === cloudfunction.orgId)])
		setLoading(false)
		// this.setState({
		// 	cloudfunction: cloudfunction,
		// 	org: orgs[orgs.findIndex(o => o.id === cloudfunction.orgId)],
		// 	loading: false
		// })
		let prevURL = location.prevURL ? location.prevURL : `/function/${this.id}`
		setHeader('menus.edits.cloudfunction', true, prevURL, 'manage.cloudfunctions')
		setBC('editcloudfunction', cloudfunction.name, cloudfunction.id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cloudfunction, stateCloudfunction])

	// componentDidUpdate = (prevProps, prevState) => {
	// 	const { location, setHeader, setBC, cloudfunction } = this.props
	// 	if (((!prevProps.cloudfunction
	// 		&& cloudfunction !== prevProps.cloudfunction
	// 		&& cloudfunction)
	// 		|| (this.state.cloudfunction === null && cloudfunction))
	// 		&& this.props.orgs.length > 0) {
	// 		let orgs = this.props.orgs
	// 		this.setState({
	// 			cloudfunction: cloudfunction,
	// 			org: orgs[orgs.findIndex(o => o.id === cloudfunction.orgId)],
	// 			loading: false
	// 		})
	// 		let prevURL = location.prevURL ? location.prevURL : `/function/${this.id}`
	// 		setHeader('menus.edits.cloudfunction', true, prevURL, 'manage.cloudfunctions')
	// 		setBC('editcloudfunction', cloudfunction.name, cloudfunction.id)
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
	const handleOrgChange = org => {
		setOrg(org)
		setStateCloudfunction({ ...stateCloudfunction, orgId: org.id })
		// this.setState({
		// 	org: org,
		// 	cloudfunction: {
		// 		...this.state.cloudfunction,
		// 		orgId: org.id
		// 	}
		// })
	}
	const handleCodeChange = what => value => {
		setStateCloudfunction({ ...stateCloudfunction, [what]: value })
		// this.setState({
		// 	cloudfunction: {
		// 		...this.state.cloudfunction,
		// 		[what]: value
		// 	}
		// })
	}
	const handleChange = (what) => e => {
		setStateCloudfunction({ ...stateCloudfunction, [what]: e.target.value })
		// this.setState({
		// 	cloudfunction: {
		// 		...this.state.cloudfunction,
		// 		[what]: e.target.value
		// 	}
		// })
	}
	const updateFunctionFunc = async () => {
		return await updateFunction(stateCloudfunction)
	}
	const handleUpdate = async () => {
		const { history } = props
		// const { s, history, orgId, accessLevel } = this.props
		let rs = await updateFunctionFunc()
		if (rs) {
			// const { isFav, updateFav } = this.props
			// const { cloudfunction } = this.state
			let favObj = {
				id: stateCloudfunction.id,
				name: stateCloudfunction.name,
				type: 'function',
				path: `/function/${stateCloudfunction.id}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.cloudfunction', { cf: stateCloudfunction.name })
			dispatch(await getFunctions(true, orgId, accessLevel.apisuperuser ? true : false))
			// this.props.getFunctions(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/function/${id}`)
		}
		else
			s('snackbars.failed')
	}
	const goToRegistries = () => props.history.push('/functions')

	// const { t } = this.props
	// const { loading, cloudfunction, org } = this.state
	return (loading ? <CircularLoader /> :

		<CreateFunctionForm
			cloudfunction={stateCloudfunction}
			org={org}
			handleChange={handleChange}
			handleCreate={handleUpdate}
			handleCodeChange={handleCodeChange}
			handleOrgChange={handleOrgChange}
			goToRegistries={goToRegistries}
			t={t}
		/>
	)
}

export default EditCloudFunction
