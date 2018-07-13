import React, { Component } from 'react'
import SmallCard from '../Cards/SmallCard';
import { IconButton, Menu, MenuItem, withStyles } from '@material-ui/core';
import { ItemGrid } from '..';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import { MoreVert, Edit, PictureAsPdf, Devices, Delete } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
class ProjectCard extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 actionAnchor: null
	  }
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	};
	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	};
	handleEdit = () => {

	}
	assignDevice = () => {

	}
	handleDeleteProject = () => {

	}
	// options = () => {
	// 	return [
	// 		{ label: 'Edit', func: this.handleEdit, single: true, icon: Edit },
	// 		{ label: 'Assign Device', func: this.assignDevice, single: true, icon: Devices },
	// 		{ label: 'Export to PDF', func: () => { }, icon: PictureAsPdf },
	// 		{ label: 'Delete', func: this.handleDeleteProjects, icon: Delete }
	// 	]
	// };4
	render() {
		const { p, classes } = this.props
		const { actionAnchor } = this.state
		return (
			<ItemGrid noPadding extraClass={classes.smallCardGrid} xs={3}>
				<SmallCard
					key={p.id}
					title={p.title}
					topAction={
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
									// maxHeight: 200,
										minWidth: 200
									}
								}}>
								<MenuItem onClick={() => this.props.history.push(`/project/${p.id}/edit`)}>
									<Edit className={classes.leftIcon} />Edit details
								</MenuItem>
								<MenuItem onClick={() => alert('Not Implemented')}>
									<Devices className={classes.leftIcon} /> Assign Devices
								</MenuItem>
								<MenuItem onClick={() => alert('Not Implemented')}>
									<PictureAsPdf className={classes.leftIcon} /> Export to PDF
								</MenuItem>
								<MenuItem onClick={() => alert('Not Implemented')}>
									<Delete className={classes.leftIcon} /> Delete Project
								</MenuItem>
							))}
							</Menu>
						</ItemGrid>
					}
					content={p.description} />
			</ItemGrid>

		)
	}
}

export default withRouter(withStyles(regularCardStyle)(ProjectCard))
