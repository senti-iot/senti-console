import React, { useState, Fragment } from 'react'
import { Popover, MenuItem, withStyles, ClickAwayListener, Paper, MenuList, FormControl, OutlinedInput } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import { ArrowDropDown } from 'variables/icons'

const DInput = props => {
	const [actionAnchor, setActionAnchor] = useState(null)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		actionAnchor: null
	// 	}
	// }
	const handleMenuItem = (e) => {
		props.onChange(e.target.value)
		handleCloseActionsDetails()

	}
	const handleCloseActionsDetails = event => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null });
	}
	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
		// this.setState({ actionAnchor: event.currentTarget });
	}

	const { classes, value, menuItems } = props

	return (
		<Fragment>
			<FormControl style={{ maxWidth: props.fullWidth ? undefined : 230 }}>

				<OutlinedInput
					labelWidth={0}
					aria-owns={actionAnchor ? 'menu-list-grow' : null}
					value={value} onClick={handleOpenActionsDetails}
					className={classes.formControl}
					onChange={handleMenuItem}
					endAdornment={<ArrowDropDown className={classes.iconColor} />}
				/>
			</FormControl>

			<Popover
				open={actionAnchor ? true : false}
				anchorEl={actionAnchor}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				disablePortal>
				<Paper>
					<ClickAwayListener onClickAway={handleCloseActionsDetails}>
						<MenuList>
							{menuItems.map((m, i) => {
								return <MenuItem onClick={handleMenuItem} key={i} value={m}>
									{m}
								</MenuItem>
							})}
						</MenuList>
					</ClickAwayListener>
				</Paper>

			</Popover>
		</Fragment>
	)
}

export default withStyles(settingsStyles)(DInput)

