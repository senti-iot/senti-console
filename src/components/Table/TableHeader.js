import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox, Hidden, Typography } from '@material-ui/core'
import classNames from 'classnames'
import thStyles from 'assets/jss/components/table/thStyles';

const TableHeader = props => {
	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};
	const classes = thStyles()
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData, mdDown, customColumn, noCheckbox } = props;
	return (
		<TableHead>
			<TableRow>
				{noCheckbox ? null : <TableCell className={classes.header + ' ' + classes.tablecellcheckbox}>
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={numSelected === rowCount && numSelected > 0}
						disabled={rowCount === 0}
						onChange={onSelectAllClick}
						className={classes.checkbox}
					/>
				</TableCell>}
				<Hidden mdDown>
					{columnData.map((column, i) => {
						let tcClasses = classNames({
							[classes.header]: classes,
							[classes.tableCell]: classes,
							[classes.centered]: classes && column.centered,
							[classes.tablecellcheckbox]: classes && column.checkbox,
							[classes.noCheckbox]: noCheckbox
						})
						return (
							<TableCell
								key={i}
								padding={column.disablePadding ? 'none' : 'default'}
								sortDirection={orderBy === column.id ? order : false}
								className={tcClasses}
							>
								<TableSortLabel
									active={orderBy === column.id}
									direction={order === '' ? 'asc' : order}
									disabled={rowCount === 0}
									onClick={createSortHandler(column.id)}
									classes={{
										root: classes.headerLabelActive, active: classes.headerLabelActive, icon: classNames({
											[classes.hideIcon]: !(orderBy === column.id) ? true : false
										}),


									}}>
									{column.checkbox ? column.label : <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>{column.label}</Typography>}
								</TableSortLabel>
							</TableCell>
						);
					})}
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
									onClick={createSortHandler(columnData[c].id)}
									classes={{
										root: classes.headerLabelActive, active: classes.headerLabelActive, icon: classNames({
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
									onClick={createSortHandler(c.id)}
									classes={{
										root: classes.headerLabelActive, active: classes.headerLabelActive, icon: classNames({
											[classes.hideIcon]: !(orderBy === c.id) ? true : false
										})
									}}>
									{c.label}
								</TableSortLabel>
							</TableCell>
						}) : null
					}
				</Hidden>

			</TableRow>
		</TableHead>
	);
}

TableHeader.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
	columnData: PropTypes.array.isRequired
};

export default TableHeader