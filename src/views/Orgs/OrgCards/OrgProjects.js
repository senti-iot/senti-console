import React, { Component } from 'react'
import { InfoCard, ItemGrid, Info, Caption } from 'components'
import { Table, TableBody, TableRow, Hidden, withStyles } from '@material-ui/core'
import { LibraryBooks } from 'variables/icons'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'


class OrgDevices extends Component {

	render() {
		const { projects, classes, t } = this.props
		return (
			<InfoCard
				title={t('projects.pageTitle')}
				subheader={`${t('orgs.fields.deviceCount')}: ${projects.length}`}
				avatar={<LibraryBooks />}
				noExpand
				noPadding
				content={
					<Table>
						<TableBody style={{ padding: "0 24px" }}>
							{projects ? projects.map((n, i) => {
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push({ pathname: '/project/' + n.id, prevURL: `/management/org/${this.props.org.id}` }) }}
										key={i}
										style={{ cursor: 'pointer', padding: '0 20px' }}
									>
										<Hidden lgUp>
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{`${n.title} - ${n.id}`}
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
											<TC checkbox center className={classes.orgDevicesTD} label={n.id}/>
											<TC label={n.title} />
											{/* <TC checkbox label={n.id} /> */}
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