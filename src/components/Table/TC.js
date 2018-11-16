import React from 'react'
import { TableCell, Typography, withStyles } from "@material-ui/core"

import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';

const styles = theme => ({
	tableCell: {
		padding: 0,
		"&:last-child": {
			paddingRight: 8
		}
	},
	tableCellCheckbox: {
		width: 35,
	}
})


const TC = (props) => {
	const { checkbox, classes, label, content } = props
	return (
		<TableCell classes={{
			root: checkbox ? classes.tableCellCheckbox + " " + classes.tableCell : classes.tableCell
		}}
		
		>
			{label ? <Typography variant={"body1"} classes={{ root: classes.paragraphCell }}>
				{label}
			</Typography> : null}
			{content ? content : null}
		</TableCell>
	)
}
export default withStyles(styles)(TC)