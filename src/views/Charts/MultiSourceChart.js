import React, { Fragment, useCallback, } from 'react'
import {
	Grid, IconButton, Menu, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Typography, Tooltip, colors, Divider, Hidden
} from '@material-ui/core'
import {
	Timeline, MoreVert,
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ExpandMore, Visibility, ShowChart, ArrowUpward, /* CloudDownload, */ LinearScale, KeyboardArrowLeft, KeyboardArrowRight,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard, BarChart,
	MultiLineChart,
	DoughnutChart,
	PieChart,
	DateFilterMenu,
	T,
	DSelect,
} from 'components'
import classNames from 'classnames'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { handleSetDate as rSetDate, getGraph, getPeriod, /* getGraph, getPeriod */ } from 'redux/dsSystem'
import { getSensorDataClean } from 'variables/dataSensors'
import { setDailyData, setMinutelyData, setHourlyData } from 'components/Charts/DataModel'
import { useLocalization, useSelector, useDispatch, useState, useEffect } from 'hooks'
import multiSourceChartStyles from 'assets/jss/components/graphs/multiSourceChartStyles'

const MultiSourceChart = (props) => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const classes = multiSourceChartStyles()

	//Props
	const { gId, create, title, color, dId, hoverID, setHoverID, device, single, } = props

	//Redux
	// const gs = useSelector(s => create ? s.dsSystem.cGraphs : s.dsSystem.graphs)
	const g = useSelector(s => getGraph(s, gId, create))

	// let f = usePrevious(gs[gs.findIndex(r => r.id === gId)])
	const period = useSelector(s => getPeriod(s, gId, create))
	// const sensors = useSelector(s => s.data.sensors)

	//State
	const [actionAnchor, setActionAnchor] = useState(null)
	const [visibility, setVisibility] = useState(false)
	const [resetZoom, setResetZoom] = useState(false)
	const [zoomDate, setZoomDate] = useState([])
	const [loading, setLoading] = useState(true)
	const [chartType, setChartType] = useState('linear')
	const [lineDataSets, setLineDataSets] = useState(null)
	const [roundDataSets, setRoundDataSets] = useState(null)
	const [barDataSets, setBarDataSets] = useState(null)
	const [initialPeriod, setInitialPeriod] = useState(null)
	const [selectedDevice, setSelectedDevice] = useState(0)


	//Consts
	let small = g ? g.grid ? g.grid.w <= 5 ? true : false : false : false
	const options = [
		{ id: 0, label: t('filters.dateOptions.today') },
		{ id: 1, label: t('filters.dateOptions.yesterday') },
		{ id: 2, label: t('filters.dateOptions.thisWeek') },
		{ id: 3, label: t('filters.dateOptions.7days') },
		{ id: 4, label: t('filters.dateOptions.30days') },
		{ id: 5, label: t('filters.dateOptions.90days') },
		{ id: 6, label: t('filters.dateOptions.custom') },
	]
	const timeTypes = [
		{ id: 0, format: 'lll dddd', chart: 'minute', tooltipFormat: 'LT' },
		{ id: 1, format: 'lll dddd', chart: 'hour', tooltipFormat: 'LT' },
		{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' },
		{ id: 3, format: 'lll dddd', chart: 'month', tooltipFormat: 'll' },
	]
	const visibilityOptions = [
		{ id: 2, icon: <BarChartIcon />, label: t('charts.type.bar') },
		{ id: 3, icon: <ShowChart />, label: t('charts.type.line') }
	]

	useEffect(() => {
		if (period && loading) {
			const gData = async () => await getData()
			gData()
		}
		// eslint-disable-next-line
	}, [])

	const setData = useCallback((data, timeType) => {
		switch (timeType) {
			case 0:
				return setMinutelyData([{ data: data, name: title, color: colors[color][500], id: g.id }], g.period.from, g.period.to)
			case 1:
				return setHourlyData([{ data: data, name: title, color: colors[color][500], id: g.id }], g.period.from, g.period.to)
			case 2:
				return setDailyData([{ data: data, name: title, color: colors[color][500], id: g.id }], g.period.from, g.period.to)
			default:
				break
		}
	}, [color, g.id, g.period.from, g.period.to, title])

	const getData = useCallback(async () => {
		if (g.dataSource.dataKey && g.dataSource.deviceIds.length > 0) {
			//TODO HACK
			let data = null
			if (g.dataSource.deviceIds[selectedDevice].id) {
				data = await getSensorDataClean(g.dataSource.deviceIds[selectedDevice].id, period.from, period.to, g.dataSource.dataKey, g.dataSource.cf, g.dataSource.deviceType, g.dataSource.type, g.dataSource.calc)
			}
			else {
				data = await getSensorDataClean(g.dataSource.deviceIds[selectedDevice], period.from, period.to, g.dataSource.dataKey, g.dataSource.cf, g.dataSource.deviceType, g.dataSource.type, g.dataSource.calc)
			}
			//END HACK
			let newState = setData(data, period.timeType)
			if (newState && newState.lineDataSets) {
				setLineDataSets(newState.lineDataSets)
				setRoundDataSets(newState.roundDataSets)
				setBarDataSets(newState.barDataSets)
			}
			setLoading(false)

		}
		else {
			setLoading(false)
		}
	}, [g.dataSource.calc, g.dataSource.cf, g.dataSource.dataKey, g.dataSource.deviceIds, g.dataSource.deviceType, g.dataSource.type, period.from, period.timeType, period.to, selectedDevice, setData])

	useEffect(() => {
		setLoading(true)
		const gData = async () => await getData()
		gData()
	}, [period.menuId, period.timeType, g.dataSource.dataKey, period.from, period.to, getData])

	const handleChangeChartType = () => {
		setChartType(chartType === 'linear' ? 'logarithmic' : 'linear')

	}
	// const handleCloseDownloadModal = () => {
	// 	setOpenDownload(false)
	// }
	// const handleOpenDownloadModal = () => {
	// 	setOpenDownload(true)
	// 	setActionAnchor(null)
	// }
	const handleGetDeviceName = d => {
		return d.name ? d.name : d.id
	}
	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
	}

	const handleVisibility = id => (event) => {
		if (event)
			event.preventDefault()
		handleSetDate(period.menuId, period.to, period.from, period.timeType, id)
	}

	const handleReverseZoomOnData = async () => {
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
					}
					handleSetDate(6, endDate, startDate, 1, period.id)
					break
				case 1:
					startDate = zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					setResetZoom(false)
					setZoomDate([])
					handleSetDate(6, endDate, startDate, 2, period.id)
					break
				default:
					break
			}
		}
		catch (e) {
		}
	}

	const handleZoomOnData = async (elements) => {
		if (elements.length > 0) {
			let date = null
			let startDate = null
			let endDate = null
			try {
				date = lineDataSets.datasets[elements[0]._datasetIndex].data[elements[0]._index].x
				switch (period.timeType) {
					case 1:
						startDate = moment(date).startOf('hour')
						endDate = moment(date).endOf('hour').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('hour')
						setResetZoom(true)
						setZoomDate([
							...zoomDate,
							{
								from: period.from,
								to: period.to
							}])
						handleSetDate(6, endDate, startDate, 0, period.id)
						break
					case 2:
						startDate = moment(date).startOf('day')
						endDate = moment(date).endOf('day').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('day')
						setResetZoom(true)
						setZoomDate([{
							from: period.from,
							to: period.to
						}])
						handleSetDate(6, endDate, startDate, 1, period.id)
						break
					default:
						break
				}
			}
			catch (error) {
			}
		}
	}
	const futureTester = (date, unit) => moment().diff(date, unit) <= 0
	const handleNextPeriod = () => {
		let from, to, diff
		if (!initialPeriod) {
			setInitialPeriod(period)
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
						return handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = futureTester(to, 'day') ? moment() : to
			}
		}
		handleSetDate(6, to, from, period.timeType, period.id)
	}
	const handlePreviousPeriod = () => {
		let from, to, diff
		if (!initialPeriod) {
			setInitialPeriod(period)
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
						return handleSetDate(6, to, from, 1, period.id)
					}
				}
				else {
					return handleSetDate(6, to, from, 2, period.id)
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf('day')
				to = moment(period.to).subtract(diff + 1, 'minute').endOf('day')
			}
		}
		handleSetDate(6, to, from, period.timeType, period.id)
	}
	const handleChangeSelectedDevice = e => {
		setSelectedDevice(e.target.value)
	}
	const handleMenuItems = () => g ? g.dataSource ? g.dataSource.deviceIds ? g.dataSource.deviceIds.map((d, i) => ({ label: handleGetDeviceName(d), value: i })) : [] : [] : []
	const renderTitle = (small) => {
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container alignItems={'center'} justify={'center'}>
			<ItemG zeroMinWidth>
				<DSelect
					value={selectedDevice}
					menuItems={handleMenuItems()}
					onChange={handleChangeSelectedDevice}
				/>
			</ItemG>
			<Hidden mdDown>
				{small ? null : <ItemG xs style={{ width: 'auto' }} container justify={'center'}>
					<T className={classes.smallTitle} variant={'h6'}>{title}</T>
				</ItemG>}

				{small ? null : <ItemG style={{ width: 'auto' }} container alignItems={'center'}>
					<ItemG>
						<Tooltip title={t('tooltips.chart.previousPeriod')}>
							<IconButton onClick={() => handlePreviousPeriod(period)}>
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
													<T noWrap component={'span'}> {`${options[period.menuId].label}`}</T>
												</ItemG>
											</ItemG>

										</ItemG>

									</ItemG>
								}
								customSetDate={handleSetDate}
								period={period}
								t={t} />
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

				</ItemG>}
			</Hidden>

		</ItemG>
	}
	const renderType = () => {
		if (!loading) {
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
											unit={timeTypes[period.timeType]}
											setHoverID={setHoverID}
											data={d}
											t={t}
										/>
									</div>
									<Typography align={'center'} variant={'subtitle1'}>{d.name}</Typography>
								</ItemG>
							})}
						</ItemG>
						: renderNoData()
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
											unit={timeTypes[period.timeType]}
											setHoverID={setHoverID}
											data={d}
											t={t}
										/>
									</div>
									<Typography align={'center'} variant={'subtitle1'}>{d.name}</Typography>
								</ItemG>
							})}
						</ItemG>
						: renderNoData()
				case 2:
					return barDataSets ?
						<BarChart
							chartYAxis={chartType}
							single={single}
							hoverID={hoverID}
							obj={device}
							unit={timeTypes[period.timeType]}
							onElementsClick={handleZoomOnData}
							setHoverID={setHoverID}
							data={barDataSets}
							t={t}
						/> : renderNoData()
				case 3:

					return lineDataSets ?
						<MultiLineChart
							chartYAxis={chartType}
							single={single}
							hoverID={hoverID}
							handleReverseZoomOnData={handleReverseZoomOnData}
							resetZoom={resetZoom}
							obj={device}
							unit={timeTypes[period.timeType]}
							onElementsClick={handleZoomOnData}
							setHoverID={setHoverID}
							data={lineDataSets}
							t={t}
						/> : renderNoData()
				default:
					return null
			}
		}
		else return renderNoData()
	}
	const disableFuture = () => {
		if (moment().diff(period.to, 'hour') <= 0) {
			return true
		}
		return false
	}
	const handleSetDate = async (menuId, to, from, defaultT, chartType) => {
		await dispatch(await rSetDate(dId, gId, { menuId, to, from, timeType: defaultT, chartType: chartType ? chartType : period.chartType }))
	}
	const handleSetVisibility = () => setVisibility(!visibility)

	const renderMenu = () => {
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container direction={'column'}>
			<ItemG container>
				<Collapse in={resetZoom}>
					{resetZoom && <Tooltip title={t('tooltips.chart.resetZoom')}>
						<IconButton onClick={handleReverseZoomOnData}>
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
						<ListItem button onClick={handleSetVisibility}>
							<ListItemIcon>
								<Visibility />
							</ListItemIcon>
							<ListItemText primary={t('filters.options.graphType')} />
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
										<ListItemText primary={op.label} />
									</ListItem>
								})}
							</List>
						</Collapse>
					</div>
					<ListItem button onClick={handleChangeChartType}>
						<ListItemIcon>
							{chartType !== 'linear' ? <LinearScale /> : <Timeline />}
						</ListItemIcon>
						<ListItemText>
							{t(chartType !== 'linear' ? 'settings.chart.YAxis.linear' : 'settings.chart.YAxis.logarithmic')}
						</ListItemText>
					</ListItem>
					{small ? [
						<Divider />,
						<ListItem>
							<ItemG style={{ width: 'auto' }} container alignItems={'center'}>
								<ItemG>
									<Tooltip title={t('tooltips.chart.previousPeriod')}>
										<IconButton onClick={() => handlePreviousPeriod(period)}>
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
																<T noWrap component={'span'}> {`${options[period.menuId].label}`}</T>
															</ItemG>
														</ItemG>

													</ItemG>

												</ItemG>
											}
											customSetDate={handleSetDate}
											period={period}
											t={t} />
									</Tooltip>
								</ItemG>
								<ItemG>
									<Tooltip title={t('tooltips.chart.nextPeriod')}>
										<IconButton onClick={() => handleNextPeriod(period)} disabled={disableFuture(period)}>
											<KeyboardArrowRight />
										</IconButton>
									</Tooltip>
								</ItemG>
							</ItemG>
						</ListItem>] :
						<Hidden smUp>
							<Divider />
							<ListItem>
								<ItemG style={{ width: 'auto' }} container alignItems={'center'}>
									<ItemG>
										<Tooltip title={t('tooltips.chart.previousPeriod')}>
											<IconButton onClick={() => handlePreviousPeriod(period)}>
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
																	<T noWrap component={'span'}> {`${options[period.menuId].label}`}</T>
																</ItemG>
															</ItemG>

														</ItemG>

													</ItemG>
												}
												customSetDate={handleSetDate}
												period={period}
												t={t} />
										</Tooltip>
									</ItemG>
									<ItemG>
										<Tooltip title={t('tooltips.chart.nextPeriod')}>
											<IconButton onClick={() => handleNextPeriod(period)} disabled={disableFuture(period)}>
												<KeyboardArrowRight />
											</IconButton>
										</Tooltip>
									</ItemG>
								</ItemG>
							</ListItem></Hidden>}
					{/* <ListItem button onClick={handleOpenDownloadModal}>
						<ListItemIcon><CloudDownload /></ListItemIcon>
						<ListItemText>{t('menus.export')}</ListItemText>
					</ListItem> */}

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
				break
		}
	}
	const renderSmallTitle = () => {
		return <ItemG xs={12} container justify={'center'}>
			<T className={classes.smallTitle} variant={'h6'}>{title}</T>
		</ItemG>
	}

	return (
		<InfoCard
			color={color}
			title={renderTitle(small)}
			avatar={renderIcon()}
			noExpand
			dashboard
			headerClasses={{
				root: small ? classes.smallSubheader : classes.subheader
			}}
			bodyClasses={{
				root: small ? classes.smallBody : classes.body
			}}
			topAction={renderMenu()}
			content={
				<Grid container style={{ height: '100%', width: '100%' }}>
					{loading ? <div style={{ height: 300, width: '100%' }}><CircularLoader fill /></div> :
						<Fragment>
							<Hidden smUp>
								{renderSmallTitle()}
							</Hidden>
							<Hidden mdDown>
								{small ? renderSmallTitle() : null}
							</Hidden>
							{renderType()}
						</Fragment>
					}
				</Grid>}
		/>
	)
}

export default MultiSourceChart