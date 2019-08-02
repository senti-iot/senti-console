import React, { PureComponent, Fragment } from 'react';
import {
	Grid, IconButton, Menu, withStyles, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Hidden, Typography, Tooltip, colors,
} from '@material-ui/core';
import {
	Timeline, MoreVert,
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ExpandMore, Visibility, ShowChart, ArrowUpward, CloudDownload, LinearScale, KeyboardArrowLeft, KeyboardArrowRight,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard, BarChart,
	MultiLineChart,
	DoughnutChart,
	PieChart,
	DateFilterMenu,
	T,
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import classNames from 'classnames';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeYAxis } from 'redux/appState'
import { changeChartType, changeRawData, removeChartPeriod } from 'redux/dateTime'
import { handleSetDate, getGraph, getPeriod, /* getGraph, getPeriod */ } from 'redux/dsSystem';
import { getSensorDataClean } from 'variables/dataRegistry';
import { setDailyData, setMinutelyData, setHourlyData } from 'components/Charts/DataModel';

class DoubleChartData extends PureComponent {
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
		// { id: 0, icon: <PieChartRounded />, label: this.props.t('charts.type.pie') },
		// { id: 1, icon: <DonutLargeRounded />, label: this.props.t('charts.type.donut') },
		{ id: 2, icon: <BarChartIcon />, label: this.props.t('charts.type.bar') },
		{ id: 3, icon: <ShowChart />, label: this.props.t('charts.type.line') }
	]
	componentDidMount = async () => {
		const { period } = this.props
		const { loading } = this.state
		if (period && loading) {
			await this.getData()
		}
	}
	setData = (data, timeType) => {
		const { g, title, color } = this.props

		console.log(timeType)
		switch (timeType) {
			case 0:
				return setMinutelyData([{ data: data, name: title, color: colors[color][500], id: g.id }], g.period.from, g.period.to)
			case 1:
				return setHourlyData([{ data: data, name: title, color: colors[color][500], id: g.id }], g.period.from, g.period.to)
			case 2:
				return setDailyData([{ data: data, name: title, color: colors[color][500], id: g.id }], g.period.from, g.period.to)
			default:
				break;
		}
	}
	getData = async () => {
		const { g, period } = this.props
		if (g.dataSource.dataKey) {
			let data = await getSensorDataClean(g.dataSource.deviceId, period.from, period.to, g.dataSource.dataKey, g.dataSource.cf, g.dataSource.deviceType, g.dataSource.type, g.dataSource.calc)
			// let newState = setDailyData([{ data: data, name: title, color: colors[color][500], id: g.id }], g.period.from, g.period.to)
			let newState = this.setData(data, period.timeType)
			this.setState({
				...newState, loading: false
			})
		}
		else {
			this.setState({
				loading: false
			})
		}
	}
	componentDidUpdate = async (prevProps, prevState) => {

		if (prevProps.period.menuId !== this.props.period.menuId ||
			prevProps.period.timeType !== this.props.period.timeType ||
			prevProps.g !== this.props.g ||
			prevProps.g.dataSource.dataKey !== this.props.g.dataSource.dataKey ||
			prevProps.period.from !== this.props.period.from
		) {
			this.setState({ loading: true }, async () => {
				this.getData()
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
		const { period } = this.props
		// this.props.changeChartType(this.props.period, id)
		this.handleSetDate(period.menuId, period.to, period.from, period.timeType, id)
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
					this.handleSetDate(6, endDate, startDate, 1, period.id)
					break;
				case 1:
					startDate = zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					this.setState({ resetZoom: false, zoomDate: [] })
					this.handleSetDate(6, endDate, startDate, 2, period.id)
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
						this.handleSetDate(6, endDate, startDate, 0, period.id)
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
						this.handleSetDate(6, endDate, startDate, 1, period.id)
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
	renderType = () => {
		const { title, setHoverID, t, device, period, single, hoverID } = this.props
		const { loading } = this.state
		if (!loading) {
			const { roundDataSets, lineDataSets, barDataSets } = this.state
			switch (period.chartType) {
				case 0:
					return roundDataSets ?
						<ItemG container >
							{roundDataSets.map((d, i) => {
								return <ItemG style={{ marginBottom: 30 }} key={i} xs={12} md/* md={roundDataSets.length >= 2 ? period.length > 2 ? 12 : 6 : 12} */ direction={'column'} container justify={'center'}>
									<div style={{ maxHeight: 200 }}>
										<PieChart
											title={title}
											single
											unit={this.timeTypes[period.timeType]}
											setHoverID={setHoverID}
											data={d}
											t={t}
										/>
									</div>
									<Typography align={'center'} variant={'subtitle1'}>{d.name}</Typography>
								</ItemG>
							})}
						</ItemG>
						: this.renderNoData()
				case 1:
					return roundDataSets ?
						<ItemG container >
							{roundDataSets.map((d, i) => {
								return <ItemG style={{ marginBottom: 30 }} key={i} xs={12} md direction={'column'} container justify={'center'}>
									<div style={{ maxHeight: 200 }}>
										<DoughnutChart
											// height={200}
											title={title}
											single
											unit={this.timeTypes[period.timeType]}
											setHoverID={setHoverID}
											data={d}
											t={t}
										/>
									</div>
									<Typography align={'center'} variant={'subtitle1'}>{d.name}</Typography>
								</ItemG>
							})}
						</ItemG>
						: this.renderNoData()
				case 2:
					return barDataSets ?
						<BarChart
							chartYAxis={this.state.chartType}
							single={single}
							hoverID={hoverID}
							obj={device}
							unit={this.timeTypes[period.timeType]}
							onElementsClick={this.handleZoomOnData}
							setHoverID={setHoverID}
							data={barDataSets}
							t={t}
						/> : this.renderNoData()
				case 3:

					return lineDataSets ?
						<MultiLineChart
							chartYAxis={this.state.chartType}
							single={single}
							hoverID={this.props.hoverID}
							handleReverseZoomOnData={this.handleReverseZoomOnData}
							resetZoom={this.state.resetZoom}
							obj={device}
							unit={this.timeTypes[period.timeType]}
							onElementsClick={this.handleZoomOnData}
							setHoverID={setHoverID}
							data={lineDataSets}
							t={t}
						/> : this.renderNoData()
				default:
					return null
			}
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
	handleSetDate = async (menuId, to, from, defaultT, chartType) => {
		const { dId, gId, period } = this.props
		await this.props.handleSetDate(dId, gId, { menuId, to, from, timeType: defaultT, chartType: chartType ? chartType : period.chartType })
	}
	renderMenu = () => {
		const { actionAnchor, resetZoom } = this.state
		const { classes, t, /* period */ } = this.props
		// let displayTo = dateTimeFormatter(period.to)
		// let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container direction={'column'}>

			<ItemG container>
				<Collapse in={resetZoom}>
					{resetZoom && <Tooltip title={t('tooltips.chart.resetZoom')}>
						<IconButton onClick={this.handleReverseZoomOnData}>
							<ArrowUpward />
						</IconButton>
					</Tooltip>
					}
				</Collapse>

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
					<div>
						<ListItem button onClick={() => { this.setState({ visibility: !this.state.visibility }) }}>
							<ListItemIcon>
								<Visibility />
							</ListItemIcon>
							<ListItemText primary={t('filters.options.graphType')} />
							<ExpandMore className={classNames({
								[classes.expandOpen]: this.state.visibility,
							}, classes.expand)} />
						</ListItem>
						<Collapse in={this.state.visibility} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								{this.visibilityOptions.map(op => {
									return <ListItem key={op.id} button className={classes.nested} onClick={this.handleVisibility(op.id)}>
										<ListItemIcon>
											{op.icon}
										</ListItemIcon>
										<ListItemText primary={op.label} />
									</ListItem>
								})}
							</List>
						</Collapse>
					</div>
					<ListItem button onClick={() => this.handleChangeChartType(this.state.chartType === 'linear' ? 'logarithmic' : 'linear')}>
						<ListItemIcon>
							{this.state.chartType !== 'linear' ? <LinearScale /> : <Timeline />}
						</ListItemIcon>
						<ListItemText>
							{t(this.state.chartType !== 'linear' ? 'settings.chart.YAxis.linear' : 'settings.chart.YAxis.logarithmic')}
						</ListItemText>
					</ListItem>
					<ListItem button onClick={this.handleOpenDownloadModal}>
						<ListItemIcon><CloudDownload /></ListItemIcon>
						<ListItemText>{t('menus.export')}</ListItemText>
					</ListItem>

				</Menu>
			</ItemG>
		</ItemG>
	}
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t('devices.noData')}</Caption>
		</ItemG>
	}

	renderIcon = () => {
		const { period } = this.props
		switch (period.chartType) {
			case 0:
				return <PieChartRounded />
			case 1:
				return <DonutLargeRounded />
			case 2:
				return <BarChartIcon />
			case 3:
				return <ShowChart />
			default:
				break;
		}
	}
	renderSmallTitle = () => {
		const { title, classes } = this.props
		return <ItemG xs={12} container justify={'center'}>
			<T className={classes.smallTitle} variant={'h6'}>{title}</T>
		</ItemG>
	}
	render() {
		const { color, classes, g } = this.props
		const { loading } = this.state
		let small = g ? g.grid ? g.grid.w <= 4 ? true : false : false : false

		return (
			<InfoCard
				color={color}
				title={this.renderTitle(small)}
				// subheader={`${this.options[period.menuId].label}`}
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
						{loading ? <div style={{ height: 300, width: '100%' }}><CircularLoader notCentered /></div> :
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
	changeChartType: (p, chartId) => dispatch(changeChartType(p, chartId)),
	changeRawData: (p) => dispatch(changeRawData(p))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(DoubleChartData))