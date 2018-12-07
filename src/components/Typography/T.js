import React from 'react'
import { Typography } from '@material-ui/core';

const T = (props) => {
	return (
		<Typography variant={'body1'}>
			{props.children}
		</Typography>
	)
}
export default T