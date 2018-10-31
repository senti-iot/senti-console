import React, { PureComponent } from 'react'
import { Line } from 'react-chartjs-2';
import { Typography, withStyles, Paper, Grow } from '@material-ui/core';
import { ItemG } from 'components';
import { graphStyles } from './graphStyles';
class LineChart extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			tooltip: {
				show: false,
				title: '',
				top: 0,
				left: 0,
				data: [],
				exited: false
			},
			lineOptions: {
				animation: {
					duration: 500
				},
				display: true,
				maintainAspectRatio: false,
				tooltips: {
					mode: "point",
					intersect: false,
					enabled: false,
					custom: this.customTooltip
				},
				hover: {
					mode: "point"
				},
				scales: {
					xAxes: [
						 {
							id: "day",
							type: 'time',
							time: {
								unit: props.unit.chart,
								tooltipFormat: props.unit.format
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
		}
		// this.hideTooltip = this.hideTooltip.bind(this)
		// this.setTooltip = this.setTooltip.bind(this)
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
	// componentDidUpdate = (prevProps, prevState) => {
	//   this.chart.chartInstance.update()
	// }
	customTooltip = (tooltipModel) => {
		// console.log(this.chart.chartInstance)
		// console.log(tooltipModel.opacity)
		if (tooltipModel.opacity === 0) {
			this.hideTooltip()
			return
		}
		const left = tooltipModel.caretX;
		const top = tooltipModel.caretY;
		this.setTooltip({
			top,
			left,
			title: tooltipModel.title,
			data: tooltipModel.dataPoints.map((d, i) => ({
				device: tooltipModel.body[i].lines[0].split(':')[0], count: d.yLabel, color: tooltipModel.labelColors[i].backgroundColor
			}))
		})
	}
	lineOptions = {
		display: true,
		maintainAspectRatio: false,
		tooltips: {
			mode: "point",
			intersect: false,
			enabled: false,
			custom: this.customTooltip
		},
		hover: {
			mode: "point"
		},
		scales: {
			xAxes: [
				{
					id: "hour",
					type: 'time',
					time: {
						unit: "hour",
						tooltipFormat: "ll"
					},
					scaleLabel: {
						display: true,
						labelString: 'Hours'
					}
				}, {
					id: "day",
					type: 'time',
					time: {
						unit: "day",
						tooltipFormat: "lll"
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
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.unit !== this.props.unit)
		{
			this.setState({
				lineOptions: {
					...this.state.lineOptions,
					scales: {
						...this.state.lineOptions.scales,
						xAxes: [{
							id: "day",
							type: 'time',
							time: {
								unit: this.props.unit.chart,
								tooltipFormat: this.props.unit.format
							},
							scaleLabel: {
								display: true,
								labelString: 'Date'
							}
						}]
					}
				}
			})
			// this.chart.chartInstance.config.options.scales.xAxes[0] = {
			// 	id: "day",
			// 	type: 'time',
			// 	time: {
			// 		unit: this.props.unit,
			// 		tooltipFormat: "ll"
			// 	},
			// 	scaleLabel: {
			// 		display: true,
			// 		labelString: 'Date'
			// 	}
			// }
			this.chart.chartInstance.update()
		}
	}
	
	setTooltip = (tooltip) => {
		this.setState({
			tooltip: {
				...tooltip,
				show: true,
				exited: false
			}
		})
	}
	exitedTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				exited: true
			}
		})
	}
	hideTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				show: false
			}
		})
	}
	elementClicked = async (elements) => {
		if (this.props.onElementsClick)
		{
			await this.props.onElementsClick(elements)
			
		}
		this.hideTooltip()
	}
	render() {
		const { classes } = this.props
		const { tooltip, chartWidth } = this.state
		console.log(this.props.unit)
		// console.log(this.state.lineOptions)
		return (
			<div style={{ maxHeight: 400, position: 'relative' }} onScroll={this.hideTooltip} onMouseLeave={() => {this.props.setHoverID(0);/* this.hideTooltip() */}}>
				<Line
					// redraw={true}
					data={this.props.data}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
					ref={r => this.chart = r}
					options={this.state.lineOptions}
					legend={this.legendOptions}
					onElementsClick={this.elementClicked}
				/>
				<div ref={r => this.tooltip = r} style={{
					zIndex: tooltip.show ? 1300 : tooltip.exited ? -1 : 1300,
					position: 'absolute',
					top: Math.round(this.state.tooltip.top),
					left: Math.round(this.state.tooltip.left),
					transform: (tooltip.left) > (chartWidth / 2) ? 'translate(-105%, -50%)' : 'translate(5%, -50%)',
					minWidth: 300
				}}>
					<Grow in={tooltip.show} onExited={this.exitedTooltip} >
						<Paper className={classes.paper}>
							<ItemG>
								<Typography variant={'h6'}>{this.state.tooltip.title}</Typography>
								{this.state.tooltip.data.map((d, i) => {
									return (
										<ItemG key={i} container alignItems={'center'}>
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
				</div>
			</div>
		)
	}
}

export default withStyles(graphStyles, { withTheme: true })(LineChart)
