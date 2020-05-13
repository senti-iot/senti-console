import React, { useState, useEffect, useCallback } from 'react'
import { GridContainer, ItemGrid, CircularLoader } from 'components'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Fade } from '@material-ui/core'
import { getOrgUsers } from 'variables/dataOrgs'
import OrgDetails from './OrgCards/OrgDetails'
import { useSelector, useDispatch } from 'react-redux'
import { deleteOrg } from 'variables/dataOrgs'
import OrgUsers from 'views/Orgs/OrgCards/OrgUsers'
// import OrgDevices from 'views/Orgs/OrgCards/OrgDevices'
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites'
// import { getAllDevices } from 'variables/dataDevices'
// import Toolbar from 'components/Toolbar/Toolbar';
import { Business, DeviceHub, People, LibraryBooks, DataUsage } from 'variables/icons'
// import { getAllProjects } from 'variables/dataProjects'
// import { getAllCollections } from 'variables/dataCollections'
// import OrgProjects from './OrgCards/OrgProjects'
// import OrgCollections from './OrgCards/OrgCollections'
import { scrollToAnchor } from 'variables/functions'
import { getOrgLS } from 'redux/data'
import { useLocalization, useSnackbar, useMatch, useLocation, useHistory } from 'hooks'


const Org = props => {
	//Hooks
	const match = useMatch()
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	//Redux
	const language = useSelector(state => state.localization.language)
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const saved = useSelector(state => state.favorites.saved)
	const org = useSelector(state => state.data.org)
	const loading = useSelector(state => !state.data.gotOrg)
	console.log('Org', org)
	//State
	// const [projects, setProjects] = useState([]) // added
	// const [collections, setCollections] = useState([]) // added
	const [users, setUsers] = useState([])
	// const [devices, setDevices] = useState([]) // added
	const [loadingUsers, setLoadingUsers] = useState(true)
	// const [loadingDevices, setLoadingDevices] = useState(true) // added
	const [openDelete, setOpenDelete] = useState(false)
	// const [loadingCollections, setLoadingCollections] = useState(true) // added
	// const [loadingProjects, setLoadingProjects] = useState(true) // added

	//Const
	const { setHeader, setTabs, setBC } = props

	//useCallbacks

	const getData = useCallback(async () => {

		if (match.params.id && !org) {
			dispatch(await getOrgLS(match.params.id))

		}
		if (org) {
			await getOrgUsers(match.params.id).then(rs => {
				setUsers(rs)
				setLoadingUsers(false)
			})
			// await getAllDevices().then(rs => {
			// 	let newDevices = rs.filter(f => f.org.id === org.id)
			// 	setDevices(newDevices)
			// 	setLoadingDevices(false)
			// })
			// await getAllCollections().then(rs => {
			// 	let newCollections = rs.filter(f => f.org.id === org.id)
			// 	setCollections(newCollections)
			// 	setLoadingCollections(false)
			// })
			// await getAllProjects().then(rs => {
			// 	let newProjects = rs.filter(f => f.org.id === org.id)
			// 	setProjects(newProjects)
			// 	setLoadingProjects(false)
			// })
		}
	}, [dispatch, match.params.id, org])

	//useEffects

	useEffect(() => {
		let gData = async () => await getData()
		gData()
	}, [getData])

	useEffect(() => {
		if (saved === true) {
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
	}, [saved])

	useEffect(() => {
		if (org) {
			const tabs = [
				{ id: 0, title: t('tabs.details'), label: <Business />, url: `#details` },
				{ id: 1, title: t('tabs.users'), label: <People />, url: `#users` },
				{ id: 2, title: t('tabs.projects'), label: <LibraryBooks />, url: `#projects` },
				{ id: 3, title: t('tabs.collections'), label: <DataUsage />, url: `#collections` },
				{ id: 4, title: t('tabs.devices'), label: <DeviceHub />, url: `#devices` }
			]

			let prevURL = location.prevURL ? location.prevURL : '/management/orgs'
			setHeader('orgs.organisation', true, prevURL, 'orgs')
			setTabs({
				id: 'org',
				tabs: tabs,
				route: 0
			})

			setBC('org', org.name)
			if (location.hash !== '') {
				scrollToAnchor(location.hash)
			}

		}

	}, [location, org, setBC, setHeader, setTabs, t])

	//Handlers

	const addToFavorites = () => {
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		// const { org } = this.props
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: match.url
		}
		dispatch(removeFromFav(favObj))
	}
	const handleClose = () => {
		snackBarMessages(1)
		history.push('/management/orgs')
	}
	const handleDeleteOrg = async () => {
		await deleteOrg(org.id).then(rs => {
			setOpenDelete(false)
			handleClose()
		})
	}

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}

	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}


	const renderDeleteDialog = () => {
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
		switch (msg) {
			case 1:
				s('snackbars.orgDeleted')
				break
			default:
				break
		}
	}

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
						t={t}
						org={org}
						language={language}
						accessLevel={accessLevel}
					// devices={devices ? devices.length : 0}
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
				{/* <ItemGrid xs={12} noMargin id={'projects'}>
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
				</ItemGrid> */}
				{renderDeleteDialog()}
			</GridContainer>
		</Fade>
	)
}

export default Org
