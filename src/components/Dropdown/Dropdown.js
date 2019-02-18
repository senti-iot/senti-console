import React, { Component } from 'react'
import { IconButton, Menu, MenuItem, Button } from '@material-ui/core';
import { ItemG } from 'components';
import { MoreVert } from 'variables/icons';

class Dropdown extends Component {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchor: null
		}
	}

	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	render() {
		const { actionAnchor } = this.state
		const { menuItems, icon, button, divider } = this.props
		return (
			<ItemG>
				{button && <Button
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					style={{ color: 'rgba(0, 0, 0, 0.54)' }}
					onClick={this.handleOpenActionsDetails}>
					{icon ? icon : <MoreVert />}
				</Button>}
				{!button && <IconButton
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					onClick={this.handleOpenActionsDetails}>
					{icon ? icon : <MoreVert />}
				</IconButton>}
				<Menu
					id='long-menu'
					anchorEl={actionAnchor}
					open={Boolean(actionAnchor)}
					onClose={this.handleCloseActionsDetails}
					PaperProps={{ style: { minWidth: 200 } }}>
					{menuItems.map((m, i) => {
						if (m.dontShow)
							return null
						return <MenuItem divider={divider ? i === menuItems.length - 1 ? false : true : false} selected={m.selected} key={i} onClick={() => { m.func(); this.handleCloseActionsDetails() }}>
							{m.icon} {m.label}
						</MenuItem>
					})}
					))}
				</Menu>
			</ItemG>
		)
	}
}

export default Dropdown
