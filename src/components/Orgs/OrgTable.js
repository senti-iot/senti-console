import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow
} from '@material-ui/core'
import TC from 'components/Table/TC'
import React, { Fragment, useState, useEffect } from 'react'
import TableHeader from 'components/Table/TableHeader'
import { Info, ItemG, Caption } from 'components'
import { useSelector, useDispatch } from 'react-redux'
import TP from 'components/Table/TP'
import { isFav, /* addToFav, removeFromFav, */ finishedSaving } from 'redux/favorites';
import OrgHover from 'components/Hover/OrgHover';
import { useLocalization, useSnackbar } from 'hooks'
var countries = require('i18n-iso-countries')

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
// 	language: state.localization.language,
// 	accessLevel: state.settings.user.privileges,
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
// quite a lot of redux-related stuff that we don't use here (I commented it out)
const OrgTable = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()

	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	const language = useSelector(state => state.localization.language)
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	// const favorites = useSelector(state => state.data.favorites)
	const saved = useSelector(state => state.favorites.saved)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	let timer = null
	const [/* stateSelected */, setStateSelected] = useState([])
	const [page, setPage] = useState(0)
	// const [anchorElMenu, setAnchorElMenu] = useState(null)
	// const [anchorFilterMenu, setAnchorFilterMenu] = useState(null)
	// const [openDelete, setOpenDelete] = useState(false)
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverOrg, setHoverOrg] = useState(null) // added
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		selected: [],
	// 		page: 0,
	// 		anchorElMenu: null,
	// 		anchorFilterMenu: null,
	// 		openDelete: false,
	// 	}
	// }

	timer = null

	useEffect(() => {
		if (saved === true) {
			const { data, selected } = props
			let org = data[data.findIndex(d => d.id === selected[0])]
			if (org) {
				if (dispatch(isFav({ id: org.id, type: 'org' }))) {
					s('snackbars.favorite.saved', { name: org.name, type: t('favorites.types.org') })
					dispatch(finishedSaving())
					setStateSelected([])
				}
				if (!dispatch(isFav({ id: org.id, type: 'org' }))) {
					s('snackbars.favorite.removed', { name: org.name, type: t('favorites.types.org') })
					dispatch(finishedSaving())
					setStateSelected([])
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saved])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { data, selected } = props
	// 		let org = data[data.findIndex(d => d.id === selected[0])]
	// 		if (org) {
	// 			if (dispatch(isFav({ id: org.id, type: 'org' }))) {
	// 				s('snackbars.favorite.saved', { name: org.name, type: t('favorites.types.org') })
	// 				dispatch(finishedSaving())
	// 				setSelected([])
	// 			}
	// 			if (!dispatch(isFav({ id: org.id, type: 'org' }))) {
	// 				s('snackbars.favorite.removed', { name: org.name, type: t('favorites.types.org') })
	// 				dispatch(finishedSaving())
	// 				setSelected([])
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
						setHoverOrg(n)
						// this.setState({ rowHover: e.target, hoverOrg: n })
					}, 200);
				}
				else {
					setRowHover(e.target)
					setHoverOrg(n)
					// this.setState({ rowHover: e.target, hoverOrg: n })
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
		return <OrgHover anchorEl={rowHover} handleClose={unsetHover} org={hoverOrg} />
	}

	const { classes, order, orderBy, data, handleCheckboxClick, selected, handleSelectAllClick } = props
	// const { page } = this.state
	let emptyRows;
	if (data) {
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
	}
	return (
		<Fragment>
			<div className={classes.tableWrapper} onMouseLeave={unsetHover}>
				{renderHover()}
				<Table className={classes.table} aria-labelledby='tableTitle'>
					<TableHeader
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						t={t}
						classes={classes}
						customColumn={[{ id: 'name', label: t('orgs.fields.org') }]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.id);
							return (
								<TableRow
									hover
									// onMouseEnter={e => { this.setHover(e, n) }}
									// onMouseLeave={this.unsetTimeout}
									onClick={e => { e.stopPropagation(); props.history.push('/management/org/' + n.id) }}
									role='checkbox'
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.id}
									selected={isSelected}
									style={{ cursor: 'pointer' }}
								>
									<Hidden lgUp>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC content={
											<ItemG container alignItems={'center'}>
												<ItemG>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
													<ItemG>
														<Caption noWrap className={classes.noMargin}>
															{n.address && n.zip && n.city && n.country ?
																`${n.address}, ${n.zip} ${n.city}, ${countries.getName(n.country, language)}` : null}
														</Caption>
													</ItemG>
												</ItemG>
											</ItemG>
										} />
									</Hidden>
									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											label={n.name} />
										<TC label={n.address} />
										<TC label={`${n.zip} ${n.city}`} />
										<TC label={n.url} />
									</Hidden>
								</TableRow>
							)
						}) : null}
						{emptyRows > 0 && (
							<TableRow style={{ height: 49 /* * emptyRows */ }}>
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
			// handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Fragment>
	)
}

export default OrgTable