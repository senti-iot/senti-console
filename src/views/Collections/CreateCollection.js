import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createCollection, getEmptyCollection } from 'variables/dataCollections';
import { connect } from 'react-redux'
import { getAllOrgs } from 'variables/dataOrgs';
import CreateCollectionForm from 'components/Collections/CreateCollectionForm';
import { CircularLoader } from 'components';


class CreateCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collection: null,
			loading: true,
			openOrg: false,
		}
		this.id = props.match.params.id
		// props.setHeader('', true, `/collections/list`, "collections")
	}
	createDC = async () => {
		let success = await createCollection(this.state.collection)
		// console.log(success);
		if (success)
			return true
		else
			return false
	}
	getAvailableDevices = async () => {
		const { t } = this.props
		let orgs = await getAllOrgs()
		this.setState({
			orgs: [{ id: 0, name: t("users.fields.noOrg") }, ...orgs],
			// loading: false
		})
	}
	getEmptyCollection = async () => {
		console.log("Entered")
		let emptyDC = await getEmptyCollection()
		console.log(emptyDC)
		this.setState({
			loading: false,
			collection: emptyDC
		})
	}
	componentDidMount = async () => {
		await this.getEmptyCollection()
		this.getAvailableDevices()
	}
	handleOpenOrg = () => {
		this.setState({
			openOrg: true
		})
	}
	handleCloseOrg = () => {
		this.setState({
			openOrg: false
		})
	}
	handleChangeOrg = (o) => e => {
		this.setState({
			collection: {
				...this.state.collection,
				org: o
			},
			openOrg: false
		})
	}
	handleChange = (what) => e => {
		// if (e)
		// 	e.preventDefault()
		this.setState({
			collection: {
				...this.state.collection,
				[what]: e.target.value
			}
		})
	}
	handleCreate = async () => {
		// console.log(this.props.s)
		const { s, t, history } = this.props
		let rs = await this.createDC()
		if (rs) {
			s(t("snackbars.collectionUpdated"))
			history.push(`/collection/${this.id}`)
		}
		else
			s(t("snackbars.failed"))
	}
	render() {
		const { t } = this.props
		const { loading, collection, openOrg, orgs } = this.state
		return (
			loading ? <CircularLoader /> : 
				<CreateCollectionForm
					collection={collection}
					handleChange={this.handleChange}
					open={openOrg}
					orgs={orgs}
					handleCloseOrg={this.handleCloseOrg}
					handleOpenOrg={this.handleOpenOrg}
					handleChangeOrg={this.handleChangeOrg}
					handleUpdate={this.handleUpdate}
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
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection)
