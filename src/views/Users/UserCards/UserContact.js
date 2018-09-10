import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core';
import UserPlaceHolder from 'assets/img/userplaceholder.jpg'

export class UserContact extends Component {
	render() {
		const { t, user, classes } = this.props
		return (
			<InfoCard
				title={t('users.headers.contact')}
				noExpand
				content={
					<Grid container>
						<ItemGrid xs={8}>
							<Caption>{t("users.fields.firstName") + " " + t("users.fields.lastName")}</Caption>
							<Info>{user.firstName + " " + user.lastName}</Info>
						</ItemGrid>
						<ItemGrid container xs={3} justify={"flex-end"}>
							<img src={UserPlaceHolder} alt={"profilepicture"} className={classes.img} />
						</ItemGrid>
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
							<Info>{user.org ? user.org.name : t("users.noOrg")} </Info>
						</ItemGrid>
						<ItemGrid xs>
							<Caption>{t("users.fields.language")}</Caption>
							{/* <Info>{user.settings.language}</Info> */}
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
