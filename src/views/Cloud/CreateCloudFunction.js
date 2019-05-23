import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createFunction } from 'variables/dataFunctions';
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm';

class CreateCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			cloudfunction: {
				name: "",
				js: `(data) => {
	return data;
}`,
				type: 0,
				description: ""
			}
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
	handleChange = (what) => e => {
		this.setState({
			cloudfunction: {
				...this.state.cloudfunction,
				[what]: e.target.value
			}
		})
	}
	createFunction = async () => { 
		return await createFunction(this.state.cloudfunction)
	}
	handleCreate = async () => {
		const { s, history } = this.props
		let rs = await this.createFunction()
		if (rs) {
			s('snackbars.collectionCreated')
			history.push(`/cloudfunction/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	goToRegistries = () => this.props.history.push('/functions')
	render() {
		const { t } = this.props
		const { cloudfunction } = this.state
		return (
		
			<CreateFunctionForm
				cloudfunction={cloudfunction}
				handleChange={this.handleChange}
				handleCreate={this.handleCreate}
				handleCodeChange={this.handleCodeChange}
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