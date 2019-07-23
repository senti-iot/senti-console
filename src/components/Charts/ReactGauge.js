import React, { Component } from 'react'
import * as d3 from 'd3'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = (theme) => ({
	gauge: {
		width: '300px',
		height: '150px',
		/* margin: 100px auto   */
	},
	label: {
		fontSize: '24px',
		// fill: '#aaa',
	},
	chartFilled2: {
		position: 'absolute',
		zIndex: '2',
		fill: 'steelblue',
	},
	
	chartFilled: {
		position: 'absolute',
		zIndex: '1',
		fill: 'teal',
		'&:hover': {
			zIndex: 3
		}
	},
	
	chartEmpty: {
		zIndex: '0',
		fill: '#dedede',
	},
	svg: {
		font: '10px "Roboto"',
	}
})
const draw = (props, opts) => {
	//#region Variables
	//options
	let valueDesc, valueLabel;
	let min, max, margin, totalPercent, width, height, className, labels, color;
	//gauge vars
	let barWidth, chart, chartInset, padRad, radius, svg, arcStartRad, arcEndRad;
	//utility
	let degToRad, percToRad, percToDeg, value2percent;
	//#endregion
	const getMax = (value) => {
		let str = value.toString().split('.')
		let max = 1
		if (str[0].length === 1) {
			if (parseInt(str[0]) === 0) {
				return max = 1
			}
		}
		if (str.length > 1) {
			for (let index = 0; index < str[0].length; index++) {
				max += '0';
			}
		}
		else {
			for (let index = 0; index < str[0].length; index++) {
				max += '0';
			}
		}
		return max
	}
	//#region Options
	let options = opts ? opts : {}
	className = options.className || props.classes.gauge || '.gauge'
	console.log(className)
	max = options.max || getMax(props.value) || 100;
	min = options.min || 0;
	margin = options.margin || {
		top: 20,
		right: 8,
		bottom: 30,
		left: 8
	};
	color = options.color || props.color || '#ffffff'
	chartInset = options.chartInset || 10;
	padRad = options.padRad || 0.025;
	totalPercent = options.totalPercent || .75;
	labels = options.labels || true;

	//#endregion
	let el = d3.select('.' + className)

	width = el['_groups'][0][0].offsetWidth;
	height = el['_groups'][0][0].offsetHeight;
	// radius = Math.min(width, height);
	radius = height - 20;
	barWidth = 40 * width / 300;

	//#region Utility methods

	value2percent = function(value) {
		return value > 0 ? (((value - min) * 100) / (max - min)) / 100 : 0
	}

	percToDeg = function (perc) {
		return perc * 360;
	};

	percToRad = function (perc) {
		return degToRad(percToDeg(perc));
	};

	degToRad = function (deg) {
		return deg * Math.PI / 180;
	};

	//#endregion
	
	// Create SVG element
	svg = el.append('svg').attr('class', `${props.classes.svg}`).attr('width', width + margin.left + margin.right).attr('height', height).attr('position', 'relative');

	// Add layer for the panel
	chart = svg.append('g').attr('transform', "translate(" + ((width) / 2) + ", " + ((height - margin.top)) + ")").attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

	//Add the Arcs
	chart.append('path').attr('class', `arc ${props.classes.chartFilled}`);
	if (props.dGauge) {
		chart.append('path').attr('class', `arc ${props.classes.chartFilled2}`)
	}
	chart.append('path').attr('class', `arc ${props.classes.chartEmpty}`);
	

	//Add the text
	if (labels) {
		valueLabel = svg.append("text")
			.attr('dominant-baseline', "middle")
			.attr("x", (width / 2))
			.attr("y", (((height - margin.top) * 95) / 100))
			.attr("text-anchor", 'middle')
			.attr('class', props.classes ? props.classes.label : "small-label")
			// .text(props.value)
			.attr('font-family', "Roboto")
			.attr('font-size', "16px")
			.attr('fill', color);
		valueDesc = svg.append("text")
			.attr("x", (width / 2))
			.attr("y", (((height - margin.top) * 95) / 100))
			.attr('dominant-baseline', "middle")
			.attr("text-anchor", 'middle')
			.attr('class', props.classes ? props.classes.label : "label")
			// .text(props.value)
			.attr('font-family', "Roboto")
			.attr('font-size', "24px");
	}


	//Generate Arc positions
	let primaryArc, arcEmpty, secondaryArc;
	primaryArc = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
	arcEmpty = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
	secondaryArc = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)

	//Generate instance
	var Chart = (function () {
		function Chart(el) {
			this.el = el
		}

		Chart.prototype.repaintGauge = function (value, prevValue) {
			var next_start = totalPercent;
			arcStartRad = percToRad(next_start);
			arcEndRad = arcStartRad + percToRad(value / 2);
			let arcEndRad2 = arcStartRad + percToRad(prevValue / 2);

			primaryArc.startAngle(arcStartRad).endAngle(arcEndRad);
			secondaryArc.startAngle(arcStartRad).endAngle(arcEndRad2);

			if (value > prevValue) {
				next_start += value / 2;
				arcStartRad = percToRad(next_start);
				arcEndRad = arcStartRad + percToRad((1 - value) / 2);
			}
			else {
				next_start += prevValue / 2;
				arcStartRad = percToRad(next_start);
				arcEndRad = arcStartRad + percToRad((1 - prevValue) / 2);
			}

			arcEmpty.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

			this.el.select('.' + props.classes.chartFilled).attr('d', primaryArc);
			this.el.select('.' + props.classes.chartEmpty).attr('d', arcEmpty);
			this.el.select('.' + props.classes.chartFilled2).attr('d', secondaryArc);
		};
		Chart.prototype.moveTo = function (value, oldValue, value2, oldValue2, txt, prev) {
			var self = this
			let perc = value2percent(value)
			let perc2 = value2percent(value2)
			let oldPerc = value2percent(oldValue)
			let oldPerc2 = value2percent(oldValue2)

			if (labels) {
				valueLabel.text(parseFloat(prev ? value2 : value) ? parseFloat(prev ? value2 : value).toFixed(3) : '---')
				valueDesc.text(txt)
			}
			this.el.transition().duration(400).select('.' + props.classes.chartFilled).tween('progress', function () {
				return function (percentOfPercent) {
					var progress = d3.interpolate(oldPerc, perc)(percentOfPercent)
					var progress2 = d3.interpolate(oldPerc2, perc2)(percentOfPercent)
					self.repaintGauge(progress, progress2);
				};
			});


		}
		return Chart
	})()

	let ch = new Chart(chart);
	return ch

}

class ReactGauge extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			 prevSee: false,
			 oldValue: props.value,
			 oldPrevValue: props.dGauge ? 0 : props.prevValue,
			 gauge: null
		}
	}
	componentDidMount() {
		window.d3 = d3
		let { oldValue, oldPrevValue }  = this.state
		let { value, label, color } = this.props
		let g = draw({ value: parseFloat(value), oldValue: parseFloat(oldValue), prevValue: 0, prevOldValue: 0, ...this.props, min: 0, max: 100 }, { className: this.props.chartId, color: color })
		if (g)
			this.setState({
				gauge: g
			}, () => {
				g.moveTo(parseFloat(value), parseFloat(oldValue), 0, oldPrevValue, label, false)
			})
	}
	componentDidUpdate(prevProps, prevState) {
		let { gauge, oldValue, oldPrevValue, prevSee }  = this.state
		let { value, label, prevValue, prevLabel } = this.props
		if (prevProps.value !== value || prevProps.prevValue !== prevValue) {
			if (gauge) {
				if (prevSee) {
					gauge.moveTo(value, oldValue, prevValue, oldPrevValue, prevLabel, true)
					this.setState({
						oldValue: value,
						oldPrevValue: prevValue
					})
				}
				else {
					gauge.moveTo(value, oldValue, 0, oldPrevValue, label, false)
					this.setState({
						oldValue: value,
						oldPrevValue: 0
					})
				}
			}
		} 
	}
	
	setPrevSee = () => {
		this.setState({
			prevSee: !this.state.prevSee
		})
	}
	render() {
		const { chartId } = this.props
		
		return (
			<div className={this.props.classes.gauge + ' ' + chartId} onClick={() => {this.setPrevSee()}} />
		)
	}
}

export default withStyles(styles)(ReactGauge)
