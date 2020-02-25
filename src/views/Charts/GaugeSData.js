import React, { Fragment } from 'react';
import { Grid, IconButton, Hidden, Tooltip } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight, GaugeIcon } from 'variables/icons'
import { CircularLoader, Caption, ItemG, InfoCard, DateFilterMenu, T } from 'components';
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import RGauge from 'components/Charts/RGauge';
import { getSensorDataClean } from 'variables/dataSensors';
import { getGraph, getPeriod, handleSetDate as rHandleSetDate } from 'redux/dsSystem';
import { useLocalization, useSelector, useState, useEffect, useCallback, useDispatch, usePrevious } from 'hooks';
import gaugeStyles from 'assets/jss/components/graphs/gaugeStyles';


const GaugeComponent = props => {

	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = gaugeStyles()
	//Redux
	const g = useSelector(s => getGraph(s, props.gId, props.create))
	const period = useSelector(s => getPeriod(s, props.gId, props.create))
	const prevPeriod = usePrevious(period)
	//State
	const [initialPeriod, setInitialPeriod] = useState(null)
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState(null)

	//Const
	const { title, color, create, chartId, dId, gId } = props

	let small = g ? g.grid ? g.grid.w <= 4 ? true : false : false : false

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

	//useCallbacks
	const getData = useCallback(async () => {
		let data = null
		if (g.dataSource.deviceId && g.dataSource.dataKey) {
			data = await getSensorDataClean(g.dataSource.deviceId, moment(period.from).subtract(1, 'day'), period.to, g.dataSource.dataKey, g.dataSource.cf, g.dataSource.deviceType, g.dataSource.type, g.dataSource.calc)
		}
		setData(data)
		setLoading(false)
	}, [g.dataSource.calc, g.dataSource.cf, g.dataSource.dataKey, g.dataSource.deviceId, g.dataSource.deviceType, g.dataSource.type, period.from, period.to])

	//useEffects
	useEffect(() => {
		const gData = async () => await getData()
		if ((period && loading) || (period !== prevPeriod)) {
			gData()
		}


	}, [period, prevPeriod, getData, loading])

	//Handlers

	const handleSetDate = async (menuId, to, from, defaultT, chartType) => {
		dispatch(await rHandleSetDate(dId, gId, {
			menuId,
			to,
			from, timeType: defaultT,
			chartType: chartType ? chartType : period.chartType
		}))
	}

	const disableFuture = () => {
		if (moment().diff(period.to, 'hour') <= 0) {
			return true
		}
		return false
	}

	const futureTester = (date, unit) => moment().diff(date, unit) <= 0

	const handleNextPeriod = () => {
		let from, to, diff;
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

		let from, to, diff;
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
	const renderTitle = (small) => {
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
						<IconButton onClick={handlePreviousPeriod}>
							<KeyboardArrowLeft />
						</IconButton>
					</Tooltip>
				</ItemG>
				<ItemG>
					<Tooltip title={t('tooltips.chart.period')}>
						<div>
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
						</div>

					</Tooltip>
				</ItemG>
				<ItemG>
					<Tooltip title={t('tooltips.chart.nextPeriod')}>
						<div>
							<IconButton onClick={handleNextPeriod} disabled={disableFuture(period)}>
								<KeyboardArrowRight />
							</IconButton>
						</div>
					</Tooltip>
				</ItemG>
			</ItemG>

		</ItemG>
	}
	const renderType = () => {
		let id = chartId ? chartId : create ? 'edit' + g.id : g.id
		if (!loading && data) {
			return <RGauge
				color={color}
				period={period}
				value={data}
				chartId={id}
			/>
		}
		else return renderNoData()
	}

	const renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {t('devices.noData')}</Caption>
		</ItemG>
	}


	const renderSmallTitle = () => {
		return <ItemG xs={12} container justify={'center'}>
			<T className={classes.smallTitle} variant={'h6'}>{title}</T>
		</ItemG>
	}


	return (
		<Fragment>
			<InfoCard
				color={color}
				title={renderTitle(small)}
				avatar={<GaugeIcon />}
				noExpand
				headerClasses={{
					root: small ? classes.smallSubheader : classes.subheader
				}}
				bodyClasses={{
					root: small ? classes.smallBody : classes.body
				}}
				content={
					<Grid container>
						{loading ? <div style={{ height: 300, width: '100%' }}>
							<CircularLoader fill />
						</div> :
							<Fragment>
								<Hidden xsDown>
									{small ? renderSmallTitle() : null}
								</Hidden>
								<Hidden smUp>
									{renderSmallTitle()}
								</Hidden>
								{renderType()}
							</Fragment>
						}
					</Grid>}
			/>
		</Fragment >
	);
}


export default GaugeComponent