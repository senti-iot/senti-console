import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Grid, IconButton, Menu, MenuItem, withStyles } from '@material-ui/core';
import { LibraryBooks, MoreVert, Edit } from "@material-ui/icons"
import { dateFormatter } from 'variables/functions';
import { ItemGrid, Caption, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';


class ProjectDetails extends Component {
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
	render() {
		const { actionAnchor } = this.state
		const { project, classes } = this.props
		return (
			<InfoCard
				title={'Project Details'} avatar={<LibraryBooks />}
				noExpand
				topAction={<ItemGrid noMargin noPadding>
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
								maxHeight: 200,
								minWidth: 200
							}
						}}>
						<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/edit`)}>
							<Edit className={classes.leftIcon} />Edit project
						</MenuItem>
						))}
					</Menu>
				</ItemGrid>}
				content={<Grid container>
					<ItemGrid xs={12} container noMargin noPadding>
						<ItemGrid>
							<Caption>Name:</Caption>
							<Info>{project.title}</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>Description:</Caption>
							<Info>{project.description}</Info>
						</ItemGrid>
					</ItemGrid>
					<ItemGrid>
						<Caption>Start Date:</Caption>
						<Info>{dateFormatter(project.open_date)}</Info>
					</ItemGrid>
					<ItemGrid xs>
						<Caption>End Date:</Caption>
						<Info>{dateFormatter(project.close_date)}</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>Created:</Caption>
						<Info>{dateFormatter(project.created)}</Info>
					</ItemGrid>
				</Grid>}
			/>

		);
	}
}
ProjectDetails.propTypes = {
	history: PropTypes.any.isRequired,
	match: PropTypes.any.isRequired,
	project: PropTypes.object.isRequired,
}
export default withStyles(deviceStyles)(ProjectDetails);