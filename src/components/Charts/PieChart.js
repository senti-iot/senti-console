import React, { PureComponent } from 'react'
import { Pie } from 'react-chartjs-2';
import { Typography, withStyles, Paper, Grow } from '@material-ui/core';
import { ItemG } from 'components';
import { graphStyles } from './graphStyles';
class PieChart extends PureComponent {
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
				title: {
					display: true,
					text: props.title,
				},
				categoryPercentage: 0.5,
				barPercentage: 0.5,
				barThickness: "flex",
				gridLines: { offsetGridLines: false },
				animation: {
					duration: 500
				},
				display: true,
				maintainAspectRatio: false,
				tooltips: {
					titleFontFamily: "inherit",
					mode: "point",
					intersect: false,
					enabled: false,
					custom: this.customTooltip
				},
				hover: {
					mode: "point"
				},
				// scales: {
				// 	xAxes: [
				// 		{
				// 			display: false,
				// 			offset: true,
				// 			id: "day",
				// 			type: 'time',
				// 			time: {
				// 				displayFormats: {
				// 					hour: "LT",
				// 					day: 'll'
				// 				},
				// 				unit: props.unit.chart,
				// 				tooltipFormat: props.unit.format
				// 			},
				// 			gridLines: {
				// 				offsetGridLines: true
				// 			}
				// 		}],
				//		 yAxes: [{
				//		 	scaleLabel: {
				//		 		display: true,
				//		 		labelString: 'value'
				//		 	}
				//		 }]
				// }
			}
		}
	}
	legendOptions = {
		position: "bottom",
		display: !this.props.single ? true : false,
		onHover: !this.props.single ? (t, l) => {
			this.props.setHoverID(this.props.data.datasets[l.datasetIndex].id)
		} : null
	}
	componentDidMount = () => {
		this.setState({
			chartWidth: this.chart.chartInstance.canvas.width
		})
	}
	customTooltip = (tooltipModel) => {
		if (tooltipModel.opacity === 0) {
			this.hideTooltip()
			return
		}
		const left = tooltipModel.caretX;
		const top = tooltipModel.caretY;
		// ;
		// )
		this.setTooltip({
			top,
			left,
			title: tooltipModel.title,
			data: tooltipModel.dataPoints.map((d, i) => ({
				device: tooltipModel.body[i].lines[0].split(':')[0], count: tooltipModel.body[i].lines[0].split(':')[1], color: tooltipModel.labelColors[i].backgroundColor
			}))
		})
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.unit !== this.props.unit) {
			this.setState({
				lineOptions: {
					...this.state.lineOptions,

					scales: {
						...this.state.lineOptions.scales,
						xAxes: [{
							offset: true,
							id: "day",
							type: 'time',

							time: {
								displayFormats: {
									hour: "LT"
								},
								unit: this.props.unit.chart,
								tooltipFormat: this.props.unit.format
							},
						}]
					}
				}
			})
			this.chart.chartInstance.update()
		}
		if (prevProps.title !== this.props.title) {
			this.setState({
				lineOptions: {
					...this.state.lineOptions,
					title: {
						display: true,
						text: this.props.title
					}
				}
			})
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
		if (this.props.onElementsClick) {
			await this.props.onElementsClick(elements)

		}
		this.hideTooltip()
	}
	onMouseLeave = () => {
		const { single } = this.props
		return !single ? () => this.props.setHoverID(0) : undefined
	}
	render() {
		const { classes } = this.props
		const { tooltip, chartWidth } = this.state
		return (
			<div style={{ maxHeight: 400, position: 'relative' }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
				<Pie
					// redraw={true}
					data={this.props.data}
					height={400}
					// height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
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

export default withStyles(graphStyles, { withTheme: true })(PieChart)
