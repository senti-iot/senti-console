import React from 'react'
import { FormControl, withStyles, Select, Input, MenuItem, InputLabel } from '@material-ui/core';
import { ItemG } from 'components';

// Replace withStyles with withTheme, remove styles

const styles = theme => ({
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 230
	},
});

const DSelect = (props) => {
	const { classes, value, onKeyPress, onChange, menuItems, label, theme, fullWidth, leftIcon } = props
	let mobile = window.innerWidth < theme.breakpoints.values.md ? true : false
	return <FormControl className={classes.formControl} fullWidth={mobile || fullWidth}>
		{label ? <InputLabel FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
			{label}
		</InputLabel> : null}
		<Select
			fullWidth={mobile || fullWidth}
			value={value}
			onChange={onChange}
			input={<Input classes={{ root: classes.label }} />}
			onKeyPress={onKeyPress}
		>
			{menuItems.map((m, i) => {
				return <MenuItem key={i} value={m.value}>
					<ItemG container justify={'space-between'} alignItems={'center'}>
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

export default withStyles(styles, { withTheme: true })(DSelect)