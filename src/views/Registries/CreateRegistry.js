import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { createRegistry } from 'variables/dataRegistry';
import CreateRegistryForm from 'components/Registry/CreateRegistryForm';

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
				customer_id: 1
			}
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
		props.setHeader('registries.createRegistry', true, prevURL, '')
		props.setBC('createregistry')
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
	createRegistry = async () => { 
		return await createRegistry(this.state.registry)
	}
	handleCreate = async () => {
		const { s, history } = this.props
		let rs = await this.createRegistry()
		if (rs) {
			s('snackbars.collectionCreated')
			history.push(`/registry/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	goToRegistries = () => this.props.history.push('/registries')
	render() {
		const { t } = this.props
		const { registry } = this.state
		return (
		
			<CreateRegistryForm
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
	orgId: state.settings.user.org.id
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
