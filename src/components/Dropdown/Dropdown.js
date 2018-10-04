import React, { Component } from 'react'
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { ItemGrid } from '../index';
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
		const { menuItems } = this.props
		return (
			<ItemGrid noMargin noPadding>
				<IconButton
					aria-label="More"
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup="true"
					onClick={this.handleOpenActionsDetails}>
					<MoreVert />
				</IconButton>
				<Menu
					id="long-menu"
					anchorEl={actionAnchor}
					open={Boolean(actionAnchor)}
					onClose={this.handleCloseActionsDetails}
					PaperProps={{
						style: {
							// maxHeight: 208,
							minWidth: 200
						}
					}}>
					{menuItems.map((m, i) => {
						if (m.dontShow)
							return null
						return <MenuItem key={i} onClick={() => { m.func(); this.handleCloseActionsDetails()}}>
							{m.icon} {m.label}
						</MenuItem>
					})}
					))}
				</Menu>
			</ItemGrid>
		)
	}
}

export default Dropdown
