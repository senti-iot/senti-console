import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core';

export class UserContact extends Component {
	render() {
		const { t, user } = this.props
		return (
			<InfoCard
				title={t('users.headers.contact')}
				noExpand
				content={
					<Grid container>
						
						<ItemGrid xs>
							<Caption>{t("users.fields.email")}</Caption>
							<Info>{user.email} </Info>
						</ItemGrid>
						<ItemGrid xs>
							<Caption>{t("users.fields.phone")}</Caption>
							<Info>{user.phone} </Info>
						</ItemGrid>
						<ItemGrid xs>
							<Caption>{t("users.fields.organisation")}</Caption>
							<Info>{user.organisation} </Info>
						</ItemGrid>
						<ItemGrid xs>
							<Caption>{t("users.fields.language")}</Caption>
							<Info>{user.settings.language}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.accessLevel")}</Caption>
							<Info>{user.accessLevel}</Info>
						</ItemGrid>
					</Grid>
				}
			/>
		)
	}
}

export default UserContact
