import React from 'react'
import { FormControl, withStyles, Select, Input, MenuItem, InputLabel } from '@material-ui/core';
const styles = theme => ({
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 208
	},
});

const DSelect = (props) => {
	const { classes, value, func, menuItems, label } = props
	return <FormControl className={classes.formControl}>
		{label ? <InputLabel FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select-multiple-chip">
			{label}
		</InputLabel> : null}
		<Select
			value={value}
			onChange={func}
			input={<Input classes={{ root: classes.label }} />}
		>
			{menuItems.map((m, i) => {
				return <MenuItem key={i} value={m.value}>
					{m.label}
				</MenuItem>
			})}
				})}
		</Select>
	</FormControl>
}

export default withStyles(styles)(DSelect)