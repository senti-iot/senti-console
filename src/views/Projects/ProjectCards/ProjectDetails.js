import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Grid, withStyles } from '@material-ui/core';
import { LibraryBooks, Edit, Delete } from "@material-ui/icons"
import { dateFormatter } from 'variables/functions';
import { ItemGrid, Caption, Info, Dropdown } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';


class ProjectDetails extends Component {

	deleteProject = () => {
		this.handleCloseActionsDetails()
		this.props.deleteProject()
	}
	editProject = () => {
		this.props.history.push({ pathname: `${this.props.match.url}/edit`, prevURL: `/project/${this.props.project.id}` })
	}
	render() {
		const { project, classes, t } = this.props
		return (
			<InfoCard
				title={project.title} avatar={<LibraryBooks />}
				noExpand
				topAction={<Dropdown
					menuItems={[{ label: t("menus.editProject"), icon: <Edit className={classes.leftIcon} />, func: this.editProject },
						{ label: t("menus.deleteProject"), icon: <Delete className={classes.leftIcon} />, func: this.deleteProject }]
					}
				/>
				}
				content = {< Grid container>
					<ItemGrid xs={12} container noMargin noPadding>
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
				</Grid >}
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