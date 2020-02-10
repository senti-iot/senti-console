import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography,
} from '@material-ui/core'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import React, { Fragment, useState } from 'react'
// import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption, /* Caption */ } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import DeviceTypeHover from 'components/Hover/DeviceTypeHover';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
// 	hoverTime: state.settings.hoverTime
// })

// @Andrei
//TODO Move to own classes
const DeviceTypeTable = props => {
	const t = useLocalization()
	//TODO
	const classes = devicetableStyles()
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	const hoverTime = useSelector(state => state.settings.hoverTime)
	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverDeviceType, setHoverDeviceType] = useState(null) // added
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		page: 0,
	// 	}
	// }

	let timer = null

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	}
	const handleSelectAllClick = (event, checked) => {
		const { data } = props
		let selected = data.map(d => d.id)
		props.handleSelectAllClick(selected, checked)
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
						setHoverDeviceType(n)
						// this.setState({ rowHover: e.target, hoverDeviceType: n })
					}, 200);
				}
				else {
					setRowHover(e.target)
					setHoverDeviceType(n)
					// this.setState({ rowHover: e.target, hoverDeviceType: n })
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
		return <DeviceTypeHover anchorEl={rowHover} handleClose={unsetHover} devicetype={hoverDeviceType} />
	}

	const { handleClick, selected, order, data, orderBy, handleCheckboxClick } = props
	// const { page } = this.state
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
						classes={classes}
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
									// onMouseEnter={e => { this.setHover(e, n) }}
									// onMouseLeave={this.unsetTimeout}
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
				classes={classes}
				page={page}
				t={t}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}

export default DeviceTypeTable