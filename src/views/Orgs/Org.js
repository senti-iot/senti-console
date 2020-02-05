import React, { useState, useEffect } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components';
import { userStyles } from 'assets/jss/components/users/userStyles';
import { withStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Fade } from '@material-ui/core';
import { getOrgUsers } from 'variables/dataOrgs';
import OrgDetails from './OrgCards/OrgDetails';
import { useSelector, useDispatch } from 'react-redux'
import { deleteOrg } from 'variables/dataOrgs';
import OrgUsers from 'views/Orgs/OrgCards/OrgUsers';
import OrgDevices from 'views/Orgs/OrgCards/OrgDevices';
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites';
import { getAllDevices } from 'variables/dataDevices';
// import Toolbar from 'components/Toolbar/Toolbar';
import { Business, DeviceHub, People, LibraryBooks, DataUsage } from 'variables/icons';
import { getAllProjects } from 'variables/dataProjects';
import { getAllCollections } from 'variables/dataCollections';
import OrgProjects from './OrgCards/OrgProjects';
import OrgCollections from './OrgCards/OrgCollections';
import { scrollToAnchor } from 'variables/functions';
import { getOrgLS, /* setDevices, setProjects */ } from 'redux/data';
import { useLocalization, useSnackbar } from 'hooks';

// const mapStateToProps = (state) => ({
// 	language: state.localization.language,
// 	accessLevel: state.settings.user.privileges,
// 	saved: state.favorites.saved,
// 	org: state.data.org,
// 	loading: !state.data.gotOrg
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getOrg: async id => dispatch(await getOrgLS(id))
// })

const Org = props => {
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const language = useSelector(state => state.localization.language)
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const saved = useSelector(state => state.favorites.saved)
	const org = useSelector(state => state.data.org)
	const loading = useSelector(state => !state.data.gotOrg)

	const [projects, setProjects] = useState([]) // added
	const [collections, setCollections] = useState([]) // added
	const [users, setUsers] = useState([])
	const [devices, setDevices] = useState([]) // added
	const [loadingUsers, setLoadingUsers] = useState(true)
	const [loadingDevices, setLoadingDevices] = useState(true) // added
	const [openDelete, setOpenDelete] = useState(false)
	const [loadingCollections, setLoadingCollections] = useState(true) // added
	const [loadingProjects, setLoadingProjects] = useState(true) // added
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		users: [],
	// 		loadingUsers: true,
	// 		openDelete: false
	// 	}
	// }

	const tabs = () => {
		// const { t } = this.props
		return [
			{ id: 0, title: t('tabs.details'), label: <Business />, url: `#details` },
			{ id: 1, title: t('tabs.users'), label: <People />, url: `#users` },
			{ id: 2, title: t('tabs.projects'), label: <LibraryBooks />, url: `#projects` },
			{ id: 3, title: t('tabs.collections'), label: <DataUsage />, url: `#collections` },
			{ id: 4, title: t('tabs.devices'), label: <DeviceHub />, url: `#devices` }
		]
	}

	const asyncFunc = async () => {
		const { location } = props
		if (props.match.params.id) {
			dispatch(await getOrgLS(props.match.params.id)).then(() => {

				let prevURL = location.prevURL ? location.prevURL : '/management/orgs'
				props.setHeader('orgs.organisation', true, prevURL, 'users')
				props.setTabs({
					id: 'org',
					tabs: tabs(),
					route: 0
				})

				props.setBC('org', org.name)
				if (props.location.hash !== '') {
					scrollToAnchor(props.location.hash)
				}

			})
			await getOrgUsers(props.match.params.id).then(rs => {
				setUsers(rs)
				setLoadingUsers(false)
				// this.setState({ users: rs, loadingUsers: false })
			})
			await getAllDevices().then(rs => {
				let newDevices = rs.filter(f => f.org.id === org.id)
				setDevices(newDevices)
				setLoadingDevices(false)
				// this.setState({ devices: devices, loadingDevices: false })
			})
			await getAllCollections().then(rs => {
				let newCollections = rs.filter(f => f.org.id === org.id)
				setCollections(newCollections)
				setLoadingCollections(false)
				// this.setState({ collections: collections, loadingCollections: false })
			})
			await getAllProjects().then(rs => {
				let newProjects = rs.filter(f => f.org.id === org.id)
				setProjects(newProjects)
				setLoadingProjects(false)
				// this.setState({ projects: projects, loadingProjects: false })
			})
		}
	}

	useEffect(() => {
		asyncFunc()

		if (saved === true) {
			// const { org } = this.props
			if (dispatch(isFav({ id: org.id, type: 'org' }))) {
				s('snackbars.favorite.saved', { name: org.name, type: t('favorites.types.org') })
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: org.id, type: 'org' }))) {
				s('snackbars.favorite.removed', { name: org.name, type: t('favorites.types.org') })
				dispatch(finishedSaving())
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saved, props.match.params.id])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (prevProps.match.params.id !== this.props.match.params.id) {
	// 		this.componentDidMount()
	// 	}
	// 	if (this.props.saved === true) {
	// 		const { org } = this.props
	// 		if (this.props.isFav({ id: org.id, type: 'org' })) {
	// 			this.props.s('snackbars.favorite.saved', { name: org.name, type: this.props.t('favorites.types.org') })
	// 			this.props.finishedSaving()
	// 		}
	// 		if (!this.props.isFav({ id: org.id, type: 'org' })) {
	// 			this.props.s('snackbars.favorite.removed', { name: org.name, type: this.props.t('favorites.types.org') })
	// 			this.props.finishedSaving()
	// 		}
	// 	}
	// }

	// componentDidMount = async () => {
	// 	const { match, setHeader, location, setBC, setTabs, getOrg } = this.props
	// 	if (match)
	// 		if (match.params.id) {
	// 			await getOrg(match.params.id).then(() => {

	// 				let prevURL = location.prevURL ? location.prevURL : '/management/orgs'
	// 				setHeader('orgs.organisation', true, prevURL, 'users')
	// 				setTabs({
	// 					id: 'org',
	// 					tabs: this.tabs(),
	// 					route: 0
	// 				})

	// 				setBC('org', this.props.org.name)
	// 				if (this.props.location.hash !== '')
	// 				{
	// 					scrollToAnchor(this.props.location.hash)
	// 				}

	// 			})
	// 			await getOrgUsers(this.props.match.params.id).then(rs => {
	// 				this.setState({ users: rs, loadingUsers: false })
	// 			})
	// 			await getAllDevices().then(rs => {
	// 				let devices = rs.filter(f => f.org.id === this.props.org.id)
	// 				this.setState({ devices: devices, loadingDevices: false })
	// 			})
	// 			await getAllCollections().then(rs => {
	// 				let collections = rs.filter(f => f.org.id === this.props.org.id)
	// 				this.setState({ collections: collections, loadingCollections: false })
	// 			})
	// 			await getAllProjects().then(rs => {
	// 				let projects = rs.filter(f => f.org.id === this.props.org.id)
	// 				this.setState({ projects: projects, loadingProjects: false })
	// 			})
	// 		}
	// }
	const addToFavorites = () => {
		// const { org } = this.props
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: props.match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		// const { org } = this.props
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: props.match.url
		}
		dispatch(removeFromFav(favObj))
	}
	const close = () => {
		snackBarMessages(1)
		props.history.push('/management/orgs')
	}
	const handleDeleteOrg = async () => {
		await deleteOrg(org.id).then(rs => {
			setOpenDelete(false)
			// this.setState({
			// 	openDelete: false
			// })
			close()
		})
	}

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
		// this.setState({ openDelete: true })
	}

	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
		// this.setState({ openDelete: false })
	}


	const renderDeleteDialog = () => {
		// const { openDelete } = this.state
		// const { t } = this.props
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.org')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.org', { org: org.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={handleDeleteOrg} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	const snackBarMessages = (msg) => {
		// const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.orgDeleted')
				break
			default:
				break
		}
	}

	const { classes, history, match } = props
	// const { loadingUsers, loadingDevices, loadingProjects, loadingCollections, users, devices, collections, projects } = this.state
	return (
		loading ? <CircularLoader /> : <Fade in={true}>
			<GridContainer justify={'center'} alignContent={'space-between'}>
				<ItemGrid xs={12} noMargin id={'details'}>
					<OrgDetails
						isFav={dispatch(isFav({ id: org.id, type: 'org' }))}
						addToFav={addToFavorites}
						removeFromFav={removeFromFavorites}
						deleteOrg={handleOpenDeleteDialog}
						match={match}
						history={history}
						classes={classes}
						t={t}
						org={org}
						language={language}
						accessLevel={accessLevel}
						devices={devices ? devices.length : 0}
					/>
				</ItemGrid>
				<ItemGrid xs={12} noMargin id={'users'}>
					{!loadingUsers ? <OrgUsers
						t={t}
						org={org}
						users={users ? users : []}
						history={history}
					/> :
						<CircularLoader fill />}
				</ItemGrid>
				<ItemGrid xs={12} noMargin id={'projects'}>
					{!loadingProjects ? <OrgProjects
						t={t}
						org={org}
						projects={projects ? projects : []}
						history={history} />
						:
						<CircularLoader fill />
					}
				</ItemGrid>
				<ItemGrid xs={12} noMargin id={'collections'}>
					{!loadingCollections ? <OrgCollections
						t={t}
						org={org}
						collections={collections ? collections : []}
						history={history} />
						:
						<CircularLoader fill />
					}
				</ItemGrid>
				<ItemGrid xs={12} noMargin id={'devices'}>
					{!loadingDevices ? <OrgDevices
						t={t}
						org={org}
						devices={devices ? devices : []}
						history={history} />
						:
						<CircularLoader fill />
					}
				</ItemGrid>
				{renderDeleteDialog()}
			</GridContainer>
		</Fade>
	)
}

export default withStyles(userStyles)(Org)
