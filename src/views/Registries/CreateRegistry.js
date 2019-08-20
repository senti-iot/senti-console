import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { createRegistry } from 'variables/dataRegistry';
import CreateRegistryForm from 'components/Registry/CreateRegistryForm';
import { getRegistries } from 'redux/data';

class CreateCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			registry: {
				name: "",
				region: "Europe",
				protocol: 0,
				ca_certificate: 0,
				orgId: props.orgId
			},
			org: props.org
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
		props.setHeader('menus.create.registry', true, prevURL, 'manage.registries')
		props.setBC('createregistry')
		props.setTabs({
			id: 'createRegistry',
			tabs: []
		})
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToRegistries()
		}
	}
	componentDidMount = async () => {
		window.addEventListener('keydown', this.keyHandler, false)
	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)
	}

	handleChange = (what) => e => {
		this.setState({
			registry: {
				...this.state.registry,
				[what]: e.target.value
			}
		})
	}
	handleOrgChange = org => {
		this.setState({
			org,
			registry: {
				...this.state.registry,
				orgId: org.id
			}
		})
	}
	createRegistry = async () => {
		return await createRegistry(this.state.registry)
	}
	handleCreate = async () => {
		const { s, history, orgId, accessLevel } = this.props
		let rs = await this.createRegistry()
		if (rs) {
			s('snackbars.create.registry', { reg: this.state.registry.name })
			this.props.getRegistries(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/registry/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	goToRegistries = () => this.props.history.push('/registries')
	render() {
		const { t } = this.props
		const { registry, org } = this.state
		return (

			<CreateRegistryForm
				org={org}
				handleOrgChange={this.handleOrgChange}
				registry={registry}
				handleChange={this.handleChange}
				handleCreate={this.handleCreate}
				goToRegistries={this.goToRegistries}
				t={t}
			/>
		)
	}
}

CreateCollection.propTypes = {
	match: PropTypes.object.isRequired,
	accessLevel: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	org: state.settings.user.org,
})

const mapDispatchToProps = dispatch => ({
	getRegistries: async (reload, orgId, ua) => dispatch(await getRegistries(reload, orgId, ua))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
