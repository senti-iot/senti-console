import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography,
} from '@material-ui/core';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
// import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
// import { withRouter } from 'react-router-dom';
import EnhancedTableHead from 'components/Table/TableHeader'
import { useSelector } from 'react-redux'
import { Info, Caption, ItemG } from 'components';
import TC from 'components/Table/TC'
import TP from 'components/Table/TP';
import DeviceHover from 'components/Hover/DeviceHover';
import { useLocalization } from 'hooks';

/**
 * Unused
 */

const DeviceTable = props => {
	const t = useLocalization()
	const classes = devicetableStyles()

	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null)
	const [hoverDevice, setHoverDevice] = useState(null)
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		page: 0,
	// 		rowHover: null
	// 	};
	// }

	let timer = null

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
		// this.setState({ page });
	};

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1;

	const setHover = (e, n) => {
		// e.persist()
		let target = e.target
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover !== null) {
					if (rowHover.id !== n.id) {
						setRowHover(null)
						// this.setState({
						// 	rowHover: null
						// })
						setTimeout(() => {
							setHoverDevice(n)
							setRowHover(target)
							// this.setState({ rowHover: target, hoverDevice: n })
						}, 200);
					}
				}
				else {
					setHoverDevice(n)
					setRowHover(target)
					// this.setState({ rowHover: target, hoverDevice: n })
				}
			}, hoverTime);
	}
	const unsetTimeout = () => {
		clearTimeout(timer)
	}
	const unsetHover = () => {
		// console.trace()
		setRowHover(null)
		// this.setState({
		// 	rowHover: null
		// })
	}
	const renderHover = () => {
		return <DeviceHover anchorEl={rowHover} handleClose={unsetHover} device={hoverDevice} />
	}

	const renderIcon = (status) => {
		const { classes } = props
		switch (status) {
			case 1:
				return <ItemG container justify={'center'} title={t('devices.status.yellow')}>
					<SignalWifi2Bar className={classes.yellowSignal} />
				</ItemG>
			case 2:
				return <ItemG container justify={'center'} title={t('devices.status.green')}>
					<SignalWifi2Bar className={classes.greenSignal} />
				</ItemG>
			case 0:
				return <ItemG container justify={'center'} title={t('devices.status.red')}>
					<SignalWifi2Bar className={classes.redSignal} />
				</ItemG>
			case null:
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}

	const { selected, data, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick } = props;
	let emptyRows
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
	return (
		<Fragment>
			<div className={classes.tableWrapper} onMouseLeave={unsetHover}>
				{renderHover()}
				<Table className={classes.table} aria-labelledby='tableTitle'>
					<EnhancedTableHead
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						classes={classes}
						customColumn={[
							{
								id: 'liveStatus', label: <ItemG container justify={'center'}>
									<SignalWifi2Bar />
								</ItemG>, checkbox: true
							},
							{
								id: 'id',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('collections.fields.device')}
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
										<TC checkbox content={renderIcon(n.liveStatus)} />
										<TC content={
											<ItemG container alignItems={'center'}>
												<ItemG xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name ? n.name : n.id}
													</Info>
												</ItemG>
												<ItemG xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${n.name ? n.id : t('devices.noName')} - ${n.org ? n.org.name : ''}`}
													</Caption>
												</ItemG>
											</ItemG>} />
									</Hidden>
									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											label={n.name ? n.name : t('devices.noName')} />
										<TC label={n.id} />
										<TC content={renderIcon(n.liveStatus)} />
										<TC label={n.address ? n.address : t('devices.noAddress')} />
										<TC label={n.org ? n.org.name : t('no.org')} />
										<TC label={n.dataCollection ? t('devices.fields.notfree') : t('devices.fields.free')} />
									</Hidden>
								</TableRow>
							);
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
				// rowsPerPage={rowsPerPage}
				page={page}
				t={t}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	);
}

DeviceTable.propTypes = {
	// classes: PropTypes.object.isRequired,
};

export default DeviceTable