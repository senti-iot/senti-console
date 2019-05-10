import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
// import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption, ItemG } from 'components'
import { Block, CheckCircle, CellWifi } from 'variables/icons'
import { connect } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import SensorHover from 'components/Hover/RegistryHover';
import { dateFormatter } from 'variables/functions';

class SensorTable extends React.Component {
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

	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	isSelected = id => this.props.selected.indexOf(id) !== -1

	setHover = (e, n) => {
		e.persist()
		const { hoverTime } = this.props
		const { rowHover } = this.state
		if (hoverTime > 0)
		 this.timer = setTimeout(() => {
				if (rowHover) {
					this.setState({
						rowHover: null
					})
					setTimeout(() => {
						this.setState({ rowHover: e.target, hoverSensor: n })
					}, 200);
				}
				else {
					this.setState({ rowHover: e.target, hoverSensor: n })
				}
			}, hoverTime);
	}
	unsetTimeout = () => {
		clearTimeout(this.timer)
	}
	unsetHover = () => {
		this.setState({
			rowHover: null
		})
	}
	renderHover = () => {
		return <SensorHover anchorEl={this.state.rowHover} handleClose={this.unsetHover} project={this.state.hoverSensor} />
	}
	renderProtocol = (id) => {
		const { t } = this.props
		switch (id) {
			case 0:
				return t('registries.fields.protocols.none')
			case 1: 
				return t('registries.fields.protocols.mqtt')
			case 2: 
				return t('registries.fields.protocols.http')
			case 3: 
				return `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}`
			default:
				break;
		}
	}
	renderSmallCommunication = (val) => {
		const { classes } = this.props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /></ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /></ItemG>
			default:
				break;
		}
	}
	renderCommunication = (val) => {
		const { t, classes } = this.props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> {t('sensors.fields.communications.blocked')}</ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> {t('sensors.fields.communications.allowed')}</ItemG>
			default:
				break;
		}
	}
	render() {
		const { classes, rowsPerPage, handleClick, selected, t, order, data, orderBy, handleCheckboxClick } = this.props
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
							onSelectAllClick={this.props.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
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
								const isSelected = this.isSelected(n.id);
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
											<TC checkbox content={this.renderSmallCommunication(n.communication)}/>
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{n.name}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														{/* {this.renderCommunication(n.communication)} */}
														<Caption noWrap className={classes.noMargin}>
															{`${n.reg_name} - ${dateFormatter(n.created)}`}
															{/* {`${n.org ? n.org.name : t('users.fields.noOrg')}`} */}
														</Caption>
													</ItemGrid>
												</ItemGrid>
											}/>
										</Hidden>

										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
											<TC checkbox label={n.id}/>
											<TC 
												onMouseEnter={e => { this.setHover(e, n) }}
												onMouseLeave={this.unsetTimeout}
												FirstC label={n.name}/>
											{/* <TC label={n.region}/> */}
											<TC label={this.renderCommunication(n.communication)} />
											<TC label={dateFormatter(n.created)} />
											<TC label={n.reg_id} />
											{/* <TC label={dateFormatter(n.endDate)}/> */}
											{/* <TC label={dateFormatter(n.created)}/> */}
											{/* <TC label={dateFormatter(n.modified)}/> */}
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
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
	hoverTime: state.settings.hoverTime
})

const mapDispatchToProps = {

}

SensorTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(SensorTable)))