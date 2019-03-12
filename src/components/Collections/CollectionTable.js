import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, withStyles, Typography
} from '@material-ui/core'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import TableHeader from 'components/Table/TableHeader'
import { connect } from 'react-redux'
import TP from 'components/Table/TP'
import { Info, Caption, ItemG } from 'components';
import { dateFormatter } from 'variables/functions';
import { SignalWifi2Bar } from 'variables/icons'
import CollectionHover from 'components/Hover/CollectionHover';
import { getCollection } from 'variables/dataCollections';
import { getProject } from 'variables/dataProjects';
class CollectionTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 0,
		}
	}

	timer = null

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	handleSelectAllClick = (event, checked) => {
		this.props.handleSelectAllClick(event, checked)
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	isSelected = id => this.props.selected.indexOf(id) !== -1

	setHover = async (e, n) => {
		e.persist()
		const { rowHover } = this.state
		if (rowHover) {
			this.setState({
				rowHover: null
			})
		}

		this.timer = setTimeout(() => {
			getCollection(n.id).then(rs => {
				if (rs.project.id) {
					getProject(rs.project.id).then(rsp => {
						rs.project = rsp
						this.setState({ rowHover: e.target, hoverCollection: rs })
					})
				}
				else {
					this.setState({ rowHover: e.target, hoverCollection: rs })
				}
			})
		}, 700);
	}
	unsetTimeout = () => {
		// this.timer.forEach(e => clearTimeout(e))
		clearTimeout(this.timer)
	}
	unsetHover = () => {
		this.setState({
			rowHover: null
		})
	}
	renderHover = () => {
		return <CollectionHover anchorEl={this.state.rowHover} handleClose={this.unsetHover} collection={this.state.hoverCollection} />
	}

	renderIcon = (status) => {
		const { classes, t } = this.props
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

	render() {
		const { rowsPerPage, handleClick, classes, t, order, orderBy, data, selected, handleCheckboxClick } = this.props
		const { page } = this.state
		let emptyRows;
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
		return (
			<Fragment>
				<div className={classes.tableWrapper} onMouseLeave={this.unsetHover}>
					{this.renderHover()}
					<Table className={classes.table} aria-labelledby='tableTitle'>
						<TableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
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
								const isSelected = this.isSelected(n.id);
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
											<TC checkbox content={this.renderIcon(n.activeDeviceStats ? n.activeDeviceStats.state : null)} />
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
												onMouseEnter={e => { this.setHover(e, n) }}
												onMouseLeave={this.unsetTimeout}
											/>
											<TC content={this.renderIcon(n.activeDeviceStats ? n.activeDeviceStats.state : null)} />
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
					handleChangePage={this.handleChangePage}
				/>
			</Fragment>

		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
	language: state.localization.language,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

CollectionTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(CollectionTable)))