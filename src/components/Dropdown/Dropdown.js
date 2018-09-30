import React, { Component } from 'react'
import { IconButton, Menu } from '@material-ui/core';
import { ItemGrid } from '../index';
import { MoreVert } from '@material-ui/icons';

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
					{menuItems.map(n => n)}
					))}
				</Menu>
			</ItemGrid>
		)
	}
}

export default Dropdown
