import React from 'react'
import { InfoCard, ItemGrid, Info, Caption, ItemG } from 'components'
import { Table, TableBody, TableRow, Hidden } from '@material-ui/core'
import { DeviceHub, SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'

const OrgDevices = props => {
	const { devices, t } = props
	const classes = devicetableStyles()

	const renderIcon = (status) => {
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
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}

	return (
		<InfoCard
			title={t('devices.pageTitle')}
			subheader={<ItemG><Caption>
				{`${t('orgs.fields.deviceCount')}: ${devices.length}`}
			</Caption></ItemG>}
			avatar={<DeviceHub />}
			noExpand
			noPadding
			content={
				<Table>
					<TableBody style={{ padding: "0 24px" }}>
						{devices ? devices.map((n, i) => {
							return (
								<TableRow
									hover
									onClick={e => { e.stopPropagation(); props.history.push({ pathname: '/device/' + n.id, prevURL: `/management/org/${props.org.id}` }) }}
									key={i}
									style={{ cursor: 'pointer', padding: '0 20px' }}
								>
									<Hidden lgUp>
										<TC checkbox /* className={classes.orgDevicesTD} */ content={renderIcon(n.liveStatus)} />
										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap /* paragraphCell={classes.noMargin} */>
														{`${n.name} - ${n.id}`}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap /* className={classes.noMargin} */>

													</Caption>
												</ItemGrid>
												{/* </ItemGrid> */}
											</ItemGrid>
										} />

									</Hidden>
									<Hidden mdDown>
										<TC checkbox /* className={classes.orgDevicesTD} */ content={renderIcon(n.liveStatus)} />
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

export default OrgDevices