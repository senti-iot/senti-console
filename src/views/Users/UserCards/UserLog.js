import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core'
export class UserLog extends Component {
	render() {
		const { t, user } = this.props
		return (
			<InfoCard
				title={t("users.headers.system")}
				noExpand
				content={
					<Grid container>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.created")}</Caption>
							<Info>{user.created}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.lastSignIn")}</Caption>
							<Info>{user.lastLogin}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t("users.fields.active")}</Caption>
							<Info>{user.active}</Info>
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
