import React, { Component } from 'react'
import { InfoCard, ItemGrid, Info, Caption, ItemG, T } from 'components'
import { Table, TableBody, TableRow, Hidden, withStyles } from '@material-ui/core'
import { SignalWifi2Bar, DataUsage } from 'variables/icons'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'


class OrgCollections extends Component {
	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1:
				return <ItemG container justify={'center'} title={t('devices.status.yellow')}>
					<SignalWifi2Bar className={classes.yellowSignal} />
				</ItemG>
			case 2:
				return <ItemG container justify={'center'} title={t('devices.status.green')}>
					<SignalWifi2Bar className={classes.greenSignal} />
				</ItemG>
			case 0:
				return <ItemG container justify={'center'} title={t('devices.status.red')}>
					<SignalWifi2Bar className={classes.redSignal} />
				</ItemG>
			case null:
				return <ItemG container justify={'center'} title={t('devices.status.red')}>
					<SignalWifi2Bar />
				</ItemG>
			default:
				break;
		}
	}
	render() {
		const { collections, classes, t } = this.props
		return (
			<InfoCard
				title={t('collections.pageTitle')}
				subheader={<T>
					{`${t('orgs.fields.deviceCount')}: ${collections.length}`}
				</T>}
				avatar={<DataUsage />}
				noExpand
				noPadding
				content={
					<Table>
						<TableBody style={{ padding: "0 24px" }}>
							{collections ? collections.map((n, i) => {
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push({ pathname: '/collection/' + n.id, prevURL: `/management/org/${this.props.org.id}` }) }}
										key={i}
										style={{ cursor: 'pointer', padding: '0 20px' }}
									>
										<Hidden lgUp>
											<TC checkbox className={classes.orgDevicesTD} content={this.renderIcon(n.activeDeviceStats ? n.activeDeviceStats.state : null)} />
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{`${n.name} - ${n.id}`}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap className={classes.noMargin}>

														</Caption>
													</ItemGrid>
													{/* </ItemGrid> */}
												</ItemGrid>
											} />

										</Hidden>
										<Hidden mdDown>
											<TC checkbox className={classes.orgDevicesTD} content={this.renderIcon(n.activeDeviceStats ? n.activeDeviceStats.state : null)} />
											<TC checkbox label={n.id} />
											<TC label={n.name} />
										</Hidden>
									</TableRow>

								)
							}) : null}
						</TableBody>
					</Table>
				} />
		)
	}
}

export default withStyles(devicetableStyles)(OrgCollections)