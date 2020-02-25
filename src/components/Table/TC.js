import React from 'react'
import { TableCell, Typography, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const styles = makeStyles(theme => ({
	tablecellPadding: {
		padding: 9
	},
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
}))


const TC = (props) => {
	const classes = styles()
	const { checkbox, noCheckbox, label, content, className, center, FirstC, ...rest } = props
	let tcClasses = classNames({
		[className]: className,
		[classes.tableCellCheckbox]: checkbox,
		[classes.tableCell]: true,
		[classes.tablecellPadding]: noCheckbox
	})
	return (
		<TableCell classes={{ root: tcClasses }}
			{...rest}
		>
			{(label !== null || label !== undefined) ? <Typography variant={'body1'} classes={{ root: classes.paragraphCell + ' ' + (center ? classes.center : '') }}>
				{label}
			</Typography> : null}
			{content ? content : null}
		</TableCell>
	)
}
export default TC