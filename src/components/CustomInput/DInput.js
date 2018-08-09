import React, { Component, Fragment } from 'react'
import { Popper, Input, MenuItem, withStyles, Grow, ClickAwayListener, Paper, MenuList, FormControl } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import { ArrowDropDown } from "@material-ui/icons"
class DInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchor: null
		}
	}
	handleMenuItem = (e) => {
		this.props.func(e.target.value)
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
				<Popper open={actionAnchor ? true : false} anchorEl={actionAnchor} placement={"bottom-end"} transition disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							id="menu-list-grow"
							style={{ zIndex: "1100" }}
						>
							<Paper>
								<ClickAwayListener onClickAway={this.handleCloseActionsDetails}>
									<MenuList>
										{menuItems.map((m, i) => {
											return <MenuItem onClick={this.handleMenuItem} key={i} value={m.value}>
												{m.label}
											</MenuItem>
										})}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</Fragment>
		)
	}
}

export default withStyles(settingsStyles)(DInput)

