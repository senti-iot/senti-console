import React, { Component } from 'react'
import { withStyles, Paper, Typography, Grid } from '@material-ui/core';
import { ItemGrid } from '..';
import TextF from '../CustomInput/TextF';

class EditDetails extends Component {
	render() {
		return (
			<Paper>
				<Typography>Edit {this.props.match.params.id}</Typography>
				<Grid>
					<ItemGrid xs>
						{/* <TextF
						/> */}
					</ItemGrid>
				</Grid>
			</Paper>
		)
	}
}
export default withStyles()(EditDetails)