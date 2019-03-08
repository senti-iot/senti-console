import React from 'react'
import { TableCell, Typography, withStyles } from '@material-ui/core'

const styles = theme => ({
	tableCell: {
		// paddingRight: "8px",
		// padding: 0,
		[theme.breakpoints.down('sm')]: {
			paddingRight: 4,
			padding: 0,
		},
		'&:last-child': {
			paddingRight: 8
		}
	},
	tableCellCheckbox: {
		width: 35,
	},
	center: {
		textAlign: 'center'
	}
})


const TC = (props) => {
	const { checkbox, classes, label, content, className, center } = props
	return (
		<TableCell classes={{
			root: className + ' ' + (checkbox ? classes.tableCellCheckbox + ' ' + classes.tableCell : classes.tableCell) 
		}}
		>
			{label ? <Typography variant={'body1'} classes={{ root: classes.paragraphCell + ' ' + (center ? classes.center : '') }}>
				{label}
			</Typography> : null}
			{content ? content : null}
		</TableCell>
	)
}
export default withStyles(styles)(TC)