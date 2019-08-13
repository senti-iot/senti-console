import { Paper, withStyles, Dialog, IconButton, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TokensTable from 'components/API/TokensTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort, dateTimeFormatter } from 'variables/functions';
import { Delete, ViewList, /* ViewModule, */ Star, StarBorder, Close, Add } from 'variables/icons';
import { GridContainer, CircularLoader, ItemG, Caption, Info, /* AssignProject */ } from 'components'
// import TokensCards from './TokensCards';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getTokens, setTokens, sortData } from 'redux/data';
import { Link } from 'react-router-dom'
import CreateToken from './CreateToken';
import { deleteTokens } from 'variables/dataRegistry';

class Tokens extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			openToken: false,
			openNewToken: false,
			openDelete: false,
			route: 0,
			order: 'asc',
			orderBy: 'id',
			filters: {
				keyword: '',
			}
		}
		props.setHeader('sidebar.api', false, '', 'manage.api')
		props.setBC('api')
		props.setTabs({
			id: 'api',
			tabs: this.tabs(),
			route: this.handleTabs()
		})
	}
	//#region Constants
	tabs = () => {
		const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			// { id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			// { id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}
	dProtocols = () => {
		const { t } = this.props
		return [
			{ value: 0, label: t("tokens.fields.protocols.none") },
			{ value: 1, label: t("tokens.fields.protocols.mqtt") },
			{ value: 2, label: t("tokens.fields.protocols.http") },
			{ value: 3, label: `${t('tokens.fields.protocols.mqtt')} & ${t('tokens.fields.protocols.http')}` }
		]
	}
	ft = () => {
		const { t } = this.props
		return [
			// { key: 'name', name: t('tokens.fields.name'), type: 'string' },
			// { key: 'customer_name', name: t('orgs.fields.name'), type: 'string' },
			// { key: 'created', name: t('tokens.fields.created'), type: 'date' },
			// { key: 'protocol', name: t('tokens.fields.protocol'), type: 'dropDown', options: this.dProtocols() },
			// { key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	tokensHeader = () => {
		const { t } = this.props
		return [
			{ id: 'id', label: t('tokens.fields.id') },
			{ id: 'name', label: t('tokens.fields.name') },
			{ id: 'created', label: t('registries.fields.created') }
		]
	}
	options = () => {
		const { t, isFav, tokens } = this.props
		const { selected } = this.state
		let token = tokens[tokens.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: token.id,
			name: token.name,
			type: 'token',
			path: `/token/${token.id}`
		}
		let isFavorite = isFav(favObj)
		let allOptions = [
			// { label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete },
			{ single: true, label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) }
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle
	componentDidMount = async () => {
		this._isMounted = 1
		this.handleTabs()
		this.getData()

	}

	componentDidUpdate = () => {
		const { t, saved, s, isFav, finishedSaving } = this.props
		if (saved === true) {
			const { tokens } = this.props
			const { selected } = this.state
			let token = tokens[tokens.findIndex(d => d.id === selected[0])]
			if (token) {
				if (isFav({ id: token.id, type: 'token' })) {
					s('snackbars.favorite.saved', { name: token.name, type: t('favorites.types.token') })
					finishedSaving()
					this.setState({ selected: [] })
				}
				if (!isFav({ id: token.id, type: 'token' })) {
					s('snackbars.favorite.removed', { name: token.name, type: t('favorites.types.token') })
					finishedSaving()
					this.setState({ selected: [] })
				}
			}
		}
	}
	//#endregion

	//#region Functions
	addNewToken = () => {
		this.setState({
			openNewToken: true
		})
	}

	getFavs = () => {
		const { order, orderBy } = this.state
		const { favorites, tokens } = this.props
		let favs = favorites.filter(f => f.type === 'token')
		let favTokens = favs.map(f => {
			return tokens[tokens.findIndex(d => d.id === f.id)]
		})
		favTokens = handleRequestSort(orderBy, order, favTokens)
		return favTokens
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	filterItems = (data) => {
		const rFilters = this.props.filters
		const { filters } = this.state
		return customFilterItems(filterItems(data, filters), rFilters)
	}
	snackBarTokens = (token, display) => {
		const { s } = this.props
		// const { selected } = this.state
		switch (token) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			// case 2:
			// 	s('snackbars.exported')
			// 	break;
			// case 3:
			// 	s('snackbars.assign.deviceToToken', { token: ``, what: 'Device' })
			// 	break;
			// case 6:
			// 	s('snackbars.assign.deviceToToken', { token: `${tokens[tokens.findIndex(c => c.id === selected[0])].name}`, device: display })
			// 	break
			default:
				break;
		}
	}
	reload = async () => {
		await this.getData(true)
	}
	getData = async (reload) => {
		const { getTokens, /* setTokens, */ accessLevel, user, tokens } = this.props
		// setTokens()
		if (accessLevel || user) {
			if (reload || tokens.length === 0)
				getTokens(user.id, true, accessLevel.apisuperuser ? true : false)
		}
	}
	//#endregion

	//#region Handlers

	handleEdit = () => {
		const { selected } = this.state
		this.props.history.push({ pathname: `/token/${selected[0]}/edit`, prevURL: `/tokens/list` })
	}

	handleTabs = () => {
		const { location } = this.props
		if (location.pathname.includes('grid'))
			// this.setState({ route: 1 })
			return 1
		else {
			if (location.pathname.includes('favorites'))
				// this.setState({ route: 2 })
				return 2
			else {
				// this.setState({ route: 0 })
				return 0
			}
		}
	}
	handleRequestSort = key => (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		this.props.sortData(key, property, order)
		this.setState({ order, orderBy: property })
	}
	handleTokenClick = id => e => {
		e.stopPropagation()
		this.props.history.push('/token/' + id)
	}

	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/token/' + id, prevURL: '/tokens/favorites' })
	}
	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	handleDeleteTokens = async () => {
		const { selected } = this.state
		let r = await deleteTokens(selected)
		if (r) {
			this.setState({
				selected: [],
				openDelete: false,
				anchorElMenu: null
			})
			this.getData(true)
			this.snackBarTokens(1)
		}
		// Promise.all([selected.map(u => {
		// 	return deleteToken(u)
		// })]).then(async () => {
		// 	this.setState({ openDelete: false, anchorElMenu: null, selected: [] })
		// 	await this.getData(true).then(
		// 		() => this.snackBarTokens(1)
		// 	)
		// })
	}
	handleSelectAllClick = (arr, checked) => {
		if (checked) {
			this.setState({ selected: arr })
			return;
		}
		this.setState({ selected: [] })
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

	handleOpenAssignDevice = () => {
		this.setState({ openAssignDevice: true, anchorElMenu: null })
	}

	handleCancelAssignDevice = () => {
		this.setState({ openAssignDevice: false })
	}

	handleCloseAssignDevice = async (reload, display) => {
		if (reload) {
			this.setState({ openAssignDevice: false })
			await this.getData(true).then(() => {
				this.snackBarTokens(6, display)
				this.setState({ selected: [] })
			})
		}
	}
	handleOpenAssignProject = () => {
		this.setState({ openAssignProject: true, anchorElMenu: null })
	}

	handleCancelAssignProject = () => {
		this.setState({ openAssignProject: false })
	}

	handleCloseAssignProject = async (reload) => {
		if (reload) {
			this.setState({ openAssignProject: false })
			await this.getData(true).then(() => {
				this.snackBarTokens(6)
			})
		}
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleOpenUnassignDevice = () => {
		this.setState({
			openUnassignDevice: true
		})
	}

	handleCloseUnassignDevice = () => {
		this.setState({
			openUnassignDevice: false, anchorEl: null
		})
	}
	handleOpenToken = token => e => {
		this.setState({
			openToken: true,
			token: token
		})
	}
	handleCloseToken = () => {
		this.setState({
			openToken: false,
			token: null
		})
	}
	renderReference = (type, tId) => {
		const { devices, registries, deviceTypes } = this.props
		switch (type) {
			case 0:
				return <Link to={{ pathname: `/sensor/${tId}`, prevURL: '/api/list' }}>
					<Info>
						{devices[devices.findIndex(d => d.id === tId)].name}
					</Info>
				</Link>
			case 1:
				return <Link to={{ pathname: `/registry/${tId}`, prevURL: '/api/list' }}>
					<Info>
						{registries[registries.findIndex(d => d.id === tId)].name}
					</Info>
				</Link>
			case 2:
				return <Link to={{ pathname: `/devicetype/${tId}`, prevURL: '/api/list' }}>
					<Info>
						{deviceTypes[deviceTypes.findIndex(d => d.id === tId)].name}
					</Info>
				</Link>

			default:
				break;
		}
	}
	renderType = (type) => {
		const { t } = this.props
		switch (type) {
			case 0:
				return t('tokens.fields.types.device')
			case 1:
				return t('tokens.fields.types.registry')
			case 2:
				return t('tokens.fields.types.devicetype')

			default:
				break;
		}
	}
	renderToken = () => {
		let { openToken, token } = this.state
		let { t, classes } = this.props
		return <Dialog
			open={openToken}
			onClose={this.handleCloseToken}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			PaperProps={{
				style: {
					width: 600
				}
			}}
		>
			{token ?
				<Fragment>
					<DialogTitle disableTypography >
						<ItemG container justify={'space-between'} alignItems={'center'}>
							{token.name}
							<IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleCloseToken}>
								<Close />
							</IconButton>
						</ItemG>
					</DialogTitle>
					<DialogContent>
						<ItemG container>
							{/* <ItemG xs={6}>
								<Caption>{t('tokens.fields.name')}</Caption>
								<Info>{token.name}</Info>
							</ItemG> */}
							<ItemG xs={12}>
								<Caption>{t('tokens.fields.created')}</Caption>
								<Info>{dateTimeFormatter(token.created, true)}</Info>
							</ItemG>
							<ItemG xs={6}>
								<Caption>{t('tokens.fields.type')}</Caption>
								<Info>{this.renderType(token.type)}</Info>
							</ItemG>
							<ItemG xs={6}>
								<Caption>{t('tokens.fields.reference')}</Caption>
								{this.renderReference(token.type, token.type_id)}
							</ItemG>
						</ItemG>
					</DialogContent>
					<DialogActions>
						<Button variant={'outlined'} onClick={e => {
							this.handleCheckboxClick(e, token.id)
							this.handleOpenDeleteDialog()
							this.handleCloseToken()
						}} className={classes.redButton}><Close /> {t('actions.delete')}</Button>
					</DialogActions>
				</Fragment>
				: <div />}
		</Dialog>
	}
	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { t, classes, tokens } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			PaperProps={{
				style: {
					minWidth: 300
				}
			}}
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.tokens')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.tokens')}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><div>&bull;</div>
						<ListItemText primary={tokens[tokens.findIndex(d => d.id === s)].name} /></ListItem>)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteTokens} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}


	renderTableToolBarContent = () => {
		const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.token')}>
				<IconButton aria-label='Add new token' onClick={this.addNewToken}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	renderTableToolBar = () => {
		const { t } = this.props
		const { selected } = this.state
		return <TableToolbar
			ft={this.ft()}
			reduxKey={'tokens'}
			numSelected={selected.length}
			options={this.options}
			t={t}
			content={this.renderTableToolBarContent()}
		/>
	}
	renderNewToken = () => {
		const { t } = this.props
		const { openNewToken } = this.state
		return <CreateToken
			t={t}
			openToken={openNewToken}
			handleClose={() => {
				this.setState({
					openNewToken: false
				})
			}}
		/>
	}
	renderTable = (items, handleClick, key) => {
		const { t } = this.props
		const { order, orderBy, selected } = this.state
		return <Fragment>
			{this.renderToken()}
			{this.renderNewToken()}
			<TokensTable
				data={this.filterItems(items)}
				handleCheckboxClick={this.handleCheckboxClick}
				handleClick={this.handleOpenToken}
				handleRequestSort={this.handleRequestSort(key)}
				handleSelectAllClick={this.handleSelectAllClick}
				order={order}
				orderBy={orderBy}
				selected={selected}
				t={t}
				tableHead={this.tokensHeader()}
			/>
		</Fragment>
	}

	renderCards = () => {
		const { /* t, history, tokens, */ loading } = this.props
		return loading ? <CircularLoader /> :
			// <TokenCards tokens={this.filterItems(tokens)} t={t} history={history} />
			null
	}

	renderFavorites = () => {
		const { classes, loading } = this.props
		const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderAssignProject()}
				{this.renderAssignDevice()}
				{selected.length > 0 ? this.renderDeviceUnassign() : null}
				{this.renderTableToolBar()}
				{this.renderTable(this.getFavs(), this.handleFavClick, 'favorites')}
				{this.renderConfirmDelete()}
			</Paper>
			}
		</GridContainer>
	}

	renderTokens = () => {
		const { classes, tokens, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable(tokens, this.handleTokenClick, 'tokens')}
				{this.renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	render() {
		// const { tokens, route, filters } = this.state
		const { /* history,  */match } = this.props
		return (
			<Fragment>
				<Switch>
					<Route path={`${match.path}/list`} render={() => this.renderTokens()} />
					<Route path={`${match.path}/grid`} render={() => this.renderCards()} />
					{/* <Route path={`${match.path}/favorites`} render={() => this.renderFavorites()} /> */}
					<Redirect path={`${match.path}`} to={`${match.path}/list`} />
				</Switch>

			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	favorites: state.data.favorites,
	saved: state.favorites.saved,
	tokens: state.data.tokens,
	loading: !state.data.gottokens,
	filters: state.appState.filters.tokens,
	user: state.settings.user,
	devices: state.data.sensors,
	registries: state.data.registries,
	deviceTypes: state.data.deviceTypes
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getTokens: (reload, customerID, ua) => dispatch(getTokens(reload, customerID, ua)),
	setTokens: () => dispatch(setTokens()),
	sortData: (key, property, order) => dispatch(sortData(key, property, order))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles, { withTheme: true })(Tokens))