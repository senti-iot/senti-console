import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography,
} from '@material-ui/core'
import React, { Fragment, useState } from 'react'
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
import sensorsStyles from 'assets/jss/components/sensors/sensorsStyles'

const SensorTable = props => {
	//Hooks
	const t = useLocalization()
	const classes = sensorsStyles()
	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	//State
	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverSensor, setHoverSensor] = useState(null) // added
	//Const
	const { handleClick, selected, order, data, orderBy, handleCheckboxClick } = props

	let timer = null
	//handlers

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	}

	const isSelectedFunc = uuid => props.selected.indexOf(uuid) !== -1

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
						setHoverSensor(n)
						setRowHover(e.target)
						// this.setState({ rowHover: e.target, hoverSensor: n })
					}, 200);
				}
				else {
					setHoverSensor(n)
					setRowHover(e.target)
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
		let selected = data.map(d => d.uuid)
		props.handleSelectAllClick(selected, checked)
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
							const isSelected = isSelectedFunc(n.uuid);
							return (
								<TableRow
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
														{`${n.deviceType.name} - ${dateFormatter(n.created)}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.uuid)} />} />
										{/* <TC checkbox label={n.uuid} /> */}
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											FirstC label={n.name} />
										<TC label={n.uuid} />
										<TC content={renderCommunication(n.communication)} />
										<TC label={n.registry.name} />
										<TC label={n.deviceType.name} />
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
				t={t}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}

export default SensorTable