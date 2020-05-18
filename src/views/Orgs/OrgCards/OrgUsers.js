import React from 'react'
import { InfoCard, ItemGrid, Info, Caption, ItemG } from 'components'
import { Table, TableBody, TableRow, Hidden, Link, makeStyles } from '@material-ui/core'
import { People } from 'variables/icons'
import TC from 'components/Table/TC'
import Gravatar from 'react-gravatar'
import { pF, dateFormat } from 'variables/functions'
import moment from 'moment'
const orgUserStyles = makeStyles(theme => ({
	img: {
		borderRadius: "50px",
		height: "40px",
		width: "40px",
		display: 'flex',
		padding: 8
	},
}))
const OrgUsers = props => {

	const { users, t, history, org } = props
	const classes = orgUserStyles()
	return (
		<InfoCard
			title={t('users.pageTitle')}
			avatar={<People />}
			noExpand
			noPadding
			content={
				<Table>
					<TableBody style={{ padding: "0 24px" }}>
						{users ? users.map((n, i) => {
							const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t('users.fields.neverLoggedIn')
							return (
								<TableRow
									hover
									onClick={e => { e.stopPropagation(); history.push({ pathname: '/management/user/' + n.id, prevURL: `/management/org/${org.id}` }) }}
									key={i}
									style={{ cursor: 'pointer', padding: '0 20px' }}
								>
									<Hidden lgUp>
										<TC /* className={classes.orgUsersTD} */ checkbox content={<ItemGrid container zeroMargin justify={'center'}>
											<Gravatar default='mp' email={n.email} /* className={classes.img} */ />
										</ItemGrid>} />
										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap /* paragraphCell={classes.noMargin} */>
														{`${n.firstName} ${n.lastName}`}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap /* className={classes.noMargin} */>
														{`${n.org ? n.org.name : t('users.fields.noOrg')} - ${n.email}`}
													</Caption>
												</ItemGrid>
												{/* </ItemGrid> */}
											</ItemGrid>
										} />

									</Hidden>
									<Hidden mdDown>
										<TC checkbox content={<ItemG container justify={'center'}>
											<Gravatar default='mp' email={n.email} className={classes.img} />
										</ItemG>} />
										{/* <TC label={n.userName} /> */}
										<TC FirstC label={`${n.firstName} ${n.lastName}`} />
										<TC label={<Link onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone) : n.phone}</Link>} />
										<TC label={<Link onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</Link>} />
										<TC label={lastLoggedIn} />
									</Hidden>
								</TableRow>

							)
						}) : null}
					</TableBody>
				</Table>
			} />
	)
}

export default OrgUsers