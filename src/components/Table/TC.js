import React from 'react'
import { TableCell, Typography, withStyles } from "@material-ui/core"

import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';



const TC = (props) => {
	const { classes, label, content } = props
	return (
		<TableCell className={props.FirstC ? classes.tableCell + " " + classes.tableCellNoWidth : classes.tableCell}>
			{label ? <Typography paragraph classes={{ root: classes.paragraphCell }}>
				{label}
			</Typography> : null}
			{content ? content : null}
		</TableCell>
	)
}
export default withStyles(devicetableStyles)(TC)