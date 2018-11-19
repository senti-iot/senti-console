import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core';
import { Person } from 'variables/icons'
import { Link } from 'react-router-dom'

export class ProjectContact extends Component {
	render() {
		const { t, project } = this.props
		return (
			<InfoCard title={t('projects.contact.title')} avatar={<Person />} subheader={''}
				noExpand
				content={
					<Grid container>
						<ItemGrid>
							<Caption>
								{t('projects.contact.name')}
							</Caption>
							<Info >
								<Link to={`/user/${project.user.id}`} >
									{project.user.firstName + ' ' + project.user.lastName}
								</Link>
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('projects.contact.email')}
							</Caption>
							<Info>
								<a title={t('links.mailTo')} href={`mailto:${project.user.email}`}>
									{project.user.email}
								</a>
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('projects.contact.phone')}
							</Caption>
							<Info>
								<a title={t('links.phoneTo')} href={`tel:${project.user.phone}`}>
									{project.user.phone}
								</a>
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('projects.contact.organisation')}
							</Caption>
							<Info>
								{project.user.org ? <Link to={{ pathname: `/org/${project.user.org.id}`, prevURL: `/project/${project.id}` }} >
									{project.user.org.name}
								</Link> : t('users.fields.noOrg')}
							</Info>
						</ItemGrid>
					</Grid>
				}
			/>
		)
	}
}

export default ProjectContact
