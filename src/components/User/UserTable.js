import { ItemGrid, Info, Caption, Link } from 'components'
import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography
} from '@material-ui/core'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment, useState, useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
import TableHeader from 'components/Table/TableHeader'
import { useSelector, useDispatch } from 'react-redux'
import { pF, dateFormat } from 'variables/functions';
import Gravatar from 'react-gravatar'
import TP from 'components/Table/TP';
import { isFav, /* addToFav, removeFromFav, */ finishedSaving } from 'redux/favorites';
// import withSnackbar from 'components/Localization/S';
import UserHover from 'components/Hover/UserHover';
import { useSnackbar, useLocalization, useHistory } from 'hooks'
var moment = require('moment')

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
// 	accessLevel: state.settings.user.privileges,
// 	language: state.settings.language,
// 	favorites: state.data.favorites,
// 	saved: state.favorites.saved,
// 	hoverTime: state.settings.hoverTime
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

// @Andrei
const UserTable = props => {
	const classes = devicetableStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	const history = useHistory()
	const dispatch = useDispatch()

	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const language = useSelector(state => state.settings.language)
	// const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	let timer = null

	const [/* stateSelected */, setStateSelected] = useState([]) // added
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverUser, setHoverUser] = useState(null) // added
	const [data, /* setData */] = useState([])
	const [page, setPage] = useState(0)
	// const [openDelete, setOpenDelete] = useState(false)
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		data: [],
	// 		page: 0,
	// 		openDelete: false,
	// 	}
	// }

	// timer = null

	useEffect(() => {
		if (saved === true) {
			const { data, selected } = props
			let user = data[data.findIndex(d => d.id === selected[0])]
			if (user) {
				if (dispatch(isFav({ id: user.id, type: 'user' }))) {
					s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
					dispatch(finishedSaving())
					setStateSelected([])
					// this.setState({ selected: [] })
				}
				if (!dispatch(isFav({ id: user.id, type: 'user' }))) {
					s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
					dispatch(finishedSaving())
					setStateSelected([])
					// this.setState({ selected: [] })
				}
			}
		}
	}, [dispatch, props, s, saved, t])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { data, selected } = this.props
	// 		let user = data[data.findIndex(d => d.id === selected[0])]
	// 		if (user) {
	// 			if (this.props.isFav({ id: user.id, type: 'user' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
	// 				this.props.finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 			if (!this.props.isFav({ id: user.id, type: 'user' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
	// 				this.props.finishedSaving()
	// 				this.setState({ selected: [] })
	// 			}
	// 		}
	// 	}
	// }


	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	}
	const isSelectedFunc = id => props.selected.indexOf(id) !== -1
	const setHover = (e, n) => {
		e.persist()
		// const { hoverTime } = this.props
		// const { rowHover } = this.state
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover) {
					setRowHover(null)
					// this.setState({
					// 	rowHover: null
					// })
					setTimeout(() => {
						setRowHover(e.target)
						setHoverUser(n)
						// this.setState({ rowHover: e.target, hoverUser: n })
					}, 200);
				}
				else {
					setRowHover(e.target)
					setHoverUser(n)
					// this.setState({ rowHover: e.target, hoverUser: n })
				}
			}, hoverTime);
	}
	const unsetTimeout = () => {
		clearTimeout(timer)
	}
	const unsetHover = () => {
		setRowHover(null)
		// this.setState({
		// 	rowHover: null
		// })
	}
	const renderHover = () => {
		return <UserHover anchorEl={rowHover} handleClose={unsetHover} user={hoverUser} />
	}

	const { selected, order, orderBy, /* classes */ } = props
	// const { page } = this.state
	let emptyRows;
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
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
						classes={classes}
						customColumn={[{
							id: 'avatar', label: <div style={{ width: 40 }} />
						}, {
							id: 'firstName', label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>Users</Typography>
						}]}
					/>
					<TableBody >
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.id);
							const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t('users.fields.neverLoggedIn')
							return (
								<TableRow
									hover
									// onMouseEnter={e => { this.setHover(e, n) }}
									// onMouseLeave={this.unsetTimeout}
									onClick={e => { e.stopPropagation(); history.push('/management/user/' + n.id) }}
									role='checkbox'
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.id}
									selected={isSelected}
									style={{ cursor: 'pointer' }}
								>
									<Hidden lgUp>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => props.handleCheckboxClick(e, n.id)} />} />
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
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => props.handleCheckboxClick(e, n.id)} />} />
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
				classes={classes}
				rowsPerPage={rowsPerPage}
				page={page}
				t={t}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}

UserTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default UserTable