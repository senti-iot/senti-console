import React, { Component } from 'react'
import { connect } from 'react-redux'
// import UpdateRegistryForm from 'components/Collections/UpdateRegistryForm';
import { getRegistryLS, getRegistries } from 'redux/data';
import { updateRegistry } from 'variables/dataRegistry';
import UpdateRegistryForm from 'components/Registry/CreateRegistryForm';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';

class UpdateRegistry extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			registry: null,
			org: null
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
		props.setHeader('menus.edits.registry', true, prevURL, 'manage.registries')
		props.setBC('updateregistry')
		props.setTabs({
			id: 'editRegistry',
			tabs: []
		})
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToRegistries()
		}
	}
	getData = async () => {
		const { getRegistry } = this.props
		await getRegistry(this.id)
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { location, setHeader, setBC, registry } = this.props
		if ((!prevProps.registry && registry !== prevProps.registry && registry) || (this.state.registry === null && registry)) {
			let orgs = this.props.orgs
			this.setState({
				registry: registry,
				org: orgs[orgs.findIndex(o => o.id === registry.orgId)],
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/registry/${this.id}`
			setHeader('menus.edits.registry', true, prevURL, 'manage.registries')
			setBC('editregistry', registry.name, registry.id)
		}
	}
	componentDidMount = async () => {
		this.getData()
		window.addEventListener('keydown', this.keyHandler, false)

	}
	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyHandler, false)
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
	handleChange = (what) => e => {
		this.setState({
			registry: {
				...this.state.registry,
				[what]: e.target.value
			}
		})
	}
	updateRegistry = async () => {
		return await updateRegistry(this.state.registry)
	}
	handleUpdate = async () => {
		const { s, history, orgId, accessLevel } = this.props
		let rs = await this.updateRegistry()
		if (rs) {
			const { isFav, updateFav } = this.props
			const { registry } = this.state
			let favObj = {
				id: registry.id,
				name: registry.name,
				type: 'registry',
				path: `/registry/${registry.id}`
			}
			if (isFav(favObj)) {
				updateFav(favObj)
			}
			s('snackbars.edit.registry', { reg: registry.name })
			this.props.getRegistries(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/registry/${this.id}`)
		}
		else
			s('snackbars.failed')
	}
	goToRegistries = () => this.props.history.push('/registries')
	render() {
		const { t } = this.props
		const { loading, registry, org } = this.state
		return (loading ? <CircularLoader /> :

			<UpdateRegistryForm
				org={org}
				handleOrgChange={this.handleOrgChange}
				registry={registry}
				onChange={this.handleChange}
				handleCreate={this.handleUpdate}
				goToRegistries={this.goToRegistries}
				t={t}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	orgs: state.data.orgs,
	registry: state.data.registry
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getRegistry: async id => dispatch(await getRegistryLS(1, id)),
	getRegistries: async (reload, orgId, ua) => dispatch(await getRegistries(reload, orgId, ua))
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateRegistry)
