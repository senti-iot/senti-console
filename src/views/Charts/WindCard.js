import React, { Fragment, PureComponent } from 'react';
import { Grid, IconButton, withStyles, Hidden, Tooltip, Paper, ListItemText, ListItemIcon, ListItem, Menu } from '@material-ui/core';
import {
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ShowChart, ArrowUpward, KeyboardArrowLeft, KeyboardArrowRight, Assignment, CloudDownload, MoreVert,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard,
	// ExportModal,
	DateFilterMenu,
	T,
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeYAxis } from 'redux/appState'
import { changeRawData, removeChartPeriod } from 'redux/dateTime'
// import { getSensorDataClean } from 'variables/dataRegistry';
import { getSensorDataClean } from 'variables/dataRegistry';
import { getGraph, getPeriod, handleSetDate } from 'redux/dsSystem';
// import TC from 'components/Table/TC'
import { Scrollbars } from 'react-custom-scrollbars';

class WindCard extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			raw: props.raw ? props.raw : false,
			actionAnchor: null,
			openDownload: false,
			visibility: false,
			resetZoom: false,
			zoomDate: [],
			loading: true,
			chartType: 'linear',
			initialPeriod: null
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
	windDirections = [
		{ id: 0, value: 0, direction: 'N' },
		{ id: 1, value: 22.5, direction: 'NNE' },
		{ id: 2, value: 45, direction: 'NE' },
		{ id: 3, value: 67.5, direction: 'ENE' },
		{ id: 4, value: 90, direction: 'E' },
		{ id: 5, value: 112.5, direction: 'ESE' },
		{ id: 6, value: 135, direction: 'SE' },
		{ id: 7, value: 157.5, direction: 'SSE' },
		{ id: 8, value: 180, direction: 'S' },
		{ id: 9, value: 202.5, direction: 'SSW' },
		{ id: 10, value: 225, direction: 'SW' },
		{ id: 11, value: 247.5, direction: 'WSW' },
		{ id: 12, value: 270, direction: 'W' },
		{ id: 13, value: 292.5, direction: 'WNW' },
		{ id: 14, value: 315, direction: 'NW' },
		{ id: 15, value: 337.5, direction: 'NNW' },
	]
	componentDidMount = async () => {
		const { period } = this.props
		const { loading } = this.state
		if (period && loading) {
			await this.getData(period)
		}
	}
	asyncForEach = async (array, callback) => {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	}
	// start = async () => {
	// 	await this.asyncForEach([1, 2, 3], async (num) => {
	// 	  await waitFor(50);
	// 	});
	//   }
	getData = async () => {
		const { g, period } = this.props
		let d = g.dataSource
		let data = []
		data = await getSensorDataClean(d.deviceId, period.from, period.to, d.dataKey, d.cf, d.deviceType, d.type)
		// await this.asyncForEach(g.dataSources, async d => {
		// 	let deviceData = )
		// 	data.push({ ...d, data: deviceData })
		// })
		this.setState({
			data: data, loading: false
		})


	}
	componentDidUpdate = async (prevProps) => {
		if (prevProps.period !== this.props.period ||
			prevProps.period.from !== this.props.period.from /* || prevProps.period.timeType !== this.props.period.timeType || prevProps.period.raw !== this.props.period.raw */) {
			this.setState({ loading: true }, async () => {
				let newState = await this.getData(this.props.period)
				this.setState({ ...newState, loading: false })
			})
		}
	}
	handleSetDate = async (menuId, to, from, defaultT, chartType) => {
		const { dId, gId, period } = this.props
		await this.props.handleSetDate(dId, gId, { menuId, to, from, timeType: defaultT, chartType: chartType ? chartType : period.chartType })
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

	handleVisibility = () => (event) => {
		if (event)
			event.preventDefault()
		// this.props.changeChartType(this.props.period, id)
		this.setState({ actionAnchorVisibility: null })
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
						return this.handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return this.handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = this.futureTester(to, 'day') ? moment() : to
			}
		}
		this.handleSetDate(6, to, from, period.timeType, period.id)
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
						return this.handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return this.handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf('day')
				to = moment(period.to).subtract(diff + 1, 'minute').endOf('day')
			}
		}
		this.handleSetDate(6, to, from, period.timeType, period.id)
	}
	renderTitle = (small) => {
		const { period, title, t } = this.props
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container alignItems={'center'} justify={small ? 'center' : undefined}>
			{small ? null :
				<Hidden xsDown>
					<ItemG xs zeroMinWidth>
						<Tooltip enterDelay={1000} title={title}>
							<div>
								<T noWrap variant={'h6'}>{title}</T>
							</div>
						</Tooltip>
					</ItemG>
				</Hidden>
			}
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

		</ItemG>
	}
	relDiff(oldNumber, newNumber) {
		var decreaseValue = oldNumber - newNumber;
		return ((decreaseValue / oldNumber) * 100).toFixed(3);
	}
	renderThumb = ({ style, ...props }) => {
		// const { top } = this.state;
		const { classes } = this.props
		// const thumbStyle = {
		// 	backgroundColor: `#ffffffaa`,
		// 	borderRadius: 8
		// };
		return (
			<div
				className={classes.scrollbar}
				style={{ ...style }}
				{...props} />
		);
	}
	renderContainer = ({ style, ...props }) => {
		const viewStyle = {
			display: 'inline-flex'
		}
		return (
			<div
				style={{ ...style, ...viewStyle }}
			/>)
	}
	renderType = () => {
		const { loading, data } = this.state
		if (!loading) {
			return <ItemG xs={12}>
				<Scrollbars
					renderThumbHorizontal={this.renderThumb}
					renderThumbVertical={this.renderThumb}
					renderView={this.renderContainer}
					style={{ maxWidth: '100%' }}>
					{Object.keys(data).reverse().map((a, i) => {
						return <Paper style={{ minHeight: 200, minWidth: 100, margin: 4 }} key={i}>
							<ItemG container alignItems={'center'} style={{ height: '100%' }}>
								<ItemG xs={12}>
									<T style={{ textAlign: 'center' }}>
										{moment(a).format('ll')}
									</T>
								</ItemG>
								<ItemG xs={12}>
									<T style={{ textAlign: 'center' }}>
										{moment(a).format('HH:mm:ss')}
									</T>
								</ItemG>
								<ItemG xs={12}>
									<T style={{ textAlign: 'center', fontWeight: 600 }}>
										{this.windDirections[data[a]].direction}
									</T>
								</ItemG>
								<ItemG container justify={'center'} xs={12}>
									<div style={{ transform: `rotate(${this.windDirections[data[a]].value + 180}deg)` }}>
										<ArrowUpward />
									</div>
								</ItemG>
							</ItemG>
						</Paper>
					}
					)}
				</Scrollbars>
			</ItemG>
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
		const { t } = this.props
		const { actionAnchor } = this.state
		// let displayTo = dateTimeFormatter(period.to)
		// let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container>
			<Tooltip title={t('menus.menu')}>
				<IconButton
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					onClick={this.handleOpenActionsDetails}>
					<MoreVert />
				</IconButton>
			</Tooltip>
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

	renderIcon = () => {
		return <Assignment />
	}

	renderSmallTitle = () => {
		const { title, classes } = this.props
		return <ItemG xs={12} container justify={'center'}>
			<T className={classes.smallTitle} variant={'h6'}>{title}</T>
		</ItemG>
	}

	render() {
		const { classes, color, g } = this.props
		const { loading, /* openDownload,  exportData */ } = this.state
		let small = g ? g.grid ? g.grid.w <= 4 ? true : false : false : false

		return (
			<Fragment>
				<InfoCard
					color={color}
					title={this.renderTitle(small)}
					// subheader={`${this.options[period.menuId].label}, ${period.raw ? t('collections.rawData') : t('collections.calibratedData')}`}
					avatar={this.renderIcon()}
					noExpand
					dashboard
					headerClasses={{
						root: small ? classes.smallSubheader : classes.subheader
					}}
					bodyClasses={{
						root: small ? classes.smallBody : classes.body
					}}
					topAction={this.renderMenu()}
					content={
						<Grid container style={{ height: '100%', width: '100%' }}>
							{loading ? <div style={{ height: '100%', width: '100%' }}><CircularLoader notCentered /></div> :
								<Fragment>
									<Hidden xsDown>
										{small ? this.renderSmallTitle() : null}
									</Hidden>
									<Hidden smUp>
										{this.renderSmallTitle()}
									</Hidden>
									{this.renderType()}
								</Fragment>
							}
						</Grid>}
				/>
			</Fragment >
		);
	}
}
const mapStateToProps = (state, ownProps) => ({
	g: getGraph(state, ownProps.gId, ownProps.create),
	period: getPeriod(state, ownProps.gId, ownProps.create)
})

const mapDispatchToProps = dispatch => ({
	handleSetDate: async (dId, gId, p) => dispatch(await handleSetDate(dId, gId, p)),
	changeYAxis: (val) => dispatch(changeYAxis(val)),
	removePeriod: (pId) => dispatch(removeChartPeriod(pId)),
	changeRawData: (p) => dispatch(changeRawData(p))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(WindCard))