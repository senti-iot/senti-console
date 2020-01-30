import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
// import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption, ItemG } from 'components'
import { Block, CheckCircle, CellWifi } from 'variables/icons'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import SensorHover from 'components/Hover/SensorHover';
import { dateFormatter } from 'variables/functions';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
// 	hoverTime: state.settings.hoverTime
// })

const SensorTable = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverSensor, setHoverSensor] = useState(null) // added
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

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	const setHover = (e, n) => {
		e.persist()
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover) {
					setRowHover(null)
					// this.setState({
					// 	rowHover: null
					// })
					setTimeout(() => {
						setRowHover(e.target)
						setHoverSensor(n)
						// this.setState({ rowHover: e.target, hoverSensor: n })
					}, 200);
				}
				else {
					setRowHover(e.target)
					setHoverSensor(n)
					// this.setState({ rowHover: e.target, hoverSensor: n })
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
		return <SensorHover anchorEl={rowHover} handleClose={unsetHover} device={hoverSensor} />
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
	const renderSmallCommunication = (val) => {
		const { classes } = props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /></ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /></ItemG>
			default:
				break;
		}
	}
	const renderCommunication = (val) => {
		const { classes } = props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> {t('sensors.fields.communications.blocked')}</ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> {t('sensors.fields.communications.allowed')}</ItemG>
			default:
				break;
		}
	}
	const handleSelectAllClick = (event, checked) => {
		const { data } = props
		let selected = data.map(d => d.id)
		props.handleSelectAllClick(selected, checked)
	}
	const { classes, handleClick, selected, order, data, orderBy, handleCheckboxClick } = props
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
								id: 'communication',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									<CellWifi />
								</Typography>
							},
							{
								id: 'name',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('devices.pageTitle')}
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
										<TC checkbox content={renderSmallCommunication(n.communication)} />
										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${n.reg_name} - ${dateFormatter(n.created)}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC checkbox label={n.id} />
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											FirstC label={n.name} />
										<TC label={n.uuid} />
										<TC content={renderCommunication(n.communication)} />
										<TC label={n.reg_name} />
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

SensorTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(devicetableStyles, { withTheme: true })(SensorTable))