import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core';
import { Person } from '@material-ui/icons'

export class ProjectContact extends Component {
	render() {
		const { t, project } = this.props
		return (
			<InfoCard title={t("projects.contact.title")} avatar={<Person />} subheader={""}
				noExpand
				content={
					<Grid container>
						<ItemGrid>
							<Caption>
								{t("projects.contact.name")}
							</Caption>
							<Info>
								{project.user.vcFirstName + " " + project.user.vcLastName}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t("projects.contact.mail")}
							</Caption>
							<Info>
								<a title={t("links.mailTo")} href={`mailto:${project.user.vcEmail}`}>
									{project.user.vcEmail}
								</a>
								{/* {project.user.vcEmail} */}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t("projects.contact.phone")}
							</Caption>
							<Info>
								{project.user.vcPhone}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t("projects.contact.organisation")}
							</Caption>
							<Info>
								{project.user.organisation}
							</Info>
						</ItemGrid>
					</Grid>
				}
			/>
		)
	}
}

export default ProjectContact
