import {
	Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
// import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
// import MessageHover from 'components/Hover/MessageHover';
import { dateTimeFormatter } from 'variables/functions';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
// 	hoverTime: state.settings.hoverTime
// })

const MessageTable = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	// const hoverTime = useSelector(state => state.settings.hoverTime)
	const [page] = useState(0)
	const [, setRowHover] = useState(null) // added
	// const [hoverMessage, setHoverMessage] = useState(null) // added
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		page: 0,
	// 	}
	// }

	// let timer = null

	const handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	// const handleChangePage = (event, newPage) => {
	// 	setPage(page)
	// 	// this.setState({ page });
	// }

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	// const setHover = (e, n) => {
	// 	e.persist()
	// 	// const { hoverTime } = this.props
	// 	// const { rowHover } = this.state
	// 	if (hoverTime > 0)
	// 		timer = setTimeout(() => {
	// 			if (rowHover) {
	// 				setRowHover(null)
	// 				// this.setState({
	// 				// 	rowHover: null
	// 				// })
	// 				setTimeout(() => {
	// 					setRowHover(e.target)
	// 					setHoverMessage(n)
	// 					// this.setState({ rowHover: e.target, hoverMessage: n })
	// 				}, 200);
	// 			}
	// 			else {
	// 				setRowHover(e.target)
	// 				setHoverMessage(n)
	// 				// this.setState({ rowHover: e.target, hoverMessage: n })
	// 			}
	// 		}, hoverTime);
	// }
	// const unsetTimeout = () => {
	// 	clearTimeout(timer)
	// }
	const unsetHover = () => {
		setRowHover(null)
		// this.setState({
		// 	rowHover: null
		// })
	}
	const renderHover = () => {
		return null //<MessageHover anchorEl={this.state.rowHover} handleClose={this.unsetHover} message={this.state.hoverMessage} />
	}
	// const renderProtocol = (id) => {
	// 	switch (id) {
	// 		case 0:
	// 			return t('registries.fields.protocols.none')
	// 		case 1:
	// 			return t('registries.fields.protocols.mqtt')
	// 		case 2:
	// 			return t('registries.fields.protocols.http')
	// 		case 3:
	// 			return `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}`
	// 		default:
	// 			break;
	// 	}
	// }

	const { classes, handleClick, selected, order, data, orderBy } = props
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
						noCheckbox
						orderBy={orderBy}
						onSelectAllClick={props.handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						t={t}
						classes={classes}
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
							const isSelected = isSelectedFunc(n.id);
							return (
								<TableRow
									hover
									onClick={handleClick(n)}
									// role='checkbox'
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.id}
									selected={isSelected}
									style={{ cursor: 'pointer', padding: 8 }}
								>
									<Hidden lgUp>
										{/* <TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} /> */}
										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.deviceName}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{n.registryName}
													</Caption>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${n.customerName ? n.customerName : t('users.fields.noOrg')}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										{/* <TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} /> */}
										<TC
											noCheckbox
											label={n.id} />
										<TC
											FirstC
											label={n.deviceName}
										/>
										<TC label={n.registryName} />
										<TC label={dateTimeFormatter(n.created, true)} />
										<TC label={n.customerName} />
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
				handleChangePage={this.handleChangePage}
			/>
		</Fragment>
	)
}

MessageTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(devicetableStyles, { withTheme: true })(MessageTable))