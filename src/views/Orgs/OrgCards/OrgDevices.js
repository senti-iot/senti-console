import React, { Component } from 'react'
import { InfoCard, ItemGrid, Info, Caption, ItemG } from 'components'
import { Table, TableBody, TableRow, Hidden, withStyles } from '@material-ui/core'
import { DeviceHub, SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import Gravatar from 'react-gravatar'


class OrgDevices extends Component {
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
					return <SignalWifi2BarLock />
				default:
					break;
			}
		}
		render() {
			const { devices, classes, t } = this.props
			return (
				<InfoCard
					title={t('devices.pageTitle')}
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
											onClick={e => { e.stopPropagation(); this.props.history.push({ pathname: '/management/user/' + n.id, prevURL: `/management/org/${this.props.org.id}` }) }}
											key={i}
											style={{ cursor: 'pointer', padding: '0 20px' }}
										>
											<Hidden lgUp>
												<TC className={classes.orgUsersTD} checkbox content={<ItemGrid container zeroMargin justify={'center'}>
													{n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />}
												</ItemGrid>}/>
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
												}/>
									
											</Hidden>
											<Hidden mdDown>
												<TC checkbox className={classes.orgUsersTD} content={this.renderIcon(n.liveStatus)} />
												<TC label={n.userName} />
												<TC label={n.name} />
												<TC label={n.id} />
												{/* <TC label={<a onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone) : n.phone}</a>} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</a>} /> */}
												{/* <TC label={lastLoggedIn} /> */}
											</Hidden>
										</TableRow>

									)
								}) : null}
							</TableBody>
						</Table>
					}/>
			)
		}
}

export default withStyles(devicetableStyles)(OrgDevices)