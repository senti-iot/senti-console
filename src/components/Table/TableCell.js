import React from 'react'
import { TableCell, Typography, withStyles } from "@material-ui/core"

import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';

export default withStyles(devicetableStyles)((props) => {
	const { classes, label } = props
	return (
		<TableCell className={props.FirstC ? classes.tableCell + " " + classes.tableCellNoWidth : classes.tableCell}>
			<Typography paragraph classes={{ root: classes.paragraphCell }}>
				{label}
			</Typography>
		</TableCell>
	)
})
