import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grow, Paper, Typography } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import moment from 'moment'
import { todayOfInterest } from 'redux/doi';
import { DataUsage } from 'variables/icons';

class PieTooltip extends Component {
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
			y = '5%'
		}
		if (tooltip.left < (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			y = '-105%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
			y = '5%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			y = '-105%'
		}
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
		let finalStr = `${moment(tooltip.from).format(unit.tooltipFormat)} - ${moment(tooltip.to).format(unit.tooltipFormat)} `
		return finalStr
	}

	handleDate = () => {
		const { date } = this.props.tooltip
		return moment(date).format('ll')
	}

	handleDayTime = () => {
		const { tooltip } = this.props
		let dayStr = moment(tooltip.date).format('ll')
		let hours = moment(tooltip.date).format('LT')
		let completeDayStr = `${dayStr} (${hours})`
		return completeDayStr
	}

	handleRawDate = () => {
		const { tooltip } = this.props
		return moment(tooltip.title[0], 'lll').format('YYYY-MM-DD')
	}
	
	render() {
		const { t, classes, tooltip, mobile,
			getRef, handleCloseTooltip } = this.props
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
								<ItemG xs={9} container direction='column'>
									<Typography variant={'h5'}>{tooltip.name}</Typography>
									<Typography variant={'body1'}> {`${t('charts.fields.range')}: ${this.handleRange()}`}</Typography>
								</ItemG>
								<ItemG container xs={3}>
									<ItemG container direction='row' justify={'flex-end'} alignItems={'center'}>
										<DataUsage style={{ color: tooltip.color, width: 24, height: 24, marginLeft: 16, marginRight: 4 }} />
										<Typography variant={'body1'}>{tooltip.count}</Typography>
									</ItemG>
								</ItemG>
							</ItemG>
						</ItemG>
					</Paper>
				</Grow>
			</div>
		)
	}
}

PieTooltip.propTypes = {
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

const mapStateToProps = () => ({

})

const mapDispatchToProps = dispatch => ({
	todayOfInterest: (date) => dispatch(todayOfInterest(moment(date, 'lll').format('YYYY-MM-DD')))
})

export default connect(mapStateToProps, mapDispatchToProps)(PieTooltip)
