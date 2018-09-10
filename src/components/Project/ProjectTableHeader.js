import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox, Hidden, Typography } from "@material-ui/core"

class EnhancedTableHead extends Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData, classes } = this.props;
		console.log(columnData)
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
									padding={column.disablePadding ? 'none' : 'default'}
									sortDirection={orderBy === column.id ? order : false}
									className={classes.header + " " + classes.tableCell}>
									<TableSortLabel
										active={orderBy === column.id}
										direction={order}
										onClick={this.createSortHandler(column.id)}
										classes={{ root: classes.HeaderLabelActive, active: classes.HeaderLabelActive }}>
										<Typography paragraph classes={{ root: classes.paragraphCell + " " + classes.headerCell }}>{column.label}</Typography>
									</TableSortLabel>
								</TableCell>
							);
						}, this)}
					</Hidden>
					<Hidden lgUp>
						{	<TableCell
							padding={columnData[0].disablePadding ? 'none' : 'default'}
							sortDirection={orderBy === columnData[1].id ? order : false}
							className={classes.header + " " + classes.tableCellID}
						>
							<TableSortLabel
								active={orderBy === columnData[0].id}
								direction={order}
								onClick={this.createSortHandler(columnData[0].id)}
								classes={{ root: classes.HeaderLabelActive, active: classes.HeaderLabelActive }}>
								<Typography paragraph classes={{ root: classes.paragraphCell + " " + classes.headerCell }}>{columnData[0].label}</Typography>
							</TableSortLabel>
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