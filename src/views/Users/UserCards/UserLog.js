import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core'
var moment = require('moment')
export class UserLog extends Component {
	render() {
		const { t, user } = this.props
		const lastLoggedIn = moment(user.lastLoggedIn).isValid() ? moment(user.lastLoggedIn).format("DD.MM.YYYY HH:mm") : t("users.fields.neverLoggedIn")
		const created = moment(user.created).isValid() ? moment(user.created).format("DD.MM.YYYY HH:mm") : ""

		return (
			<InfoCard
				title={t("users.headers.system")}
				noExpand
				content={
					<Grid container>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.created")}</Caption>
							<Info>{created}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.lastSignIn")}</Caption>
							<Info>{lastLoggedIn}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.active")}</Caption>
							<Info>{`${t("users.fields.loginSuspended")} ${!user.suspended ? t("actions.no") : t("actions.yes")}` }</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.tags")}</Caption>
							{/* <Info> */}
							{/* <List> */}
							{/* {user.tags.map(t => <Chip style={{ margin: 2 }} label={t} key={t}/>)} */}
							{/* </List> */}
							{/* </Info> */}
						</ItemGrid>
					</Grid>
				}
			/>
		)
	}
}

export default UserLog
