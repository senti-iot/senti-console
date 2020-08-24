import React, { Fragment } from 'react'
import { /* useSelector, */ useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Grow, Paper, Typography, Collapse, Dialog, DialogContent } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import { T, WeatherIcon, Muted } from 'components';
import moment from 'moment'
import { todayOfInterest } from 'redux/doi';
import { DateRange, Cake, DataUsage } from 'variables/icons';
import { useLocalization } from 'hooks';

const Tooltip = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()

	//Redux

	//State

	//Const
	const { classes, tooltip, weather,
		handleCloseTooltip, mobile, getRef, chartWidth, chartHeight,
		unit } = props

	//useCallbacks

	//useEffects

	//Handlers



	let screenWidth = window.innerWidth
	const clickEvent = () => {
		if ('ontouchstart' in document.documentElement === true)
			return false
		else
			return true
	}
	const transformLoc = () => {
		let screenWidth = window.innerWidth

		let x = 0
		let y = 0

		x = '-50%'
		y = tooltip.top < (chartHeight / 2) ? '15%' : '-115%'

		if (chartWidth > screenWidth / 2) {
			if (tooltip.left < (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
				y = '15%'
			}
			if (tooltip.left < (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
				y = '-105%'
			}
			if (tooltip.left > (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
				y = '15%'
			}
			if (tooltip.left > (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
				y = '-105%'
			}
			if (tooltip.left > chartWidth / 2) {
				x = '-110%'
			}
			else {
				x = '15%'
			}
		}
		return `translate(${x}, ${y})`
		// }
		//If tooltip is in the left side move to right by 15%
		// if (tooltip.left < (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
		// 	if ((tooltip.left + 400) * 2 > screenWidth)
		// 		y = '-105%'
		// 	else
		// 		y = '15%'
		// }
		// //If tooltip is in the right side move to left by 105%
		// if (tooltip.left < (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
		// 	y = '-105%'
		// }
		// if (tooltip.left > (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
		// 	y = '15%'
		// }
		// if (tooltip.left > (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
		// 	y = '-105%'
		// }
		// if (tooltip.left > chartWidth / 2) {
		// 	x = '-110%'
		// }
		// else {
		// 	x = '15%'
		// }
		// return `translate(${x}, ${y})`
	}
	const handleRange = () => {
		let dateStr = tooltip.title[0] ? tooltip.title[0] : ''
		let date = moment(dateStr, 'lll').isValid() ? moment(dateStr, 'lll') : null
		if (date) {
			if (tooltip.lastPoint) {
				if (moment(date).diff(moment(), 'days') === 0) {
					if (unit.chart === 'day') {
						let plusOne = moment(date).startOf(unit.chart)
						let finalStr = `${moment(plusOne).format(unit.tooltipFormat)} - ${moment().format(unit.tooltipFormat)} `
						return finalStr
					}
				}
				if (unit.chart === 'hour') {
					if (moment().diff(moment(date), 'minutes') <= 60) {
						let plusOne = moment(date).startOf(unit.chart)
						let finalStr = `${moment(plusOne).format(unit.tooltipFormat)} - ${moment().format(unit.tooltipFormat)} `
						return finalStr
					}
				}
				if (unit.chart === 'minute') {
					if (moment().diff(moment(date), 'minutes') <= 60) {
						let plusOne = moment(date).startOf('hour')
						let finalStr = `${moment(plusOne).format(unit.tooltipFormat)} - ${moment().format(unit.tooltipFormat)} `
						return finalStr
					}
				}
			}
		}
		let plusOne = moment(date).subtract(1, unit.chart)
		let finalStr = `${moment(plusOne).format(unit.tooltipFormat)} - ${moment(date).format(unit.tooltipFormat)} `
		return finalStr
	}
	const handleDate = () => {
		let dateStr = tooltip.title[0] ? tooltip.title[0] : ''
		return moment(dateStr, 'lll').isValid() ? moment(dateStr, 'lll').format('ll') : dateStr
	}
	const handleDayTime = () => {
		let dayStr = tooltip.title[1] ? tooltip.title[1].charAt(0).toUpperCase() + tooltip.title[1].slice(1) : ''
		let hours = moment(tooltip.title[0], 'lll').format('LT')
		let completeDayStr = `${dayStr} (${hours})`
		return completeDayStr
	}

	const renderTooltip = () => {
		let doi = dispatch(todayOfInterest(moment(tooltip.title[0], 'lll').format('YYYY-MM-DD')))
		let birthdays = doi.birthdays
		let days = doi.days
		let graphUnit = props.graphUnit
		return <Grow in={tooltip.show} onExited={handleCloseTooltip} >
			<Paper className={classes.paper}>
				<ItemG container>
					<ItemG container id={'header'} xs={12}>
						<ItemG xs={8} container direction='column'>
							<Typography variant={'h5'}>{`${handleDayTime()}`}</Typography>
							<Typography variant={'body1'}> {`${t('charts.fields.date')}: ${handleDate()}`}</Typography>
							<Typography variant={'body1'}> {`${t('charts.fields.range')}: ${handleRange()}`}</Typography>
						</ItemG>
						<ItemG container xs={4}>
							{tooltip.data.map((d, i) => {
								return (
									<ItemG key={i} container direction='row' justify={'flex-end'} alignItems={'center'}>
										<DataUsage style={{ color: d.color, width: 24, height: 24, marginLeft: 16, marginRight: 4 }} />
										<Typography variant={'body1'}>{d.count} {graphUnit}</Typography>
									</ItemG>
								)
							})}
						</ItemG>
					</ItemG>
					<ItemG container>
						<ItemG container xs={12} sm={6} md={6} lg={6} xl={6} style={{ padding: 8 }}>
							<Collapse in={tooltip.showWeather}>
								{weather ? <ItemG xs={12}><WeatherIcon icon={weather.currently.icon} /></ItemG> : null}
								<Fragment>
									<ItemG container direction='row' xs={12}>
										<T>
											{t("charts.fields.summary")}: {weather ? weather.currently.summary : null}
										</T>
									</ItemG>
									<ItemG container direction='row' xs={12}>
										<T>
											{t("charts.fields.temperature")}: {weather ? `${Math.round(weather.currently.temperature)} \u{2103}` : null}
										</T>
									</ItemG>
									<ItemG container direction='row' xs={12}>
										<T>
											{t("charts.fields.windspeed")}: {weather ? `${Math.round(weather.currently.windSpeed / 3.6)} m/s` : null}
										</T>
									</ItemG>
									<ItemG container direction='row' xs={12}>
										<T>
											{t("charts.fields.humidity")}: {weather ? `${Math.round(weather.currently.humidity * 100)}%` : null}
										</T>
									</ItemG>
									<ItemG container direction='row' xs={12}>
										<T>
											{t("charts.fields.pressure")}: {weather ? `${Math.round(weather.currently.pressure)} hPa` : null}
										</T>
									</ItemG>
								</Fragment>
							</Collapse>
						</ItemG>
						{days.length > 0 || birthdays.length > 0 ?
							<ItemG container alignItems={'center'} justify={'center'} xs={12} sm={6} md={6} lg={6} xl={6} style={{ padding: 8 }}>
								<ItemG xs={2}><DateRange className={classes.largeIcon} /></ItemG>
								<ItemG xs={10} style={{ paddingLeft: 4 }} container alignItems={mobile ? 'center' : undefined}>
									{days.length > 0 ? days.map((d, i) => <T key={i}>
										{`\u{2022}`}{d.name}
									</T>) : <Muted>{t('no.doi')}</Muted>}
								</ItemG>
								<ItemG xs={2}><Cake className={classes.largeIcon} /></ItemG>
								<ItemG xs={10} style={{ paddingLeft: 4 }} container alignItems={mobile ? 'center' : undefined}>
									{birthdays.length > 0 ? birthdays.map((d, i) => <T key={i}>
										{`\u{2022} ${d.name}`}
									</T>) : <Muted>{t('no.birthdays')}</Muted>}
								</ItemG>
							</ItemG>
							: null}
					</ItemG>
				</ItemG>
			</Paper>
		</Grow>
	}

	const handleTransition = React.forwardRef((props, ref) => { return <Grow in {...props} ref={ref} /> })


	return (
		clickEvent() ?
			<div ref={r => getRef(r)} style={{
				zIndex: tooltip.show ? 1028 : tooltip.exited ? -1 : 1028,
				position: 'absolute',
				top: Math.round(tooltip.top),
				left: chartWidth > screenWidth / 2 ? Math.round(tooltip.left) : '50%',
				// left: mobile ? '50%' : Math.round(tooltip.left),
				transform: transformLoc(),
				width: mobile ? 300 : 400,
				maxWidth: mobile ? 300 : 500
			}}>
				{renderTooltip()}
			</div>
			:
			<Dialog
				open={tooltip.show}
				onClose={e => { e.stopPropagation(); handleCloseTooltip() }}
				TransitionComponent={handleTransition}
			// onBackdropClick={e => e.stopPropagation()}
			>

				<DialogContent style={{ padding: 0 }}>
					{renderTooltip()}
				</DialogContent>
			</Dialog>
	)
}

Tooltip.propTypes = {
	getRef: PropTypes.func.isRequired,
	handleCloseTooltip: PropTypes.func.isRequired,
	tooltip: PropTypes.object.isRequired,
	weather: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.string,
	]),
	chartWidth: PropTypes.number,
	chartHeight: PropTypes.number,
}

export default Tooltip
