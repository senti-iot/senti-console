import React, { Component, Fragment } from 'react'
import { withStyles, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import UserTable from 'components/User/UserTable';
import GridContainer from 'components/Grid/GridContainer';
import { deleteUser } from 'variables/dataUsers';
import { People, Business, Add, Delete, Edit, Star, StarBorder, Mail, CloudDownload } from 'variables/icons';
import { handleRequestSort, copyToClipboard } from 'variables/functions';
import TableToolbar from 'components/Table/TableToolbar';
import { Info } from 'components';
import { customFilterItems } from 'variables/Filters';
import ExportUsers from 'components/Exports/ExportUsers';

class Users extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			openDelete: false,
			userHeader: [],
			anchorElMenu: null,
			route: 0,
			order: '',
			orderBy: '',
			openDownload: false
		}
		props.setHeader('users.pageTitle', false, '', 'users')
		props.setBC('users')
	}
	dUserGroup = () => {
		const { t } = this.props
		return [
			{ value: 136550100000143, label: t("users.groups.superUser") },
			{ value: 136550100000211, label: t("users.groups.accountManager") },
			{ value: 136550100000225, label: t("users.groups.user") },
		]
	}
	dSuspended = () => {
		const { t } = this.props
		return [
			{ value: 0, label: t('users.fields.active') },
			{ value: 1, label: t('users.fields.loginSuspended') },
		]
	}
	dHasLoggedIn = () => {
		const { t } = this.props
		return [
			{ value: true, label: t('filters.users.hasLoggedIn') },
			{ value: false, label: t('filters.users.neverLoggedIn') }
		]
	}
	dLang = () => {
		const { t } = this.props
		return [
			{ value: 'da', label: t('settings.languages.da') },
			{ value: 'en', label: t('settings.languages.en') }
		]
	}
	dNewsletter = () => {
		const { t } = this.props
		return [
			{ value: true, label: t('actions.yes') },
			{ value: false, label: t('actions.no') }
		]
	}
	ftUsers = () => {
		const { t } = this.props
		return [
			{ key: 'firstName', name: t('users.fields.firstName'), type: 'string' },
			{ key: 'lastName', name: t('users.fields.lastName'), type: 'string' },
			{ key: 'email', name: t('users.fields.email'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'groups', name: t('users.fields.group'), type: 'dropDown', options: this.dUserGroup() },
			{ key: 'lastLoggedIn', name: t('users.fields.lastSignIn'), type: 'date' },
			{ key: 'suspended', name: t('users.fields.loginSuspended'), type: 'dropDown', options: this.dSuspended() },
			{ key: 'lastLoggedIn', name: t('filters.users.hasLogged'), type: 'diff', options: { dropdown: this.dHasLoggedIn(), values: { false: [null] } } },
			{ key: 'aux.odeum.language', name: t('users.fields.language'), type: 'dropDown', options: this.dLang() },
			{ key: 'aux.senti.extendedProfile.newsletter', name: t('users.fields.newsletter'), type: 'diff', options: { dropdown: this.dNewsletter(), values: { false: [false, null, undefined] } } },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	handleEdit = () => {
		this.props.history.push(`/management/user/${this.state.selected[0]}/edit`)
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	handleCopyEmailsSelected = () => {
		const { selected } = this.state
		const { users } = this.props
		let fUsers = users.filter((el) => {
			return selected.some((f) => {
				return f === el.id
			});
		});
		let emails = fUsers.map(u => u.email).join(';')
		// this.setState({})
		copyToClipboard(emails)
		this.props.s('snackbars.emailsCopied')
		// this.setState({ anchorElMenu: null })

	}
	options = () => {
		const { t, isFav, users } = this.props
		const { selected } = this.state
		let user = users[users.findIndex(d => d.id === selected[0])]
		let favObj
		let isFavorite = false
		if (user) {
			favObj = {
				id: user.id,
				name: `${user.firstName} ${user.lastName}`,
				type: 'user',
				path: `/management/user/${user.id}`
			}
			isFavorite = isFav(favObj)
		}
		return [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.copyEmails'), icon: Mail, func: this.handleCopyEmailsSelected },
			{ label: t('menus.exportUsers'), icon: CloudDownload, func: this.handleOpenDownloadModal },
			// { label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete }
		]
	}
	userHeader = () => {
		const { t } = this.props
		return [
			{ id: 'avatar', label: '' },
			{ id: 'firstName', label: t('users.fields.name') },
			{ id: 'phone', label: t('users.fields.phone') },
			{ id: 'email', label: t('users.fields.email') },
			{ id: 'org.name', label: t('users.fields.organisation') },
			{ id: 'group', label: t('users.fields.group') },
			{ id: 'lastLoggedIn', label: t('users.fields.lastSignIn') }
		]
	}
	componentDidMount = async () => {
		this._isMounted = 1
		if (this.props.users.length > 0) {
			this.getData()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.users.length !== this.props.users.length) {
			if (this.state.selected.length > 0) {
				let newSelected = this.state.selected.filter(s => this.props.users.findIndex(u => u.id === s) !== -1 ? true : false)
				this.setState({ selected: newSelected })
			}
			this.getData()
		}
	}

	filterItems = (data) => {
		const rFilters = this.props.filters
		return customFilterItems(data, rFilters)
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		handleRequestSort(property, order, this.props.users)
		// this.props.sortData('users', property, order)
		this.setState({ order, orderBy: property })
	}

	getData = () => {
		this.handleRequestSort(null, 'firstName', 'asc')
	}

	tabs = [
		{ id: 0, title: this.props.t('users.tabs.users'), label: <People />, url: `/management/users` },
		{ id: 1, title: this.props.t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
	]
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break
			case 2:
				s('snackbars.exported')
				break
			default:
				break;
		}
	}
	reload = async () => {
		await this.props.reload()
	}
	deleteUsers = async () => {
		const { selected } = this.state
		await selected.forEach(async u => {
			await deleteUser(u)
		})
		await this.reload()
		this.snackBarMessages(1)
	}
	addNewUser = () => { this.props.history.push('/management/users/new') }

	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id)
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.filterItems(this.props.users).map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}
	handleDeleteUsers = async () => {
		await this.deleteUsers()
		this.setState({
			selected: [],
			anchorElMenu: null,
			openDelete: false
		})
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { users, t } = this.props
		return <Dialog
			keepMounted={false}
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
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
						return <Info key={s}>&bull;{u.firstName + ' ' + u.lastName}</Info>
					})
						: null}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteUsers} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	handleOpenDownloadModal = () => {
		this.setState({ openDownload: true })
	}
	handleCloseDownloadModal = () => { 
		this.setState({ openDownload: false })
	}
	renderExport = () => { 
		const { users, t } = this.props
		const { openDownload, selected } = this.state
		return <ExportUsers
			data={selected.length > 0 ?  users.filter((el) => {
				return selected.some((f) => {
					return f === el.id
				});
			}) : users}
			open={openDownload}
			handleClose={this.handleCloseDownloadModal}
			t={t}
		/>
	}
	renderUsers = () => {
		const { t, classes, users } = this.props
		const { selected, order, orderBy, filters, /* users */ } = this.state
		return <GridContainer justify={'center'}>
		 <Fade in={true}>
				<Paper className={classes.root}>
					{this.renderConfirmDelete()}
					{this.renderExport()}
					<TableToolbar
						ft={this.ftUsers()}
						reduxKey={'users'}
						// anchorElMenu={this.state.anchorElMenu}
						// handleToolbarMenuClose={this.handleToolbarMenuClose}
						// handleToolbarMenuOpen={this.handleToolbarMenuOpen}
						numSelected={selected.length}
						options={this.options}
						t={t}
						content={this.renderTableToolBarContent()}
					/><UserTable
						data={this.filterItems(users)}
						selected={selected}
						tableHead={this.userHeader()}
						handleSelectAllClick={this.handleSelectAllClick}
						handleRequestSort={this.handleRequestSort}
						handleDeleteUsers={this.handleDeleteUsers}
						handleCheckboxClick={this.handleCheckboxClick}
						order={order}
						orderBy={orderBy}
						filters={filters}
						t={t}
					/>
				</Paper>
			</Fade>
		</GridContainer>
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}
	renderTableToolBarContent = () => {
		const { accessLevel, t  } = this.props
		let access = accessLevel.apiorg ? accessLevel.apiorg.edit ? true : false : false
		return <Fragment>
			{access ? <Tooltip title={t('menus.create.user')}>
				<IconButton aria-label='Add new user' onClick={this.addNewUser}>
					<Add />
				</IconButton></Tooltip> : null
			}
		</Fragment>
	}
	render() {

		return (
			<Fragment>

				{this.renderUsers()}
				{/* </Paper> */}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Users)