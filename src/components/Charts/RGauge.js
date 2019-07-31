import React from 'react'
import { withStyles } from '@material-ui/styles';
import ItemG from 'components/Grid/ItemG';
import { T } from 'components';
import { graphStyles } from './graphStyles';
import ReactGauge from './ReactGauge'

function RGauge(props) {
	return (
		<ItemG container justify={'center'} alignItems={'center'} style={{ width: '100%', height: '100%' }}>
 				<ItemG container justify={'center'} alignItems={'center'}>
 					<ReactGauge value={props.value} chartId={props.chartId}/>
 				</ItemG>
			<ItemG container justify={'center'} alignItems={'center'}>
 					<T variant={'h6'}/* style={{ fontSize: 24, fontWeight: 500, fontFace: 'Roboto' }} */>{props.title}</T>
			</ItemG>
		</ItemG>
	)
}

export default withStyles(graphStyles, { withTheme: true })(RGauge)
