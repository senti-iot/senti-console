import React, { useState } from 'react'
import { InfoCard, ItemGrid, Info, Caption, ItemG } from 'components'
import { Table, TableBody, TableRow, Hidden, makeStyles } from '@material-ui/core'
import TC from 'components/Table/TC'
import TP from 'components/Table/TP'
import { useSelector } from 'react-redux'
import { AccountTree, Business } from '@material-ui/icons'
const orgUserStyles = makeStyles(theme => ({
	img: {
		borderRadius: "50px",
		height: "40px",
		width: "40px",
		display: 'flex',
		padding: 8
	},
}))
const OrgSubOrgs = props => {
	//Hooks
	const classes = orgUserStyles()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)

	//State
	const [page, setPage] = useState(0)
	//Const
	const { subOrgs, t, history, org } = props

	//useCallbacks

	//useEffects

	//Handlers
	const handleChangePage = (event, newpage) => {
		setPage(newpage)
	}

	const handleNavigation = (e, n) => {
		e.stopPropagation()
		history.push({ pathname: '/management/org/' + n.uuid, prevURL: `/management/org/${org.uuid}` })
	}
	// const handleCreateNewUser = () => {
	// 	history.push({ pathname: '/management/users/new', prevURL: `/management/org/${org.uuid}`, org: org })
	// }
	return (
		<InfoCard
			title={t('orgs.pageTitle')}
			avatar={<AccountTree />}
			noExpand
			noPadding
			// topAction={<Tooltip title={t('menus.create.user')}>
			// 	<IconButton aria-label='Add new user' onClick={handleCreateNewUser}>
			// 		<Add />
			// 	</IconButton>
			// </Tooltip>}
			content={
				<>
					<Table>
						<TableBody style={{ padding: "0 24px" }}>
							{subOrgs ? subOrgs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
								return (
									<TableRow
										hover
										onClick={e => handleNavigation(e, n)}
										key={i}
										style={{ cursor: 'pointer', padding: '0 20px' }}
									>
										<Hidden lgUp>
											<TC /* className={classes.orgUsersTD} */ checkbox content={<ItemGrid container zeroMargin justify={'center'}>
												<Business className={classes.img} />
											</ItemGrid>} />
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap /* paragraphCell={classes.noMargin} */>
															{`${n.name}`}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap /* className={classes.noMargin} */>
															{/* {`${n.org ? n.org.name : t('users.fields.noOrg')} - ${n.email}`} */}
														</Caption>
													</ItemGrid>
													{/* </ItemGrid> */}
												</ItemGrid>
											} />

										</Hidden>
										<Hidden mdDown>
											<TC checkbox content={<ItemG container justify={'center'}>
												<Business className={classes.img} />
											</ItemG>} />
											{/* <TC label={n.userName} /> */}
											<TC FirstC label={`${n.name} `} />
										</Hidden>
									</TableRow>

								)
							}) : null}
						</TableBody>
					</Table>
					<TP
						count={subOrgs ? subOrgs.length : 0}
						page={page}
						t={t}
						handleChangePage={handleChangePage}
					/>
				</>
			} />
	)
}

export default OrgSubOrgs