import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, withStyles, Typography
} from '@material-ui/core'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
import TableHeader from 'components/Table/TableHeader'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP'
import { Info, Caption, ItemG } from 'components';
import { dateFormatter } from 'variables/functions';
import { SignalWifi2Bar } from 'variables/icons'
import CollectionHover from 'components/Hover/CollectionHover';
import { getCollection } from 'variables/dataCollections';
import { getProject } from 'variables/dataProjects';

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
// 	language: state.localization.language,
// 	accessLevel: state.settings.user.privileges,
// 	hoverTime: state.settings.hoverTime
// })

const CollectionTable = props => {
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	// const language = useSelector(state => state.localization.language)
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverCollection, setHoverCollection] = useState(null) // added

	let timer = null

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleSelectAllClick = (event, checked) => {
		props.handleSelectAllClick(event, checked)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	const setHover = async (e, n) => {
		e.persist()
		if (hoverTime > 0) {
			if (rowHover) {
				setRowHover(null)
				// this.setState({
				// 	rowHover: null
				// })
			}
			timer = setTimeout(() => {
				getCollection(n.id).then(rs => {
					if (rs.project.id) {
						getProject(rs.project.id).then(rsp => {
							rs.project = rsp
							setRowHover(e.target)
							setHoverCollection(rs)
							// this.setState({ rowHover: e.target, hoverCollection: rs })
						})
					}
					else {
						setRowHover(e.target)
						setHoverCollection(rs)
						// this.setState({ rowHover: e.target, hoverCollection: rs })
					}
				})
			}, hoverTime);
		}
	}
	const unsetTimeout = () => {
		// this.timer.forEach(e => clearTimeout(e))
		clearTimeout(timer)
	}
	const unsetHover = () => {
		setRowHover(null)
		// this.setState({
		// 	rowHover: null
		// })
	}
	const renderHover = () => {
		return <CollectionHover anchorEl={rowHover} handleClose={unsetHover} collection={hoverCollection} />
	}

	const renderIcon = (status) => {
		const { classes, t } = props
		switch (status) {
			case 0:
				return <div title={t('devices.status.red')}>
					<ItemG container justify={'center'}>
						<SignalWifi2Bar className={classes.redSignal} />
					</ItemG>
				</div>
			case 1:
				return <div title={t('devices.status.yellow')}>
					<ItemG container justify={'center'}>
						<SignalWifi2Bar className={classes.yellowSignal} />
					</ItemG>
				</div>
			case 2:
				return <div title={t('devices.status.green')}>
					<ItemG container justify={'center'}>
						<SignalWifi2Bar className={classes.greenSignal} />
					</ItemG>
				</div>
			case null:
				return <div title={t('devices.status.noDevice')}>
					<ItemG container justify={'center'}>
						<SignalWifi2Bar />
					</ItemG>
				</div>
			default:
				break;
		}
	}

	const { handleClick, classes, t, order, orderBy, data, selected, handleCheckboxClick } = props
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
						customColumn={
							[{
								id: 'activeDeviceStats.state',
								label: <ItemG container title={t('collections.fields.status')} justify={'center'}>
									<SignalWifi2Bar />
								</ItemG>, checkbox: true
							},
							{
								id: 'name', label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('collections.fields.collection')}
								</Typography>
							}]
						}
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
										<TC checkbox content={renderIcon(n.activeDeviceStats ? n.activeDeviceStats.state : null)} />
										<TC content={
											<ItemG container alignItems={'center'}>
												<ItemG>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
													<ItemG container>
														<Caption noWrap className={classes.noMargin}>
															{`${n.org ? n.org.name : ''} `}
														</Caption>
													</ItemG>
												</ItemG>
											</ItemG>
										}
										/>
									</Hidden>
									<Hidden mdDown >
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC label={n.id} />
										<TC FirstC label={n.name}
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
										/>
										<TC content={renderIcon(n.activeDeviceStats ? n.activeDeviceStats.state : null)} />
										<TC label={dateFormatter(n.created)} />
										<TC label={n.devices ? n.devices[0] ? dateFormatter(n.devices[0].start) : '' : ''} />
										<TC label={n.org ? n.org.name : ''} />
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

CollectionTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(devicetableStyles, { withTheme: true })(CollectionTable))