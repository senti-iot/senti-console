import React, { Fragment, PureComponent } from 'react';
import {
	Grid, IconButton, withStyles, Collapse, Hidden, Typography, Tooltip, TableRow, Table, TableBody,
} from '@material-ui/core';
import {
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ShowChart, ArrowUpward, KeyboardArrowLeft, KeyboardArrowRight, GaugeIcon,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard,
	ExportModal,
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
import TC from 'components/Table/TC'

class ScoreCard extends PureComponent {
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
	componentDidMount = async () => {
		const { period } = this.props
		const { loading } = this.state
		if (period && loading) {
			await this.getData(period)
		}
	}
	getData = async () => {
		const { g, period } = this.props
		let newState = {
			a: { ...g.dataSources.a },
			b: { ...g.dataSources.b }
		}
		Promise.all([
			getSensorDataClean(g.dataSources.a.deviceId, period.from, period.to, g.dataSources.a.dataKey, g.dataSources.a.cf, g.dataSources.a.deviceType, g.dataSources.a.type),
			getSensorDataClean(g.dataSources.b.deviceId, period.from, period.to, g.dataSources.b.dataKey, g.dataSources.b.cf, g.dataSources.b.deviceType, g.dataSources.b.type),
		]).then(rs => { 
			newState.a.data = parseFloat(rs[0])
			newState.b.data = parseFloat(rs[1])
			this.setState({
				...newState, loading: false
			})
		}) 
		console.log(newState)
		// let data = await getSensorDataClean(g.dataSource.deviceId, period.from, period.to, g.dataSource.dataKey, g.dataSource.cf, g.dataSource.deviceType, g.dataSource.chartType)
	
	}
	componentDidUpdate = async (prevProps) => {
		if (prevProps.period !== this.props.period /* || prevProps.period.timeType !== this.props.period.timeType || prevProps.period.raw !== this.props.period.raw */) {
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
	renderTitle = () => {
		const { period, t, title } = this.props
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container style={{ flexFlow: 'row', alignItems: 'center' }}>
			<Hidden mdDown>
				<ItemG>
					<Tooltip title={t('tooltips.chart.previousPeriod')}>
						<IconButton onClick={this.handlePreviousPeriod}>
							<KeyboardArrowLeft />
						</IconButton>
					</Tooltip>
				</ItemG>
			</Hidden>
			<ItemG>
				<Typography component={'span'}>{`${displayFrom}`}</Typography>
				<Typography component={'span'}> {`${displayTo}`}</Typography>
			</ItemG>
			<Hidden mdDown>
				<ItemG>
					<Tooltip title={t('tooltips.chart.nextPeriod')}>
						<div>
							<IconButton onClick={this.handleNextPeriod} disabled={this.disableFuture()}>
								<KeyboardArrowRight />
							</IconButton>
						</div>
					</Tooltip>
				</ItemG>
			</Hidden>
			<ItemG>
				<T>{title}</T>
			</ItemG>
		</ItemG>
	}
	relDiff(oldNumber, newNumber) {
		var decreaseValue = oldNumber - newNumber;
		return ((decreaseValue / oldNumber) * 100).toFixed(3);
	}
	renderType = () => {
		const { loading, a, b } = this.state
		if (!loading) {
			return <Table>
				<TableBody>
					<TableRow>
						<TC label={a.label}/>
						<TC content={
							<T style={{ fontWeight: 500 }}>
								{a.data}
							</T>
						} />
					</TableRow>
					<TableRow>
						<TC label={b.label}/>
						<TC content={
							<T style={{ fontWeight: 500 }}>
								{b.data}
							</T>
						} />
					</TableRow>
					<TableRow>
						<TC label={'Difference'}/>
						<TC content={
							<T style={{ color: a.data > b.data ? 'red' : 'green', fontWeight: 500 }}>
								{a.data > b.data ? (a.data - b.data).toFixed(3) : (b.data - a.data).toFixed(3)}
							</T>
						} />
					</TableRow>
					<TableRow>
						<TC label={'Percentage Difference:'}/>
						<TC content={
							<T style={{ color: a.data > b.data ? 'red' : 'green', fontWeight: 500 }}>
								{a.data > b.data ? this.relDiff(a.data, b.data) : this.relDiff(b.data, a.data)}% 
							</T>
						}/>
					</TableRow>
				</TableBody>
			</Table>
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
		const { /* actionAnchor, actionAnchorVisibility, */ resetZoom } = this.state
		const { /* classes, */ t, period } = this.props
		return <ItemG container direction={'column'}>
			<Hidden lgUp>
				<ItemG container>
					<ItemG>
						<Tooltip title={t('tooltips.chart.previousPeriod')}>
							<IconButton onClick={() => this.handlePreviousPeriod(period)}>
								<KeyboardArrowLeft />
							</IconButton>
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
			</Hidden>
			<ItemG container>
				<ItemG>
					<Tooltip title={t('tooltips.chart.period')}>
						<DateFilterMenu
							customSetDate={this.handleSetDate}
							period={period}
							t={t} />
					</Tooltip>
				</ItemG>
				<Collapse in={resetZoom}>
					{resetZoom && <Tooltip title={t('tooltips.chart.resetZoom')}>
						<IconButton onClick={this.handleReverseZoomOnData}>
							<ArrowUpward />
						</IconButton>
					</Tooltip>
					}
				</Collapse>
			</ItemG>
		</ItemG>
	}
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t('devices.noData')}</Caption>
		</ItemG>
	}

	renderIcon = () => {
		return <GaugeIcon/>
	}

	render() {
		const { t, period } = this.props
		const { openDownload, loading, exportData } = this.state
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return (
			<Fragment>
				<InfoCard
					title={this.renderTitle()}
					subheader={`${this.options[period.menuId].label}, ${period.raw ? t('collections.rawData') : t('collections.calibratedData')}`}
					avatar={this.renderIcon()}
					noExpand
					topAction={this.renderMenu()}
					background={this.props.color}
					content={
						<Grid container style={{ minHeight: 300 }}>
							<ExportModal
								raw={period.raw}
								to={displayTo}
								from={displayFrom}
								data={exportData}
								open={openDownload}
								handleClose={this.handleCloseDownloadModal}
								t={t}
							/>
							{loading ? <div style={{ height: '100%', width: '100%' }}><CircularLoader notCentered /></div> :

								<ItemG xs={12}>
									{this.renderType()}
								</ItemG>
							}
						</Grid>}
				/>
			</Fragment >
		);
	}
}
const mapStateToProps = (state, ownProps) => ({
	g: getGraph(state, ownProps.gId),
	period: getPeriod(state, ownProps.gId)
})

const mapDispatchToProps = dispatch => ({
	handleSetDate: async (dId, gId, p) => dispatch(await handleSetDate(dId, gId, p)),
	changeYAxis: (val) => dispatch(changeYAxis(val)),
	removePeriod: (pId) => dispatch(removeChartPeriod(pId)),
	changeRawData: (p) => dispatch(changeRawData(p))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(ScoreCard))