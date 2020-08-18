import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography,
} from '@material-ui/core'
import React, { Fragment, useState } from 'react'
// import { dateFormatter } from 'variables/functions'
import cfTableStyles from 'assets/jss/components/cloudfunctions/cfTableStyles'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import { useLocalization } from 'hooks'

const FunctionTable = props => {
	//Hooks
	const classes = cfTableStyles()
	const t = useLocalization()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	// const hoverTime = useSelector(state => state.settings.hoverTime)

	//State
	const [page, setPage] = useState(0)
	// const [rowHover, setRowHover] = useState(null)
	// const [hoverFunction] = useState(null)

	//Const
	// let timer = null
	const { handleClick, selected, order, data, orderBy, handleCheckboxClick } = props
	let emptyRows;
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

	//useCallbacks

	//useEffects

	//Handlers

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleSelectAllClick = (event, checked) => {
		const { data } = props
		let selected = data.map(d => d.uuid)
		props.handleSelectAllClick(selected, checked)
	}

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	/* 	// const setHover = (e, n) => {
		// 	e.persist()
		// 	if (hoverTime > 0)
		// 		timer = setTimeout(() => {
		// 			if (rowHover) {
		// 				setRowHover(null)
		// 				setTimeout(() => {
		// 					setRowHover(e.target)
		// 					setHoverFunction(n)
		// 					// this.setState({ rowHover: e.target, hoverFunction: n })
		// 				}, 200);
		// 			}
		// 			else {
		// 				setRowHover(e.target)
		// 				setHoverFunction(n)
		// 				// this.setState({ rowHover: e.target, hoverFunction: n })
		// 			}
		// 		}, hoverTime);
		// }

		// const unsetTimeout = () => {
		// 	clearTimeout(timer)
		// }
		// const unsetHover = () => {
		// setRowHover(null)
		// this.setState({
		// 	rowHover: null
		// })
		// }
		// const renderHover = () => {
		// 	return <FunctionHover anchorEl={rowHover} handleClose={unsetHover} project={hoverFunction} />
		// } */

	const renderProtocol = (id) => {
		const { t } = props
		switch (id) {
			case 0:
				return t('cloudfunctions.fields.types.function')
			case 1:
				return t('cloudfunctions.fields.types.external')
			default:
				break;
		}
	}

	return (
		<Fragment>
			<div className={classes.tableWrapper} /* onMouseLeave={unsetHover} */>
				{/* {renderHover()} */}
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
						customColumn={[
							{
								id: 'name',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('registries.fields.name')}
								</Typography>
							}
						]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.uuid);
							return (
								<TableRow
									// onMouseEnter={e => { this.setHover(e, n) }}
									// onMouseLeave={this.unsetTimeout}
									hover
									onClick={handleClick(n.uuid)}
									role='checkbox'
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.uuid}
									selected={isSelected}
									style={{ cursor: 'pointer' }}
								>
									<Hidden lgUp>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.uuid)} />} />
										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${renderProtocol(n.type)}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.uuid)} />} />
										<TC FirstC label={n.name} />
										<TC label={renderProtocol(n.type)} />
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
				page={page}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}


export default FunctionTable