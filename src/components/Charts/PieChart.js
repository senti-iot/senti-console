import React, { PureComponent } from 'react'
import { Pie } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core';
import { graphStyles } from './graphStyles';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import PieTooltip from './PieTooltip';
import { compose } from 'recompose';
import { connect } from 'react-redux'
import SummaryTooltip from './SummaryTooltip';


class PieChart extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			loc: {
				lat: 0,
				long: 0
			},
			tooltip: {
				show: false,
				title: '',
				top: 0,
				left: 0,
				data: [],
				exited: true
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
	componentDidMount = () => {
		this.setState({
			chartWidth: this.chart.chartInstance.canvas.width
		})
	}
	clickEvent = () => {
		if ('ontouchstart' in document.documentElement === true)
			return false
		else
			return true
	}
	customTooltip = (tooltipModel) => {
		if (tooltipModel.opacity === 0) {
			return !this.clickEvent() ? null : this.hideTooltip()
		}
	
		let total = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data.length
		let lastPoint = false
		if (total - 1 === tooltipModel.dataPoints[0].index) { 
			lastPoint = true
		}
		
		let wDate = null
		try {

			let lat = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].lat
			let long = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].long
			wDate = moment(tooltipModel.body[0].lines[1]).format('YYYY-MM-DD HH:ss')
			if (this.state.weatherDate !== wDate || (lat !== this.state.loc.lat && long !== this.state.loc.long)) {
				this.setState({ weather: null })
				getWeather({ lat: lat, long: long }, this.setHours(wDate), this.props.lang).then(rs => {
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
				if (this.state.weather) { 
					this.setState({
						tooltip: {
							...this.state.tooltip,
							showWeather: true
						}
					})
				}
			}
		}
		catch (err) {
			console.log(err)
		}
		const left = tooltipModel.caretX;
		const top = tooltipModel.caretY;
		//Use tooltipModel.body[0].lines[1] for Date (moment Obj)
		//Use tooltipModel.body[0].lines[2] for count (int)\
		if (this.props.timeType === 3) {
			let from = this.props.data.from
			let to = this.props.data.to
			return this.setTooltip({
				to, 
				from,
				top,
				left,
				name: tooltipModel.body[0].lines[1],
				count: tooltipModel.body[0].lines[2],
				color: tooltipModel.labelColors[0].backgroundColor,
				lastPoint: lastPoint
			})
		}
		this.setTooltip({
			top,
			left,
			date: tooltipModel.body[0].lines[1],
			count: tooltipModel.body[0].lines[2],
			color: this.props.data.color,
			lastPoint: lastPoint,
			showWeather: this.state.weather ? true : false
		})

	}


	setTooltip = (tooltip) => {
		this.setState({
			tooltip: {
				...tooltip,
				show: !this.clickEvent() ?  false : true,
				exited: false
			}
		})
	}
	exitedTooltip = e => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				exited: true,
				show: false,
				top: 0,
				left: 0,

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
		if (!this.clickEvent())
			this.setState({
				tooltip: {
					...this.state.tooltip,
					show: true
				}
			})
		else { 
			this.hideTooltip()
		}
		if (this.props.onElementsClick) {
			await this.props.onElementsClick(elements)
		}
		// this.hideTooltip()
	}
	setHours = (date) => {
		if (this.props.unit.chart === 'day')
			return moment(date).startOf('day').add(12, 'h')
		else
			return moment(date)
	}
	onMouseLeave = () => {
		const { single } = this.props
		return !single ? () => this.props.setHoverID(0) : undefined
	}

	getTooltipRef = (r) => {
		this.tooltip = r
	}

	render() {
		const { classes, unit, height, timeType } = this.props
		const { tooltip, chartWidth, chartHeight, mobile, weather } = this.state
		return (
			<div style={{ maxHeight: height ? height : 200, position: 'relative' }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
				<Pie
					data={this.props.data}
					height={height ? height : 200}
					ref={r => this.chart = r}
					options={this.state.lineOptions}
					legend={this.legendOptions}
					onElementsClick={this.elementClicked}
					// getElementAtEvent={e => console.log(e)}
				
				/>
				{ timeType === 3 ? <SummaryTooltip
					getRef={this.getTooltipRef}
					tooltip={tooltip}
					handleCloseTooltip={this.exitedTooltip}
					mobile={mobile}
					classes={classes}
					t={this.props.t}
					chartHeight={chartHeight}
					chartWidth={chartWidth}
					unit={unit}
				/> : 

					<PieTooltip
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
				}
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	return ({
		lang: state.settings.language,
		timeType: state.dateTime.timeType
	})
}

const mapDispatchToProps = {
  
}

let PieChartCompose = compose(connect(mapStateToProps, mapDispatchToProps), withStyles(graphStyles, { withTheme: true }))(PieChart)

export default PieChartCompose
