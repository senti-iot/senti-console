import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getCollection, updateCollection } from 'variables/dataCollections';
import EditCollectionForm from 'components/Collections/EditCollectionForm';
import { CircularLoader } from 'components';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { getAllOrgs } from 'variables/dataOrgs';
import { isFav, updateFav } from 'redux/favorites';


class EditCollection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collection: null,
			loading: true,
			openOrg: false,
		}
		this.id = props.match.params.id
		// props.setHeader('', true, `/collections/list`, 'collections')
	}
	postUpdate = async () => {
		let success = await updateCollection(this.state.collection)
		if (success) { 

			return true
		}
		else
			return false
	}
	getData = async () => {
		const { location, setHeader, t } = this.props
		let collection = await getCollection(this.id)
		let orgs = await getAllOrgs()
		if (collection) {
			this.setState({
				collection: collection,
				orgs: [{ id: 0, name: t('users.fields.noOrg') }, ...orgs],
				loading: false
			})
			let prevURL = location.prevURL ? location.prevURL : `/collection/${this.id}`
			setHeader('collections.editCollection', true, prevURL, 'collections')
		}
		else {
			this.setState({
				collection: null,
				loading: false
			})
		}
	}
	componentDidMount = () => {
		this.getData()

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
	handleUpdate = async () => {
		const { s, history } = this.props
		let rs = await this.postUpdate()
		if (rs) {
			s('snackbars.collectionUpdated')
			const { isFav, updateFav } = this.props
			const { collection } = this.state
			let favObj = {
				id: collection.id,
				name: collection.name,
				type: 'collection',
				path: `/collection/${collection.id}`
			}
			if (isFav(favObj)) {
				updateFav(favObj)
			}
			history.push(`/collection/${this.id}`)
		}
		else
			s('snackbars.failed')
	}
	render() {
		const { t } = this.props
		const { collection, loading, openOrg, orgs } = this.state
		return (
			loading ? <CircularLoader /> :
				collection ? <EditCollectionForm
					collection={collection}
					handleChange={this.handleChange}
					open={openOrg}
					orgs={orgs}
					handleCloseOrg={this.handleCloseOrg}
					handleOpenOrg={this.handleOpenOrg}
					handleChangeOrg={this.handleChangeOrg}
					handleUpdate={this.handleUpdate}
					t={t}
				/> : <Redirect to={'/404'} />
		)
	}
}

EditCollection.propTypes = {
	match: PropTypes.object.isRequired,
	accessLevel: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCollection)
