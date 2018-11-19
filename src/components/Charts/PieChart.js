import React, { PureComponent } from 'react'
import { Pie } from 'react-chartjs-2';
import { Typography, withStyles, Paper, Grow } from '@material-ui/core';
import { ItemG, Caption } from 'components';
import { graphStyles } from './graphStyles';
import { getWeather } from 'variables/dataDevices';
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
		let wDate = null
		
		try {
			let lat = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].lat
			let long = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].long
			wDate = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x
			if (this.state.weatherDate !== wDate || (lat !== this.state.loc.lat && long !== this.state.loc.long)) {
				this.setState({ weather: null })
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
		}
		catch (err) {

		}
		const left = tooltipModel.caretX;
		const top = tooltipModel.caretY;
		let str = tooltipModel.body[0].lines[0]
		var date = str.substring(0, str.lastIndexOf(":"));
		date = date.charAt(0).toUpperCase() + date.slice(1)
		this.setTooltip({
			top,
			left,
			title: tooltipModel.body[0].lines[1],
			date: date,
			count: Math.round(parseInt(tooltipModel.body[0].lines[2], 10)),
			color: tooltipModel.labelColors[0].backgroundColor
		})
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
		;

		// let DayStr = tooltip.title[1] ? tooltip.title[1].charAt(0).toUpperCase() + tooltip.title[1].slice(1) : ""
		// let DateStr = tooltip.title[0] ? tooltip.title[0] : ""
		return (
			<div style={{ maxHeight: 400, position: 'relative' }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
				<Pie
					data={this.props.data}
					height={400}
					ref={r => this.chart = r}
					options={this.state.lineOptions}
					legend={this.legendOptions}
					onElementsClick={this.elementClicked}

				/>
				<div ref={r => this.tooltip = r} style={{
					zIndex: tooltip.show ? 1200 : tooltip.exited ? -1 : 1200,
					position: 'absolute',
					top: Math.round(this.state.tooltip.top),
					left: Math.round(this.state.tooltip.left),
					transform: (tooltip.left) > (chartWidth / 2) ? 'translate(-105%, -50%)' : 'translate(5%, -50%)',
					minWidth: 300
				}}>
					<Grow in={tooltip.show} onExited={this.exitedTooltip} >
						<Paper className={classes.paper}>
							<ItemG container>
								<ItemG container direction="row" justify="space-between">
									<ItemG xs container direction="column">
										<Typography variant={'h6'} classes={{ root: classes.antialias }} >{`${tooltip.title}`}</Typography>
										<Caption> {`(${tooltip.date})`}</Caption>
									</ItemG>
									{/* <ItemG xs={2}>
										{this.state.weather ? <WeatherIcon icon={this.state.weather.currently.icon} /> : <CircularProgress size={37} />}
									</ItemG> */}
								</ItemG>
								{/* <ItemG >
									<Caption>{this.props.t('devices.fields.weather')}: {this.state.weather ? this.state.weather.currently.summary : null}</Caption>
								</ItemG> */}
								<ItemG container alignItems={'center'}>
									<ItemG xs={1}>
										<div style={{ background: tooltip.color, width: 15, height: 15, marginRight: 8 }} />
									</ItemG>
									{/* <ItemG xs={8}><Typography noWrap variant={'caption'}>{tooltip.device}</Typography></ItemG> */}
									<ItemG xs={3}><Typography variant={'caption'} classes={{
										root: classes.expand
									}}>{tooltip.count}</Typography></ItemG>
								</ItemG>
							</ItemG>
						</Paper>
					</Grow>
				</div>
			</div>
		)
	}
}

export default withStyles(graphStyles, { withTheme: true })(PieChart)
