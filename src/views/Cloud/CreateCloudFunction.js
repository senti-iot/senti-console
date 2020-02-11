import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFunction } from 'variables/dataFunctions';
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm';
import { getFunctions } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	org: state.settings.user.org,
// 	orgId: state.settings.user.org
// })

// const mapDispatchToProps = dispatch => ({
// 	getFunctions: async (reload, customerID, ua) => dispatch(await getFunctions(reload, customerID, ua)),
// })

//@Andrei

const CreateCloudFunction = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const org = useSelector(state => state.settings.user.org)
	const orgId = useSelector(state => state.settings.user.org)

	// const [loading, setLoading] = useState(true)
	const [cloudfunction, setCloudfunction] = useState({
		name: '',
		js: `(args) => {
			return args;
		}`,
		type: 0,
		description: ''
	})

	// const id = props.match.params.id
	let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
	props.setHeader('menus.create.cloudfunction', true, prevURL, 'manage.cloudfunctions')
	props.setBC('createcloudfunction')
	props.setTabs({
		id: 'createCF',
		tabs: []
	})

	const [stateOrg, setStateOrg] = useState(org)
	// 	constructor(props) {
	// 		super(props)

	// 		this.state = {
	// 			loading: true,
	// 			cloudfunction: {
	// 				name: "",
	// 				js: `(args) => {
	// 	return args;
	// }`,
	// 				type: 0,
	// 				description: "",
	// 			},
	// 			org: props.org
	// 		}
	// 		this.id = props.match.params.id
	// 		let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
	// 		props.setHeader('menus.create.cloudfunction', true, prevURL, 'manage.cloudfunctions')
	// 		props.setBC('createcloudfunction')
	// 		props.setTabs({
	// 			id: 'createCF',
	// 			tabs: []
	// 		})
	// 	}

	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToRegistries()
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', keyHandler, false)

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	window.addEventListener('keydown', this.keyHandler, false)
	// }
	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)
	// }
	const handleCodeChange = what => value => {
		setCloudfunction({ ...cloudfunction, [what]: value })
		// this.setState({
		// 	cloudfunction: {
		// 		...this.state.cloudfunction,
		// 		[what]: value
		// 	}
		// })
	}
	const handleOrgChange = org => {
		setStateOrg(org)
		// this.setState({ org })
	}
	const handleChange = (what) => e => {
		setCloudfunction({ ...cloudfunction, [what]: e.target.value })
		// this.setState({
		// 	cloudfunction: {
		// 		...this.state.cloudfunction,
		// 		[what]: e.target.value
		// 	}
		// })
	}
	const createFunctionFunc = async () => {

		let res = await createFunction({ ...cloudfunction, orgId: stateOrg.id })
		dispatch(await getFunctions(true, orgId, accessLevel.apisuperuser ? true : false))
		// await this.props.getFunctions(true, this.props.orgId, this.props.accessLevel.apisuperuser ? true : false)
		return res
	}
	const handleCreate = async () => {
		const { history } = props
		let rs = await createFunctionFunc()
		if (rs) {
			// const { cloudfunction } = this.state
			// s('snackbars.collectionCreated')
			s('snackbars.create.cloudfunction', { cf: cloudfunction.name })
			dispatch(await getFunctions(true, orgId, accessLevel.apisuperuser ? true : false))
			// this.props.getFunctions(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/function/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	const goToRegistries = () => props.history.push('/functions')

	// const { t } = this.props
	// const { cloudfunction, org } = this.state
	return (

		<CreateFunctionForm
			cloudfunction={cloudfunction}
			org={org}
			handleChange={handleChange}
			handleCreate={handleCreate}
			handleCodeChange={handleCodeChange}
			handleOrgChange={handleOrgChange}
			goToRegistries={goToRegistries}
			t={t}
		/>
	)
}


export default CreateCloudFunction
