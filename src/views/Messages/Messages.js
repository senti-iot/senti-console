import { Paper, withStyles, Dialog, IconButton, DialogContent, DialogTitle, Fade } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import MessageTable from 'components/Message/MessageTable';
import TableToolbar from 'components/Table/TableToolbar';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterItems, handleRequestSort, dateTimeFormatter } from 'variables/functions';
import { ViewList, Close } from 'variables/icons';
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
			openDelete: false,
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
			// route: this.handleTabs()
		})
	}
	//#region Constants
	tabs = () => {
		const { t, match } = this.props
		return [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `${match.url}/list` }
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
			{ key: 'customerName', name: t('orgs.fields.name'), type: 'string' },
			{ key: 'registryName', name: t('messages.fields.registryName'), type: 'string' },
			// { key: 'created', name: t('messages.fields.created'), type: 'date' },
			// { key: 'protocol', name: t('messages.fields.protocol'), type: 'dropDown', options: this.dProtocols() },
			// { key: 'activeDeviceStats.state', name: t('devices.fields.status'), type: 'dropDown', options: this.dLiveStatus() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	messagesHeader = () => {
		const { t } = this.props
		return [
			{ id: 'id', label: t('messages.fields.id'), centered: true },
			{ id: 'deviceName', label: t('messages.fields.deviceName') },
			{ id: 'registryName', label: t('messages.fields.registryName') },
			{ id: 'created', label: t('registries.fields.created') },
			{ id: 'customerName', label: t('orgs.fields.name') }
		]
	}
	options = () => {
		return []
	}
	//#endregion

	//#region Life Cycle
	componentDidMount = async () => {
		this._isMounted = 1
		this.getData()

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
										mode={'json'}
										theme={this.props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
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


	renderMessages = () => {
		const { classes, messages, loading } = this.props
		// const { selected } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable(messages, 'messages')}
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