import React from 'react'
import { Typography, withStyles } from '@material-ui/core';
import cx from 'classnames'
const styles = theme =>  ({
	reversed: {
		color: "#fff"
	}
})
const T = (props) => {
	let classNames = cx({
		[props.classes.reversed]: props.reversed
	})
	return (
		<Typography className={classNames} variant={'body1'}>
			{props.children}
		</Typography>
	)
}
export default withStyles(styles)(T)