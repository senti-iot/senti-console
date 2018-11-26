import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox, Hidden, Typography } from '@material-ui/core'
import classNames from 'classnames'
class EnhancedTableHead extends Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData, classes, mdDown, customColumn } = this.props;
		return (
			<TableHead>
				<TableRow>
					<TableCell className={classes.header + ' ' + classes.tablecellcheckbox}>
						<Checkbox
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={numSelected === rowCount && numSelected > 0}
							disabled={rowCount === 0}
							onChange={onSelectAllClick}
							className={classes.checkbox}
						/>
					</TableCell>
					<Hidden mdDown>
						{columnData.map((column, i) => {
							return (
								<TableCell
									key={i}
									padding={column.disablePadding ? 'none' : 'default'}
									sortDirection={orderBy === column.id ? order : false}
									className={`${classes.header} ${classes.tableCell} ${column.centered ? classes.centered : ''} ${column.checkbox ? classes.tablecellcheckbox : ''}`}
									numeric={column.numeric ? true : false}>
									<TableSortLabel
										active={orderBy === column.id}
										direction={order}
										disabled={rowCount === 0}
										onClick={this.createSortHandler(column.id)}
										classes={{
											root: classes.HeaderLabelActive, active: classes.HeaderLabelActive, icon: classNames({
												[classes.hideIcon]: !(orderBy === column.id) ? true : false
											}),
											
											
										}}>
										{column.checkbox ? column.label : <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>{column.label}</Typography>}
									</TableSortLabel>
								</TableCell>
							);
						}, this)}
					</Hidden>
					<Hidden lgUp>
						{
							mdDown ? mdDown.map(c => {
								return <TableCell
									key={columnData[c].id}
									padding={columnData[c].disablePadding ? 'none' : 'default'}
									sortDirection={orderBy === columnData[c].id ? order : false}
									className={classes.header + ' ' + classes.tableCell}>
									<TableSortLabel
										active={orderBy === columnData[c].id}
										direction={order}
										onClick={this.createSortHandler(columnData[c].id)}
										classes={{
											root: classes.HeaderLabelActive, active: classes.HeaderLabelActive, icon: classNames({
												[classes.hideIcon]: !(orderBy === columnData[c].id) ? true : false
											})
										}}>
										<Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>{columnData[c].label}</Typography>
									</TableSortLabel>
								</TableCell>
							}) : customColumn ? customColumn.map(c => {
								return <TableCell
									key={c.id}
									padding={c.checkbox ? 'checkbox' : 'default'}
									sortDirection={orderBy === c.id ? order : false}
									className={c.checkbox ? classes.header + ' ' + classes.tablecellcheckbox : classes.header + ' ' + classes.tableCell}>
									<TableSortLabel
										active={orderBy === c.id}
										direction={order}
										onClick={this.createSortHandler(c.id)}
										classes={{
											root: classes.HeaderLabelActive, active: classes.HeaderLabelActive, icon: classNames({
												[classes.hideIcon]: !(orderBy === c.id) ? true : false
											})
										}}>
									</TableSortLabel>
								</TableCell>
							}) : null
						
						}
					</Hidden>

				</TableRow>
			</TableHead>
		);
	}
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
	columnData: PropTypes.array.isRequired,
	classes: PropTypes.object.isRequired 
};

export default EnhancedTableHead