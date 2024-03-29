import React, { useState, useEffect, useCallback } from 'react'
import { GridContainer, ItemGrid, CircularLoader, Warning, Danger, TextF, ItemG } from 'components'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Fade, Collapse } from '@material-ui/core'
import { getOrgUsers, getSubOrgs } from 'variables/dataOrgs'
import { getOrgRegistries } from 'variables/dataRegistry'
import OrgDetails from './OrgCards/OrgDetails'
import { useSelector, useDispatch } from 'react-redux'
import { deleteOrg } from 'variables/dataOrgs'
import OrgUsers from 'views/Orgs/OrgCards/OrgUsers'
import OrgRegistries from 'views/Orgs/OrgCards/OrgRegistries'
// import OrgDevices from 'views/Orgs/OrgCards/OrgDevices'
import { finishedSaving, addToFav, isFav, removeFromFav } from 'redux/favorites'
// import { getAllDevices } from 'variables/dataDevices'
// import Toolbar from 'components/Toolbar/Toolbar';
import { Business, InputIcon, People } from 'variables/icons'
// import { getAllProjects } from 'variables/dataProjects'
// import { getAllCollections } from 'variables/dataCollections'
// import OrgProjects from './OrgCards/OrgProjects'

// import OrgCollections from './OrgCards/OrgCollections'
import { scrollToAnchor } from 'variables/functions'
import { getOrgLS } from 'redux/data'
import { useLocalization, useSnackbar, useMatch, useLocation, useHistory } from 'hooks'
import { red } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import OrgSubOrgs from 'views/Orgs/OrgCards/OrgSubOrgs'
import { AccountTree } from '@material-ui/icons'

const styles = makeStyles(theme => ({
	closeButton: {
		marginLeft: 'auto',
		color: red[500],
		"&:hover": {
			background: 'rgb(211,47,47, 0.2)'
		}
	},
}))

const Org = props => {
	//Hooks
	const match = useMatch()
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()
	const classes = styles()
	//Redux
	const language = useSelector(state => state.localization.language)
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const saved = useSelector(state => state.favorites.saved)
	const org = useSelector(state => state.data.org)
	const loading = useSelector(state => !state.data.gotOrg)
	//State
	// const [projects, setProjects] = useState([]) // added
	// const [collections, setCollections] = useState([]) // added
	const [users, setUsers] = useState([])
	const [subOrgs, setSubOrgs] = useState([]) // added
	const [registries, setRegistries] = useState([])
	// const [devices, setDevices] = useState([]) // added
	const [loadingUsers, setLoadingUsers] = useState(true)
	const [loadingRegistries, setLoadingRegistries] = useState(true)
	const [loadingSuborgs, setLoadingSubOrgs] = useState(true)
	// const [loadingDevices, setLoadingDevices] = useState(true) // added
	const [openDelete, setOpenDelete] = useState(false)
	// const [loadingCollections, setLoadingCollections] = useState(true) // added
	// const [loadingProjects, setLoadingProjects] = useState(true) // added
	const [error, setError] = useState(null)
	const [deleteInput, setDeleteInput] = useState('')

	//Const
	const { setHeader, setTabs, setBC } = props

	//useCallbacks

	const getData = useCallback(async () => {
		if (!org) {
			await dispatch(await getOrgLS(match.params.id))

		}
		if (org) {
			if (match.params.id !== org.uuid) {
				dispatch(await getOrgLS(match.params.id))

			}
		}
		await getOrgUsers(match.params.id).then(rs => {
			setUsers(rs)
			setLoadingUsers(false)
		})
		await getOrgRegistries(match.params.id).then(rs => {
			setRegistries(rs)
			setLoadingRegistries(false)
		})
		await getSubOrgs(match.params.id).then(rs => {
			setSubOrgs(rs)
			setLoadingSubOrgs(false)
		})
	}, [dispatch, match.params.id, org])

	//useEffects

	useEffect(() => {
		let gData = async () => await getData()
		gData()
	}, [getData])

	useEffect(() => {
		if (saved === true) {
			if (dispatch(isFav({ id: org.uuid, type: 'org' }))) {
				s('snackbars.favorite.saved', { name: org.name, type: t('favorites.types.org') })
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: org.uuid, type: 'org' }))) {
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
				{ id: 1, title: t('sidebar.orgs'), label: <AccountTree />, url: `#suborgs` },
				{ id: 2, title: t('tabs.users'), label: <People />, url: `#users` },
				{ id: 3, title: t('sidebar.registries'), label: <InputIcon />, url: '#registries' },
				// { id: 2, title: t('tabs.projects'), label: <LibraryBooks />, url: `#projects` },
				// { id: 3, title: t('tabs.collections'), label: <DataUsage />, url: `#collections` },
				// { id: 4, title: t('tabs.devices'), label: <DeviceHub />, url: `#devices` }
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
			id: org.uuid,
			name: org.name,
			type: 'org',
			path: match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		// const { org } = this.props
		let favObj = {
			id: org.uuid,
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
		if (deleteInput === org.name) {
			setDeleteInput('')
			setError(null)
			let hasUsers = await getOrgUsers(org.uuid).then(rs => {
				if (rs.length === 0) {
					return false
				}
				else return true
			})
			if (hasUsers) {
				setError('snackbars.orgs.stillHasUsers')
				snackBarMessages(3)
			}
			else {
				await deleteOrg(org.uuid).then(rs => {
					setOpenDelete(false)
					handleClose()
				})
			}
		}
		else {
			setError('dialogs.delete.warning.wrongText')
		}
	}

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}

	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}

	const handleDeleteInput = e => setDeleteInput(e.target.value)


	const renderDeleteDialog = () => {
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.org')}</DialogTitle>
			<DialogContent>
				<Collapse in={Boolean(error)}>
					<div style={{ padding: 16 }}>
						<Warning>
							<Danger>
								{t(error, { disableMissing: true })}
							</Danger>
						</Warning>
					</div>
				</Collapse>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.org', { org: org.name })}
				</DialogContentText>
				<DialogContentText component={'div'}>
					{t("dialogs.delete.warning.org", { type: 'markdown' })}
				</DialogContentText>
				<DialogContentText component={'div'}>
					{t("dialogs.delete.actions.org", { type: 'markdown', org: org.name })}
				</DialogContentText>
				<TextF
					fullWidth
					onChange={handleDeleteInput}
					value={deleteInput}
				/>
			</DialogContent>
			<DialogActions style={{ display: 'flex' }}>
				<ItemG xs={6}>
					<Button fullWidth onClick={handleCloseDeleteDialog}>
						{t('actions.cancel')}
					</Button>
				</ItemG>
				<ItemG xs={6}>
					<Button fullWidth onClick={handleDeleteOrg} className={classes.closeButton} >
						{t('actions.delete')}
					</Button>
				</ItemG>
			</DialogActions>
		</Dialog>
	}
	const snackBarMessages = (msg) => {
		switch (msg) {
			case 1:
				s('snackbars.orgDeleted')
				break
			case 3:
				s('snackbars.orgs.stillHasUsers')
				break
			default:
				break
		}
	}
	console.log(org)
	return (
		loading ? <CircularLoader /> : <Fade in={true}>
			<GridContainer justify={'center'} alignContent={'space-between'}>
				<ItemGrid xs={12} noMargin id={'details'}>
					<OrgDetails
						isFav={dispatch(isFav({ id: org.uuid, type: 'org' }))}
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
				<ItemGrid xs={12} noMargin id={'suborgs'}>
					{!loadingSuborgs ? <OrgSubOrgs
						t={t}
						org={org}
						subOrgs={subOrgs ? subOrgs : []}
						history={history}
					/> :
						<CircularLoader fill />}				</ItemGrid>
				<ItemGrid xs={12} noMargin id={'users'}>
					{!loadingUsers ? <OrgUsers
						t={t}
						org={org}
						users={users ? users : []}
						history={history}
					/> :
						<CircularLoader fill />}
				</ItemGrid>
				<ItemGrid xs={12} noMargin id={'registries'}>
					{!loadingRegistries ? <OrgRegistries
						org={org}
						registries={registries ? registries : []}
					/> : <CircularLoader fill/>}
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
