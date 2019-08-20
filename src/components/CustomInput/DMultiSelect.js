import React from 'react'
import { FormControl, withStyles, Select, Input, MenuItem, InputLabel, Checkbox } from '@material-ui/core';
import { ItemG } from 'components';

// Replace withStyles with withTheme, remove styles

const styles = theme => ({
	label: {
		color: theme.palette.type === 'dark' ? "#fff" : undefined
	},
	formControl: {
		// marginTop: 16,
		// marginBottom: 8,
		minWidth: 230
	},
});
const renderSelected = (selected, menuItems) => {
	let str = ''
	selected.forEach(s => {
		let m = menuItems[menuItems.findIndex(f => f.value === s)]
		if (str === '')
			str = m.label
		else {
			str = str + ', ' + m.label
		}
	})
	return str
}
const DMultiSelect = (props) => {
	const { classes, value, onKeyPress, onChange, menuItems, label, theme, fullWidth, leftIcon, checkbox } = props
	let mobile = window.innerWidth < theme.breakpoints.values.md ? true : false
	return <FormControl className={classes.formControl} fullWidth={mobile || fullWidth}>
		{label ? <InputLabel classes={{ asterisk: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
			{label}
		</InputLabel> : null}
		<Select
			multiple
			fullWidth={mobile || fullWidth}
			value={value}
			onChange={onChange}
			input={<Input classes={{ root: classes.label }} />}
			onKeyPress={onKeyPress}
			renderValue={selected => renderSelected(selected, menuItems)}
		>
			{menuItems.map((m, i) => {
				return <MenuItem key={i} value={m.value}>
					<ItemG container justify={'space-between'} alignItems={'center'}>
				
						{checkbox ? <ItemG style={{ display: 'flex', marginRight: 8 }}>	<Checkbox checked={value.indexOf(m.value) > -1} /></ItemG> : null}
						{leftIcon ? <ItemG style={{ display: 'flex', marginRight: 8 }}>{m.icon ? m.icon : null}</ItemG> : null}
						<ItemG xs>{m.label}</ItemG>
						{!leftIcon ? <ItemG>{m.icon ? m.icon : null}</ItemG> : null}
					</ItemG>
				</MenuItem>
			})}
				})}
		</Select>
	</FormControl>
}

export default withStyles(styles, { withTheme: true })(DMultiSelect)