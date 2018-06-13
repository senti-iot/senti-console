import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';



class EnhancedTableHead extends Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData, classes } = this.props;
		return (
			<TableHead>
				<TableRow>
					<TableCell padding="checkbox"
						className={classes.header}>
						<Checkbox
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={numSelected === rowCount}
							onChange={onSelectAllClick}
							className={classes.checkbox}
						/>
					</TableCell>
					{columnData.map(column => {
						return (
							<TableCell
								key={column.id}

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
										{column.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
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