import React from 'react'
import PropTypes from 'prop-types'
import { Grow, Paper, Typography, Dialog, DialogContent } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import moment from 'moment'
import { DataUsage } from 'variables/icons';
import { useLocalization } from 'hooks';

const PieTooltip = props => {
	//Hooks
	const t = useLocalization()

	//Redux

	//State

	//Const
	const { tooltip, chartWidth, chartHeight, mobile, getRef, handleCloseTooltip, unit } = props

	//useCallbacks

	//useEffects

	//Handlers


	const clickEvent = () => {
		if ('ontouchstart' in document.documentElement === true)
			return false
		else
			return true
	}
	const transformLoc = () => {
		let x = 0
		let y = 0
		if (!clickEvent()) {
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
	const handleRange = () => {
		let finalStr = `${moment(tooltip.from).format(unit.tooltipFormat)} - ${moment(tooltip.to).format(unit.tooltipFormat)} `
		return finalStr
	}
	const renderTooltip = () => {
		return <Grow in={tooltip.show} onExited={handleCloseTooltip} >
			<Paper>
				<ItemG container>
					<ItemG container id={'header'} xs={12}>
						<ItemG xs={9} container direction='column'>
							<Typography variant={'h5'}>{tooltip.name}</Typography>
							<Typography variant={'body1'}> {`${t('charts.fields.range')}: ${handleRange()}`}</Typography>
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
	}

	const handleTransition = React.forwardRef((props, ref) => { return <Grow in {...props} ref={ref} /> })


	return (
		clickEvent() ?
			<div ref={r => getRef(r)} style={{
				zIndex: tooltip.show ? 1028 : tooltip.exited ? -1 : 1028,
				position: 'absolute',
				top: Math.round(tooltip.top),
				left: mobile ? '50%' : Math.round(tooltip.left),
				transform: transformLoc(),
				width: mobile ? 300 : 400,
				maxWidth: mobile ? 300 : 500
			}}>
				{renderTooltip()}
			</div> :
			<Dialog
				open={tooltip.show}
				onClose={e => { e.stopPropagation(); handleCloseTooltip() }}
				TransitionComponent={handleTransition}
			>

				<DialogContent style={{ padding: 0 }}>
					{renderTooltip()}
				</DialogContent>
			</Dialog>
	)
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

export default PieTooltip
