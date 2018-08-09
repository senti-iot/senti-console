import React from 'react'
import { FormControl, withStyles, Select, Input, MenuItem } from '@material-ui/core';
const styles = theme => ({
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 208,
		flexGrow: 1,
		maxWidth: 208
	},
});

const DSelect = (props) => {
	const { classes, value, func, menuItems } = props
	console.log(props)
	return <FormControl className={classes.formControl}>
		{/* <InputLabel htmlFor="streetType-helper" classes={{ root: classes.label }}>{t("devices.fields.locType")}</InputLabel> */}
		<Select
			value={value}
			onChange={func}
			input={<Input name="streetType" id="streetType-helper" classes={{ root: classes.label }} />}
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