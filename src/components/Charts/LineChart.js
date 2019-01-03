import React, { PureComponent, Fragment } from 'react'
import ChartComponent, { Chart } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core';
import { graphStyles } from './graphStyles';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import { compose } from 'recompose';
import { connect } from 'react-redux'
import Tooltip from './Tooltip';

Chart.defaults.multicolorLine = Chart.defaults.line;
Chart.controllers.multicolorLine = Chart.controllers.line.extend({
	draw: function (ease) {
		var startIndex = 0,
			meta = this.getMeta(),
			points = meta.data || [],
			colors = this.getDataset().colors,
			area = this.chart.chartArea,
			originalDatasets = meta.dataset._children
				.filter(function (data) {
					return !isNaN(data._view.y);
				});

		function _setColor(newColor, meta) {
			meta.dataset._view.borderColor = newColor;
		}

		if (!colors) {
			Chart.controllers.line.prototype.draw.call(this, ease);
			return;
		}

		for (var i = 2; i <= colors.length; i++) {
			if (colors[i - 1] !== colors[i]) {
				_setColor(colors[i - 1], meta);
				meta.dataset._children = originalDatasets.slice(startIndex, i);
				meta.dataset.draw();
				startIndex = i - 1;
			}
		}

		meta.dataset._children = originalDatasets.slice(startIndex);
		meta.dataset.draw();
		meta.dataset._children = originalDatasets;

		points.forEach(function (point) {
			point.draw(area);
		});
	}
});

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
				exited: true
			},
			lineOptions: {
				responsive: true,
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
							gridLines: {
								color: props.theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.1)',
							},
							ticks: {
								source: 'labels',
								maxRotation: 0,
								fontColor: props.theme.palette.type === 'dark' ? '#ffffff' : "#000",
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
								display: false,
								drawBorder: false,
								drawTicks: false,
							},
							ticks: {

								callback: function (value) {
									return value.charAt(0).toUpperCase() + value.slice(1);
								},
								fontColor: props.theme.palette.type === 'dark' ? ['rgba(255, 255, 255, 1)'] : ["#000"],
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
						},
						ticks: {
							fontColor: props.theme.palette.type === 'dark' ? '#ffffff' : "#000",
						},
						gridLines: {
							color: props.theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.1)',
						},
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
		labels: {
			fontColor: this.props.theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 1)' : undefined,
		},
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
		this.chart.chartInstance.generateLegend()
		this.setState({
			chartWidth: parseInt(this.chart.chartInstance.canvas.style.width.substring(0, this.chart.chartInstance.canvas.style.width.length - 1), 10),
			chartHeight: parseInt(this.chart.chartInstance.canvas.style.height.substring(0, this.chart.chartInstance.canvas.style.height.length - 1), 10),
			mobile: window.innerWidth > 430 ? false : true

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
	componentDidUpdate = (prevProps) => {

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
		let left = tooltipModel.caretX;
		let top = tooltipModel.caretY;
		if (!this.clickEvent()) {
			left = this.state.chartWidth / 2
		}
		let total = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data.length
		let lastPoint = false
		if (total - 1 === tooltipModel.dataPoints[0].index) { 
			lastPoint = true
		}

		let str = tooltipModel.title[0]
		var rest = str.substring(0, str.lastIndexOf(' ') + 1);
		var last = str.substring(str.lastIndexOf(' ') + 1, str.length);
		if (top === this.state.tooltip.top && left === this.state.tooltip.left) {
			return this.setState({
				tooltip: {
					...this.state.tooltip,
					show: true,
					exited: false
				}
			})
		}
			
		// let weatherData = null
		let wDate = null
		try {
			let lat = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].lat
			let long = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].long
			let id = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].id
			wDate = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x
			if (lat && long) {
				if (this.state.weatherDate !== wDate || (lat !== this.state.loc.lat && long !== this.state.loc.long) || this.state.tooltip.lastPoint !== this.state.to) {
					getWeather({ lat: lat, long: long }, this.setHours(wDate), this.props.lang).then((rs) => {						
						if (this.state.id === id)
							this.setState({
								tooltip: {
									...this.state.tooltip,
									showWeather: true
								},
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
						tooltip: {
							...this.state.tooltip,
							showWeather: true
						}
					})
				}
			}
			else {
				this.setState({
					tooltip: {
						...this.state.tooltip,
						showWeather: false
					},
					weatherDate: wDate,
					weather: null,
					loc: {
						lat: 0,
						long: 0
					}
				})
			}
			this.setState({ id: id })
		}
	
		catch (err) {
			console.log(err)
		}

		this.setTooltip({
			...this.state.tooltip,
			top,
			left,
			lastPoint,
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
								callback: function (value) {
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
		}, () => this.chart ? this.chart.chartInstance.update() : {})
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
				exited: true,
				// weather: null,
				// weatherDate: null
			}
		})
	}
	hideTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				show: false,
				showWeather: false
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
			y = tooltip.top < (chartHeight / 2) ? '5%' : '-105%'
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

	getTooltipRef = (r) => {
		this.tooltip = r
	}
	render() {
		const { classes, unit } = this.props
		const { tooltip, chartWidth, chartHeight, mobile, weather } = this.state
		return (
			<Fragment>
				<div style={{ display: 'block', maxHeight: 400, position: 'relative', height: 400 }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
					<div style={{ display: 'block', height: 400, maxHeight: 400, width: '100%' }}>

						<ChartComponent
							type={'multicolorLine'}
							data={this.props.data}
							// height={this.props.theme.breakpoints.width('md') < window.innerWidth ? window.innerHeight / 4 : window.innerHeight - 200}
							// width={window.innerWidth - 20}
							ref={r => this.chart = r}
							options={this.state.lineOptions}
							legend={this.legendOptions}
							onElementsClick={this.clickEvent() ? this.elementClicked : () => {}}
						/>
					</div>
					<Tooltip
						getRef={this.getTooltipRef}
						tooltip={tooltip}
						handleCloseTooltip={this.exitedTooltip}
						mobile={mobile}
						classes={classes}
						t={this.props.t}
						chartHeight={chartHeight}
						chartWidth={chartWidth}
						weather={weather}
						unit={unit}
					/>
				</div>
			</Fragment>
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