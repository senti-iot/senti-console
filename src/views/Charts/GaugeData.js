import React, { Fragment, useState, useEffect } from 'react';
import {
	Grid, IconButton, Menu, withStyles, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Hidden, Typography, Tooltip,
} from '@material-ui/core';
import {
	Timeline, MoreVert,
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ExpandMore, Visibility, ShowChart, ArrowUpward, CloudDownload, LinearScale, Clear, KeyboardArrowLeft, KeyboardArrowRight,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard,
	ExportModal,
	DateFilterMenu,
	T,
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import classNames from 'classnames';
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
// import { changeYAxis } from 'redux/appState'
import { changeDate, changeChartType, /* changeRawData, */ removeChartPeriod } from 'redux/dateTime'
import { getSensorDataClean } from 'variables/dataSensors';
import RGauge from 'components/Charts/RGauge';
import { useLocalization } from 'hooks'

// const mapDispatchToProps = dispatch => ({
// 	handleSetDate: (id, to, from, timeType, pId) => dispatch(changeDate(id, to, from, timeType, pId)),
// 	changeYAxis: (val) => dispatch(changeYAxis(val)),
// 	removePeriod: (pId) => dispatch(removeChartPeriod(pId)),
// 	changeChartType: (p, chartId) => dispatch(changeChartType(p, chartId)),
// 	changeRawData: (p) => dispatch(changeRawData(p))
// })

// @Andrei
const GaugeComponent = React.memo(props => {
	const t = useLocalization()
	const dispatch = useDispatch()

	const [/* raw */, setRaw] = useState(props.raw ? props.raw : false)
	const [actionAnchor, setActionAnchor] = useState(null)
	const [openDownload, setOpenDownload] = useState(false)
	const [visibility, setVisibility] = useState(false)
	const [resetZoom, setResetZoom] = useState(false)
	const [zoomDate, setZoomDate] = useState([])
	const [loading, setLoading] = useState(true)
	const [chartType, setChartType] = useState('linear')
	const [initialPeriod, setInitialPeriod] = useState(null)
	const [value, setValue] = useState('') // added
	const [actionAnchorVisibility, setActionAnchorVisibility] = useState(null) // added
	// const [lineDataSets, setLineDataSets] = useState(null) // added
	const [exportData, /* setExportData */] = useState(null) // added
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		raw: props.raw ? props.raw : false,
	// 		actionAnchor: null,
	// 		openDownload: false,
	// 		visibility: false,
	// 		resetZoom: false,
	// 		zoomDate: [],
	// 		loading: true,
	// 		chartType: 'linear',
	// 		initialPeriod: null
	// 	}
	// }

	// let displayFormat = 'DD MMMM YYYY HH:mm'
	// let image = null
	let options = [
		{ id: 0, label: t('filters.dateOptions.today') },
		{ id: 1, label: t('filters.dateOptions.yesterday') },
		{ id: 2, label: t('filters.dateOptions.thisWeek') },
		{ id: 3, label: t('filters.dateOptions.7days') },
		{ id: 4, label: t('filters.dateOptions.30days') },
		{ id: 5, label: t('filters.dateOptions.90days') },
		{ id: 6, label: t('filters.dateOptions.custom') },
	]
	let timeTypes = [
		{ id: 0, format: 'lll dddd', chart: 'minute', tooltipFormat: 'LT' },
		{ id: 1, format: 'lll dddd', chart: 'hour', tooltipFormat: 'LT' },
		{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' },
		{ id: 3, format: 'lll dddd', chart: 'month', tooltipFormat: 'll' },
	]
	let visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
		{ id: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
		{ id: 2, icon: <BarChartIcon />, label: t('charts.type.bar') },
		{ id: 3, icon: <ShowChart />, label: t('charts.type.line') }
	]

	useEffect(() => {
		const asyncFunc = async () => {
			const { period } = props
			// const { loading } = this.state
			if (period && loading) {
				await getData(period)
				// this.setState({ ...newState, loading: false })

				// let newState = await getData(props.period)
				// TODO
				// this.setState({ ...newState, loading: false })
			}
		}
		asyncFunc()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	const { period } = this.props
	// 	const { loading } = this.state
	// 	if (period && loading) {
	// 		await this.getData(period)
	// 		// this.setState({ ...newState, loading: false })
	// 	}
	// }
	const getData = async () => {
		const { sensor, v, nId, period } = props
		console.log(sensor.uuid, v, period, nId)
		let value = await getSensorDataClean(sensor.uuid, v, period.from, period.to,  nId)
		setLoading(false)
		setValue(value)
		// this.setState({
		// 	loading: false,
		// 	value: value
		// })
	}

	useEffect(() => {
		setLoading(true)

		return () => {
			setRaw(props.raw ? props.raw : false)
			setActionAnchor(null)
			setOpenDownload(false)
			setVisibility(false)
			setResetZoom(false)
			setZoomDate([])
			setLoading(true)
			setChartType('linear')
			setInitialPeriod(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.period])
	// componentDidUpdate = async (prevProps, prevState) => {
	// 	if (prevProps.period !== this.props.period /* || prevProps.period.timeType !== this.props.period.timeType || prevProps.period.raw !== this.props.period.raw */) {
	// 		this.setState({ loading: true }, async () => {
	// 			let newState = await this.getData(this.props.period)
	// 			this.setState({ ...newState, loading: false })
	// 		})
	// 	}
	// }

	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// 	this.setState({
	// 		raw: this.props.raw ? this.props.raw : false,
	// 		actionAnchor: null,
	// 		openDownload: false,
	// 		visibility: false,
	// 		resetZoom: false,
	// 		zoomDate: [],
	// 		loading: true,
	// 		chartType: 'linear',
	// 		initialPeriod: null
	// 	})
	// }
	const handleChangeChartType = (type) => {
		setChartType(type)
		// this.setState({
		// 	chartType: type
		// })
	}
	const handleCloseDownloadModal = () => {
		setOpenDownload(false)
		// this.setState({ openDownload: false })
	}
	const handleOpenDownloadModal = () => {
		setOpenDownload(true)
		setActionAnchor(null)
		// this.setState({ openDownload: true, actionAnchor: null })
	}
	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
		// this.setState({ actionAnchor: event.currentTarget });
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null });
	}

	const handleVisibility = id => (event) => {
		if (event)
			event.preventDefault()
		dispatch(changeChartType(props.period, id))
		// this.props.changeChartType(this.props.period, id)
		setActionAnchorVisibility(null)
		// this.setState({ actionAnchorVisibility: null })
	}

	const handleReverseZoomOnData = async () => {
		const { period } = props
		// const { zoomDate } = this.state
		let startDate = null
		let endDate = null
		try {
			switch (period.timeType) {
				case 0:
					startDate = zoomDate.length > 1 ? moment(zoomDate[1].from).startOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 1 ? moment(zoomDate[1].to).endOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					if (zoomDate.length === 1) {
						setResetZoom(false)
						setZoomDate([])
						// this.setState({ resetZoom: false, zoomDate: [] })
					}
					dispatch(changeDate(6, endDate, startDate, 1, period.id))
					// this.props.handleSetDate(6, endDate, startDate, 1, period.id)
					break;
				case 1:
					startDate = zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					setResetZoom(false)
					setZoomDate([])
					// this.setState({ resetZoom: false, zoomDate: [] })
					dispatch(changeDate(6, endDate, startDate, 2, period.id))
					// this.props.handleSetDate(6, endDate, startDate, 2, period.id)
					break;
				default:
					break;
			}
		}
		catch (e) {
		}
	}

	// const handleZoomOnData = async (elements) => {
	// 	if (elements.length > 0) {
	// 		const { period } = props
	// 		// const { lineDataSets } = this.state
	// 		let date = null
	// 		let startDate = null
	// 		let endDate = null
	// 		try {
	// 			date = lineDataSets.datasets[elements[0]._datasetIndex].data[elements[0]._index].x
	// 			switch (period.timeType) {
	// 				case 1:
	// 					startDate = moment(date).startOf('hour')
	// 					endDate = moment(date).endOf('hour').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('hour')
	// 					setResetZoom(true)
	// 					setZoomDate([...zoomDate, { from: period.from, to: period.to }])
	// 					// this.setState({
	// 					// 	resetZoom: true,
	// 					// 	zoomDate: [
	// 					// 		...this.state.zoomDate,
	// 					// 		{
	// 					// 			from: period.from,
	// 					// 			to: period.to
	// 					// 		}]
	// 					// })
	// 					dispatch(changeDate(6, endDate, startDate, 0, period.id))
	// 					// this.props.handleSetDate(6, endDate, startDate, 0, period.id)
	// 					break
	// 				case 2:
	// 					startDate = moment(date).startOf('day')
	// 					endDate = moment(date).endOf('day').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('day')
	// 					setResetZoom(true)
	// 					setZoomDate([{ from: period.from, to: period.to }])
	// 					// this.setState({
	// 					// 	resetZoom: true,
	// 					// 	zoomDate: [{
	// 					// 		from: period.from,
	// 					// 		to: period.to
	// 					// 	}]
	// 					// })
	// 					dispatch(changeDate(6, endDate, startDate, 1, period.id))
	// 					// this.props.handleSetDate(6, endDate, startDate, 1, period.id)
	// 					break;
	// 				default:
	// 					break;
	// 			}
	// 		}
	// 		catch (error) {
	// 		}
	// 	}
	// }
	const futureTester = (date, unit) => moment().diff(date, unit) <= 0
	const handleNextPeriod = () => {
		const { period } = props
		// const { initialPeriod } = this.state
		let from, to, diff;
		if (!initialPeriod) {
			setInitialPeriod(period)
			// this.setState({ initialPeriod: period })
			if (period.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).add(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
				to = futureTester(to, timeTypes[period.timeType].chart) ? moment() : to
			}
			if ([0, 1].indexOf(period.menuId) !== -1) {
				from = moment(period.from).add(1, 'day').startOf('day')
				to = moment(period.to).add(1, 'day').endOf('day')
				to = futureTester(to, 'hour') ? moment() : to

			}
			if (period.menuId === 2) {
				from = moment(period.from).add(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).add(1, 'week').endOf('week').endOf('day')
				to = futureTester(to, 'day') ? moment() : to

			}
			if ([3, 4, 5].indexOf(period.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = futureTester(to, 'day') ? moment() : to
			}
		}
		else {
			if (initialPeriod.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).add(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
				to = futureTester(to, timeTypes[period.timeType].chart) ? moment() : to

			}
			if ([0, 1].indexOf(initialPeriod.menuId) !== -1) {
				from = moment(period.from).add(1, 'day').startOf('day')
				to = moment(period.to).add(1, 'day').endOf('day')
				to = futureTester(to, 'hour') ? moment() : to
			}
			if (initialPeriod.menuId === 2) {
				from = moment(period.from).add(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).add(1, 'week').endOf('week').endOf('day')
				to = futureTester(to, timeTypes[period.timeType].chart) ? moment() : to
				if (period.timeType === 2 || period.timeType === 3) {
					let dayDiff = to.diff(from, 'day')
					if (dayDiff <= 0) {
						return dispatch(changeDate(6, to, from, 1, period.id))
						// return this.props.handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return dispatch(changeDate(6, to, from, 2, period.id))
					// return this.props.handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = futureTester(to, 'day') ? moment() : to
			}
		}
		dispatch(changeDate(6, to, from, period.timeType, period.id))
		// this.props.handleSetDate(6, to, from, period.timeType, period.id)
	}
	const handlePreviousPeriod = () => {
		const { period } = props
		// const { initialPeriod } = this.state
		let from, to, diff;
		if (!initialPeriod) {
			setInitialPeriod(period)
			// this.setState({ initialPeriod: period })
			if (period.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).subtract(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
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
				from = moment(period.from).subtract(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).subtract(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
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
						return dispatch(changeDate(6, to, from, 1, period.id))
						// return this.props.handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return dispatch(changeDate(6, to, from, 2, period.id))
					// return this.props.handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf('day')
				to = moment(period.to).subtract(diff + 1, 'minute').endOf('day')
			}
		}
		dispatch(changeDate(6, to, from, period.timeType, period.id))
		// this.props.handleSetDate(6, to, from, period.timeType, period.id)
	}
	const renderTitle = () => {
		const { period, title } = props
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container style={{ flexFlow: 'row', alignItems: 'center' }}>
			<Hidden mdDown>
				<ItemG>

					<Tooltip title={t('tooltips.chart.previousPeriod')}>
						<IconButton onClick={handlePreviousPeriod}>
							<KeyboardArrowLeft />
						</IconButton>
					</Tooltip>
				</ItemG>
			</Hidden>
			<ItemG container style={{ width: 'auto', flexFlow: 'column' }}>
				<Typography component={'span'}>{`${displayFrom}`}</Typography>
				<Typography component={'span'}> {`${displayTo}`}</Typography>
			</ItemG>
			<Hidden mdDown>
				<ItemG>
					<Tooltip title={t('tooltips.chart.nextPeriod')}>
						<div>
							<IconButton onClick={handleNextPeriod} disabled={disableFuture()}>
								<KeyboardArrowRight />
							</IconButton>
						</div>
					</Tooltip>
				</ItemG>
			</Hidden>
			<ItemG container alignItems={'center'}>
				<T>{title}</T>
			</ItemG>
		</ItemG>
	}
	const renderType = () => {
		const { period } = props
		// const { loading } = this.state
		if (!loading) {
			switch (period.chartType) {
				case 3:
					return <RGauge
						period={period}
						value={value}
					/>

				default:
					break;
			}
		}
		else return renderNoData()
	}
	const disableFuture = () => {
		const { period } = props
		if (moment().diff(period.to, 'hour') <= 0) {
			return true
		}
		return false
	}
	const renderMenu = () => {
		// const { actionAnchor, actionAnchorVisibility, resetZoom } = this.state
		const { classes, period } = props
		return <ItemG container direction={'column'}>
			<Hidden lgUp>
				<ItemG container>
					<ItemG>
						<Tooltip title={t('tooltips.chart.previousPeriod')}>
							<IconButton onClick={() => handlePreviousPeriod(period)}>
								<KeyboardArrowLeft />
							</IconButton>
						</Tooltip>
					</ItemG>
					<ItemG>
						<Tooltip title={t('tooltips.chart.nextPeriod')}>
							<div>
								<IconButton onClick={() => handleNextPeriod(period)} disabled={disableFuture(period)}>
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
						<DateFilterMenu period={period} t={t} />
					</Tooltip>
				</ItemG>
				<Collapse in={resetZoom}>
					{resetZoom && <Tooltip title={t('tooltips.chart.resetZoom')}>
						<IconButton onClick={handleReverseZoomOnData}>
							<ArrowUpward />
						</IconButton>
					</Tooltip>
					}
				</Collapse>
				<ItemG>
					<Hidden smDown>
						<Tooltip title={t('tooltips.chart.type')}>
							<IconButton variant={'fab'} onClick={(e) => { setActionAnchorVisibility(e.currentTarget) }}>
								{renderIcon()}
							</IconButton>
						</Tooltip>
						<Menu
							marginThreshold={24}
							id='long-menu'
							anchorEl={actionAnchorVisibility}
							open={Boolean(actionAnchorVisibility)}
							onClose={() => setActionAnchorVisibility(null)}
							PaperProps={{ style: { minWidth: 250 } }}>
							<List component='div' disablePadding>
								{visibilityOptions.map(op => {
									return <ListItem key={op.id} value={op.id} button className={classes.nested} onClick={handleVisibility(op.id)}>
										<ListItemIcon>
											{op.icon}
										</ListItemIcon>
										<ListItemText inset primary={op.label} />
									</ListItem>
								})}
							</List>
						</Menu>
					</Hidden>
				</ItemG>

				<ItemG>
					<Tooltip title={t('menus.menu')}>
						<IconButton
							aria-label='More'
							aria-owns={actionAnchor ? 'long-menu' : null}
							aria-haspopup='true'
							onClick={handleOpenActionsDetails}>
							<MoreVert />
						</IconButton>
					</Tooltip>
				</ItemG>
				<Menu
					marginThreshold={24}
					id='long-menu'
					anchorEl={actionAnchor}
					open={Boolean(actionAnchor)}
					onClose={handleCloseActionsDetails}
					onChange={handleVisibility}
					PaperProps={{ style: { minWidth: 250 } }}>
					<div>
						<Hidden mdUp>
							<ListItem button onClick={() => { setVisibility(!visibility) }}>
								<ListItemIcon>
									<Visibility />
								</ListItemIcon>
								<ListItemText inset primary={t('filters.options.graphType')} />
								<ExpandMore className={classNames({
									[classes.expandOpen]: visibility,
								}, classes.expand)} />
							</ListItem>
							<Collapse in={visibility} timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									{visibilityOptions.map(op => {
										return <ListItem key={op.id} button className={classes.nested} onClick={handleVisibility(op.id)}>
											<ListItemIcon>
												{op.icon}
											</ListItemIcon>
											<ListItemText inset primary={op.label} />
										</ListItem>
									})}
								</List>
							</Collapse>
						</Hidden>
					</div>
					<ListItem button onClick={handleOpenDownloadModal}>
						<ListItemIcon><CloudDownload /></ListItemIcon>
						<ListItemText>{t('menus.export')}</ListItemText>
					</ListItem>
					<ListItem button onClick={() => handleChangeChartType(chartType === 'linear' ? 'logarithmic' : 'linear')}>
						<ListItemIcon>
							{chartType !== 'linear' ? <LinearScale /> : <Timeline />}
						</ListItemIcon>
						<ListItemText>
							{t(chartType !== 'linear' ? 'settings.chart.YAxis.linear' : 'settings.chart.YAxis.logarithmic')}
						</ListItemText>
					</ListItem>
					<ListItem button onClick={() => { handleCloseActionsDetails(); dispatch(removeChartPeriod(period.id)) }}>
						<ListItemIcon>
							<Clear />
						</ListItemIcon>
						<ListItemText>
							{t('menus.charts.deleteThisPeriod')}
						</ListItemText>
					</ListItem>

				</Menu>
			</ItemG>
		</ItemG>
	}
	const renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {t('devices.noData')}</Caption>
		</ItemG>
	}

	const renderIcon = () => {
		const { period } = props
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

	const { period } = props
	// const { openDownload, loading, exportData } = this.state
	let displayTo = dateTimeFormatter(period.to)
	let displayFrom = dateTimeFormatter(period.from)
	return (
		<Fragment>
			<InfoCard
				title={renderTitle()}
				subheader={`${options[period.menuId].label}, ${period.raw ? t('collections.rawData') : t('collections.calibratedData')}`}
				avatar={renderIcon()}
				noExpand
				topAction={renderMenu()}
				content={
					<Grid container>
						<ExportModal
							raw={period.raw}
							to={displayTo}
							from={displayFrom}
							data={exportData}
							open={openDownload}
							handleClose={handleCloseDownloadModal}
							t={t}
						/>
						{loading ? <div style={{ height: 300, width: '100%' }}><CircularLoader fill /></div> :

							<ItemG xs={12}>
								{renderType()}
							</ItemG>
						}
					</Grid>}
			/>
		</Fragment >
	);
})

export default withStyles(deviceStyles, { withTheme: true })(GaugeComponent)