import React from 'react'
import { withStyles } from '@material-ui/styles';
import ItemG from 'components/Grid/ItemG';
import { T } from 'components';
import { graphStyles } from './graphStyles';
import ReactGauge from './ReactGauge'
import { colors } from '@material-ui/core';

function RGauge(props) {
	return (
		<ItemG container justify={'center'} alignItems={'center'} style={{ width: '100%', height: '100%' }}>
			<ItemG container justify={'center'} alignItems={'center'}>
				<ReactGauge
					value={props.value}
					chartId={props.chartId}
					color={colors[props.color][500]}
				/>
			</ItemG>
			{/* <ItemG container justify={'center'} alignItems={'center'}>
				<T variant={'h6'}>{props.title}</T>
			</ItemG> */}
		</ItemG>
	)
}

export default withStyles(graphStyles, { withTheme: true })(RGauge)
