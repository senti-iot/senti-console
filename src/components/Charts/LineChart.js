import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import { Popover, Typography, withStyles } from '@material-ui/core';
import { ItemG } from 'components';
import { graphStyles } from './graphStyles';

class LineChart extends Component {
	constructor(props) {
		super(props)

		this.state = {
			tooltip: {
				show: false,
				title: '',
				top: 0,
				left: 0,
				data: []
			}
		}
	}
	componentDidMount = () => {
		window.addEventListener('scroll', () => { console.log('scrolled') }, false)
	}
	componentWillUnmount = () => {
		window.removeEventListener('scroll', () => { console.log('scrolled') }, false)
	}

	lineOptions = {
		display: true,
		maintainAspectRatio: false,
		tooltips: {
			mode: "x",
			intersect: false,
			enabled: false,
			custom: (tooltipModel) => {
				if (tooltipModel.opacity === 0) {
					this.hideTooltip()
					return
				}
				console.log(tooltipModel)
				const position = this.chart.chartInstance.canvas.getBoundingClientRect();
				const left = position.left + tooltipModel.caretX + 10;
				const top = position.top + tooltipModel.caretY + 10;
				this.setTooltip({ top, left, title: tooltipModel.title, data: tooltipModel.dataPoints.map((d, i) => ({ device: tooltipModel.body[i].lines[0].split(':')[0], count: d.yLabel, color: tooltipModel.labelColors[i].backgroundColor })) })
			}
		},
		scales: {
			xAxes: [{
				type: 'time',
				time: {
					unit: 'day',
					tooltipFormat: "ll"
				},
				scaleLabel: {
					display: true,
					labelString: 'Date'
				}
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'value'
				}
			}]
		}
	}
	setTooltip = (tooltip) => {
		this.setState({
			tooltip: {
				...tooltip,
				show: true
			}
		})
	}
	hideTooltip = () => {
		console.log('called')
		this.setState({
			tooltip: {
				...this.state.tooltip,
				show: false
			}
		})
	}
	render() {
		const { classes } = this.props
		return (
			<div style={{ maxHeight: 400 }} onScroll={this.hideTooltip}>
				<Line
					data={this.props.data}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
					ref={r => this.chart = r}
					options={this.lineOptions}
				/>
				{this.state.tooltip.show &&
					<Popover
						className={this.props.classes.popover}
						classes={{
							paper: this.props.classes.paper
						}}
						// anchorEl={this.lineRef}
						anchorReference={'anchorPosition'}
						open={true}
						anchorPosition={{
							top: Math.round(this.state.tooltip.top),
							left: Math.round(this.state.tooltip.left)
						}}
						disableRestoreFocus
					>
						<ItemG>
							<Typography variant={'h6'}>{this.state.tooltip.title}</Typography>
							{this.state.tooltip.data.map(d => {
								return (
									<ItemG container /* justify={'center'} */ alignItems={'center'}>
										<div style={{ background: d.color, width: 15, height: 15, marginRight: 10 }} />
										<Typography variant={'caption'}>{d.device}</Typography>
										<Typography classes={{
											root: classes.expand
										}}>{Math.round(d.count)}</Typography>
									</ItemG>
								)
							})}
						</ItemG>

					</Popover>}
			</div>
		)
	}
}

export default withStyles(graphStyles, { withTheme: true })(LineChart)
