import React from 'react'
import { Typography, withStyles } from '@material-ui/core';
import cx from 'classnames'
const styles = theme =>  ({
	bold: {
		fontWeight: 600
	},
	reversed: {
		color: "#fff"
	}
})
const T = (props) => {
	let classNames = cx({
		[props.classes.reversed]: props.reversed,
		[props.classes.bold]: props.b
	})
	return (
		<Typography noWrap={props.noWrap} paragraph={props.paragraph ? props.paragraph : undefined} style={props.style} className={props.className + ' ' + classNames} variant={props.variant ? props.variant : 'body2'}>
			{props.children}
		</Typography>
	)
}
export default withStyles(styles)(T)