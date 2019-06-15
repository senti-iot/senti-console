import React, { Component } from 'react'
// import { primaryColor } from 'assets/jss/material-dashboard-react';
// import { withStyles } from '@material-ui/styles';
import ItemG from 'components/Grid/ItemG';
import { T } from 'components';
// import moment from 'moment'
import RGauge from 'react-svg-gauge';
import { primaryColor } from 'assets/jss/material-dashboard-react';


class Gauge extends Component {

	componentDidMount() {
		// const gaugeOptions = Object.assign({}, this.defaultOptions, this.props);
		// if (!this.gauge) {
		// 	this.gauge = G(this.gaugeEl, gaugeOptions);
		// }
		// this.gauge.setValueAnimated(0, gaugeOptions.animDuration);
		// this.gauge.setValueAnimated(this.props.value);
	}
	componentWillUpdate() {
		this.componentDidMount()
	}
	renderGauge(props) {
	}
	render() {
		const {  title } = this.props
		return (
			<ItemG container justify={'center'} alignItems={'center'} style={{ width: '100%', height: '100%' }}>
				<ItemG container justify={'center'} alignItems={'center'}>
					<RGauge 
						color={primaryColor}
						value={this.props.value} 
						width={300} height={175} 
						valueLabelStyle={{ fontSize: 40, fontWeight: 500, fontFace: 'Roboto' }} 
						label={''}
						max={this.props.value > 1 ? 100 : 1}
						minMaxLabelStyle={{ display: 'none' }}
					/>
				</ItemG>
				<ItemG container justify={'center'} alignItems={'center'}>
					<T style={{ fontSize: 24, fontWeight: 500, fontFace: 'Roboto' }}>{title}</T>
				</ItemG>
			</ItemG>
		)
	}
}

export default Gauge
