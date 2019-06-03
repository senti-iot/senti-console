import React, { Component } from 'react'
import G from 'svg-gauge'
import { primaryColor } from 'assets/jss/material-dashboard-react';
import { withStyles } from '@material-ui/styles';
import ItemG from 'components/Grid/ItemG';
import { T } from 'components';

const styles = (theme) => ({
	gaugeContainer: {
		width: 300,
		height: 175,
		display: "block",
		float: "left",
		padding: 10,
		/* backgroundColor: "#222", */
		margin: 7,
		borderRadius: 3,
		position: "relative"
	},
	dial: {
		stroke: "#ccc",
		strokeWidth: 10,
	},
	value: {
		stroke: primaryColor,
		strokeDasharray: "none",
		strokeWidth: 13,
	},
	valueText: {
		// fill: "#ccc",
		fill: '#000',
		fontSize: "1em",
		bottom: '10%',
	}

})


class Gauge extends Component {
	defaultOptions = {
		animDuration: 1,
		showValue: true,
		max: 100,
		dialStartAngle: 180,
		dialEndAngle: 0,
		dialClass: this.props.classes.dial,
		valueDialClass: this.props.classes.value,
		valueClass: this.props.classes.valueText,
		// Put any other defaults you want. e.g. dialStartAngle, dialEndAngle, radius, etc.
	};
	componentDidMount() {
		this.renderGauge(this.props)
	}
	componentWillUpdate() {
		this.renderGauge(this.props)
	}
	renderGauge(props) {
		const gaugeOptions = Object.assign({}, this.defaultOptions, props);
		if (!this.gauge) {
			this.gauge = G(this.gaugeEl, gaugeOptions);
		}
		this.gauge.setValueAnimated(props.value, gaugeOptions.animDuration);
	}
	render() {
		return (
			<ItemG container justify={'center'} alignItems={'center'}>
				<ItemG container justify={'center'} alignItems={'center'}>
					<div className={this.props.classes.gaugeContainer} ref={el => this.gaugeEl = el}/>
				</ItemG>
				<ItemG container justify={'center'} alignItems={'center'}>
					<T>Date Range</T>
				</ItemG>
			</ItemG>
		)
	}
}

export default withStyles(styles)(Gauge)
