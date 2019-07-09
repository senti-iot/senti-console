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
import { ItemGrid, Info, Caption } from 'components'
import { connect } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
// import MessageHover from 'components/Hover/MessageHover';
import { dateTimeFormatter } from 'variables/functions';

class MessageTable extends React.Component {
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
						this.setState({ rowHover: e.target, hoverMessage: n })
					}, 200);
				}
				else {
					this.setState({ rowHover: e.target, hoverMessage: n })
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
		return null //<MessageHover anchorEl={this.state.rowHover} handleClose={this.unsetHover} message={this.state.hoverMessage} />
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
									id: 'name',
									label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
										{t('tokens.fields.name')}
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
										onClick={handleClick(n)}
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
															{n.created}
														</Caption>
													</ItemGrid>
												</ItemGrid>
											}/>
										</Hidden>

										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
											<TC 
												checkbox
												label={n.id}/>
											<TC
												FirstC
												label={n.name} 
											/>
											<TC label={dateTimeFormatter(n.created, true)} />
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

MessageTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(MessageTable)))