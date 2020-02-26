import { ItemGrid, Info, Caption, Link } from 'components'
import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography
} from '@material-ui/core'
import TC from 'components/Table/TC'
import React, { Fragment, useState, useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
import TableHeader from 'components/Table/TableHeader'
import { useSelector, useDispatch } from 'react-redux'
import { pF, dateFormat } from 'variables/functions'
import Gravatar from 'react-gravatar'
import TP from 'components/Table/TP'
import { isFav, finishedSaving } from 'redux/favorites'
import UserHover from 'components/Hover/UserHover'
import { useSnackbar, useLocalization, useHistory } from 'hooks'
import usertableStyles from 'assets/jss/components/users/usertableStyles'
import moment from 'moment'

const UserTable = props => {
	//Hooks
	const classes = usertableStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	const history = useHistory()
	const dispatch = useDispatch()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	const language = useSelector(state => state.settings.language)
	const saved = useSelector(state => state.favorites.saved)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	//State
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverUser, setHoverUser] = useState(null) // added
	const [page, setPage] = useState(0)

	//Const
	const { selected, order, orderBy, data } = props
	let timer = null
	let emptyRows
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
	//useCallbacks

	//useEffects
	useEffect(() => {
		if (saved === true) {
			const { data, selected } = props
			let user = data[data.findIndex(d => d.id === selected[0])]
			if (user) {
				if (dispatch(isFav({ id: user.id, type: 'user' }))) {
					s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: user.id, type: 'user' }))) {
					s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, props, s, saved, t])

	//Handlers


	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
	}
	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	const setHover = (e, n) => {
		e.persist()
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover) {
					setRowHover(null)

					setTimeout(() => {
						setHoverUser(n)
						setRowHover(e.target)
					}, 200)
				}
				else {
					setHoverUser(n)
					setRowHover(e.target)
				}
			}, hoverTime)
	}
	const unsetTimeout = () => {
		clearTimeout(timer)
	}
	const unsetHover = () => {
		setRowHover(null)
	}
	const renderHover = () => {
		return <UserHover anchorEl={rowHover} handleClose={unsetHover} user={hoverUser} />
	}

	return (
		<Fragment>
			<div className={classes.tableWrapper} onMouseLeave={unsetHover}>
				{renderHover()}
				<Table className={classes.table} aria-labelledby='tableTitle' >
					<TableHeader
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={props.handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						t={t}
						customColumn={[{
							id: 'avatar', label: <div style={{ width: 40 }} />
						}, {
							id: 'firstName', label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>Users</Typography>
						}]}
					/>
					<TableBody >
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.uuid)
							const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t('users.fields.neverLoggedIn')
							return (
								<TableRow
									hover
									onClick={e => { e.stopPropagation(); history.push('/management/user/' + n.uuid) }}
									role='checkbox'
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.uuid}
									selected={isSelected}
									style={{ cursor: 'pointer' }}
								>
									<Hidden lgUp>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => props.handleCheckboxClick(e, n.uuid)} />} />
										<TC checkbox content={n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />} />

										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{`${n.firstName} ${n.lastName}`}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${n.org ? n.org.name : t('users.fields.noOrg')} - ${n.email}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>
									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => props.handleCheckboxClick(e, n.uuid)} />} />
										<TC checkbox content={n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />} />
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											FirstC label={`${n.firstName} ${n.lastName}`} />
										<TC label={<Link onClick={e => e.stopPropagation()} component={'a'} target={'_blank'} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone, language) : n.phone}</Link>} />
										<TC label={<Link onClick={e => e.stopPropagation()} component={'a'} target={'_blank'} href={`mailto:${n.email}`}>{n.email}</Link>} />
										<TC label={n.org ? n.org.name : t('users.noOrg')} />
										<TC label={t(n.group)} />
										<TC label={lastLoggedIn} />
									</Hidden>
								</TableRow>

							)
						}) : null}
						{emptyRows > 0 && (
							<TableRow style={{ height: 49 }}>
								<TableCell colSpan={8} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<TP
				count={data ? data.length : 0}
				rowsPerPage={rowsPerPage}
				page={page}
				t={t}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}

export default UserTable