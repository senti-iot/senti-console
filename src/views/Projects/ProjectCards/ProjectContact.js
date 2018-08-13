import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core';
import { Person } from '@material-ui/icons'

export class ProjectContact extends Component {
	render() {
		const { t, project } = this.props
		return (
			<InfoCard title={t("project.cards.contact")} avatar={<Person />} subheader={""}
				noExpand
				content={
					<Grid container>
						<ItemGrid>
							<Caption>
								Contact:
							</Caption>
							<Info>
								{project.user.vcFirstName + " " + project.user.vcLastName}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								E-mail:
							</Caption>
							<Info>
								{project.user.vcEmail}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								Phone:
							</Caption>
							<Info>
								{project.user.vcPhone}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								Organisation:
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
