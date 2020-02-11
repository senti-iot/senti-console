import { Paper, Dialog, IconButton, DialogContent, DialogTitle, DialogActions, Fade, Tooltip } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import TokensTable from 'components/API/TokensTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, dateTimeFormatter } from 'variables/functions';
import { Delete, ViewList, Close, Add, Code } from 'variables/icons';
import { GridContainer, CircularLoader, ItemG, Caption, Info, DeleteDialog, /* AssignProject */ } from 'components'
// import TokensCards from './TokensCards';
// import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getTokens, setTokens, sortData } from 'redux/data';
import { Link } from 'react-router-dom'
import CreateToken from './CreateToken';
import { deleteTokens } from 'variables/dataRegistry';
import { useLocalization, useMatch, /* useHistory, */ useLocation, useSnackbar } from 'hooks'

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	tokens: state.data.tokens,
// 	loading: !state.data.gottokens,
// 	filters: state.appState.filters.tokens,
// 	user: state.settings.user,
// 	devices: state.data.sensors,
// 	registries: state.data.registries,
// 	deviceTypes: state.data.deviceTypes
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getTokens: (reload, customerID, ua) => dispatch(getTokens(reload, customerID, ua)),
// 	setTokens: () => dispatch(setTokens()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

// @Andrei
const Tokens = props => {
	const classes = projectStyles()
	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s
	const match = useMatch()
	// const history = useHistory()
	const location = useLocation()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	// const favorites = useSelector(state => state.data.favorites)
	// const saved = useSelector(state => state.favorites.saved)
	const tokens = useSelector(state => state.data.tokens)
	const loading = useSelector(state => !state.data.gottokens)
	const filters = useSelector(state => state.appState.filters.tokens)
	const user = useSelector(state => state.settings.user)
	const devices = useSelector(state => state.data.sensors)
	const registries = useSelector(state => state.data.registries)
	const deviceTypes = useSelector(state => state.data.deviceTypes)

	const [selected, setSelected] = useState([])
	const [openToken, setOpenToken] = useState(false)
	const [openNewToken, setOpenNewToken] = useState(false)
	const [openDeleteS, setOpenDeleteS] = useState(false)
	const [openDeleteM, setOpenDeleteM] = useState(false)
	// const [route, setRoute] = useState(0)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [stateFilters, /* setStateFilters */] = useState({ keyword: '' })
	const [/* anchorElMenu */, setAnchorElMenu] = useState(null) // added
	const [token, setToken] = useState(null) // added

	const tabs = () => {
		// const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			// { id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			// { id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}

	const handleTabs = () => {
		// const { location } = this.props
		if (location.pathname.includes('grid'))
			// this.setState({ route: 1 })
			return 1
	}

	props.setHeader('sidebar.api', false, '', 'manage.api')
	props.setBC('api')
	props.setTabs({
		id: 'api',
		tabs: tabs(),
		route: handleTabs()
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		selected: [],
	// 		openToken: false,
	// 		openNewToken: false,
	// 		openDeleteS: false,
	// 		openDeleteM: false,
	// 		route: 0,
	// 		order: 'asc',
	// 		orderBy: 'id',
	// 		filters: {
	// 			keyword: '',
	// 		}
	// 	}
	// 	props.setHeader('sidebar.api', false, '', 'manage.api')
	// 	props.setBC('api')
	// 	props.setTabs({
	// 		id: 'api',
	// 		tabs: this.tabs(),
	// 		route: this.handleTabs()
	// 	})
	// }
	//#region Constants
	// const dProtocols = () => {
	// 	// const { t } = this.props
	// 	return [
	// 		{ value: 0, label: t("tokens.fields.protocols.none") },
	// 		{ value: 1, label: t("tokens.fields.protocols.mqtt") },
	// 		{ value: 2, label: t("tokens.fields.protocols.http") },
	// 		{ value: 3, label: `${t('tokens.fields.protocols.mqtt')} & ${t('tokens.fields.protocols.http')}` }
	// 	]
	// }
	const ft = () => {
		// const { t } = this.props
		return [
			{ key: 'name', name: t('tokens.fields.name'), type: 'string' },
			// { key: 'customer_name', name: t('orgs.fields.name'), type: 'string' },
			// { key: 'created', name: t('tokens.fields.created'), type: 'date' },
			// { key: 'protocol', name: t('tokens.fields.protocol'), type: 'dropDown', options: this.dProtocols() },
			// { key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const tokensHeader = () => {
		// const { t } = this.props
		return [
			{ id: 'id', label: t('tokens.fields.id') },
			{ id: 'name', label: t('tokens.fields.name') },
			{ id: 'created', label: t('registries.fields.created') }
		]
	}
	const options = () => {
		// const { t } = this.props
		let allOptions = [
			{ label: t('menus.delete'), func: handleOpenDeleteDialogM, icon: Delete },
		]
		return allOptions
	}
	//#endregion

	//#region Life Cycle
	useEffect(() => {
		handleTabs()
		getData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	this.handleTabs()
	// 	this.getData()

	// }

	// componentDidUpdate = () => {
	// }
	//#endregion

	//#region Functions
	const addNewToken = () => {
		setOpenNewToken(true)
		// this.setState({
		// 	openNewToken: true
		// })
	}

	const filterItemsFunc = (data) => {
		// const rFilters = this.props.filters
		// const { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), filters)
	}
	const snackBarTokens = (token) => {
		// const { s } = this.props
		// const { selected } = this.state
		switch (token) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			default:
				break;
		}
	}
	// const reload = async () => {
	// 	await getData(true)
	// }
	const getData = async (reload) => {
		// const { getTokens, /* setTokens, */ accessLevel, user, tokens } = this.props
		dispatch(setTokens())
		if (accessLevel || user) {
			if (reload || tokens.length === 0)
				dispatch(getTokens(user.id, true, accessLevel.apisuperuser ? true : false))
		}
	}
	//#endregion

	//#region Handlers

	const handleRequestSortFunc = key => (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		dispatch(sortData(key, property, newOrder))
		setOrder(newOrder)
		setOrderBy(property)
		// this.setState({ order, orderBy: property })
	}
	// const handleFilterKeyword = (value) => {
	// 	setStateFilters({ ...stateFilters, keyword: value })
	// 	// this.setState({
	// 	// 	filters: {
	// 	// 		...this.state.filters,
	// 	// 		keyword: value
	// 	// 	}
	// 	// })
	// }

	// const handleTabsChange = (e, value) => {
	// 	setRoute(value)
	// 	// this.setState({ route: value })
	// }
	const handleDeleteTokens = async () => {
		// const { selected } = this.state
		let r = await deleteTokens(selected)
		if (r) {
			setSelected([])
			setOpenDeleteM(false)
			setAnchorElMenu(null)
			// this.setState({
			// 	selected: [],
			// 	openDeleteM: false,
			// 	anchorElMenu: null
			// })
			getData(true)
			snackBarTokens(1)
		}
	}
	const handleDeleteToken = async () => {
		// const { token } = this.state
		// console.log(token)
		let r = await deleteTokens([token.id])
		if (r) {
			setSelected([])
			setToken(null)
			setOpenToken(false)
			setOpenDeleteS(false)
			setAnchorElMenu(false)
			// this.setState({
			// 	selected: [],
			// 	token: null,
			// 	openToken: false,
			// 	openDeleteS: false,
			// 	anchorElMenu: false
			// })
			getData(true)
			snackBarTokens(1)
		}
	}
	const handleSelectAllClick = (arr, checked) => {
		if (checked) {
			setSelected(arr)
			// this.setState({ selected: arr })
			return;
		}
		setSelected([])
		// this.setState({ selected: [] })
	}
	const handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		// const { selected } = this.state;
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
		setSelected(newSelected)
		// this.setState({ selected: newSelected })
	}

	const handleOpenDeleteDialogM = () => {
		setOpenDeleteM(true)
		setAnchorElMenu(null)
		// this.setState({ openDeleteM: true, anchorElMenu: null })
	}

	const handleCloseDeleteDialogM = () => {
		setOpenDeleteM(false)
		// this.setState({ openDeleteM: false })
	}

	const handleOpenDeleteDialogS = () => {
		setOpenDeleteS(true)
		setAnchorElMenu(null)
		// this.setState({ openDeleteS: true, anchorElMenu: null })
	}

	const handleCloseDeleteDialogS = () => {
		setOpenDeleteS(false)
		// this.setState({ openDeleteS: false })
	}

	const handleOpenToken = token => () => {
		setOpenToken(true)
		setToken(token)
		// this.setState({
		// 	openToken: true,
		// 	token: token
		// })
	}
	const handleCloseToken = () => {
		setOpenToken(false)
		setToken(null)
		// this.setState({
		// 	openToken: false,
		// 	token: null
		// })
	}
	const renderReference = (type, tId) => {
		// const { devices, registries, deviceTypes } = this.props
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
	const renderType = (type) => {
		// const { t } = this.props
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
	const renderToken = () => {
		// let { openToken, token } = this.state
		// let { classes } = props
		return <Dialog
			open={openToken}
			onClose={handleCloseToken}
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
								<IconButton className={classes.closeButton} onClick={handleOpenDeleteDialogS}>
									<Delete />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('actions.close')}>
								<IconButton aria-label="Close" className={classes.iconButton} onClick={handleCloseToken}>
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
								<Info>{renderType(token.type)}</Info>
							</ItemG>
							<ItemG xs={6}>
								<Caption>{t('tokens.fields.reference')}</Caption>
								{renderReference(token.type, token.type_id)}
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
	const renderDeleteDialogMultiple = () => {
		// const { openDeleteM, selected } = this.state
		// const { t, tokens } = this.props
		let data = selected.map(s => tokens[tokens.findIndex(t => t.id === s)])
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.tokens'}
			message={'dialogs.delete.message.tokens'}
			open={openDeleteM}
			handleCloseDeleteDialog={handleCloseDeleteDialogM}
			icon={<Code />}
			handleDelete={handleDeleteTokens}
			data={data}
			dataKey={'name'}
		/>
	}

	const renderDeleteDialogSingle = () => {
		// const { openDeleteS, token } = this.state
		// const { t } = this.props
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.token'}
			message={'dialogs.delete.message.token'}
			messageOpts={{ token: token ? token.name : '' }}
			open={openDeleteS}
			single
			handleCloseDeleteDialog={handleCloseDeleteDialogS}
			handleDelete={handleDeleteToken}
		/>
	}


	const renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Fragment>
			<Tooltip title={t('menus.create.token')}>
				<IconButton aria-label='Add new token' onClick={addNewToken}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	const renderTableToolBar = () => {
		// const { t } = this.props
		// const { selected } = this.state
		return <TableToolbar
			ft={ft()}
			reduxKey={'tokens'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}
	const renderNewToken = () => {
		// const { t } = this.props
		// const { openNewToken } = this.state
		return <CreateToken
			t={t}
			openToken={openNewToken}
			handleClose={() => {
				setOpenNewToken(false)
				// this.setState({
				// 	openNewToken: false
				// })
			}}
		/>
	}
	const renderTable = (items, handleClick, key) => {
		// const { t } = this.props
		// const { order, orderBy, selected } = this.state
		return <Fragment>
			{renderToken()}
			{renderNewToken()}
			<TokensTable
				data={filterItemsFunc(items)}
				handleCheckboxClick={handleCheckboxClick}
				handleClick={handleOpenToken}
				handleRequestSort={handleRequestSortFunc(key)}
				handleSelectAllClick={handleSelectAllClick}
				order={order}
				orderBy={orderBy}
				selected={selected}
				t={t}
				tableHead={tokensHeader()}
			/>
		</Fragment>
	}

	const renderCards = () => {
		// const { /* t, history, tokens, */ loading } = this.props
		return loading ? <CircularLoader /> :
			// <TokenCards tokens={this.filterItems(tokens)} t={t} history={history} />
			null
	}

	const renderTokens = () => {
		// const { classes } = props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(tokens, /* handleTokenClick */ null, 'tokens')}
				{renderDeleteDialogMultiple()}
				{renderDeleteDialogSingle()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	// const { tokens, route, filters } = this.state
	// const { /* history,  */match } = this.props
	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderTokens()} />
				<Route path={`${match.path}/grid`} render={() => renderCards()} />
				{/* <Route path={`${match.path}/favorites`} render={() => this.renderFavorites()} /> */}
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>

		</Fragment>
	)
}

export default Tokens