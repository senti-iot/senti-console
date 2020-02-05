import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
// import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { createRegistry } from 'variables/dataRegistry';
import CreateRegistryForm from 'components/Registry/CreateRegistryForm';
import { getRegistries } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	orgId: state.settings.user.org.id,
// 	org: state.settings.user.org,
// })

// const mapDispatchToProps = dispatch => ({
// 	getRegistries: async (reload, orgId, ua) => dispatch(await getRegistries(reload, orgId, ua))
// })

// @Andrei
const CreateCollection = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const orgId = useSelector(state => state.settings.user.org.id)
	const org = useSelector(state => state.settings.user.org)

	// const [loading, setLoading] = useState(true)
	const [registry, setRegistry] = useState({
		name: "",
		region: "Europe",
		protocol: 0,
		ca_certificate: 0,
		orgId
	})
	const [stateOrg, setStateOrg] = useState(org)
	// let id = props.match.params.id
	let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
	props.setHeader('menus.create.registry', true, prevURL, 'manage.registries')
	props.setBC('createregistry')
	props.setTabs({
		id: 'createRegistry',
		tabs: []
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		registry: {
	// 			name: "",
	// 			region: "Europe",
	// 			protocol: 0,
	// 			ca_certificate: 0,
	// 			orgId: props.orgId
	// 		},
	// 		org: props.org
	// 	}
	// this.id = props.match.params.id
	// let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
	// props.setHeader('menus.create.registry', true, prevURL, 'manage.registries')
	// props.setBC('createregistry')
	// props.setTabs({
	// 	id: 'createRegistry',
	// 	tabs: []
	// })
	// }

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

	const handleChange = (what) => e => {
		setRegistry({ ...registry, [what]: e.target.value })
		// this.setState({
		// 	registry: {
		// 		...this.state.registry,
		// 		[what]: e.target.value
		// 	}
		// })
	}
	const handleOrgChange = newOrg => {
		setStateOrg(newOrg)
		setRegistry({ ...registry, orgId: newOrg.id })
		// this.setState({
		// 	org,
		// 	registry: {
		// 		...this.state.registry,
		// 		orgId: org.id
		// 	}
		// })
	}
	const createRegistryFunc = async () => {
		return await createRegistry(registry)
	}
	const handleCreate = async () => {
		const { history } = props
		let rs = await createRegistryFunc()
		if (rs) {
			s('snackbars.create.registry', { reg: registry.name })
			dispatch(await getRegistries(true, orgId, accessLevel.apisuperuser ? true : false))
			// this.props.getRegistries(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/registry/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	const goToRegistries = () => props.history.push('/registries')

	// const { t } = this.props
	// const { registry, org } = this.state
	return (
		<CreateRegistryForm
			org={stateOrg}
			handleOrgChange={handleOrgChange}
			registry={registry}
			handleChange={handleChange}
			handleCreate={handleCreate}
			goToRegistries={goToRegistries}
			t={t}
		/>
	)
}

CreateCollection.propTypes = {
	match: PropTypes.object.isRequired,
	accessLevel: PropTypes.object.isRequired,
}

export default CreateCollection
