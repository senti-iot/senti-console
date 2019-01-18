import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from 'components'
import { connect } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';

class ProjectTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
		}
	}

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	isSelected = id => this.props.selected.indexOf(id) !== -1

	render() {
		const { classes, rowsPerPage, handleClick, selected, t, order, data, orderBy, handleCheckboxClick } = this.props
		const { page } = this.state
		let emptyRows;
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

		return (
			<Fragment>
				<div className={classes.tableWrapper}>
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
									id: 'title',
									label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
										{t('collections.fields.project')}
									</Typography>
								}
							]}
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
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{n.title}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.org ? n.org.name : t('users.fields.noOrg')}`}
														</Caption>
													</ItemGrid>
												</ItemGrid>
											}/>
										</Hidden>

										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
											<TC FirstC label={n.title}/>
											<TC label={dateFormatter(n.startDate)}/>
											<TC label={dateFormatter(n.endDate)}/>
											<TC label={dateFormatter(n.created)}/>
											<TC label={dateFormatter(n.modified)}/>
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
})

const mapDispatchToProps = {

}

ProjectTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(ProjectTable)))