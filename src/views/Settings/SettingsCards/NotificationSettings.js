import React, { Component } from 'react'
import { InfoCard, ItemGrid, DSelect } from 'components';
import { Notifications } from 'variables/icons';
import { Grid, List, ListItem, ListItemText, withStyles } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';

class NotificationSettings extends Component {

	changeDidKnow = e => this.props.changeDidKnow(e.target.value)
	changeAlerts = e => this.props.changeAlerts(e.target.value)

	render() {
		const { classes, t } = this.props
		const { alerts, didKnow } = this.props
		const alertVals = [
			{ value: 1, label: t('actions.yes') },
			{ value: 0, label: t('actions.no') }
		]
		const didKnows = [
			{ value: 1, label: t('actions.yes') },
			{ value: 0, label: t('actions.no') }
		]
		return (
			<InfoCard
				noExpand
				avatar={<Notifications />}
				title={t('settings.headers.notifications')}
				subheader={'*Work in progress*'}
				content={
					<Grid container>
						<List className={classes.list}>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.alerts')}</ListItemText>
									<DSelect menuItems={alertVals} value={alerts} onChange={this.changeAlerts} />
								</ItemGrid>
							</ListItem>
							<ListItem>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.didYouKnow')}</ListItemText>
									<DSelect menuItems={didKnows} value={didKnow} onChange={this.changeDidKnow} />
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				}
			/>
		)
	}
}

export default withStyles(settingsStyles)(NotificationSettings)