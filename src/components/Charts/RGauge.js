import React from 'react'
import ItemG from 'components/Grid/ItemG';
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
		</ItemG>
	)
}

export default RGauge
