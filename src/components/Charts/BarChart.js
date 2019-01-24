import React, { PureComponent, Fragment } from 'react'
import { Bar } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core';
import { graphStyles } from './graphStyles';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import { compose } from 'recompose';
import { connect } from 'react-redux'
import withLocalization from 'components/Localization/T';
import Tooltip from './Tooltip';

class BarChart extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			tooltip: {
				show: false,
				title: '',
				top: 0,
				left: 0,
				data: [],
			},
			loc: {
				lat: 0,
				long: 0
			},
			lineOptions: {
				categoryPercentage: 0.5,
				barPercentage: 0.5,
				barThickness: 'flex',
				gridLines: { offsetGridLines: false },	
				animation: {
					duration: 500
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
								offsetGridLines: true,
								color: props.theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.1)',
							},
							offset: true,
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
							}
						},
						{
							display: props.unit.chart === 'day' ? true : false,
							offset: true,
							ticks: {

								callback: function (value, index, values) {
									return value.charAt(0).toUpperCase() + value.slice(1);
								},
								fontColor: props.theme.palette.type === 'dark' ? ['rgba(255, 255, 255, 1)'] : ["#000"],
								source: 'labels',
								maxRotation: 0
							},
							gridLines: {
								offsetGridLines: true,
								drawBorder: false,
								drawTicks: false,
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

				}
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
		this.setState({
			chartWidth: parseInt(this.chart.chartInstance.canvas.style.width.substring(0, this.chart.chartInstance.canvas.style.width.length - 1), 10),
			chartHeight: parseInt(this.chart.chartInstance.canvas.style.height.substring(0, this.chart.chartInstance.canvas.style.height.length - 1), 10),
			mobile: window.innerWidth > 430 ? false : true
		})
	}
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
		if (this.clickEvent())
			this.showTooltip()
	}
	setXAxis = () => {
		this.setState({
			lineOptions: {
				...this.state.lineOptions,
				scales: {
					...this.state.lineOptions.scales,
					xAxes: [
						{
							offset: true,
							ticks: {
								source: 'labels',
								maxRotation: 0
							},
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
							gridLines: {
								offsetGridLines: true
							}
						},
						{
							display: this.props.unit.chart === 'day' ? true : false,
							offset: true,
							gridLines: {
								offsetGridLines: true,
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
				console.log(e)
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
		const { classes, unit } = this.props
		const { tooltip, chartWidth, chartHeight, mobile, weather } = this.state

		return (
			<Fragment>
				<div style={{ display: 'block', maxHeight: 400, position: 'relative', height: 400 }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
					<div style={{ display: 'block', height: 400, maxHeight: 400, width: '100%' }}>					
					
						<Bar
							height={400}
							data={this.props.data}
							ref={r => this.chart = r}
							options={this.state.lineOptions}
							legend={this.legendOptions}
							onElementsClick={this.elementClicked}
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

let BarChartCompose = compose(connect(mapStateToProps, mapDispatchToProps), withStyles(graphStyles, { withTheme: true }), withLocalization())(BarChart)

export default BarChartCompose
