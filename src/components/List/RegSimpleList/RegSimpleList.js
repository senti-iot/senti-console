import { Checkbox, Hidden, Paper, Table, TableBody, TableCell, TablePagination, TableRow, withStyles } from '@material-ui/core';
import devicetableStyles from "assets/jss/components/devices/devicetableStyles";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from 'react-router-dom';
import { dateTimeFormatter } from "variables/functions";
import EnhancedTableHead from '../../Project/TableHeader';
import EnhancedTableToolbar from '../../Project/TableToolBar';


class RegSimpleList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'desc',
			orderBy: 'interval',
			selected: [],
			page: 0,
			rowsPerPage: 5,
			anchorElMenu: null
		};
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
		// { id: "name", label: "Name" },
		// { id: "id", label: "ID" },
		// { id: "liveStatus", label: "Status" },
		// { id: "org", label: "Organisation" }
		const tableHead = [{ id: "name", label: "Name" }, { id: "count", label: "Count" }, { id: "interval", label: "Interval" }, { id: "registered", label: "Registered" }]
		return (
			<Paper className={classes.root}>
				<EnhancedTableToolbar
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					handleFilterKeyword={this.props.handleFilterKeyword}
					suggestions={this.props.suggestions ? this.props.suggestions : []}
					filters={this.props.filters}
					noFilterIcon
					noAdd
					noDatePickers
					numSelected={selected.length}
					options={() => []}
				/>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data.length}
							columnData={tableHead}
							classes={classes}
						/>
						<TableBody>
							{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/device/reg/' + n.id) }}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={i}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
											<Checkbox checked={isSelected} />
										</TableCell>
										<TableCell className={classes.tableCell}>
											{n.name ? n.name : n.id}
										</TableCell>
										<TableCell className={classes.tableCellID}>
											{n.count}
										</TableCell>
										<Hidden mdDown>
											<TableCell className={classes.tableCell}>
												{dateTimeFormatter(n.interval, false)}
											</TableCell>
											<TableCell className={classes.tableCell}>
												{dateTimeFormatter(n.registered, true)}
											</TableCell>
										</Hidden>
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
					labelRowsPerPage={<Hidden mdDown>Rows per page</Hidden>}
				/>
			</Paper>
		);
	}
}

RegSimpleList.propTypes = {
	classes: PropTypes.object.isRequired,
	data: PropTypes.array.isRequired
};

export default withRouter(withStyles(devicetableStyles)(RegSimpleList));