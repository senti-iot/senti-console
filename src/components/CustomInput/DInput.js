import React, { Component, Fragment } from 'react'
import { Popover, Input, MenuItem, withStyles, ClickAwayListener, Paper, MenuList, FormControl } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import { ArrowDropDown } from '@material-ui/icons'
class DInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchor: null
		}
	}
	handleMenuItem = (e) => {
		this.props.onChange(e.target.value)
		this.handleCloseActionsDetails()
		
	}
	handleCloseActionsDetails = event => {
		this.setState({ actionAnchor: null });
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}
	render() {
		const { actionAnchor } = this.state
		const { classes, value, menuItems } = this.props

		return (
			<Fragment>
				<FormControl>

					<Input
						aria-owns={actionAnchor ? 'menu-list-grow' : null}
						value={value} onClick={this.handleOpenActionsDetails}
						className={classes.formControl}
						onChange={this.handleMenuItem}
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
						<ClickAwayListener onClickAway={this.handleCloseActionsDetails}>
							<MenuList>
								{menuItems.map((m, i) => {
									return <MenuItem onClick={this.handleMenuItem} key={i} value={m}>
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
}

export default withStyles(settingsStyles)(DInput)

