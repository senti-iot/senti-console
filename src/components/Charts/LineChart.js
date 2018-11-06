import React, { PureComponent } from 'react'
import { Line } from 'react-chartjs-2';
import { Typography, withStyles, Paper, Grow } from '@material-ui/core';
import { ItemG, WeatherIcon } from 'components';
import { graphStyles } from './graphStyles';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
// import { getWeather } from 'variables/dataDevices';
class LineChart extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			weatherDate: null,
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
					duration: 500,
					onComplete: props.getImage,
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
				scales: {
					xAxes: [
						{
							// id: "xAxis",
							type: 'time',
							time: {
								displayFormats: {
									hour: "LT",
									day: 'll',
									minute: 'LT'
								},
								unit: props.unit.chart,
								tooltipFormat: props.unit.format
							},
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
	setHours = (date) => {
		if (this.props.unit.chart === 'day')
			return moment(date).startOf('day').add(12, 'h')
			
	}
	customTooltip = async (tooltipModel) => {
		if (tooltipModel.opacity === 0) {
			this.hideTooltip()
			return
		}
		// console.log(tooltipModel)
		// console.log(this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x)
		let weatherData = null
		let wDate = null
		try {
			wDate = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x
			// console.log(this.state.weatherDate, wDate, this.state.weatherDate === wDate)
			if (this.state.weatherDate !== wDate)
				weatherData = await getWeather(this.props.obj, this.setHours(wDate))
			this.setState({
				weatherDate: wDate,
				weather: weatherData ? weatherData : this.state.weather
			})
		}
		catch (err) { 

		}

		const left = tooltipModel.caretX;
		const top = tooltipModel.caretY;
		// let deviceWeather = getWeather(device).then(rs => rs)
	
		this.setTooltip({
			
			top,
			left,
			title: tooltipModel.title,
			data: tooltipModel.dataPoints.map((d, i) => ({
				device: tooltipModel.body[i].lines[0].split(':')[0], count: d.yLabel, color: tooltipModel.labelColors[i].backgroundColor
			}))
		})
	}
	setXAxis = () => {
		this.setState({
			lineOptions: {
				...this.state.lineOptions,
				scales: {
					...this.state.lineOptions.scales,
					xAxes: [{
						// id: "day",
						type: 'time',
						time: {
							displayFormats: {
								hour: 'LT',
								day: 'll',
								minute: 'LT'
							},
							unit: this.props.unit.chart,
							tooltipFormat: this.props.unit.format
						},
					}]
				}
			}
		}, this.chart.chartInstance.update())
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.unit !== this.props.unit || prevProps.hoverID !== this.props.hoverID) {
			this.setXAxis()
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
							<ItemG container>
								<ItemG container direction="row"
									justify="space-between">
									<Typography variant={'h6'} classes={{ root: classes.antialias }}>{this.state.tooltip.title}</Typography>
									{this.state.weather ? <WeatherIcon icon={this.state.weather.currently.icon} /> : null}
								</ItemG>
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
