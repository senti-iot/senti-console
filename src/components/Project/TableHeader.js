import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { Hidden, Typography } from '@material-ui/core';



class EnhancedTableHead extends Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData, classes } = this.props;
		return (
			<TableHead className={classes.tableHead}>
				<TableRow>
					<TableCell padding="checkbox"
						className={classes.header + " " + classes.tablecellcheckbox}>
						<Checkbox
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={numSelected === rowCount}
							onChange={onSelectAllClick}
							className={classes.checkbox}
						/>
					</TableCell>
					<Hidden mdDown>
						{columnData.map((column, i) => {
							return (
								<TableCell
									key={i}
									// numeric={column.numeric}
									padding={column.disablePadding ? 'none' : 'default'}
									sortDirection={orderBy === column.id ? order : false}
									className={classes.header + " " + classes.tableCell}
								>
									<Tooltip
										title="Sort"
										placement={column.numeric ? 'bottom-end' : 'bottom-start'}
										enterDelay={300}
									>
										<TableSortLabel
											active={orderBy === column.id}
											direction={order}
											onClick={this.createSortHandler(column.id)}
											classes={
												{
													root: classes.HeaderLabelActive,
													active: classes.HeaderLabelActive

												}
											}
										>
											<Typography paragraph classes={{ root: classes.paragraphCell + " " + classes.headerCell }}>{column.label}</Typography>
										</TableSortLabel>
									</Tooltip>
								</TableCell>
							);
						}, this)}
					</Hidden>
					<Hidden lgUp>
						{
							<TableCell
								key={columnData[0].id}

								// numeric={columnData[0].numeric}
								padding={columnData[0].disablePadding ? 'none' : 'default'}
								sortDirection={orderBy === columnData[0].id ? order : false}
								className={classes.header + " " + classes.tableCell}
							>
								<Tooltip
									title="Sort"
									placement={columnData[0].numeric ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={orderBy === columnData[0].id}
										direction={order}
										onClick={this.createSortHandler(columnData[0].id)}
										classes={
											{
												root: classes.HeaderLabelActive,
												active: classes.HeaderLabelActive

											}
										}
									>
										<Typography paragraph classes={{ root: classes.paragraphCell + " " + classes.headerCell }}>{columnData[0].label}</Typography>
									</TableSortLabel>
								</Tooltip>
							</TableCell>

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
};

export default EnhancedTableHead