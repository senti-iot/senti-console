import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { updateCollection } from 'variables/dataCollections';
import EditCollectionForm from 'components/Collections/EditCollectionForm';
import { CircularLoader } from 'components';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { isFav, updateFav } from 'redux/favorites';
import { Fade } from '@material-ui/core';
import { getCollectionLS, getCollections, /* setOrgs */ } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	collection: state.data.collection,
// 	loading: !state.data.gotCollection,
// 	orgs: state.data.orgs
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	updateFav: (favObj) => dispatch(updateFav(favObj)),
// 	getCollection: async id => dispatch(await getCollectionLS(id)),
// 	getCollections: reload => dispatch(getCollections(reload)),
// 	getOrgs: () => dispatch(setOrgs())
// })

// @Andrei
const EditCollection = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const collection = useSelector(state => state.data.collection)
	const loading = useSelector(state => !state.data.gotCollection)
	const orgs = useSelector(state => state.data.orgs)

	const [stateCollection, setStateCollection] = useState(null)
	const [/* stateLoading */, setStateLoading] = useState(true)
	const [openOrg, setOpenOrg] = useState(false)
	const [/* stateOrgs */, setStateOrgs] = useState(null) // added
	const id = props.match.params.id
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		collection: null,
	// 		loading: true,
	// 		openOrg: false,
	// 	}
	// 	this.id = props.match.params.id
	// }
	const postUpdate = async () => {
		let success = await updateCollection(stateCollection)
		if (success) {

			return true
		}
		else
			return false
	}
	const getData = async () => {
		// const { getCollection } = this.props
		dispatch(await getCollectionLS(id))
		// await getCollection(this.id)
	}
	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToCollection()
		}
	}


	useEffect(() => {
		const { location } = props

		setStateCollection(collection)
		setStateOrgs([{ id: 0, name: t('users.fields.noOrg') }, ...orgs])
		setStateLoading(false)
		// this.setState({
		// 	collection: collection,
		// 	orgs: [{ id: 0, name: t('users.fields.noOrg') }, ...orgs],
		// 	loading: false
		// })
		let prevURL = location.prevURL ? location.prevURL : `/collection/${id}`
		props.setHeader('collections.editCollection', true, prevURL, 'collections')
		props.setBC('editcollection', collection.name, collection.id)
		props.setTabs({
			id: 'createCollection',
			tabs: []
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collection, stateCollection])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	const { location, setHeader, t, orgs, collection } = this.props
	// 	if ((!prevProps.collection && collection !== prevProps.collection && collection) || (this.state.collection === null && collection)) {
	// 		this.setState({
	// 			collection: collection,
	// 			orgs: [{ id: 0, name: t('users.fields.noOrg') }, ...orgs],
	// 			loading: false
	// 		})
	// 		let prevURL = location.prevURL ? location.prevURL : `/collection/${this.id}`
	// 		setHeader('collections.editCollection', true, prevURL, 'collections')
	// 		this.props.setBC('editcollection', collection.name, collection.id)
	// 		this.props.setTabs({
	// 			id: 'createCollection',
	// 			tabs: []
	// 		})
	// 	}
	// }

	useEffect(() => {
		getData()
		window.addEventListener('keydown', keyHandler, false)

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = () => {
	// 	this.getData()
	// 	window.addEventListener('keydown', this.keyHandler, false)

	// }
	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)

	// }

	const handleOpenOrg = () => {
		setOpenOrg(true)
		// this.setState({
		// 	openOrg: true
		// })
	}
	const handleCloseOrg = () => {
		setOpenOrg(false)
		// this.setState({
		// 	openOrg: false
		// })
	}
	const handleChangeOrg = (o) => e => {
		setStateCollection({ ...stateCollection, org: o })
		setOpenOrg(false)
		// this.setState({
		// 	collection: {
		// 		...this.state.collection,
		// 		org: o
		// 	},
		// 	openOrg: false
		// })
	}
	const handleChange = (what) => e => {
		setStateCollection({ ...stateCollection, [what]: e.target.value })
		// this.setState({
		// 	collection: {
		// 		...this.state.collection,
		// 		[what]: e.target.value
		// 	}
		// })
	}

	const goToCollection = () => {
		const { history, location } = props

		history.push(location.prevURL ? location.prevURL : `/collection/${id}`)
	}

	const handleUpdate = async () => {
		const { history } = props
		let rs = await postUpdate()
		if (rs) {
			s('snackbars.collectionUpdated')
			// const { isFav, updateFav } = this.props
			// const { collection } = this.state
			let favObj = {
				id: stateCollection.id,
				name: stateCollection.name,
				type: 'collection',
				path: `/collection/${stateCollection.id}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			dispatch(getCollections(true))
			// this.props.getCollections(true)
			dispatch(await getCollectionLS(id))
			// this.props.getCollection(this.id)
			history.push(`/collection/${id}`)
		}
		else
			s('snackbars.failed')
	}

	// const { t } = this.props
	// const { collection, loading, openOrg, orgs } = this.state
	return (
		loading ? <CircularLoader /> :
			collection ? <Fade in={true}>
				<EditCollectionForm
					collection={collection}
					handleChange={handleChange}
					open={openOrg}
					orgs={orgs}
					handleCloseOrg={handleCloseOrg}
					goToCollection={goToCollection}
					handleOpenOrg={handleOpenOrg}
					handleChangeOrg={handleChangeOrg}
					handleUpdate={handleUpdate}
					t={t} />
			</Fade>
				: <Redirect to={{
					pathname: '/404',
					prevURL: window.location.pathname
				}} />
	)
}

EditCollection.propTypes = {
	match: PropTypes.object.isRequired,
	accessLevel: PropTypes.object.isRequired,
}

export default EditCollection
