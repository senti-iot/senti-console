import React, { Fragment, PureComponent } from 'react';
import {
	Grid, IconButton, Menu, withStyles, ListItem,
	ListItemIcon, ListItemText, List, Tooltip, DialogTitle, DialogContent, Dialog, Divider
} from '@material-ui/core';
import {
	MoreVert,
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ShowChart, CloudDownload, KeyboardArrowLeft, KeyboardArrowRight, InsertChart, Close,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard,
	DateFilterMenu,
	T
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeYAxis } from 'redux/appState'
import { changeDate, changeChartType, changeRawData, removeChartPeriod } from 'redux/dateTime'
import TP from 'components/Table/TP';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/theme/monokai';

class SensorMessages extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			raw: props.raw ? props.raw : false,
			actionAnchor: null,
			openMessage: false,
			visibility: false,
			resetZoom: false,
			zoomDate: [],
			loading: true,
			chartType: 'linear',
			initialPeriod: null,
			page: 0,
			msg: null
		}
	}

	displayFormat = 'DD MMMM YYYY HH:mm'
	image = null
	options = [
		{ id: 0, label: this.props.t('filters.dateOptions.today') },
		{ id: 1, label: this.props.t('filters.dateOptions.yesterday') },
		{ id: 2, label: this.props.t('filters.dateOptions.thisWeek') },
		{ id: 3, label: this.props.t('filters.dateOptions.7days') },
		{ id: 4, label: this.props.t('filters.dateOptions.30days') },
		{ id: 5, label: this.props.t('filters.dateOptions.90days') },
		{ id: 6, label: this.props.t('filters.dateOptions.custom') },
	]
	timeTypes = [
		{ id: 0, format: 'lll dddd', chart: 'minute', tooltipFormat: 'LT' },
		{ id: 1, format: 'lll dddd', chart: 'hour', tooltipFormat: 'LT' },
		{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' },
		{ id: 3, format: 'lll dddd', chart: 'month', tooltipFormat: 'll' },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t('charts.type.pie') },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t('charts.type.donut') },
		{ id: 2, icon: <BarChartIcon />, label: this.props.t('charts.type.bar') },
		{ id: 3, icon: <ShowChart />, label: this.props.t('charts.type.line') }
	]
	componentDidMount = async () => {
		const { period } = this.props
		const { loading } = this.state
		if (period && loading) {
			await this.props.getData()
			this.setState({ loading: false })
		}
	}
	componentDidUpdate = async (prevProps) => {
		if (prevProps.period !== this.props.period /* || prevProps.period.timeType !== this.props.period.timeType || prevProps.period.raw !== this.props.period.raw */) {
			this.setState({ loading: true }, async () => {
				let newState = await this.props.getData()
				this.setState({ ...newState, loading: false })
			})
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		this.setState({
			raw: this.props.raw ? this.props.raw : false,
			actionAnchor: null,
			openDownload: false,
			visibility: false,
			resetZoom: false,
			zoomDate: [],
			loading: true,
			chartType: 'linear',
			initialPeriod: null
		})
	}
	handleChangeChartType = (type) => {
		this.setState({
			chartType: type
		})
	}
	handleCloseDownloadModal = () => {
		this.setState({ openDownload: false })
	}
	handleOpenDownloadModal = () => {
		this.setState({ openDownload: true, actionAnchor: null })
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	handleVisibility = id => (event) => {
		if (event)
			event.preventDefault()
		this.props.changeChartType(this.props.period, id)
		this.setState({ actionAnchorVisibility: null })
	}

	handleReverseZoomOnData = async () => {
		const { period } = this.props
		const { zoomDate } = this.state
		let startDate = null
		let endDate = null
		try {
			switch (period.timeType) {
				case 0:
					startDate = zoomDate.length > 1 ? moment(zoomDate[1].from).startOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 1 ? moment(zoomDate[1].to).endOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					if (zoomDate.length === 1) {
						this.setState({ resetZoom: false, zoomDate: [] })
					}
					this.props.handleSetDate(6, endDate, startDate, 1, period.id)
					break;
				case 1:
					startDate = zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					this.setState({ resetZoom: false, zoomDate: [] })
					this.props.handleSetDate(6, endDate, startDate, 2, period.id)
					break;
				default:
					break;
			}
		}
		catch (e) {
		}
	}

	handleZoomOnData = async (elements) => {
		if (elements.length > 0) {
			const { period } = this.props
			const { lineDataSets } = this.state
			let date = null
			let startDate = null
			let endDate = null
			try {
				date = lineDataSets.datasets[elements[0]._datasetIndex].data[elements[0]._index].x
				switch (period.timeType) {
					case 1:
						startDate = moment(date).startOf('hour')
						endDate = moment(date).endOf('hour').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('hour')
						this.setState({
							resetZoom: true,
							zoomDate: [
								...this.state.zoomDate,
								{
									from: period.from,
									to: period.to
								}]
						})
						this.props.handleSetDate(6, endDate, startDate, 0, period.id)
						break
					case 2:
						startDate = moment(date).startOf('day')
						endDate = moment(date).endOf('day').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('day')
						this.setState({
							resetZoom: true,
							zoomDate: [{
								from: period.from,
								to: period.to
							}]
						})
						this.props.handleSetDate(6, endDate, startDate, 1, period.id)
						break;
					default:
						break;
				}
			}
			catch (error) {
			}
		}
	}
	futureTester = (date, unit) => moment().diff(date, unit) <= 0
	handleNextPeriod = () => {
		const { period } = this.props
		const { initialPeriod } = this.state
		let from, to, diff;
		if (!initialPeriod) {
			this.setState({ initialPeriod: period })
			if (period.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf(this.timeTypes[period.timeType].chart)
				to = moment(period.to).add(diff + 1, 'minute').endOf(this.timeTypes[period.timeType].chart)
				to = this.futureTester(to, this.timeTypes[period.timeType].chart) ? moment() : to
			}
			if ([0, 1].indexOf(period.menuId) !== -1) {
				from = moment(period.from).add(1, 'day').startOf('day')
				to = moment(period.to).add(1, 'day').endOf('day')
				to = this.futureTester(to, 'hour') ? moment() : to

			}
			if (period.menuId === 2) {
				from = moment(period.from).add(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).add(1, 'week').endOf('week').endOf('day')
				to = this.futureTester(to, 'day') ? moment() : to

			}
			if ([3, 4, 5].indexOf(period.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = this.futureTester(to, 'day') ? moment() : to
			}
		}
		else {
			if (initialPeriod.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf(this.timeTypes[period.timeType].chart)
				to = moment(period.to).add(diff + 1, 'minute').endOf(this.timeTypes[period.timeType].chart)
				to = this.futureTester(to, this.timeTypes[period.timeType].chart) ? moment() : to

			}
			if ([0, 1].indexOf(initialPeriod.menuId) !== -1) {
				from = moment(period.from).add(1, 'day').startOf('day')
				to = moment(period.to).add(1, 'day').endOf('day')
				to = this.futureTester(to, 'hour') ? moment() : to
			}
			if (initialPeriod.menuId === 2) {
				from = moment(period.from).add(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).add(1, 'week').endOf('week').endOf('day')
				to = this.futureTester(to, this.timeTypes[period.timeType].chart) ? moment() : to
				if (period.timeType === 2 || period.timeType === 3) {
					let dayDiff = to.diff(from, 'day')
					if (dayDiff <= 0) {
						return this.props.handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return this.props.handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = this.futureTester(to, 'day') ? moment() : to
			}
		}
		this.props.handleSetDate(6, to, from, period.timeType, period.id)
	}
	handlePreviousPeriod = () => {
		const { period } = this.props
		const { initialPeriod } = this.state
		let from, to, diff;
		if (!initialPeriod) {
			this.setState({ initialPeriod: period })
			if (period.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf(this.timeTypes[period.timeType].chart)
				to = moment(period.to).subtract(diff + 1, 'minute').endOf(this.timeTypes[period.timeType].chart)
			}
			if ([0, 1].indexOf(period.menuId) !== -1) {
				from = moment(period.from).subtract(1, 'day').startOf('day')
				to = moment(period.to).subtract(1, 'day').endOf('day')
			}
			if (period.menuId === 2) {
				from = moment(period.from).subtract(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).subtract(1, 'week').endOf('week').endOf('day')
			}
			if ([3, 4, 5].indexOf(period.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf('day')
				to = moment(period.to).subtract(diff + 1, 'minute').endOf('day')
			}
		}
		else {
			if (initialPeriod.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf(this.timeTypes[period.timeType].chart)
				to = moment(period.to).subtract(diff + 1, 'minute').endOf(this.timeTypes[period.timeType].chart)
			}
			if ([0, 1].indexOf(initialPeriod.menuId) !== -1) {
				from = moment(period.from).subtract(1, 'day').startOf('day')
				to = moment(period.to).subtract(1, 'day').endOf('day')
			}
			if (initialPeriod.menuId === 2) {
				from = moment(period.from).subtract(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).subtract(1, 'week').endOf('week').endOf('day')
				if (period.timeType === 2 || period.timeType === 3) {
					let dayDiff = to.diff(from, 'day')
					if (dayDiff <= 0) {
						return this.props.handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return this.props.handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf('day')
				to = moment(period.to).subtract(diff + 1, 'minute').endOf('day')
			}
		}
		this.props.handleSetDate(6, to, from, period.timeType, period.id)
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

							{`${dateTimeFormatter(msg.created, true)} - ${msg.id}`}

							<IconButton aria-label="Close" style={{ color: '#fff' }} className={classes.closeButton} onClick={this.handleCloseMessage}>
								<Close />
							</IconButton>
						</ItemG>
					</DialogTitle>
					<DialogContent>
						<ItemG container>
							<ItemG xs={12}>
								<Caption>{t('messages.fields.data')}</Caption>
								<Divider />
								<div className={classes.editor}>
									<AceEditor
										// height={300}
										mode={'json'}
										theme={this.props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
										// onChange={handleCodeChange('js')}
										value={JSON.stringify(msg.data, null, 4)}
										showPrintMargin={false}
										style={{ width: '100%', height: '300px' }}
										name="seeMsgData"
									// editorProps={{ $blockScrolling: true }}
									/>
								</div>
							</ItemG>
						</ItemG>
					</DialogContent>
				</Fragment>
				: <div></div>}
		</Dialog>
	}
	handleCloseMessage = () => {
		this.setState({
			msg: null,
			openMessage: false
		})
	}
	handleOpenMessage = msg => () => {
		this.setState({
			msg,
			openMessage: true
		})
	}
	messagesHeader = () => {
		const { t } = this.props
		return [
			{ id: 'id', label: t('messages.fields.id') },
			{ id: 'created', label: t('registries.fields.created') },
		]
	}
	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	renderType = () => {
		const { t, messages, rowsPerPage } = this.props
		const { loading, page } = this.state
		if (!loading) {
			return (
				<Fragment>
					<List style={{
						width: '100%'
					}}>
						{messages ? messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {

							return (
								<ListItem key={n.id} button onClick={this.handleOpenMessage(n)} divider style={{ paddingLeft: 24 }}>
									<ListItemText style={{ margin: 0 }} primary={dateTimeFormatter(n.created, true)} secondary={n.id} />
								</ListItem>
							)
						}) : null}
					</List>
					<TP
						count={messages ? messages.length : 0}
						page={page}
						t={t}
						handleChangePage={this.handleChangePage}
					/>
				</Fragment>
			)
		}

		else return this.renderNoData()
	}
	disableFuture = () => {
		const { period } = this.props
		if (moment().diff(period.to, 'hour') <= 0) {
			return true
		}
		return false
	}
	renderMenu = () => {
		const { actionAnchor } = this.state
		const { t, period } = this.props
		// const {  } = this.props
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container alignItems={'center'}>
			<ItemG style={{ width: 'auto' }} container alignItems={'center'}>
				<ItemG>
					<Tooltip title={t('tooltips.chart.previousPeriod')}>
						<IconButton onClick={() => this.handlePreviousPeriod(period)}>
							<KeyboardArrowLeft />
						</IconButton>
					</Tooltip>
				</ItemG>
				<ItemG>
					<Tooltip title={t('tooltips.chart.period')}>
						<DateFilterMenu
							button
							buttonProps={{
								style: {
									color: undefined,
									textTransform: 'none',
									padding: "8px 0px"
								}
							}}
							icon={
								<ItemG container justify={'center'}>
									<ItemG>
										<ItemG container style={{ width: 'min-content' }}>
											<ItemG xs={12}>
												<T noWrap component={'span'}>{`${displayFrom}`}</T>
											</ItemG>
											<ItemG xs={12}>
												<T noWrap component={'span'}> {`${displayTo}`}</T>
											</ItemG>
											<ItemG xs={12}>
												<T noWrap component={'span'}> {`${this.options[period.menuId].label}`}</T>
											</ItemG>
										</ItemG>

									</ItemG>

								</ItemG>
							}
							customSetDate={this.handleSetDate}
							period={period}
							t={t} />
					</Tooltip>
				</ItemG>
				<ItemG>
					<Tooltip title={t('tooltips.chart.nextPeriod')}>
						<div>
							<IconButton onClick={() => this.handleNextPeriod(period)} disabled={this.disableFuture(period)}>
								<KeyboardArrowRight />
							</IconButton>
						</div>
					</Tooltip>
				</ItemG>
			</ItemG>

			<ItemG>
				<Tooltip title={t('menus.menu')}>
					<IconButton
						aria-label='More'
						aria-owns={actionAnchor ? 'long-menu' : null}
						aria-haspopup='true'
						onClick={this.handleOpenActionsDetails}>
						<MoreVert />
					</IconButton>
				</Tooltip>
			</ItemG>
			<Menu
				marginThreshold={24}
				id='long-menu'
				anchorEl={actionAnchor}
				open={Boolean(actionAnchor)}
				onClose={this.handleCloseActionsDetails}
				onChange={this.handleVisibility}
				PaperProps={{ style: { minWidth: 250 } }}>

				<ListItem button onClick={this.handleOpenDownloadModal}>
					<ListItemIcon><CloudDownload /></ListItemIcon>
					<ListItemText>{t('menus.export')}</ListItemText>
				</ListItem>

			</Menu>
		</ItemG>
	}
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t('devices.noData')}</Caption>
		</ItemG>
	}



	render() {
		const { t } = this.props
		const { loading } = this.state
		// let displayTo = dateTimeFormatter(period.to)
		// let displayFrom = dateTimeFormatter(period.from)
		return (
			<Fragment>
				<InfoCard
					title={t('sidebar.messages')}
					// subheader={`${this.options[period.menuId].label}`}
					avatar={<InsertChart />}
					noExpand
					topAction={this.renderMenu()}
					content={
						<Grid container>
							{loading ? <div style={{ height: 300, width: '100%' }}><CircularLoader notCentered /></div> :

								<ItemG xs={12}>
									{this.renderMessage()}
									{this.renderType()}
								</ItemG>
							}
						</Grid>}
				/>
			</Fragment >
		);
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
})

const mapDispatchToProps = dispatch => ({
	handleSetDate: (id, to, from, timeType, pId) => dispatch(changeDate(id, to, from, timeType, pId)),
	changeYAxis: (val) => dispatch(changeYAxis(val)),
	removePeriod: (pId) => dispatch(removeChartPeriod(pId)),
	changeChartType: (p, chartId) => dispatch(changeChartType(p, chartId)),
	changeRawData: (p) => dispatch(changeRawData(p))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles((theme) => ({
	...deviceStyles(theme),
	...devicetableStyles(theme),
}), { withTheme: true })(SensorMessages))