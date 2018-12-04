import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grow, Paper, Typography, CircularProgress } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import { Caption, WeatherIcon } from 'components';
import moment from 'moment'
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
			x = '-25%'
			y = '25%'
		}
		if (tooltip.left < (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			x = '-25%'
			y = '-125%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
			x = '-80%'
			y = '25%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			x = '-80%'
			y = '-125%'
		}
		if (tooltip.left > ((chartWidth / 4) * 3)) {
			x = '-90%'
		}
		if (tooltip.left < chartWidth / 4) {
			x = '0%'
		}
		return `translate(${x}, ${y})`
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
	render() {
		const { t, classes, tooltip, weather, mobile, chartWidth,
			getRef, handleCloseTooltip } = this.props
		// let DateStr = tooltip.title[0] ? tooltip.title[0] : ''
		this.handleDayTime()
		return (
			<div ref={r => getRef(r)} style={{
				zIndex: tooltip.show ? 1200 : tooltip.exited ? -1 : 1200,
				position: 'absolute',
				top: Math.round(tooltip.top),
				left: mobile ? '50%' : Math.round(tooltip.left),
				transform: this.transformLoc(),
				width: mobile ? 300 : 500,
				maxWidth: mobile ? 300 : 500
			}}>
				<Grow in={tooltip.show} onExited={handleCloseTooltip} >
					<Paper className={classes.paper}>
						<ItemG container>
							<ItemG container id={'header'} xs={12}>
								<ItemG xs={8} container direction='column'>
									<Typography variant={'h5'}>{`${this.handleDayTime()}`}</Typography>
									<Typography variant={'body1'}> {`${t('charts.fields.date')}:${this.handleDate()}`}</Typography>
								</ItemG>
								<ItemG container xs={4}>
									{tooltip.data.map((d, i) => {
										return (
											<ItemG key={i} container direction='row' justify={'flex-end'} alignItems={'center'}>
												{/*<ItemG xs={8}><Typography noWrap variant={'caption'}>{d.device}</Typography></ItemG> */}
												<div style={{ background: d.color, width: 15, height: 15, marginLeft: 16, marginRight: 4 }} />
												<Typography variant={'body1'}>{Math.round(d.count)}</Typography>

											</ItemG>
										)
									})}
								</ItemG>
							</ItemG>
							<ItemG container xs={6}>

							</ItemG>
							<ItemG container xs={6}>

							</ItemG>
							<ItemG container direction='row' justify='space-between'>

								<ItemG xs={2}>
									{weather ? <WeatherIcon icon={weather.currently.icon} /> : weather === null ? null : <CircularProgress size={37} />}
								</ItemG>
							</ItemG>
							<ItemG >
								<Caption>{weather === null ? null : `${t('devices.fields.weather')}:`} {weather ? weather.currently.summary : null}</Caption>
							</ItemG>
							{tooltip.data.map((d, i) => {
								return (
									<ItemG key={i} container alignItems={'center'}>
										<ItemG xs={1}>
											<div style={{ background: d.color, width: 15, height: 15, marginRight: 8 }} />
										</ItemG>
										<ItemG xs={8}><Typography noWrap variant={'caption'}>{d.device}</Typography></ItemG>
										<ItemG xs={3}><Typography variant={'caption'} classes={{
											root: classes.expand
										}}>{Math.round(d.count)}</Typography></ItemG>
									</ItemG>
								)
							})}
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

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip)
