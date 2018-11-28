import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { FolderShared } from 'variables/icons'
import { Grid } from '@material-ui/core'
import { dateFormat, dateFormatter } from 'variables/functions';
var moment = require('moment')
export class UserLog extends Component {
	render() {
		const { t, user } = this.props
		const lastLoggedIn = moment(user.lastLoggedIn).isValid() ? dateFormat(user.lastLoggedIn) : t('users.fields.neverLoggedIn')
		const created = moment(user.created).isValid() ? dateFormatter(user.created) : ''

		return (
			<InfoCard
				title={t('users.headers.system')}
				noExpand
				avatar={<FolderShared/>}
				content={
					<Grid container>
						<ItemGrid xs={12}>
							<Caption>{t('users.fields.created')}</Caption>
							<Info>{created}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t('users.fields.lastSignIn')}</Caption>
							<Info>{lastLoggedIn}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t('users.fields.active')}</Caption>
							<Info>{`${user.suspended ? t('users.fields.loginSuspended') : t('actions.yes')}` }</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t('users.fields.tags')}</Caption>
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
