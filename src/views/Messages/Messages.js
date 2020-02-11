import { Paper, Dialog, IconButton, DialogContent, DialogTitle, Fade } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import MessageTable from 'components/Message/MessageTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, /* handleRequestSort, */ dateTimeFormatter } from 'variables/functions';
import { ViewList, Close } from 'variables/icons';
import { GridContainer, CircularLoader, ItemG, Caption, Info, /* AssignProject */ } from 'components'
// import MessagesCards from './MessagesCards';
// import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getMessages, /* setMessages, */ sortData } from 'redux/data';
import AceEditor from 'react-ace';
import { useLocalization, useMatch, /* useHistory, useSnackbar */ } from 'hooks'

import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/theme/monokai';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	messages: state.data.messages,
// 	loading: !state.data.gotmessages,
// 	filters: state.appState.filters.messages,
// 	user: state.settings.user
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getMessages: (reload, customerID, ua) => dispatch(getMessages(reload, customerID, ua)),
// 	setMessages: () => dispatch(setMessages()),
// 	sortData: (key, property, order) => dispatch(sortData(key, property, order))
// })

// @Andrei
// a lot of things commented out because of 'never used' ESLint warnings
const Messages = props => {
	const classes = projectStyles()
	const t = useLocalization()
	// const s = useSnackbar().s
	const dispatch = useDispatch()
	const match = useMatch()
	// const history = useHistory()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	// const favorites = useSelector(state => state.data.favorites)
	// const saved = useSelector(state => state.favorites.saved)
	const messages = useSelector(state => state.data.messages)
	const loading = useSelector(state => !state.data.gotmessages)
	const filters = useSelector(state => state.appState.filters.messages)
	const user = useSelector(state => state.settings.user)

	const [selected, /* setSelected */] = useState([])
	const [openMessage, setOpenMessage] = useState(false)
	// const [openDelete, setOpenDelete] = useState(false)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [stateFilters, /* setStateFilters */] = useState({ keyword: '' })
	// const [anchorEl, setAnchorEl] = useState(null) // added
	// const [anchorElMenu, setAnchorElMenu] = useState(null) // added
	// const [route, setRoute] = useState(0) // added
	const [msg, setMsg] = useState(null) // added
	// const [openUnassignDevice, setOpenUnassignDevice] = useState(null) // added

	const tabs = () => {
		// const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` }
		]
	}

	props.setHeader('sidebar.messages', false, '', 'messages')
	props.setBC('messages')
	props.setTabs({
		id: 'messages',
		tabs: tabs(),
		// route: this.handleTabs()
	})

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		selected: [],
	// 		openMessage: false,
	// 		openDelete: false,
	// 		order: 'asc',
	// 		orderBy: 'id',
	// 		filters: {
	// 			keyword: '',
	// 		}
	// 	}
	// 	props.setHeader('sidebar.messages', false, '', 'messages')
	// 	props.setBC('messages')
	// 	props.setTabs({
	// 		id: 'messages',
	// 		tabs: this.tabs(),
	// 		// route: this.handleTabs()
	// 	})
	// }
	//#region Constants
	// const dProtocols = () => {
	// 	// const { t } = this.props
	// 	return [
	// 		{ value: 0, label: t("messages.fields.protocols.none") },
	// 		{ value: 1, label: t("messages.fields.protocols.mqtt") },
	// 		{ value: 2, label: t("messages.fields.protocols.http") },
	// 		{ value: 3, label: `${t('messages.fields.protocols.mqtt')} & ${t('messages.fields.protocols.http')}` }
	// 	]
	// }
	const ft = () => {
		// const { t } = this.props
		return [
			// { key: 'name', name: t('messages.fields.name'), type: 'string' },
			{ key: 'customerName', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'registryName', name: t('messages.fields.registryName'), type: 'string' },
			// { key: 'created', name: t('messages.fields.created'), type: 'date' },
			// { key: 'protocol', name: t('messages.fields.protocol'), type: 'dropDown', options: this.dProtocols() },
			// { key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	const messagesHeader = () => {
		// const { t } = this.props
		return [
			{ id: 'id', label: t('messages.fields.id'), centered: true },
			{ id: 'deviceName', label: t('messages.fields.deviceName') },
			{ id: 'registryName', label: t('messages.fields.registryName') },
			{ id: 'created', label: t('registries.fields.created') },
			{ id: 'customerName', label: t('orgs.fields.name') }
		]
	}
	const options = () => {
		return []
	}
	//#endregion

	//#region Life Cycle
	useEffect(() => {
		getData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	this.getData()

	// }

	//#endregion

	//#region Functions
	// const addNewMessage = () => history.push({ pathname: `/messages/new`, prevURL: '/messages/list' })

	// const getFavs = () => {
	// 	// const { order, orderBy } = this.state
	// 	// const { favorites, messages } = this.props
	// 	let favs = favorites.filter(f => f.type === 'message')
	// 	let favMessages = favs.map(f => {
	// 		return messages[messages.findIndex(d => d.id === f.id)]
	// 	})
	// 	favMessages = handleRequestSort(orderBy, order, favMessages)
	// 	return favMessages
	// }
	// const addToFavorites = (favObj) => {
	// 	dispatch(addToFav(favObj))
	// 	setAnchorElMenu(null)
	// 	// this.setState({ anchorElMenu: null })
	// }
	// const removeFromFavorites = (favObj) => {
	// 	dispatch(removeFromFav(favObj))
	// 	setAnchorElMenu(null)
	// 	// this.setState({ anchorElMenu: null })
	// }
	const filterItemsFunc = (data) => {
		// const rFilters = this.props.filters
		// const { filters } = this.state
		return customFilterItems(filterItems(data, stateFilters), filters)
	}
	// const snackBarMessages = (msg, display) => {
	// 	// const { s } = this.props
	// 	// const { selected } = this.state
	// 	switch (msg) {
	// 		case 1:
	// 			s('snackbars.deletedSuccess')
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }
	// const reload = async () => {
	// 	await getData(true)
	// }
	const getData = async (reload) => {
		// const { getMessages, /* setMessages, */ accessLevel, user, messages } = this.props
		// setMessages()
		if (accessLevel || user) {
			if (reload || messages.length === 0)
				dispatch(getMessages(user.org.id, true, accessLevel.apisuperuser ? true : false))
		}
	}
	//#endregion

	//#region Handlers

	const handleRequestSort = key => (event, property, way) => {
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

	// const handleOpenDeleteDialog = () => {
	// 	setOpenDelete(true)
	// 	setAnchorElMenu(null)
	// 	// this.setState({ openDelete: true, anchorElMenu: null })
	// }

	// const handleCloseDeleteDialog = () => {
	// 	setOpenDelete(false)
	// 	// this.setState({ openDelete: false })
	// }
	// const handleOpenUnassignDevice = () => {
	// 	setOpenUnassignDevice(true)
	// 	// this.setState({
	// 	// 	openUnassignDevice: true
	// 	// })
	// }

	// const handleCloseUnassignDevice = () => {
	// 	setOpenUnassignDevice(false)
	// 	setAnchorEl(null)
	// 	// this.setState({
	// 	// 	openUnassignDevice: false, anchorEl: null
	// 	// })
	// }
	const handleOpenMessage = msg => e => {
		setOpenMessage(true)
		setMsg(msg)
		// this.setState({
		// 	openMessage: true,
		// 	msg: msg
		// })
	}
	const handleCloseMessage = () => {
		setOpenMessage(false)
		setMsg(null)
		// this.setState({
		// 	openMessage: false,
		// 	msg: null
		// })
	}
	const renderMessage = () => {
		// let { openMessage, msg } = this.state
		let { classes } = props
		return <Dialog
			open={openMessage}
			onClose={handleCloseMessage}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			PaperProps={{
				style: {
					width: 600
				}
			}}
		>
			{msg ?
				<Fragment>
					<DialogTitle disableTypography >
						<ItemG container justify={'space-between'} alignItems={'center'}>

							{msg.deviceName}

							<IconButton aria-label="Close" className={classes.closeButton} onClick={handleCloseMessage}>
								<Close />
							</IconButton>
						</ItemG>
					</DialogTitle>
					<DialogContent>
						<ItemG container>
							<ItemG xs={6}>
								<Caption>{t('messages.fields.registryName')}</Caption>
								<Info>{msg.registryName}</Info>
							</ItemG>
							<ItemG xs={6}>
								<Caption>{t('orgs.fields.name')}</Caption>
								<Info>{msg.customerName}</Info>
							</ItemG>
							<ItemG xs={12}>
								<Caption>{t('messages.fields.receivedAt')}</Caption>
								<Info>{dateTimeFormatter(msg.created, true)}</Info>
							</ItemG>
							<ItemG xs={12}>
								<Caption>{t('messages.fields.data')}</Caption>
								<div className={classes.editor}>
									<AceEditor
										mode={'json'}
										// TODO
										theme={props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
										value={JSON.stringify(msg.data, null, 4)}
										showPrintMargin={false}
										style={{ width: '100%', height: '300px' }}
										name="seeMsgData"
									/>
								</div>
							</ItemG>
						</ItemG>
					</DialogContent>
				</Fragment>
				: <div />}
		</Dialog>
	}


	const renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Fragment>
			{/* <Tooltip title={t('menus.create.message')}>
				<IconButton aria-label='Add new message' onClick={this.addNewMessage}>
					<Add />
				</IconButton>
			</Tooltip> */}
		</Fragment>
	}

	const renderTableToolBar = () => {
		// const { t } = this.props
		// const { selected } = this.state
		return <TableToolbar
			ft={ft()}
			reduxKey={'messages'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}

	const renderTable = (items, key) => {
		// const { t } = this.props
		// const { order, orderBy, selected } = this.state
		return <Fragment>
			{renderMessage()}
			<MessageTable
				data={filterItemsFunc(items)}
				// handleCheckboxClick={handleCheckboxClick}
				handleClick={handleOpenMessage}
				handleRequestSort={handleRequestSort(key)}
				// handleSelectAllClick={handleSelectAllClick}
				order={order}
				orderBy={orderBy}
				selected={selected}
				t={t}
				tableHead={messagesHeader()}
			/>
		</Fragment>
	}


	const renderMessages = () => {
		// const { classes, messages, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(messages, 'messages')}
			</Paper></Fade>
			}
		</GridContainer>
	}

	// const { messages, route, filters } = this.state
	// const { /* history,  */match } = this.props
	return (
		<Fragment>
			<Switch>
				<Route path={`${match.path}/list`} render={() => renderMessages()} />
				<Route path={`${match.path}/grid`} render={() => /* renderCards()*/ { }} />
				{/* <Route path={`${match.path}/favorites`} render={() => this.renderFavorites()} /> */}
				<Redirect path={`${match.path}`} to={`${match.path}/list`} />
			</Switch>

		</Fragment>
	)
}

export default Messages