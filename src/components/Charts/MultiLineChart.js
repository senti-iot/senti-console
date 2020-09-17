import React, { PureComponent, Fragment } from 'react'
import ChartComponent, { Chart } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core';
import { graphStyles } from './graphStyles';
// import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import { compose } from 'recompose';
import { connect } from 'react-redux'
// import Tooltip from './Tooltip';
import { getWeather } from 'redux/weather';
import MultiTooltip from './MultiTooltip';

/**
 *  @Pavel do not convert this file
 *  */


Chart.defaults.global.elements.line.tension = 0;
Chart.defaults.multicolorLine = Chart.defaults.line;
Chart.defaults.global.elements.point.radius = 1;
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
			loc: {
				lat: 0,
				long: 0
			},
			lineOptions: {
				lineTension: 0,
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
						},
					],
					yAxes: [{
						scaleLabel: {
							display: props.graphUnit ? true : false,
							labelString: props.graphUnit ? props.graphUnit : "",
							fontColor: props.theme.palette.type === 'dark' ? '#ffffff' : "#000",
							rotate: false
						},
						type: props.chartYAxis,
						ticks: {
							// beginAtZero: true,
							fontColor: props.theme.palette.type === 'dark' ? '#ffffff' : "#000",
						},
						gridLines: {
							color: props.theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.1)',
						},
					}]
				},
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
	updateHover = () => {
		const { hoverID } = this.props
		let dId = this.chart.chartInstance.data.datasets.findIndex(d => d.id === hoverID)
		// let dId = 0
		if (dId > -1) {
			let dataset = this.chart.chartInstance.data.datasets[dId]
			dataset.borderWidth = 7
		}
		else {
			this.chart.chartInstance.data.datasets.forEach(d => {
				d.borderWidth = 3
			})
		}
		this.setState({ updateHover: false })
		this.chart.chartInstance.update()
	}
	componentDidUpdate = (prevProps) => {
		if (prevProps.hoverID !== this.props.hoverID) {
			this.setState({ updateHover: true })
		}
		if (this.state.updateHover) {
			this.updateHover()
		}
		if (prevProps.unit !== this.props.unit || prevProps.hoverID !== this.props.hoverID || prevProps.chartYAxis !== this.props.chartYAxis) {
			this.setXAxis()
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
			return !this.clickEvent() ? null : this.hideTooltip()
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
					showWeather: this.state.weather ? true : false,
				}
			})
		}
		let wDate = null
		try {
			let lat = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].lat
			let long = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].long
			let id = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].id
			wDate = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x
			if (lat && long) {
				if (this.state.weatherDate !== wDate || (lat !== this.state.loc.lat && long !== this.state.loc.long) || this.state.tooltip.lastPoint !== lastPoint) {
					this.props.getWeather({ lat: lat, long: long }, this.setHours(wDate), this.props.lang).then((rs) => {
						if (this.state.id === id)
							this.setState({
								tooltip: {
									...this.state.tooltip,
									showWeather: true
								},
								weatherDate: wDate,
								weather: this.props.weather,
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
			console.error(err)
		}

		this.setTooltip({
			...this.state.tooltip,
			xAlign: tooltipModel.xAlign,
			yAlign: tooltipModel.yAlign,
			top,
			left,
			lastPoint,
			title: [rest, last],
			data: tooltipModel.dataPoints.map((d, i) => ({
				device: tooltipModel.body[i].lines[0].split(':')[0], count: parseFloat(d.yLabel).toFixed(3), color: tooltipModel.labelColors[i].backgroundColor
			}))
		})
		if (this.clickEvent())
			this.showTooltip()
	}
	setXAxis = () => {
		this.setState({
			lineOptions: {
				...this.state.lineOptions,
				lineTension: 0,
				scales: {
					...this.state.lineOptions.scales,
					xAxes: [
						{
							id: 'xAxis',
							type: 'time',
							time: {
								displayFormats: {
									hour: 'LT',
									day: 'DD MMM',
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
						}],
					yAxes: [{
						scaleLabel: {
							display: false,
							labelString: 'value'
						},
						type: this.props.chartYAxis,
						ticks: {
							fontColor: this.props.theme.palette.type === 'dark' ? '#ffffff' : "#000",
						},
						gridLines: {
							color: this.props.theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.1)',
						},
					}]
				}
			}
		}, () => this.chart ? this.chart.chartInstance ? this.chart.chartInstance.update() : {} : {})
	}
	showTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				show: true,
				exited: false
			}
		})
	}
	setTooltip = (tooltip) => {
		this.setState({
			tooltip: {
				...tooltip,
			}
		})
	}
	exitedTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				show: false,
				showWeather: false,
				exited: true
			}
		})
	}
	hideTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				show: false,
			}
		})

	}
	elementClicked = async (elements) => {
		if (!this.clickEvent()) {
			if (elements.length > 0)
				this.showTooltip()
		}
		else {
			try {
				await this.props.onElementsClick(elements)
			}
			catch (e) {
				console.error(e)
			}
			this.hideTooltip()
		}
	}
	onMouseLeave = () => {
		const { single } = this.props
		return !single ? () => this.props.setHoverID(0) : undefined
	}
	getTooltipRef = (r) => {
		this.tooltip = r
	}
	render() {
		const { classes, unit, data, graphUnit } = this.props
		const { tooltip, chartWidth, chartHeight, mobile, weather } = this.state
		return (
			<Fragment>
				<div style={{ /* display: 'block', */ height: '100%', width: '100%', /* maxHeight: 300, */ position: 'relative' }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
					<div style={{ /* display: 'block', */ height: '100%', /*  maxHeight: 300, */ width: '100%', position: 'relative' }}>

						<ChartComponent
							type={'multicolorLine'}
							data={data}
							ref={r => this.chart = r}
							options={this.state.lineOptions}
							legend={this.legendOptions}
							onElementsClick={this.elementClicked}
						/>
					</div>
					<MultiTooltip
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
						graphUnit={graphUnit}
					/>
				</div>
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	lang: state.settings.language,
	weather: state.weather.weather,
	loadingWeather: state.weather.loading
	// chartYAxis: state.appState.chartYAxis
})

const mapDispatchToProps = dispatch => ({
	getWeather: async (device, date, lang) => dispatch(await getWeather(device, date, lang))
})

let LineChartCompose = compose(connect(mapStateToProps, mapDispatchToProps), withStyles(graphStyles, { withTheme: true }))(LineChart)

export default LineChartCompose