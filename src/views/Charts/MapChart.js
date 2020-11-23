import { CircularLoader, DateFilterMenu, InfoCard, ItemG, T } from 'components'
import { useDispatch, useLocalization, useSelector } from 'hooks'
import React, { useCallback, useState } from 'react'
import deviceStyles from 'assets/jss/components/devices/deviceStyles'
import { Collapse, Grid, Hidden, IconButton, Tooltip } from '@material-ui/core'
import { handleSetDate as rSetDate, getGraph, getPeriod, } from 'redux/dsSystem'
import OpenStreetMapWidget from 'components/Map/OpenStreetMapWidget'
import { KeyboardArrowLeft, KeyboardArrowRight, Map as MapIcon, MoreVert } from 'variables/icons'
import moment from 'moment'
import { Update } from '@material-ui/icons'
import cx from 'classnames'
import { dateTimeFormatter } from 'variables/functions'

const MapChart = props => {

	const { gId, create, title, color, dId, hoverID, setHoverID, device, single } = props

	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const classes = deviceStyles()
	//Redux
	const g = useSelector(s => getGraph(s, gId, create))
	const period = useSelector(s => getPeriod(s, gId, create))
	console.log('period', period, gId, create )
	//State
	const [actionAnchor, setActionAnchor] = useState(null)
	// const [openDownload, setOpenDownload] = useState(false)
	const [visibility, setVisibility] = useState(false)
	const [resetZoom, setResetZoom] = useState(false)
	const [zoomDate, setZoomDate] = useState([])
	const [loading, setLoading] = useState(true)
	const [chartType, setChartType] = useState('linear')
	const [lineDataSets, setLineDataSets] = useState(null)
	const [roundDataSets, setRoundDataSets] = useState(null)
	const [barDataSets, setBarDataSets] = useState(null)
	const [initialPeriod, setInitialPeriod] = useState(null)
	const [autoUpdate, setAutoUpdate] = useState(g ? g.defaultRefresh ? g.defaultRefresh : false : false)

	//Const


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

	//useCallbacks
	const handleSetDate = useCallback(async (menuId, to, from, defaultT, chartType) => {
		await dispatch(await rSetDate(dId, gId, { menuId, to, from, timeType: defaultT, chartType: chartType ? chartType : period.chartType }))

	}, [dId, dispatch, gId, period])
	//useEffects

	//Handlers
	const handleAutoUpdate = () => setAutoUpdate(!autoUpdate)

	const futureTester = (date, unit) => moment().diff(date, unit) <= 0
	const disableFuture = () => {
		if (moment().diff(period.to, 'hour') <= 0) {
			return true
		}
		return false
	}

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

	//Renders
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
				<ItemG container xs>
					<Collapse in={g.refresh}>
						<Tooltip title={t('tooltips.chart.autoupdate')}>
							<IconButton onClick={handleAutoUpdate}>
								<Update className={cx({
									[classes.autoUpdate]: true,
									[classes.autoUpdateOn]: autoUpdate,
								})} />
							</IconButton>
						</Tooltip>
					</Collapse>
				</ItemG>
				<Collapse in={!Boolean(autoUpdate)}>
					<ItemG>
						<Tooltip title={t('tooltips.chart.previousPeriod')}>
							<IconButton onClick={() => handlePreviousPeriod(period)}>
								<KeyboardArrowLeft />
							</IconButton>
						</Tooltip>
					</ItemG>
				</Collapse>
				<ItemG>
					<div>
						<DateFilterMenu
							liveData
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
				</ItemG>
				<Collapse in={!Boolean(autoUpdate)}>
					<ItemG>
						<Tooltip title={t('tooltips.chart.nextPeriod')}>
							<div>
								<IconButton onClick={() => handleNextPeriod(period)} disabled={disableFuture(period)}>
									<KeyboardArrowRight />
								</IconButton>
							</div>
						</Tooltip>
					</ItemG>
				</Collapse>
			</ItemG>

		</ItemG>
	}
	const renderType = () => {
		const { t, mapTheme, g } = this.props
		const { device } = this.state
		return <ItemG container>
			<OpenStreetMapWidget
				calibrate={this.state.openModalEditLocation}
				getLatLng={this.getLatLngFromMap}
				iRef={this.getRef}
				mapTheme={mapTheme}
				heatMap={false}
				heatData={[]}
				g={g}
				t={t}
				markers={[{ lat: device.lat, long: device.lng }]}
			/>
		</ItemG>
		// return <div>Here will be the map</div>
	}
	const renderMenu = () => {
		return null
	}
	return (
		<>
			<InfoCard
				color={color}
				title={renderTitle()}
				avatar={<MapIcon />}
				noExpand
				headerClasses={{
					root: small ? classes.smallSubheader : classes.subheader
				}}
				bodyClasses={{
					root: small ? classes.smallBody : classes.body
				}}
				flexPaper
				topAction={renderMenu()}
				background={color}
				content={
					<Grid container style={{ height: '100%', width: '100%' }}>
						{loading ? <div style={{ height: '100%', width: '100%' }}><CircularLoader fill /></div> :

							<>
								{/* <Hidden xsDown>
									{small ? this.renderSmallTitle() : null}
								</Hidden>
								<Hidden smUp>
									{this.renderSmallTitle()}
								</Hidden> */}
								{device ? this.renderType() : this.renderNoData()}
							</>
						}

					</Grid>}
			/>
		</ >
	)
}

export default MapChart
