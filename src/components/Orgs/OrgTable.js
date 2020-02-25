import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow
} from '@material-ui/core'
import TC from 'components/Table/TC'
import React, { Fragment, useState } from 'react'
import TableHeader from 'components/Table/TableHeader'
import { Info, ItemG, Caption } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP'
import OrgHover from 'components/Hover/OrgHover';
import { useLocalization, useHistory } from 'hooks'
import orgsStyles from 'assets/jss/components/orgs/orgsStyles'
var countries = require('i18n-iso-countries')


const OrgTable = props => {
	//Hooks
	const t = useLocalization()
	const classes = orgsStyles()
	const history = useHistory()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	const language = useSelector(state => state.localization.language)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	//State
	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverOrg, setHoverOrg] = useState(null) // added

	//Const
	const { order, orderBy, data, handleCheckboxClick, selected, handleSelectAllClick } = props

	let timer = null
	let emptyRows;

	if (data) {
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
	}



	//useCallbacks

	//useEffects

	//Handlers

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
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover) {
					setRowHover(null)
					setTimeout(() => {
						setHoverOrg(n)
						setRowHover(e.target)
					}, 200);
				}
				else {
					setHoverOrg(n)
					setRowHover(e.target)
				}
			}, hoverTime);
	}
	const unsetTimeout = () => {
		clearTimeout(timer)
	}
	const unsetHover = () => {
		setRowHover(null)
	}

	const renderHover = () => {
		return <OrgHover anchorEl={rowHover} handleClose={unsetHover} org={hoverOrg} />
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
									onClick={e => { e.stopPropagation(); history.push('/management/org/' + n.id) }}
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
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}

export default OrgTable