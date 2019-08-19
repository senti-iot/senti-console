import { Paper, withStyles, Dialog, IconButton, DialogContent, DialogTitle, DialogActions, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TokensTable from 'components/API/TokensTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, dateTimeFormatter } from 'variables/functions';
import { Delete, ViewList, Close, Add, Code } from 'variables/icons';
import { GridContainer, CircularLoader, ItemG, Caption, Info, DeleteDialog, /* AssignProject */ } from 'components'
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
			openDeleteS: false,
			openDeleteM: false,
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
			{ key: 'name', name: t('tokens.fields.name'), type: 'string' },
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
		const { t } = this.props
		let allOptions = [
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialogM, icon: Delete },
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

	}
	//#endregion

	//#region Functions
	addNewToken = () => {
		this.setState({
			openNewToken: true
		})
	}

	filterItems = (data) => {
		const rFilters = this.props.filters
		const { filters } = this.state
		return customFilterItems(filterItems(data, filters), rFilters)
	}
	snackBarTokens = (token) => {
		const { s } = this.props
		// const { selected } = this.state
		switch (token) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
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

	handleTabs = () => {
		const { location } = this.props
		if (location.pathname.includes('grid'))
			// this.setState({ route: 1 })
			return 1
	}
	handleRequestSort = key => (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		this.props.sortData(key, property, order)
		this.setState({ order, orderBy: property })
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
				openDeleteM: false,
				anchorElMenu: null
			})
			this.getData(true)
			this.snackBarTokens(1)
		}
	}
	handleDeleteToken = async () => {
		const { token } = this.state
		// console.log(token)
		let r = await deleteTokens([token.id])
		if (r) {
			this.setState({
				selected: [],
				token: null,
				openToken: false,
				openDeleteS: false,
				anchorElMenu: false
			})
			this.getData(true)
			this.snackBarTokens(1)
		}
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

	handleOpenDeleteDialogM = () => {
		this.setState({ openDeleteM: true, anchorElMenu: null })
	}

	handleCloseDeleteDialogM = () => {
		this.setState({ openDeleteM: false })
	}

	handleOpenDeleteDialogS = () => {
		this.setState({ openDeleteS: true, anchorElMenu: null })
	}

	handleCloseDeleteDialogS = () => {
		this.setState({ openDeleteS: false })
	}

	handleOpenToken = token => () => {
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
							<Tooltip title={t('actions.delete')}>
								<IconButton className={classes.closeButton} onClick={this.handleOpenDeleteDialogS}>
									<Delete />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('actions.close')}>
								<IconButton aria-label="Close" className={classes.iconButton} onClick={this.handleCloseToken}>
									<Close />
								</IconButton>
							</Tooltip>
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
						{/* <Button variant={'outlined'} onClick={e => {
							this.handleCheckboxClick(e, token.id)
							this.handleOpenDeleteDialogS()
							// this.handleCloseToken()
						}} className={classes.redButton}><Close /> {t('actions.delete')}</Button> */}
					</DialogActions>
				</Fragment>
				: <div />}
		</Dialog>
	}
	renderDeleteDialogMultiple = () => {
		const { openDeleteM, selected } = this.state
		const { t, tokens } = this.props
		let data = selected.map(s => tokens[tokens.findIndex(t => t.id === s)])
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.tokens'}
			message={'dialogs.delete.message.tokens'}
			open={openDeleteM}
			handleCloseDeleteDialog={this.handleCloseDeleteDialogM}
			icon={<Code />}
			handleDelete={this.handleDeleteTokens}
			data={data}
			dataKey={'name'}
		/>
	}

	renderDeleteDialogSingle = () => {
		const { openDeleteS, token } = this.state
		const { t } = this.props
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.token'}
			message={'dialogs.delete.message.token'}
			messageOpts={{ token: token ? token.name : '' }}
			open={openDeleteS}
			single
			handleCloseDeleteDialog={this.handleCloseDeleteDialogS}
			handleDelete={this.handleDeleteToken}
		/>
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

	renderTokens = () => {
		const { classes, tokens, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable(tokens, this.handleTokenClick, 'tokens')}
				{this.renderDeleteDialogMultiple()}
				{this.renderDeleteDialogSingle()}
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