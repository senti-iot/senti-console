import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles';
import ItemG from 'components/Grid/ItemG';
import { T } from 'components';
import Gauge from 'react-svg-gauge';
import { primaryColor } from 'assets/jss/material-dashboard-react';
import { colors } from '@material-ui/core';
import { graphStyles } from './graphStyles';

class RGauge extends Component {
	render() {
		const { title, color, theme  } = this.props

		return (
			<ItemG container justify={'center'} alignItems={'center'} style={{ width: '100%', height: '100%' }}>
				<ItemG container justify={'center'} alignItems={'center'}>
					<Gauge 
						color={color ? colors[color][500] : primaryColor}
						value={this.props.value} 
						width={300} height={175} 
						valueLabelStyle={{ fontSize: 40, fontWeight: 500, fontFace: 'Roboto', fill: theme.palette.type === 'dark' ? '#ffffff' : '#000000' }} 
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

// export default RGauge
export default  withStyles(graphStyles, { withTheme: true })(RGauge)
