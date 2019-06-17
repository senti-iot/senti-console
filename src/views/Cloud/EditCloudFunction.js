import React, { Component } from 'react'
import { connect } from 'react-redux'
// import EditCloudFunctionForm from 'components/Collections/EditCloudFunctionForm';
import { getFunctionLS, getFunctions } from 'redux/data';
import { updateFunction } from 'variables/dataFunctions';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import CreateFunctionForm from 'components/Cloud/CreateFunctionForm';

class EditCloudFunction extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			cloudfunction: null
		}
		this.id = props.match.params.id
		let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
		props.setHeader('menus.edits.cloudfunction', true, prevURL, '')
		props.setBC('updatecloudfunction')
	}

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToRegistries()
		}
	}
	getData = async () => {
		const { getFunction } = this.props
		await getFunction(this.id)
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { location, setHeader, cloudfunction } = this.props
		if ((!prevProps.cloudfunction && cloudfunction !== prevProps.cloudfunction && cloudfunction) || (this.state.cloudfunction === null && cloudfunction)) {
			this.setState({
				cloudfunction: cloudfunction,
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/function/${this.id}`
			setHeader('menus.edits.cloudfunction', true, prevURL, 'manage.cloudfunctions')
			this.props.setBC('editcloudfunction', cloudfunction.name, cloudfunction.id)
		}
	}
	componentDidMount = async () => {
		this.getData()
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
	updateFunction = async () => {
		return await updateFunction(this.state.cloudfunction)
	}
	handleUpdate = async () => {
		const { s, history, orgId, accessLevel } = this.props
		let rs = await this.updateFunction()
		if (rs) {
			const { isFav, updateFav } = this.props
			const { cloudfunction } = this.state
			let favObj = {
				id: cloudfunction.id,
				name: cloudfunction.name,
				type: 'function',
				path: `/function/${cloudfunction.id}`
			}
			if (isFav(favObj)) {
				updateFav(favObj)
			}
			s('snackbars.edit.cloudfunction', { cf: cloudfunction.name })
			this.props.getFunctions(true, orgId, accessLevel.apisuperuser ? true : false)
			history.push(`/function/${this.id}`)
		}
		else
			s('snackbars.failed')
	}
	goToRegistries = () => this.props.history.push('/functions')
	render() {
		const { t } = this.props
		const { loading, cloudfunction } = this.state
		return ( loading ? <CircularLoader/> :

			<CreateFunctionForm
				cloudfunction={cloudfunction}
				handleChange={this.handleChange}
				handleCreate={this.handleUpdate}
				handleCodeChange={this.handleCodeChange}
				goToRegistries={this.goToRegistries}
				t={t}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	orgId: state.settings.user.org.id,
	cloudfunction: state.data.cloudfunction
})

const mapDispatchToProps = dispatch => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getFunction: async id => dispatch(await getFunctionLS(id)),
	getFunctions: async (reload, orgId, ua) => dispatch(await getFunctions(reload, orgId, ua))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCloudFunction)
