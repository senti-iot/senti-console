import React, { PureComponent } from 'react'
import { Line } from 'react-chartjs-2';
import { Typography, withStyles, Paper, Grow, CircularProgress } from '@material-ui/core';
import { ItemG, WeatherIcon, Caption } from 'components';
import { graphStyles } from './graphStyles';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import { compose } from 'recompose';
import { connect } from 'react-redux'
// import './zoom';
// import { getWeather } from 'variables/dataDevices';
class LineChart extends PureComponent {
	constructor(props) {
		super(props)
		
		this.state = {
			weather: '',
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
				// responsive: true,
				animation: {
					duration: 500,
					onComplete: props.getImage ? props.getImage : null,
				},
				display: true,
				maintainAspectRatio: false,
				tooltips: {
					titleFontFamily: 'inherit',
					mode: 'point',
					intersect: false,
					enabled: false,
					custom: this.customTooltip
				},
				hover: {
					mode: 'point'
				},
				scales: {
					xAxes: [
						{
							ticks: {
								source: 'labels',
								maxRotation: 0
							},
							id: 'xAxis',
							type: 'time',
							// distribution: 'series',
							time: {
								displayFormats: {
									hour: 'LT',
									day: 'DD MMM',
									minute: 'LT'
								},
								unit: props.unit.chart,
								tooltipFormat: props.unit.format
							},
						},
						{
							display: props.unit.chart === 'day' ? true : false,
							gridLines: {
								drawBorder: false,
								drawTicks: false,
							},
							ticks: {
							
								callback: function (value, index, values) {
									return value.charAt(0).toUpperCase() + value.slice(1);
								},
								source: 'labels',
								maxRotation: 0
							},
							id: 'xAxis-day',
							type: 'time',
							time: {
								displayFormats: {
									day: 'dddd',
								},
								unit: props.unit.chart,
								tooltipFormat: props.unit.format
							},
						}],
					yAxes: [{
						scaleLabel: {
							display: false,
							labelString: 'value'
						}
					}]
				},
				// zoom: {
				// 	enabled: true,
				// 	drag: true,
				// 	mode: 'x',
				// 	// onZoom: function (props) { ;  }
				// }
			}
		}
	}
	legendOptions = {
		position: 'bottom',
		display: !this.props.single ? true : false,
		onHover: !this.props.single ? (t, l) => {
			this.props.setHoverID(this.props.data.datasets[l.datasetIndex].id)
		} : null
	}
	clickEvent = () => {
		if ('ontouchstart' in document.documentElement === true)
			return false
		else
			return true
	}
	componentDidMount = () => {
		this.chart.chartInstance.config.options.elements.point.radius = this.clickEvent() ? 3 : 5 
		this.chart.chartInstance.config.options.elements.point.hitRadius = this.clickEvent() ? 3 : 5 
		this.chart.chartInstance.config.options.elements.point.hoverRadius = this.clickEvent() ? 4 : 6 

		this.setState({
			chartWidth: parseInt(this.chart.chartInstance.canvas.style.width.substring(0, this.chart.chartInstance.canvas.style.width.length - 1), 10),
			chartHeight: parseInt(this.chart.chartInstance.canvas.style.height.substring(0, this.chart.chartInstance.canvas.style.height.length - 1), 10),
			mobile: window.innerWidth > 400 ? false : true

		})	
	}

	/**
		 * 	How the damn zoom Works:
		 *  1. Sets a min/max moment objects scale on the x axis
		 *  2. Re renders the chart
		 * 
		 *  How to implement in our code:
		 *  1. In the onZoom function get the minMax from the xAxis scale
		 *  2. Pass them to the same function as CustomSetRange used by the filter in Device.js
		 *  3. Create a new function that based on the difference between the dates, sets the appropiate timeType (hour, minute, day, month, etc.)
		 *  4. Set the 'newData' without loading
		 * 	@debug 
		 *  */
	componentDidUpdate = (prevProps, prevState) => {
	
		if (prevProps.unit !== this.props.unit || prevProps.hoverID !== this.props.hoverID) {
			this.setXAxis()
		}
		if (this.chart.chartInstance.canvas.style.width !== this.state.chartWidth || this.state.chartHeight !== this.chart.chartInstance.canvas.style.height) {
			this.setState({
				chartWidth: parseInt(this.chart.chartInstance.canvas.style.width.substring(0, this.chart.chartInstance.canvas.style.width.length - 1), 10),
				chartHeight: parseInt(this.chart.chartInstance.canvas.style.height.substring(0, this.chart.chartInstance.canvas.style.height.length - 1), 10)
			})
		}
	}

	setHours = (date) => {
		if (this.props.unit.chart === 'day')
			return moment(date).startOf('day').add(12, 'h')
		else 
			return moment(date)
	}
	customTooltip = async (tooltipModel) => {
		if (tooltipModel.opacity === 0) {
			this.hideTooltip()
			return
		}
		
		
		// let weatherData = null
		let wDate = null
		try {
			let lat = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].lat
			let long = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].long
			
			wDate = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x
			if (this.state.weatherDate !== wDate || (lat !== this.state.loc.lat && long !== this.state.loc.long)) {
				if (lat !== 0 && long !== 0) {
					this.setState({ weather: "" })
					getWeather({ lat: lat, long: long }, this.setHours(wDate), this.props.lang).then(rs => {
						this.setState({
							weatherDate: wDate,
							weather: rs,
							loc: {
								lat: lat,
								long: long
							}
						})
					})
				}
				else { 
					this.setState({
						weatherDate: wDate,
						weather: null,
						loc: {
							lat: 0,
							long: 0
						}
					})
				}
			}
		}
		catch (err) {
			
		}
		let left = tooltipModel.caretX;
		let top = tooltipModel.caretY;
		if (!this.clickEvent()) { 
			left = this.state.chartWidth / 2
		}
		let str = tooltipModel.title[0]
		var rest = str.substring(0, str.lastIndexOf(' ') + 1);
		var last = str.substring(str.lastIndexOf(' ') + 1, str.length);
		this.setTooltip({
			top,
			left,
			title: [rest, last],
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
					xAxes: [
						{
							id: 'xAxis',
							type: 'time',
							time: {
								displayFormats: {
									hour: 'LT',
									day: 'll dddd',
									minute: 'LT'
								},
								unit: this.props.unit.chart,
								tooltipFormat: this.props.unit.format
							},
						},
						{
							display: this.props.unit.chart === 'day' ? true : false,
							gridLines: {
								drawBorder: false,
								drawTicks: false,
							},
							ticks: {
								callback: function (value, index, values) {
									return value.charAt(0).toUpperCase() + value.slice(1);
								},
								source: 'labels',
								maxRotation: 0
							},
							id: 'xAxis-day',
							type: 'time',
							time: {
								displayFormats: {
									day: 'dddd',
								},
								unit: this.props.unit.chart,
								tooltipFormat: this.props.unit.format
							},
						}]
				}
			}
		}, this.chart.chartInstance.update())
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
		try {
			await this.props.onElementsClick(elements)
		}
		catch (e) {
			// ;
		}
		// }
		this.hideTooltip()
	}
	onMouseLeave = () => {
		const { single } = this.props
		return !single ? () => this.props.setHoverID(0) : undefined
	}
	transformLoc = () => {
		const { tooltip, chartWidth, chartHeight } = this.state
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
	render() {
		const { classes } = this.props
		const { tooltip, chartWidth, mobile } = this.state
		let DayStr = tooltip.title[1] ? tooltip.title[1].charAt(0).toUpperCase() + tooltip.title[1].slice(1) : ''
		let DateStr = tooltip.title[0] ? tooltip.title[0] : ''
		return (
			<div style={{ maxHeight: 400, position: 'relative', height: 400 }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
				<Line
					data={this.props.data}
					height={this.props.theme.breakpoints.width('md') < window.innerWidth ? window.innerHeight / 4 : window.innerHeight - 200}
					ref={r => this.chart = r}
					options={this.state.lineOptions}
					legend={this.legendOptions}
					onElementsClick={this.clickEvent() ? this.elementClicked : undefined}
				/>
				<div ref={r => this.tooltip = r} style={{
					zIndex: tooltip.show ? 1200 : tooltip.exited ? -1 : 1200,
					position: 'absolute',
					top: Math.round(this.state.tooltip.top),
					left: mobile ? '50%' : Math.round(this.state.tooltip.left),
					transform: this.transformLoc(),
					width: mobile ? 200 : 300,
					maxWidth: mobile ?  (chartWidth ? chartWidth : window.innerWidth - 250) : 300 
				}}>
					<Grow in={tooltip.show} onExited={this.exitedTooltip} >
						<Paper className={classes.paper}>
							<ItemG container>
								<ItemG container direction='row' justify='space-between'>
									<ItemG xs container direction='column'>
										<Typography variant={'h6'} classes={{ root: classes.antialias }} >{`${DayStr}`}</Typography>
										<Caption> {`(${DateStr})`}</Caption>
									</ItemG>
									<ItemG xs={2}>
										{this.state.weather ? <WeatherIcon icon={this.state.weather.currently.icon} /> : this.state.weather === null ? null : <CircularProgress size={37} />}
									</ItemG>
								</ItemG>
								<ItemG >
									<Caption>{this.state.weather === null ? null : `${this.props.t('devices.fields.weather')}:`} {this.state.weather ? this.state.weather.currently.summary : null}</Caption>
									{/* <Info></Info> */}
								</ItemG> 
								{this.state.tooltip.data.map((d, i) => {
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
			</div>
		)
	}
}
const mapStateToProps = (state) => ({
	lang: state.settings.language
})

const mapDispatchToProps = {

}

let LineChartCompose = compose(connect(mapStateToProps, mapDispatchToProps), withStyles(graphStyles, { withTheme: true }))(LineChart)
// export default withStyles(graphStyles, { withTheme: true })(LineChart)
export default LineChartCompose