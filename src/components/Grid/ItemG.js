import { Grid } from '@material-ui/core'
import React from 'react'

const ItemG = React.forwardRef((props, ref) => { 
	const { children, ...rest } = props;
	return (
		<Grid item {...rest} ref={ref}>
			{children}
		</Grid>
	);
})

export default ItemG
