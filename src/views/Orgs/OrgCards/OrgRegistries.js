import React, { useState } from 'react'
import { InfoCard, ItemGrid, Info, /* Caption, */ ItemG } from 'components'
import { Table, TableBody, TableRow, Hidden, makeStyles, Tooltip, IconButton } from '@material-ui/core'
import { Add, InputIcon } from 'variables/icons'
import TC from 'components/Table/TC'
import { useLocalization, useHistory, useSelector } from 'hooks'
import TP from 'components/Table/TP'
const orgRegStyles = makeStyles(theme => ({
	img: {
		height: "34px",
		width: '34px',
		display: 'flex',
		padding: 12
	},
}))
const OrgRegistries = props => {
	//Hooks
	const t = useLocalization()
	const history = useHistory()
	const classes = orgRegStyles()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)

	//State
	const [page, setPage] = useState(0)
	//Const
	const { registries, org } = props

	//useCallbacks

	//useEffects

	//Handlers
	const handleChangePage = (event, newpage) => {
		setPage(newpage)
	}
	const handleNavigation = (e, n) => {
		e.stopPropagation()
		history.push({ pathname: '/registry/' + n.uuid, prevURL: `/management/org/${org.uuid}` })
	}
	const handleCreateNewRegistry = () => {
		history.push({ pathname: '/registries/new', prevURL: `/management/org/${org.uuid}`, org: org })
	}

	return (
		<InfoCard
			title={t('registries.pageTitle')}
			avatar={<InputIcon />}
			noExpand
			noPadding
			topAction={<Tooltip title={t('menus.create.registry')}>
				<IconButton aria-label='Add new registry' onClick={handleCreateNewRegistry}>
					<Add />
				</IconButton>
			</Tooltip>}
			content={
				<>
					<Table>
						<TableBody style={{ padding: "0 24px" }}>
							{registries ? registries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
							// const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t('registries.fields.neverLoggedIn')
								return (
									<TableRow
										hover
										onClick={e => handleNavigation(e, n)}
										key={i}
										style={{ cursor: 'pointer', padding: '0 20px' }}
									>
										<Hidden lgUp>
											<TC /* className={classes.orgRegistriesTD} */ checkbox content={<ItemGrid container zeroMargin justify={'center'}>
												<InputIcon className={classes.img} />
											</ItemGrid>} />
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap /* paragraphCell={classes.noMargin} */>
															{`${n.name}`}
														</Info>
													</ItemGrid>
													{/* </ItemGrid> */}
												</ItemGrid>
											} />

										</Hidden>
										<Hidden mdDown>
											<TC checkbox content={<ItemG container justify={'center'} >
												<InputIcon className={classes.img}/>
											</ItemG>} />
											<TC label={n.name} />
											{/* <TC FirstC label={`${n.firstName} ${n.lastName}`} /> */}
											{/* <TC label={<Link onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone) : n.phone}</Link>} />
										<TC label={<Link onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</Link>} />
										<TC label={lastLoggedIn} /> */}
										</Hidden>
									</TableRow>

								)
							}) : null}
						</TableBody>
					</Table>
					<TP
						count={registries ? registries.length : 0}
						page={page}
						t={t}
						handleChangePage={handleChangePage}
					/>
				</>
			} />
	)
}

export default OrgRegistries