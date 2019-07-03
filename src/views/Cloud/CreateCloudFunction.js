import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createFunction } from 'variables/dataFunctions';
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm';
import { getFunctions } from 'redux/data';

class CreateCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			cloudfunction: {
				name: "",
				js: `(args) => {
	return args;
}`,
				type: 0,
				description: "",
			},
			org: props.org
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
		props.setHeader('menus.create.cloudfunction', true, prevURL, '')
		props.setBC('createcloudfunction')
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
	handleCodeChange = what => value => {
		this.setState({
			cloudfunction: {
				...this.state.cloudfunction,
				[what]: value
			}
		})
	}
	handleOrgChange = org => {
		this.setState({ org })
	}
	handleChange = (what) => e => {
		this.setState({
			cloudfunction: {
				...this.state.cloudfunction,
				[what]: e.target.value
			}
		})
	}
	createFunction = async () => { 

		let res = await createFunction({ ...this.state.cloudfunction, orgId: this.state.org.id })
		await this.props.getFunctions(true, this.props.orgId, this.props.accessLevel.apisuperuser ? true : false)
		return res
	}
	handleCreate = async () => {
		const { s, history, orgId, accessLevel } = this.props
		let rs = await this.createFunction()
		if (rs) {
			const { cloudfunction } = this.state
			// s('snackbars.collectionCreated')
			s('snackbars.create.cloudfunction', { cf: cloudfunction.name })
			this.props.getFunctions(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/function/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	goToRegistries = () => this.props.history.push('/functions')
	render() {
		const { t } = this.props
		const { cloudfunction, org } = this.state
		return (
		
			<CreateFunctionForm
				cloudfunction={cloudfunction}
				org={org}
				handleChange={this.handleChange}
				handleCreate={this.handleCreate}
				handleCodeChange={this.handleCodeChange}
				handleOrgChange={this.handleOrgChange}
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
	org: state.settings.user.org,
	orgId: state.settings.user.org
})

const mapDispatchToProps = dispatch => ({
	getFunctions: async (reload, customerID, ua) => dispatch(await getFunctions(reload, customerID, ua)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
