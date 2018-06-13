import React from "react";
import {
	withStyles,
	Table,
	// TableHead,
	TableRow,
	TableBody,
	TableCell
} from "@material-ui/core";
import EnhancedTableHead from './TableHeader';
import EnhancedTableToolbar from './TableToolBar'
import PropTypes from "prop-types";
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { headerColor, primaryColor } from "assets/jss/material-dashboard-react";
var moment = require('moment')

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
	},
	table: {
		minWidth: 0,
	},
	tableWrapper: {
		overflowX: 'auto',
	},
	header: {
		// padding: 0,
		backgroundColor: headerColor,
		color: '#fff'
	},
	checkbox: {
		color: 'white',
		'&$checked': {
			color: primaryColor
		},
	},
	checked: {},
	HeaderLabelActive: {
		color: '#fff',
		"&:hover": {
			color: primaryColor
		},
		"&:focus": {
			color: "#fff"
		}
	},
	tableCell: {
		padding: 0
	}
});

class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'asc',
			orderBy: 'calories',
			selected: [],
			page: 0,
			rowsPerPage: 5,
			anchorElMenu: null
		};
	}
	dateFormatter = (date) => {
		var a = moment(date).format("DD.MM.YYYY")
		// console.log(a)
		return a
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget });
	};
	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}
	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		const data =
			order === 'desc'
				? this.props.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
				: this.props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

		this.setState({ data, order, orderBy });
	};

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.data.map(n => n.id) });
			return;
		}
		this.setState({ selected: [] });
	};

	handleClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	isSelected = id => this.state.selected.indexOf(id) !== -1;

	render() {
		const { classes, data } = this.props;
		const { order, orderBy, selected, rowsPerPage, page } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<EnhancedTableToolbar
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length} />
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data.length}
							columnData={this.props.tableHead}
							classes={classes}
						/>
						<TableBody>
							{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/project/' + n.id) }}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<TableCell padding="checkbox" onClick={e => this.handleClick(e, n.id)}>
											<Checkbox checked={isSelected} />
										</TableCell>
										<TableCell className={classes.tableCell}>
											{n.title}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{n.description}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{this.dateFormatter(n.open_date)}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{this.dateFormatter(n.close_date)}
										</TableCell>
										{/* <TableCell className={classes.tableCell}>
											{n.progress}
										</TableCell> */}
										<TableCell className={classes.tableCell}>
											{this.dateFormatter(n.created)}
										</TableCell>
										{/* <TableCell className={classes.tableCell}>
											{n.last_modified}
										</TableCell> */}

									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={8} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page',
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page',
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</Paper>
		);
	}
}

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);