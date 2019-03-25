import React, { Component, Fragment } from 'react'
import { withStyles, Paper, Button, DialogActions, ListItemText, ListItem, List, DialogContentText, DialogContent, DialogTitle, Dialog, ListItemIcon, IconButton, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import OrgTable from 'components/Orgs/OrgTable';
import { People, Business, PictureAsPdf, Delete, Edit, Star, StarBorder, Add } from 'variables/icons';
import { handleRequestSort } from 'variables/functions'
import { deleteOrg } from 'variables/dataOrgs';
import TableToolbar from 'components/Table/TableToolbar';
import { customFilterItems } from 'variables/Filters';

class Orgs extends Component {
	constructor(props) {
		super(props)

		this.state = {
			orgs: [],
			selected: [],
			openDelete: false,
			loading: true,
			route: 1,
			order: 'desc',
			orderBy: 'name',
			filters: {
				keyword: '',
			}
		}
		props.setHeader('orgs.pageTitle', false, '', 'users')
		props.setBC('orgs')
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.props.reload()
	}
	options = () => {
		const { t, accessLevel, isFav, orgs } = this.props
		const { selected } = this.state
		let org = orgs[orgs.findIndex(d => d.id === selected[0])]
		let favObj
		let isFavorite = false
		if (org) {
			favObj = {
			   id: org.id,
			   name: org.name,
			   type: 'org',
			   path: `/management/org/${org.id}`
		   }
			isFavorite = isFav(favObj)
		}

		let allOptions = [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete }
		]
		if (accessLevel.apiorg.edit)
			return allOptions
		else return [
			{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf }
		]
	}
	dHasOrgParent = () => {
		const { t } = this.props
		return [
			{ value: true, label: t("filters.orgs.hasParentOrg") },
			{ value: false, label: t("filters.orgs.noParentOrg") }
		]
	 }
	ftOrgs = () => {
		const { t } = this.props
		return [
			{ key: 'name', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'address', name: t('orgs.fields.address'), type: 'string' },
			{ key: 'city', name: t('orgs.fields.city'), type: 'string' },
			{ key: 'zip', name: t('orgs.fields.zip'), type: 'string' },
			{ key: 'org.name', name: t('orgs.fields.parentOrg'), type: 'string' },
			{ key: 'org.id', name: t('filters.orgs.parentOrg'), type: 'diff', options: { dropdown: this.dHasOrgParent(), values: { false: [-1] } } },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
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
	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleEdit = () => {
		this.props.history.push(`/management/org/${this.state.selected[0]}/edit`)
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleDeleteOrg = async () => {
		await this.handleDeleteOrgs()
		this.setState({
			selected: [],
			anchorElMenu: null,
			openDelete: false
		})
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.filterItems(this.props.orgs).map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}

	orgsHeader = () => {
		const { t } = this.props
		return [
			{ id: 'name', label: t('orgs.fields.name') },
			{ id: 'address', label: t('orgs.fields.address') },
			{ id: 'city', label: t('orgs.fields.city') },
			{ id: 'url', label: t('orgs.fields.url') },
		]
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getData()
		if (this._isMounted) {
			if (this.props.location.pathname.includes('/management/orgs')) {
				this.setState({ route: 1 })
			}
			else {
				this.setState({ route: 0 })
			}
		}
	}
	componentDidUpdate = async (prevState, prevProps) => {
		if (prevProps.orgs !== this.props.orgs) {
			if (this.state.selected.length > 0)
				if (this.state.selected.length > 0) {
					let newSelected = this.state.selected.filter(s => this.props.orgs.findIndex(u => u.id === s) !== -1 ? true : false)
					this.setState({ selected: newSelected })
				}
			this.getData()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		let newData = handleRequestSort(property, order, this.props.orgs)
		this.setState({ orgs: newData, order, orderBy: property })
	}
	filterItems = (data) => {
		const rFilters = this.props.filters
		return customFilterItems(data, rFilters)
	}

	getData = async () => {
		if (this.props.orgs) {
			this.setState({
				loading: false
			}, () => this.handleRequestSort(null, 'name', 'asc'))
		}
	}

	tabs = [
		{ id: 0, title: this.props.t('users.tabs.users'), label: <People />, url: `/management/users` },
		{ id: 1, title: this.props.t('users.tabs.orgs'), label: <Business />, url: `/management/orgs` },
	]
	
	addNewOrg = () => { this.props.history.push('/management/orgs/new') }

	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			case 2:
				s('snackbars.exported')
				break;
			default:
				break;
		}
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	handleDeleteOrgs = async () => {
		const { selected } = this.state
		await selected.forEach(async u => {
			await deleteOrg(u)
		})
		await this.props.reload()
		this.snackBarMessages(1)
	}
	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { orgs, t, classes } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.orgs')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.orgs')}:
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={orgs[orgs.findIndex(d => d.id === s)].name} /></ListItem>)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteOrg} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderTableToolBarContent = () => {
		const { accessLevel, t  } = this.props
		let access = accessLevel.apiorg ? accessLevel.apiorg.edit ? true : false : false
		return <Fragment>
			{access ? <Tooltip title={t('menus.create.org')}>
				<IconButton aria-label='Add new organisation' onClick={this.addNewOrg}>
					<Add />
				</IconButton> 
			</Tooltip>
				: null
			}
		</Fragment>
	}

	renderOrgs = () => {
		const { t, classes } = this.props
		const { loading, order, orderBy, orgs, selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> :
				<Fade in={true}>
					<Paper className={classes.root}>
						{this.renderConfirmDelete()}
						<TableToolbar
							ft={this.ftOrgs()}
							reduxKey={'orgs'}
							anchorElMenu={this.state.anchorElMenu}
							handleToolbarMenuClose={this.handleToolbarMenuClose}
							handleToolbarMenuOpen={this.handleToolbarMenuOpen}
							numSelected={selected.length}
							options={this.options}
							t={t}
							content={this.renderTableToolBarContent()}
						/>
						<OrgTable
							data={this.filterItems(orgs)}
							tableHead={this.orgsHeader()}
							handleRequestSort={this.handleRequestSort}
							handleDeleteOrgs={this.handleDeleteOrgs}
							handleCheckboxClick={this.handleCheckboxClick}
							handleSelectAllClick={this.handleSelectAllClick}
							orderBy={orderBy}
							selected={selected}
							order={order}
							t={t}
						/></Paper>
				</Fade>
			}
		</GridContainer>
	}
	render() {
		return (
			<Fragment>
				{this.renderOrgs()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Orgs)