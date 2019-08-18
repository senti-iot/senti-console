import { Paper, withStyles, Dialog, IconButton, DialogContent, DialogTitle, DialogContentText, List, ListItem, ListItemText, DialogActions, Button, ListItemIcon, Fade } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import MessageTable from 'components/Message/MessageTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort, dateTimeFormatter } from 'variables/functions';
import { Delete, Edit, ViewList, ViewModule, Star, StarBorder, Close } from 'variables/icons';
import { GridContainer, CircularLoader, ItemG, Caption, Info, /* AssignProject */ } from 'components'
// import MessagesCards from './MessagesCards';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { customFilterItems } from 'variables/Filters';
import { getMessages, setMessages, sortData } from 'redux/data';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/theme/monokai';

class Messages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			openMessage: false,
			openAssignDevice: false,
			openAssignProject: false,
			openUnassignDevice: false,
			openDelete: false,
			route: 0,
			order: 'asc',
			orderBy: 'id',
			filters: {
				keyword: '',
			}
		}
		props.setHeader('sidebar.messages', false, '', 'messages')
		props.setBC('messages')
		props.setTabs({
			id: 'messages',
			tabs: this.tabs(),
			route: this.handleTabs()
		})
	}
	//#region Constants
	tabs = () => {
		const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` },
			{ id: 1, title: t('tooltips.cardView'), label: <ViewModule />, url: `${match.url}/grid` },
			// { id: 2, title: t('tooltips.favorites'), label: <Star />, url: `${match.url}/favorites` }
		]
	}
	dProtocols = () => {
		const { t } = this.props
		return [
			{ value: 0, label: t("messages.fields.protocols.none") },
			{ value: 1, label: t("messages.fields.protocols.mqtt") },
			{ value: 2, label: t("messages.fields.protocols.http") },
			{ value: 3, label: `${t('messages.fields.protocols.mqtt')} & ${t('messages.fields.protocols.http')}` }
		]
	}
	ft = () => {
		const { t } = this.props
		return [
			// { key: 'name', name: t('messages.fields.name'), type: 'string' },
			// { key: 'customer_name', name: t('orgs.fields.name'), type: 'string' },
			// { key: 'created', name: t('messages.fields.created'), type: 'date' },
			// { key: 'protocol', name: t('messages.fields.protocol'), type: 'dropDown', options: this.dProtocols() },
			// { key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	messagesHeader = () => {
		const { t } = this.props
		return [
			{ id: 'id', label: t('messages.fields.id') },
			{ id: 'deviceName', label: t('messages.fields.deviceName') },
			{ id: 'registryName', label: t('messages.fields.registryName') },
			{ id: 'created', label: t('registries.fields.created') },
			{ id: 'customerName', label: t('orgs.fields.name') }
		]
	}
	options = () => {
		const { t, isFav, messages } = this.props
		const { selected } = this.state
		let message = messages[messages.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: message.id,
			name: message.name,
			type: 'message',
			path: `/message/${message.id}`
		}
		let isFavorite = isFav(favObj)
		let allOptions = [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			// { label: t('menus.assign.messageToProject'), func: this.handleOpenAssignProject, single: true, icon: LibraryBooks },
			// { label: t('menus.assign.deviceToMessage'), func: this.handleOpenAssignDevice, single: true, icon: DeviceHub },
			// { label: t('menus.unassign.deviceFromMessage'), func: this.handleOpenUnassignDevice, single: true, icon: LayersClear, dontShow: messages[messages.findIndex(c => c.id === selected[0])].activeDeviceStats ? false : true },
			// { label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
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
			const { messages } = this.props
			const { selected } = this.state
			let message = messages[messages.findIndex(d => d.id === selected[0])]
			if (message) {
				if (isFav({ id: message.id, type: 'message' })) {
					s('snackbars.favorite.saved', { name: message.name, type: t('favorites.types.message') })
					finishedSaving()
					this.setState({ selected: [] })
				}
				if (!isFav({ id: message.id, type: 'message' })) {
					s('snackbars.favorite.removed', { name: message.name, type: t('favorites.types.message') })
					finishedSaving()
					this.setState({ selected: [] })
				}
			}
		}
	}
	componentWillUnmount = () => {
		// this._isMounted = 0
	}
	//#endregion

	//#region Functions
	addNewMessage = () => this.props.history.push({ pathname: `/messages/new`, prevURL: '/messages/list' })

	getFavs = () => {
		const { order, orderBy } = this.state
		const { favorites, messages } = this.props
		let favs = favorites.filter(f => f.type === 'message')
		let favMessages = favs.map(f => {
			return messages[messages.findIndex(d => d.id === f.id)]
		})
		favMessages = handleRequestSort(orderBy, order, favMessages)
		return favMessages
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
	snackBarMessages = (msg, display) => {
		const { s } = this.props
		// const { selected } = this.state
		switch (msg) {
			case 1:
				s('snackbars.deletedSuccess')
				break;
			// case 2:
			// 	s('snackbars.exported')
			// 	break;
			// case 3:
			// 	s('snackbars.assign.deviceToMessage', { message: ``, what: 'Device' })
			// 	break;
			// case 6:
			// 	s('snackbars.assign.deviceToMessage', { message: `${messages[messages.findIndex(c => c.id === selected[0])].name}`, device: display })
			// 	break
			default:
				break;
		}
	}
	reload = async () => {
		await this.getData(true)
	}
	getData = async (reload) => {
		const { getMessages, /* setMessages, */ accessLevel, user, messages } = this.props
		// setMessages()
		if (accessLevel || user) {
			if (reload || messages.length === 0)
				getMessages(user.org.id, true, accessLevel.apisuperuser ? true : false)
		}
	}
	//#endregion

	//#region Handlers

	handleEdit = () => {
		const { selected } = this.state
		this.props.history.push({ pathname: `/message/${selected[0]}/edit`, prevURL: `/messages/list` })
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
	handleMessageClick = id => e => {
		e.stopPropagation()
		this.props.history.push('/message/' + id)
	}

	handleFavClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: '/message/' + id, prevURL: '/messages/favorites' })
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
	handleDeleteMessages = async () => {
		// const { selected } = this.state
		// Promise.all([selected.map(u => {
		// 	return deleteMessage(u)
		// })]).then(async () => {
		// 	this.setState({ openDelete: false, anchorElMenu: null, selected: [] })
		// 	await this.getData(true).then(
		// 		() => this.snackBarMessages(1)
		// 	)
		// })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.messages.map(n => n.id) })
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
				this.snackBarMessages(6, display)
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
				this.snackBarMessages(6)
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
	handleOpenMessage = msg => e => {
		this.setState({
			openMessage: true,
			msg: msg
		})
	}
	handleCloseMessage = () => {
		this.setState({
			openMessage: false,
			msg: null
		})
	}
	renderMessage = () => {
		let { openMessage, msg } = this.state
		let { t, classes } = this.props
		return <Dialog
			open={openMessage}
			onClose={this.handleCloseMessage}
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

							<IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleCloseMessage}>
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
										height={300}
										mode={'json'}
										theme={this.props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
										// onChange={handleCodeChange('js')}
										value={JSON.stringify(msg.data, null, 4)}
										showPrintMargin={false}
										style={{ width: '100%' }}
										name="seeMsgData"
										// editorProps={{ $blockScrolling: true }}
									/>
								</div>
							</ItemG>
						</ItemG>
					</DialogContent>
				</Fragment>
				: null}
		</Dialog>
	}
	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { t, classes, messages } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.messages')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.messages')}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={messages[messages.findIndex(d => d.id === s)].name} /></ListItem>)}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteMessages} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}


	renderTableToolBarContent = () => {
		// const { t } = this.props
		return <Fragment>
			{/* <Tooltip title={t('menus.create.message')}>
				<IconButton aria-label='Add new message' onClick={this.addNewMessage}>
					<Add />
				</IconButton>
			</Tooltip> */}
		</Fragment>
	}

	renderTableToolBar = () => {
		const { t } = this.props
		const { selected } = this.state
		return <TableToolbar
			ft={this.ft()}
			reduxKey={'messages'}
			numSelected={selected.length}
			options={this.options}
			t={t}
			content={this.renderTableToolBarContent()}
		/>
	}

	renderTable = (items, key) => {
		const { t } = this.props
		const { order, orderBy, selected } = this.state
		return <Fragment>
			{this.renderMessage()}
			<MessageTable
				data={this.filterItems(items)}
				handleCheckboxClick={this.handleCheckboxClick}
				handleClick={this.handleOpenMessage}
				handleRequestSort={this.handleRequestSort(key)}
				handleSelectAllClick={this.handleSelectAllClick}
				order={order}
				orderBy={orderBy}
				selected={selected}
				t={t}
				tableHead={this.messagesHeader()}
			/>
		</Fragment>
	}

	renderCards = () => {
		const { /* t, history, messages, */ loading } = this.props
		return loading ? <CircularLoader /> :
			// <MessageCards messages={this.filterItems(messages)} t={t} history={history} />
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

	renderMessages = () => {
		const { classes, messages, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable(messages, this.handleMessageClick, 'messages')}
				{this.renderConfirmDelete()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	render() {
		// const { messages, route, filters } = this.state
		const { /* history,  */match } = this.props
		return (
			<Fragment>
				<Switch>
					<Route path={`${match.path}/list`} render={() => this.renderMessages()} />
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
	messages: state.data.messages,
	loading: !state.data.gotmessages,
	filters: state.appState.filters.messages,
	user: state.settings.user
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getMessages: (reload, customerID, ua) => dispatch(getMessages(reload, customerID, ua)),
	setMessages: () => dispatch(setMessages()),
	sortData: (key, property, order) => dispatch(sortData(key, property, order))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles, { withTheme: true })(Messages))