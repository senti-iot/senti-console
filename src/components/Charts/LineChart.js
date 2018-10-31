import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import { Typography, withStyles, Paper, Grow } from '@material-ui/core';
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
	legendOptions = {
		position: "bottom",
		onHover: (t, l) => {
			this.props.setHoverID(this.props.data.datasets[l.datasetIndex].id)
		}
	}
	componentDidMount = () => {
		this.setState({
		  chartWidth: this.chart.chartInstance.canvas.width
	  })
	}
	
	lineOptions = {
		display: true,
		maintainAspectRatio: false,
		tooltips: {
			mode: "point",
			intersect: false,
			enabled: false,
			custom: (tooltipModel) => {
				if (tooltipModel.opacity === 0) {
					this.hideTooltip()
					return
				}
				console.log(tooltipModel.caretX)
				const position = this.chart.chartInstance.canvas.getBoundingClientRect();
				console.log('position', position)
				// console.log(this.chart.chartInstance)

				const left =/*  position.left +*/  tooltipModel.caretX;
				const top = /* position.top +  */tooltipModel.caretY;
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
		// console.log('called')
		this.setState({
			tooltip: {
				...this.state.tooltip,
				// top: 0,
				// left: 0,
				show: false
			}
		})
	}
	render() {
		const { classes } = this.props
		const { tooltip, chartWidth } = this.state
		return (
			<div style={{ maxHeight: 400, position: 'relative' }} onScroll={this.hideTooltip} onMouseLeave={() => this.props.setHoverID(0)}>
				<Line
					data={this.props.data}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
					ref={r => this.chart = r}
					options={this.lineOptions}
					legend={this.legendOptions}
				/>
				{/* this.state.tooltip.show  && */
					<div ref={r => this.tooltip = r} style={{
						zIndex: tooltip.show ? 1300 : -1,
						position: 'absolute',
						top: Math.round(this.state.tooltip.top),
						left: Math.round(this.state.tooltip.left),
						transform: (tooltip.left) > (chartWidth / 2) ? 'translate(-105%, -50%)' : 'translate(5%, -50%)',
						minWidth: 300
					}}>
						<Grow in={tooltip.show} exited={this.hideTooltip} >
							<Paper className={classes.paper}>
								<ItemG>
									<Typography variant={'h6'}>{this.state.tooltip.title}</Typography>
									{this.state.tooltip.data.map(d => {
										return (
											<ItemG key={d.id} container alignItems={'center'}>
												<div style={{ background: d.color, width: 15, height: 15, marginRight: 10 }} />
												<Typography variant={'caption'}>{d.device}</Typography>
												<Typography classes={{
													root: classes.expand
												}}>{Math.round(d.count)}</Typography>
											</ItemG>
										)
									})}
								</ItemG>
							</Paper>
						</Grow>

						{/* 	</Popover> */}</div>
				}
			</div>
		)
	}
}

export default withStyles(graphStyles, { withTheme: true })(LineChart)
