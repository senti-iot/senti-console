import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grow, Paper, Typography, Collapse } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import { T, WeatherIcon, Muted } from 'components';
import moment from 'moment'
import { todayOfInterest } from 'redux/doi';
import { DateRange, Cake, DataUsage } from 'variables/icons';
class Tooltip extends Component {
	clickEvent = () => {
		if ('ontouchstart' in document.documentElement === true)
			return false
		else
			return true
	}
	transformLoc = () => {
		const { tooltip, chartWidth, chartHeight } = this.props
		let x = 0
		let y = 0
		if (!this.clickEvent()) {
			x = '-50%'
			y = tooltip.top < (chartHeight / 2) ? '25%' : '-125%'
			return `translate(${x}, ${y})`
		}
		if (tooltip.left < (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
			// x = '-15%'
			y = '5%'
		}
		if (tooltip.left < (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			// x = '-15%'
			y = '-105%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
			// x = '-70%'
			y = '5%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			// x = '-70%'
			y = '-105%'
		}
		// if (tooltip.left > ((chartWidth / 4) * 3)) {
		// 	x = '-90%'
		// }
		// if (tooltip.left < chartWidth / 4) {
		// 	x = '0%'
		// }
		if (tooltip.left > chartWidth / 2) {
			x = '-100%'
		}
		else { 
			x = '5%'
		}
		return `translate(${x}, ${y})`
	}
	handleRange = () => {
		const { tooltip, unit } = this.props
		let dateStr = tooltip.title[0] ? tooltip.title[0] : ''
		let date = moment(dateStr, 'lll').isValid() ? moment(dateStr, 'lll') : null
		if (date) {
			let plusOne = moment(date).subtract(1, unit.chart)
			let finalStr = `${moment(plusOne).format(unit.tooltipFormat)} - ${moment(date).format(unit.tooltipFormat)} ` 
			return finalStr
		}
		return moment(dateStr, 'lll').isValid() ? moment(dateStr, 'lll').format('ll') : dateStr
	}
	handleDate = () => {
		const { tooltip } = this.props
		let dateStr = tooltip.title[0] ? tooltip.title[0] : ''
		return moment(dateStr, 'lll').isValid() ? moment(dateStr, 'lll').format('ll') : dateStr
	}
	handleDayTime = () => {
		const { tooltip } = this.props
		let dayStr = tooltip.title[1] ? tooltip.title[1].charAt(0).toUpperCase() + tooltip.title[1].slice(1) : ''
		let hours = moment(tooltip.title[0], 'lll').format('LT')
		let completeDayStr = `${dayStr} (${hours})`
		return completeDayStr
	}
	handleRawDate = () => {
		const { tooltip } = this.props
		return moment(tooltip.title[0], 'lll').format('YYYY-MM-DD')
	}
	render() {
		const { t, classes, tooltip, weather, mobile,
			getRef, handleCloseTooltip, todayOfInterest } = this.props
		let doi = todayOfInterest(tooltip.title[0])
		return (
			<div ref={r => getRef(r)} style={{
				zIndex: tooltip.show ? 1028 : tooltip.exited ? -1 : 1028,
				position: 'absolute',
				top: Math.round(tooltip.top),
				left: mobile ? '50%' : Math.round(tooltip.left),
				transform: this.transformLoc(),
				width: mobile ? 300 : 400,
				maxWidth: mobile ? 300 : 500
			}}>
				<Grow in={tooltip.show} onExited={handleCloseTooltip} >
					<Paper className={classes.paper}>
						<ItemG container>
							<ItemG container id={'header'} xs={12}>
								<ItemG xs={8} container direction='column'>
									<Typography variant={'h5'}>{`${this.handleDayTime()}`}</Typography>
									<Typography variant={'body1'}> {`${t('charts.fields.date')}: ${this.handleDate()}`}</Typography>
									<Typography variant={'body1'}> {`${t('charts.fields.range')}: ${this.handleRange()}`}</Typography>
								</ItemG>
								<ItemG container xs={4}>
									{tooltip.data.map((d, i) => {
										return (
											<ItemG key={i} container direction='row' justify={'flex-end'} alignItems={'center'}>
												<DataUsage style={{ color: d.color, width: 24, height: 24, marginLeft: 16, marginRight: 4 }} />
												<Typography variant={'body1'}>{Math.round(d.count)}</Typography>
											</ItemG>
										)
									})}
								</ItemG>
							</ItemG>
							<Collapse in={tooltip.showWeather}>
								<ItemG container>
									<ItemG container xs={12} sm={6} md={6} lg={6} xl={6} style={{ padding: 8 }}>
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
													{t("charts.fields.humidity")}: {weather ? `${weather.currently.humidity * 100}%` : null}
												</T>
											</ItemG>
											<ItemG container direction='row' xs={12}>
												<T>
													{t("charts.fields.pressure")}: {weather ? `${Math.round(weather.currently.pressure)} hPa` : null}
												</T>
											</ItemG>
										</Fragment>
									</ItemG>
									{doi.length > 0 ? <ItemG container justify={'center'} xs={12} sm={6} md={6} lg={6} xl={6} style={{ padding: 8 }}>
										{/* <ItemG xs={12}><Typography variant={'body1'}>{t('charts.fields.thisDay')}</Typography></ItemG> */}
										<ItemG xs={2}><DateRange className={classes.largeIcon} /></ItemG>
										<ItemG xs={10} style={{ paddingLeft: 4 }}>
											{doi.length > 0 ? doi.map((d, i) => <T key={i}>
												{`\u{2022}`}{d.name}
											</T>) : <Muted>{t('no.doi')}</Muted>}
										</ItemG>
										<ItemG xs={2}><Cake className={classes.largeIcon} /></ItemG>
										<ItemG xs={10} style={{ paddingLeft: 4 }}>
											<Muted>{t('no.birthdays')}</Muted>
										</ItemG>
									</ItemG> : null}
								</ItemG>
							</Collapse>
						</ItemG>
					</Paper>
				</Grow>
			</div>
		)
	}
}

Tooltip.propTypes = {
	//functions
	getRef: PropTypes.func.isRequired,
	handleCloseTooltip: PropTypes.func.isRequired,

	//vars
	tooltip: PropTypes.object.isRequired,
	weather: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.string,
	]),
	chartWidth: PropTypes.number,
	chartHeight: PropTypes.number,
	//Redux
	// daysOfInterest: PropTypes.object.isRequired,
	//EndRedux
}

const mapStateToProps = (state, props) => ({

})

const mapDispatchToProps = dispatch => ({
	// getDateDoI: (date) => dispatch(') 
	todayOfInterest: (date) => dispatch(todayOfInterest(moment(date, 'lll').format('YYYY-MM-DD')))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip)
