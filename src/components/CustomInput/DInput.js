import React, { useState, Fragment } from 'react'
import { Popover, MenuItem, ClickAwayListener, Paper, MenuList, FormControl, OutlinedInput } from '@material-ui/core';
import { ArrowDropDown } from 'variables/icons'



const DInput = props => {
	//Hooks

	//Redux

	//State
	const [actionAnchor, setActionAnchor] = useState(null)

	//Const

	//useCallbacks

	//useEffects

	//Handlers

	const handleMenuItem = (e) => {
		props.onChange(e.target.value)
		handleCloseActionsDetails()

	}
	const handleCloseActionsDetails = event => {
		setActionAnchor(null)
	}
	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
	}

	const { value, menuItems } = props

	return (
		<Fragment>
			<FormControl style={{ maxWidth: props.fullWidth ? undefined : 230 }}>

				<OutlinedInput
					labelWidth={0}
					aria-owns={actionAnchor ? 'menu-list-grow' : null}
					value={value} onClick={handleOpenActionsDetails}
					onChange={handleMenuItem}
					endAdornment={<ArrowDropDown />}
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

export default DInput

