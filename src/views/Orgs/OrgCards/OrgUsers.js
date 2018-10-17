import React, { Component } from 'react'
import { InfoCard, ItemGrid, Info, Caption } from 'components'
import { Table, TableBody, TableRow, Hidden, TableCell, withStyles } from '@material-ui/core'
import { People } from "@material-ui/icons"
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import Gravatar from 'react-gravatar'
import { pF, dateFormat } from 'variables/functions'
import moment from 'moment'

class OrgUsers extends Component {
	render() {
		const { users, classes, t } = this.props
		return (
			<InfoCard
				title={"Users"}
				avatar={<People />}
				noExpand
				content={
					<Table>
						<TableBody>
							{users ? users.map((n, i) => {
								const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t("users.fields.neverLoggedIn")
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push({ pathname: '/user/' + n.id, prevURL: `/org/${this.props.org.id}` }) }}
										// tabIndex={-1}
										key={i}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox}>
												<ItemGrid container zeroMargin noPadding justify={"center"}>
													{n.img ? <img src={n.img} alt="brken" className={classes.img} /> : <Gravatar default="mp" email={n.email} className={classes.img} />}
												</ItemGrid>
											</TableCell>
											<TableCell classes={{ root: classes.tableCell }}>
												<ItemGrid container zeroMargin noPadding alignItems={"center"}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{`${n.firstName} ${n.lastName}`}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.org ? n.org.name : t("users.fields.noOrg")} - ${n.email}`}
														</Caption>
													</ItemGrid>
													{/* </ItemGrid> */}
												</ItemGrid>
											</TableCell>
										</Hidden>
										<Hidden mdDown>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox}>
												<ItemGrid container zeroMargin noPadding justify={"center"}>
													{n.img ? <img src={n.img} alt="brken" className={classes.img} /> : <Gravatar default="mp" email={n.email} className={classes.img} />}
												</ItemGrid>
											</TableCell>
											{/* <TC label={n.userName} /> */}
											<TC FirstC label={`${n.firstName} ${n.lastName}`} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone) : n.phone}</a>} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</a>} />
											<TC label={lastLoggedIn} />
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

export default withStyles(devicetableStyles)(OrgUsers)