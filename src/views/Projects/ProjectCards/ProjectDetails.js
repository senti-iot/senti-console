import React from 'react';
import PropTypes from 'prop-types'
// import { withStyles } from '@material-ui/core';
import { LibraryBooks, Edit, Delete, DataUsage, StarBorder, Star } from 'variables/icons'
import { dateFormatter } from 'variables/functions';
import { ItemG, Caption, Info, Dropdown } from 'components';
import InfoCard from 'components/Cards/InfoCard';
// import deviceStyles from 'assets/jss/views/deviceStyles';
import { useSelector } from 'react-redux'
import { useHistory, useMatch, useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	detailsPanel: state.settings.detailsPanel
// })

// @Andrei
const ProjectDetails = props => {
	// const classes = deviceStyles()
	const detailsPanel = useSelector(state => state.settings.detailsPanel)
	const history = useHistory()
	const match = useMatch()
	const t = useLocalization()

	const deleteProject = () => {
		props.deleteProject()
	}
	const editProject = () => {
		history.push({ pathname: `${match.url}/edit`, prevURL: `/project/${props.project.id}` })
	}

	const { project, isFav, addToFav, removeFromFav } = props
	return (
		<InfoCard
			title={project.title}
			avatar={<LibraryBooks />}
			// noExpand
			noPadding
			// noRightExpand
			// menuExpand
			expanded={Boolean(detailsPanel)}
			topAction={<Dropdown
				menuItems={[
					{ label: t('menus.edit'), icon: Edit, func: editProject },
					{ label: t('menus.assign.collectionsToProject'), icon: DataUsage, func: props.handleOpenAssignCollection },
					{ label: t('menus.delete'), icon: Delete, func: deleteProject },
					{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav }

				]
				}
			/>
			}
			hiddenContent={<ItemG container spacing={2}>
				<ItemG xs={12}>
					<ItemG>
						<Caption>{t('projects.fields.description')}:</Caption>
						<Info>{project.description}</Info>
					</ItemG>
				</ItemG>
				<ItemG>
					<Caption>{t('projects.fields.startDate')}:</Caption>
					<Info>{dateFormatter(project.startDate)}</Info>
				</ItemG>
				<ItemG xs>
					<Caption>{t('projects.fields.endDate')}:</Caption>
					<Info>{dateFormatter(project.endDate)}</Info>
				</ItemG>
				<ItemG xs={12}>
					<Caption>{t('projects.fields.created')}:</Caption>
					<Info>{dateFormatter(project.created)}</Info>
				</ItemG>
				<ItemG xs={12}>
					<Caption>{t('projects.fields.lastUpdate')}:</Caption>
					<Info>{dateFormatter(project.modified)}</Info>
				</ItemG>
			</ItemG>}
		/>

	);
}

ProjectDetails.propTypes = {
	// history: PropTypes.any.isRequired,
	// match: PropTypes.any.isRequired,
	project: PropTypes.object.isRequired,
}

export default ProjectDetails