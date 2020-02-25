import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography,
} from '@material-ui/core'
import React, { Fragment, useState } from 'react'
// import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption, /* Caption */ } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import DeviceTypeHover from 'components/Hover/DeviceTypeHover';
import { useLocalization } from 'hooks'
import deviceTypeTableStyles from 'assets/jss/components/deviceTypes/deviceTypeTableStyles'


const DeviceTypeTable = props => {

	//Hooks
	const t = useLocalization()
	const classes = deviceTypeTableStyles()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	//State
	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null)
	const [hoverDeviceType, setHoverDeviceType] = useState(null)

	//Const
	let timer = null
	const { data, handleClick, selected, order, orderBy, handleCheckboxClick } = props

	//useCallbacks

	//useEffects

	//Handlers

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
	}
	const handleSelectAllClick = (event, checked) => {
		let selected = data.map(d => d.id)
		props.handleSelectAllClick(selected, checked)
	}
	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	const setHover = (e, n) => {
		e.persist()
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover) {
					setRowHover(null)
					setTimeout(() => {
						setRowHover(e.target)
						setHoverDeviceType(n)
					}, 200);
				}
				else {
					setRowHover(e.target)
					setHoverDeviceType(n)
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
		return <DeviceTypeHover anchorEl={rowHover} handleClose={unsetHover} devicetype={hoverDeviceType} />
	}

	let emptyRows;
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

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
						customColumn={[
							{
								id: 'name',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('devicetypes.fields.name')}
								</Typography>
							}
						]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.id);
							return (
								<TableRow
									hover
									onClick={handleClick(n.id)}
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
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${n.customer_name}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											FirstC label={n.name} />
										<TC
											label={n.customer_name}
										/>
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

export default DeviceTypeTable