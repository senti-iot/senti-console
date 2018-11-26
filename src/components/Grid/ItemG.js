import { Grid } from '@material-ui/core'
import React from 'react'

function ItemG({ ...props }) {
	const { classes, children, ...rest } = props;
	return (
		<Grid item {...rest}>
			{children}
		</Grid>
	);
}

export default ItemG
