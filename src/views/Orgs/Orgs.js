import React, { Fragment, useEffect, useState } from 'react'
import { Paper, Button, DialogActions, ListItemText, ListItem, List, DialogContentText, DialogContent, DialogTitle, Dialog, ListItemIcon, IconButton, Fade, Tooltip } from '@material-ui/core'
import GridContainer from 'components/Grid/GridContainer'
import OrgTable from 'components/Orgs/OrgTable'
import { /* PictureAsPdf, */ Delete, Edit, Star, StarBorder, Add, People, Business } from 'variables/icons'
import { deleteOrg } from 'variables/dataOrgs'
import TableToolbar from 'components/Table/TableToolbar'
import { customFilterItems } from 'variables/Filters'
import { useLocalization, useDispatch, useHistory, useSelector, useSnackbar, useAuth } from 'hooks'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites'
import orgsStyles from 'assets/jss/components/orgs/orgsStyles'

const Orgs = props => {
	//Hooks
	const hasAccess = useAuth().hasAccess
	const hasAccessList = useAuth().hasAccessList
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const history = useHistory()
	const classes = orgsStyles()
	//Redux
	const filters = useSelector(state => state.appState.filters.orgs)
	const saved = useSelector(state => state.favorites.saved)

	//State
	const [selected, setSelected] = useState([])
	const [openDelete, setOpenDelete] = useState(false)
	// const [loading, setLoading] = useState(true)
	// const [route, setRoute] = useState(1)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('name')
	// const [filters, setFilters] = useState({ keyword: '' })

	//Const
	const { orgs, setHeader, setBC, setTabs } = props

	const dHasOrgParent = [
		{ value: true, label: t("filters.orgs.hasParentOrg") },
		{ value: false, label: t("filters.orgs.noParentOrg") }
	]

	const ftOrgs = [
		{ key: 'name', name: t('orgs.fields.name'), type: 'string' },
		{ key: 'address', name: t('orgs.fields.address'), type: 'string' },
		{ key: 'city', name: t('orgs.fields.city'), type: 'string' },
		{ key: 'zip', name: t('orgs.fields.zip'), type: 'string' },
		{ key: 'org.name', name: t('orgs.fields.parentOrg'), type: 'string' },
		{ key: 'org.uuid', name: t('filters.orgs.parentOrg'), type: 'diff', options: { dropdown: dHasOrgParent, values: { false: [-1] } } },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]


	//UseEffect


	useEffect(() => {

		const tabs = [
			{ id: 0, title: t('users.tabs.users'), label: <People />, url: `/management/users` },
			{ id: 1, title: t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
			{ id: 2, title: t('sidebar.favorites'), label: <Star />, url: `/management/favorites` }
		]
		setHeader('orgs.pageTitle', false, '', 'users')
		setBC('orgs')

		setTabs({
			id: 'management',
			tabs: tabs,
			route: 1
		})

	}, [setHeader, setTabs, setBC, t])

	useEffect(() => {
		if (saved === true) {
			let org = orgs[orgs.findIndex(d => d.uuid === selected[0])]
			if (org) {
				if (dispatch(isFav({ id: org.uuid, type: 'org' }))) {
					s('snackbars.favorite.saved', { name: org.name, type: t('favorites.types.org') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: org.uuid, type: 'org' }))) {
					s('snackbars.favorite.removed', { name: org.name, type: t('favorites.types.org') })
					dispatch(finishedSaving())
				}
			}
		}

	}, [saved, selected, dispatch, orgs, s, t])

	//Handlers
	const handleAddToFav = (favObj) => {
		dispatch(addToFav(favObj))
	}
	const handleRemoveFromFav = (favObj) => {
		dispatch(removeFromFav(favObj))
	}
	const options = () => {
		let org = orgs[orgs.findIndex(d => d.uuid === selected[0])]
		let favObj
		let isFavorite = false
		if (org) {
			favObj = {
				id: org.uuid,
				name: org.name,
				type: 'org',
				path: `/management/org/${org.uuid}`
			}
			isFavorite = dispatch(isFav(favObj))
		}

		let allOptions = [
			{ label: t('menus.edit'), func: handleEdit, single: true, icon: Edit, dontShow: !hasAccess(selected[0], 'org.edit') },
			{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => handleRemoveFromFav(favObj) : () => handleAddToFav(favObj) },
			// { label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: handleOpenDeleteDialog, icon: Delete, dontShow: !hasAccessList(selected, "org.delete") }
		]
		return allOptions
		// if (accessLevel.apiorg.edit)
		// 	return allOptions
		// else return [
		// 	{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
		// 	{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf }
		// ]
	}

	const handleCheckboxClick = (event, id) => {
		console.log(event)
		console.log(id)
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
	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}
	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}

	const handleEdit = () => {
		history.push(`/management/org/${selected[0]}/edit`)
	}

	const handleDeleteOrgs = async () => {
		await selected.forEach(async u => {
			await deleteOrg(u)
		})
		await props.reload()
		snackBarMessages(1)
		setSelected([])
		setOpenDelete(false)
	}
	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected([filterItems(orgs).map(n => n.uuid)])
			return
		}
		setSelected([])
	}

	const orgsHeader = [
		{ id: 'name', label: t('orgs.fields.name') },
		{ id: 'address', label: t('orgs.fields.address') },
		{ id: 'city', label: t('orgs.fields.city') },
		{ id: 'url', label: t('orgs.fields.url') },
	]

	const handleRequestSort = (event, property, way) => {
		let nOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			nOrder = 'asc'
		}
		handleRequestSort(property, nOrder, orgs)
		setOrder(nOrder)
		setOrderBy(property)
	}
	const filterItems = (data) => {
		return customFilterItems(data, filters)
	}



	const handleAddNewOrg = () => { history.push('/management/orgs/new') }

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

	const renderConfirmDelete = () => {
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.orgs')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.orgs')}:
				</DialogContentText>
				<List>
					{selected.map(s => {
						let org = orgs[orgs.findIndex(o => o.uuid === s)]
						return org ? <ListItem divider key={s.uuid}>
							<ListItemIcon><Business /></ListItemIcon>
							<ListItemText primary={org.name} /></ListItem>
							: s
					}
					)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleDeleteOrgs} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	const renderTableToolBarContent = () => {
		// let access = accessLevel.apiorg ? accessLevel.apiorg.edit ? true : false : false
		let access = hasAccess(null, 'org.create')
		return <Fragment>
			{access ? <Tooltip title={t('menus.create.org')}>
				<IconButton aria-label='Add new organisation' onClick={handleAddNewOrg}>
					<Add />
				</IconButton>
			</Tooltip>
				: null
			}
		</Fragment>
	}

	const renderOrgs = () => {
		return <GridContainer justify={'center'}>
			<Fade in={true}>
				<Paper className={classes.root}>
					{renderConfirmDelete()}
					<TableToolbar
						ft={ftOrgs}
						reduxKey={'orgs'}
						numSelected={selected.length}
						options={options}
						t={t}
						content={renderTableToolBarContent()}
					/>
					<OrgTable
						data={filterItems(orgs)}
						tableHead={orgsHeader}
						handleRequestSort={handleRequestSort}
						handleDeleteOrgs={handleDeleteOrgs}
						handleCheckboxClick={handleCheckboxClick}
						handleSelectAllClick={handleSelectAllClick}
						orderBy={orderBy}
						selected={selected}
						order={order}
						t={t}
					/></Paper>
			</Fade>

		</GridContainer>
	}
	return (
		<Fragment>
			{renderOrgs()}
		</Fragment>
	)

}

export default Orgs