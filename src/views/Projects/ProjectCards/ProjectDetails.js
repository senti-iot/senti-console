import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Grid, IconButton, Menu, MenuItem, withStyles } from '@material-ui/core';
import { LibraryBooks, MoreVert, Edit, Delete } from "@material-ui/icons"
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
	}
	
	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	deleteProject = () => {
		this.handleCloseActionsDetails()
		this.props.deleteProject()
	}

	render() {
		const { actionAnchor } = this.state
		const { project, classes, t } = this.props
		return (
			<InfoCard
				title={t("projects.infoCardProjectDetails")} avatar={<LibraryBooks />}
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
							<Edit className={classes.leftIcon} />{t("menus.editProject")}
						</MenuItem>
						<MenuItem onClick={this.deleteProject}>
							<Delete className={classes.leftIcon} />{t("menus.deleteProject")}
						</MenuItem>
						))}
					</Menu>
				</ItemGrid>}
				content={<Grid container>
					<ItemGrid xs={12} container noMargin noPadding>
						<ItemGrid>
							<Caption>{t("projects.projectsColumnTitle")}:</Caption>
							<Info>{project.title}</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>{t("projects.projectsColumnDescription")}:</Caption>
							<Info>{project.description}</Info>
						</ItemGrid>
					</ItemGrid>
					<ItemGrid>
						<Caption>{t("projects.projectsColumnStartDate")}:</Caption>
						<Info>{dateFormatter(project.startDate)}</Info>
					</ItemGrid>
					<ItemGrid xs>
						<Caption>{t("projects.projectsColumnEndDate")}:</Caption>
						<Info>{dateFormatter(project.endDate)}</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>{t("projects.projectsColumnCreated")}:</Caption>
						<Info>{dateFormatter(project.created)}</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>{t("projects.projectsColumnLastMod")}:</Caption>
						<Info>{dateFormatter(project.modified)}</Info>
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