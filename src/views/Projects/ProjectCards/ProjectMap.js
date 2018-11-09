import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import { Maps } from 'components/Map/Maps';

export default class ProjectMap extends Component {
	render() {
		const { devices, t } = this.props
		return (
			<Grid container justify={'center'}>
				<Maps t={t} isMarkerShown markers={devices} zoom={10} />
			</Grid>
		
		)
		
	}
}
