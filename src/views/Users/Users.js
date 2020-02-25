import React, { Fragment, useState } from 'react'
import { Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Fade, Tooltip } from '@material-ui/core'
import UserTable from 'components/User/UserTable'
import GridContainer from 'components/Grid/GridContainer'
import { deleteUser } from 'variables/dataUsers'
import { Add, Delete, Edit, Star, StarBorder, Mail, CloudDownload, People, Business } from 'variables/icons'
import { handleRequestSort, copyToClipboard } from 'variables/functions'
import TableToolbar from 'components/Table/TableToolbar'
import { Info } from 'components'
import { customFilterItems } from 'variables/Filters'
import ExportUsers from 'components/Exports/ExportUsers'
import { useLocalization, useHistory, useEffect, useSnackbar, useSelector, useDispatch } from 'hooks'
import usersStyles from 'assets/jss/components/users/usersStyles'
import { isFav, addToFav, removeFromFav } from 'redux/favorites'

const Users = props => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	const history = useHistory()
	const classes = usersStyles()
	const dispatch = useDispatch()
	//Redux
	const filters = useSelector(state => state.appState.filters.users)
	// const saved = useSelector(state => state.favorites.saved)

	//State
	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	const [orderBy, setOrderBy] = useState('')
	const [order, setOrder] = useState('')
	const [openDownload, setOpenDownload] = useState(false)

	//Const
	const { users, setHeader, setBC, reload, setTabs } = props

	const dUserGroup = [
		{ value: 136550100000143, label: t("users.groups.superUser") },
		{ value: 136550100000211, label: t("users.groups.accountManager") },
		{ value: 136550100000225, label: t("users.groups.user") },
	]

	const dSuspended = [
		{ value: 0, label: t('users.fields.active') },
		{ value: 1, label: t('users.fields.loginSuspended') },
	]

	const dHasLoggedIn = [
		{ value: true, label: t('filters.users.hasLoggedIn') },
		{ value: false, label: t('filters.users.neverLoggedIn') }
	]

	const dLang = [
		{ value: 'da', label: t('settings.languages.da') },
		{ value: 'en', label: t('settings.languages.en') }
	]

	const dNewsletter = [
		{ value: true, label: t('actions.yes') },
		{ value: false, label: t('actions.no') }
	]

	const ftUsers = [
		{ key: 'firstName', name: t('users.fields.firstName'), type: 'string' },
		{ key: 'lastName', name: t('users.fields.lastName'), type: 'string' },
		{ key: 'email', name: t('users.fields.email'), type: 'string' },
		{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
		{ key: 'groups', name: t('users.fields.group'), type: 'dropDown', options: dUserGroup },
		{ key: 'lastLoggedIn', name: t('users.fields.lastSignIn'), type: 'date' },
		{ key: 'suspended', name: t('users.fields.loginSuspended'), type: 'dropDown', options: dSuspended },
		{ key: 'lastLoggedIn', name: t('filters.users.hasLogged'), type: 'diff', options: { dropdown: dHasLoggedIn, values: { false: [null] } } },
		{ key: 'aux.odeum.language', name: t('users.fields.language'), type: 'dropDown', options: dLang },
		{ key: 'aux.senti.extendedProfile.newsletter', name: t('users.fields.newsletter'), type: 'diff', options: { dropdown: dNewsletter, values: { false: [false, null, undefined] } } },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]
	const snackBarMessages = (msg) => {
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break
			case 2:
				s('snackbars.exported')
				break
			default:
				break
		}
	}

	const options = () => {
		/**
		 * TODO
		 */
		let user = users[users.findIndex(d => d.uuid === selected[0])]
		let favObj
		let isFavorite = false
		if (user) {
			favObj = {
				id: user.uuid,
				name: `${user.firstName} ${user.lastName}`,
				type: 'user',
				path: `/management/user/${user.uuid}`
			}
			isFavorite = dispatch(isFav(favObj))
		}
		return [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit },
			{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => handleRemoveFromFav(favObj) : () => handleAddToFav(favObj) },
			{ label: t('menus.copyEmails'), icon: Mail, func: handleCopyEmailsSelected },
			{ label: t('menus.exportUsers'), icon: CloudDownload, func: handleOpenDownloadModal },
			// { label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete }
		]
	}
	const userHeader = [
		{ id: 'avatar', label: '' },
		{ id: 'firstName', label: t('users.fields.name') },
		{ id: 'phone', label: t('users.fields.phone') },
		{ id: 'email', label: t('users.fields.email') },
		{ id: 'org.name', label: t('users.fields.organisation') },
		{ id: 'group', label: t('users.fields.group') },
		{ id: 'lastLoggedIn', label: t('users.fields.lastSignIn') }
	]

	//Effects
	useEffect(() => {

		const tabs = [
			{ id: 0, title: t('users.tabs.users'), label: <People />, url: `/management/users` },
			{ id: 1, title: t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
			{ id: 2, title: t('sidebar.favorites'), label: <Star />, url: `/management/favorites` }
		]
		setBC('users')
		setHeader('users.pageTitle', false, '', 'users')
		setTabs({
			id: 'management',
			tabs: tabs,
			route: 0
		})

	}, [setHeader, setTabs, setBC, t])

	//Handlers

	const handleEdit = () => {
		history.push(`/management/user/${selected[0]}/edit`)
	}
	const handleAddToFav = (favObj) => {
		dispatch(addToFav(favObj))
	}
	const handleRemoveFromFav = (favObj) => {
		dispatch(removeFromFav(favObj))
	}
	const handleCopyEmailsSelected = () => {
		let fUsers = users.filter((el) => {
			return selected.some((f) => {
				return f === el.id
			})
		})
		let emails = fUsers.map(u => u.email).join(';')
		copyToClipboard(emails)
		s('snackbars.emailsCopied')
	}
	const handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const selectedIndex = selected.indexOf(id)
		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			)
		}
		setSelected(newSelected)
	}
	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected(handleFilterItems(users).map(n => n.uuid))
			return
		}
		setSelected([])
	}
	const handleDeleteUsers = async () => {
		await selected.forEach(async u => {
			let favObj = {
				id: u,
				type: 'user',
			}
			if (isFav(favObj)) {
				handleRemoveFromFav(favObj)
			}
			await deleteUser(u)
		})
		await reload(true)
		snackBarMessages(1)
		setSelected([])
		setOpenDelete(false)
	}

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}

	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}
	const handleOpenDownloadModal = () => {
		setOpenDownload(true)
	}
	const handleCloseDownloadModal = () => {
		setOpenDownload(false)
	}

	const handleFilterItems = (data) => {
		return customFilterItems(data, filters)
	}
	const handleReqSort = (event, property, way) => {
		let nOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			nOrder = 'asc'
		}
		handleRequestSort(property, nOrder, users)
		setOrder(nOrder)
		setOrderBy(property)

	}


	const handleAddNewUser = () => { history.push('/management/users/new') }

	//Renders
	const renderConfirmDelete = () => <Dialog
		keepMounted={false}
		open={openDelete}
		onClose={handleCloseDeleteDialog}
		aria-labelledby='alert-dialog-title'
		aria-describedby='alert-dialog-description'
	>
		<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.users')}</DialogTitle>
		<DialogContent>
			<DialogContentText id='alert-dialog-description'>
				{t('dialogs.delete.message.users')}
			</DialogContentText>
			<div>
				{openDelete ? selected.map(s => {
					let u = users[users.findIndex(d => d.id === s)]
					return <Info key={u.uuid}>&bull;{u.firstName + ' ' + u.lastName}</Info>
				})
					: null}
			</div>
		</DialogContent>
		<DialogActions>
			<Button onClick={handleCloseDeleteDialog} color='primary'>
				{t('actions.no')}
			</Button>
			<Button onClick={handleDeleteUsers} color='primary' autoFocus>
				{t('actions.yes')}
			</Button>
		</DialogActions>
	</Dialog>



	const renderExport = () => <ExportUsers
		data={selected.length > 0 ? users.filter((el) => {
			return selected.some((f) => {
				return f === el.id
			})
		}) : users}
		open={openDownload}
		handleClose={handleCloseDownloadModal}
		t={t}
	/>

	const renderUsers = () => <GridContainer justify={'center'}>
		<Fade in={true}>
			<Paper className={classes.root}>
				{renderConfirmDelete()}
				{renderExport()}
				<TableToolbar
					ft={ftUsers}
					reduxKey={'users'}
					numSelected={selected.length}
					options={options}
					t={t}
					content={renderTableToolBarContent()}
				/><UserTable
					data={handleFilterItems(users)}
					selected={selected}
					tableHead={userHeader}
					handleSelectAllClick={handleSelectAllClick}
					handleRequestSort={handleReqSort}
					handleDeleteUsers={handleDeleteUsers}
					handleCheckboxClick={handleCheckboxClick}
					order={order}
					orderBy={orderBy}
					filters={filters}
					t={t}
				/>
			</Paper>
		</Fade>
	</GridContainer>



	const renderTableToolBarContent = () => {
		return <Fragment>
			<Tooltip title={t('menus.create.user')}>
				<IconButton aria-label='Add new user' onClick={handleAddNewUser}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	return (
		<Fragment>

			{renderUsers()}
			{/* </Paper> */}
		</Fragment>
	)
}

export default Users