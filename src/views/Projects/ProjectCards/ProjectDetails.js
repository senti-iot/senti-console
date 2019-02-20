import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Grid, withStyles } from '@material-ui/core';
import { LibraryBooks, Edit, Delete, DataUsage, StarBorder, Star } from 'variables/icons'
import { dateFormatter } from 'variables/functions';
import { ItemGrid, Caption, Info, Dropdown } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';


class ProjectDetails extends Component {

	deleteProject = () => {
		this.props.deleteProject()
	}
	editProject = () => {
		this.props.history.push({ pathname: `${this.props.match.url}/edit`, prevURL: `/project/${this.props.project.id}` })
	}
	render() {
		const { project, classes, t, isFav, addToFav, removeFromFav } = this.props
		return (
			<InfoCard
				title={project.title} avatar={<LibraryBooks />}
				noExpand
				topAction={<Dropdown
					menuItems={[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: this.editProject },
						{ label: t('menus.assign.collectionsToProject'), icon: <DataUsage className={classes.leftIcon} />, func: this.props.handleOpenAssignCollection },
						{ label: t('menus.delete'), icon: <Delete className={classes.leftIcon} />, func: this.deleteProject },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav }

					]
					}
				/>
				}
				content = {< Grid container>
					<ItemGrid xs={12} container noMargin noPadding>
						<ItemGrid>
							<Caption>{t('projects.fields.description')}:</Caption>
							<Info>{project.description}</Info>
						</ItemGrid>
					</ItemGrid>
					<ItemGrid>
						<Caption>{t('projects.fields.startDate')}:</Caption>
						<Info>{dateFormatter(project.startDate)}</Info>
					</ItemGrid>
					<ItemGrid xs>
						<Caption>{t('projects.fields.endDate')}:</Caption>
						<Info>{dateFormatter(project.endDate)}</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>{t('projects.fields.created')}:</Caption>
						<Info>{dateFormatter(project.created)}</Info>
					</ItemGrid>
					<ItemGrid xs={12}>
						<Caption>{t('projects.fields.lastUpdate')}:</Caption>
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