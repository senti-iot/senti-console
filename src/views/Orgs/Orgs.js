import React, { Component, Fragment } from 'react'
import { withStyles, Paper, Button, DialogActions, ListItemText, ListItem, List, DialogContentText, DialogContent, DialogTitle, Dialog, ListItemIcon, IconButton } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
// import { getAllOrgs } from 'variables/dataOrgs';
import OrgTable from 'components/Orgs/OrgTable';
// import Toolbar from 'components/Toolbar/Toolbar'
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
				custom: []
			}
		}
		props.setHeader('orgs.pageTitle', false, '', 'users')
	}
	reload = async () => {
		this.setState({ loading: true })
		await this.props.reload()
	}
	options = () => {
		const { t, accessLevel, isFav, orgs } = this.props
		const { selected } = this.state
		let org = orgs[orgs.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: `/management/org/${org.id}`
		}
		let isFavorite = isFav(favObj)
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
			{ key: 'org.id', name: t('filters.orgs.parentOrg'), type: 'diff', options: { dropdown: this.dHasOrgParent(), values: { false: [-1] } } }
		]
	}
	addFilter = (f) => {
		let cFilters = this.state.filters.custom
		let id = cFilters.length
		cFilters.push({ ...f, id: id })
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
		return id
	}
	editFilter = (f) => {
		let cFilters = this.state.filters.custom
		let filterIndex = cFilters.findIndex(fi => fi.id === f.id)
		cFilters[filterIndex] = f
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
	}
	removeFilter = (fId) => {
		let cFilters = this.state.filters.custom
		cFilters = cFilters.reduce((newFilters, f) => {
			if (f.id !== fId) {
				newFilters.push(f)
			}
			return newFilters
		}, [])
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
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
			this.setState({ selected: this.props.orgs.map(n => n.id) })
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
			this.getData()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.props.orgs)
		this.setState({ orgs: newData, order, orderBy: property })
	}

	filterItems = (data) => {
		const { filters } = this.state
		return customFilterItems(data, filters.custom)
	}

	handleFilterStartDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				startDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}
	handleFilterEndDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				endDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}
	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
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
			<DialogTitle id='alert-dialog-title'>{t('dialogs.delete.title.orgs')}</DialogTitle>
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
		const { accessLevel } = this.props
		let access = accessLevel.apiorg ? accessLevel.apiorg.edit ? true : false : false
		return <Fragment>
			{access ? <IconButton aria-label='Add new organisation' onClick={this.addNewOrg}>
				<Add />
			</IconButton> : null
			}
		</Fragment>
	}

	renderOrgs = () => {
		const { t, classes } = this.props
		const { loading, order, orderBy, orgs, filters, selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> :
				<Paper className={classes.root}>
					{this.renderConfirmDelete()}
					<TableToolbar //	./TableToolbar.js
						ft={this.ftOrgs()}
						addFilter={this.addFilter}
						editFilter={this.editFilter}
						removeFilter={this.removeFilter}
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
						handleFilterEndDate={this.handleFilterEndDate}
						handleFilterKeyword={this.handleFilterKeyword}
						handleFilterStartDate={this.handleFilterStartDate}
						handleRequestSort={this.handleRequestSort}
						handleDeleteOrgs={this.handleDeleteOrgs}
						handleCheckboxClick={this.handleCheckboxClick}
						handleSelectAllClick={this.handleSelectAllClick}
						orderBy={orderBy}
						selected={selected}
						order={order}
						filters={filters}
						t={t}
					/></Paper>}
		</GridContainer>
	}
	render() {
		// const { orgs, route, filters } = this.state
		return (
			<Fragment>
				{/* <Toolbar
					data={orgs}
					route={route}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
					defaultRoute={1}
				/> */}
				{this.renderOrgs()}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Orgs)