import React, { Component } from 'react'
import G from 'svg-gauge'
// import { primaryColor } from 'assets/jss/material-dashboard-react';
// import { withStyles } from '@material-ui/styles';
import ItemG from 'components/Grid/ItemG';
import { T } from 'components';
import moment from 'moment'



class Gauge extends Component {
	defaultOptions = {
		animDuration: 1,
		showValue: true,
		max: Math.round(this.props.value * 100 / 60) ? Math.round(this.props.value) * 10 :  1,
		dialStartAngle: 180,
		dialEndAngle: 0,
		label: (value) => {
			return value.toFixed(3);
		}
	};
	componentDidMount() {
		const gaugeOptions = Object.assign({}, this.defaultOptions, this.props);
		if (!this.gauge) {
			this.gauge = G(this.gaugeEl, gaugeOptions);
		}
		this.gauge.setValueAnimated(0, gaugeOptions.animDuration);
		this.gauge.setValueAnimated(this.props.value);
	}
	componentWillUpdate() {
		this.componentDidMount()
	}
	renderGauge(props) {
	}
	render() {
		const { period, title } = this.props
		return (
			<ItemG container justify={'center'} alignItems={'center'}>
				<ItemG container justify={'center'} alignItems={'center'}>
					<div className={'gauge-container'} ref={el => this.gaugeEl = el}/>
				</ItemG>
				<ItemG container justify={'center'} alignItems={'center'}>
					<T>{`${moment(period.from).format('LLL')} - ${moment(period.to).format('LLL')}`}</T>
				</ItemG>
				<ItemG container justify={'center'} alignItems={'center'}>
					<T>{title}</T>
				</ItemG>
			</ItemG>
		)
	}
}

export default Gauge
