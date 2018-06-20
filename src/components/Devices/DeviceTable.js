import React from "react";
import {
	withStyles,
	Table,
	// TableHead,
	TableRow,
	TableBody,
	TableCell,
	Hidden,
	Typography
} from "@material-ui/core";
import EnhancedTableHead from './DeviceTableHeader';
import EnhancedTableToolbar from './TableToolBar'
import PropTypes from "prop-types";
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { headerColor, primaryColor } from "assets/jss/material-dashboard-react";
import { withRouter } from 'react-router';
var moment = require('moment')

const styles = theme => ({
	headerCell: {
		color: "inherit",
	},
	paragraphCell: {
		margin: 0,
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis"
	},
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		borderRadius: "3px"
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
		padding: 4,
		minWidth: 130,
		maxWidth: 200
	},
	tablecellcheckbox: {
		padding: 0,
		width: '50px'
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
			anchorElMenu: null,
			anchorFilterMenu: null
		};
	}
	dateFormatter = (date) => {
		var a = moment(date).format("DD.MM.YYYY")
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
	handleFilterMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: e.currentTarget })
	}
	handleFilterMenuClose = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: null })
	}
	handleFilter = e => {
		console.log('not implemented')
	}
	handleSearch = value => {
		this.setState({
			searchFilter: value
		})
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
	handleDeleteProjects = async () => {
		this.props.deleteProjects(this.state.selected)
		this.setState({
			selected: [],
			anchorElMenu: null
		})
	}
	isSelected = id => this.state.selected.indexOf(id) !== -1;
	options = [
		{ label: 'Export to PDF', func: () => { } },
		{ label: 'Delete', func: this.handleDeleteProjects }
	];
	suggestionSlicer = (obj) => {
		var arr = [];

		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				var innerObj = {};
				if (typeof obj[prop] === 'object') {
					arr.push(...this.suggestionSlicer(obj[prop]))
				}
				else {
					innerObj = {
						id: prop.toString().toLowerCase(),
						label: obj[prop] ? obj[prop].toString() : ''
					};
					arr.push(innerObj)
				}
			}
		}
		return arr;
	}
	suggestionGen = (arrayOfObjs) => {
		let arr = [];
		arrayOfObjs.map(obj => {
			arr.push(...this.suggestionSlicer(obj))
			// for (var prop in obj) {
			// 	if (obj.hasOwnProperty(prop)) {
			// 		var innerObj = null
			// 		if (typeof obj[prop] === 'object') { 

			// 			// var p = obj[prop];
			// 			// for (var pr in p)
			// 			// 	if (p.hasOwnProperty(pr)) { 
			// 			// 		 innerObj = {
			// 			// 			id: pr.toString().toLowerCase(),
			// 			// 			label: p[pr].toString()
			// 			// 		}
			// 			// 	}
			// 		}
			// 		else {	
						
			// 		}
			// 		if (innerObj)
			// 			arr.push(innerObj) 
			// 	}
			// }
			return ''
		})
		console.log(arr)

		return arr;
	}
	render() {
		const { classes, data } = this.props;
		const { order, orderBy, selected, rowsPerPage, page } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<EnhancedTableToolbar
					anchorElMenu={this.state.anchorElMenu}
					anchorFilterMenu={this.state.anchorFilterMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					handleFilterMenuOpen={this.handleFilterMenuOpen}
					handleFilterMenuClose={this.handleFilterMenuClose}
					handleFilterKeyword={this.props.handleFilterKeyword}
					handleFilterStartDate={this.props.handleFilterStartDate}
					handleFilterEndDate={this.props.handleFilterEndDate}
					filters={this.props.filters}
					filterOptions={this.props.tableHead}
					numSelected={selected.length}
					options={this.options}
					suggestions={this.suggestionGen(data)}
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
							columnData={this.props.tableHead}
							classes={classes}
						/>
						<TableBody>
							{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.device_id);
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/device/' + n.device_id) }}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.device_id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.device_id)}>
											<Checkbox checked={isSelected} />
										</TableCell>
										<Hidden mdDown>
											{Object.keys(n).map((k, i) => {
												return <TableCell key={i} className={classes.tableCell}>
													<Typography paragraph classes={{ root: classes.paragraphCell }}>
														{n[k] !== null ? (k === 'organisation' ? n[k].vcName ? n[k].vcName : "Unnasigned" : k === 'project' ? n[k].title : n[k]) : "No Name"} 
													</Typography>
												</TableCell>
											})}
										</Hidden>
										<Hidden lgUp>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_id}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_name}
												</Typography>
											</TableCell>
										</Hidden>
										{/* <TableCell className={classes.tableCell}>
											<Typography paragraph classes={{ root: classes.paragraphCell }}>
												{n.title}
											</Typography>
										</TableCell> */}
										{/* <Hidden mdDown>
											<TableCell className={classes.tableCell}>
												<Typography paragraph title={n.description} classes={{ root: classes.paragraphCell }}>
													{n.description}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{this.dateFormatter(n.open_date)}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{this.dateFormatter(n.close_date)}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{this.dateFormatter(n.created)}	</Typography>
											</TableCell>
										</Hidden> */}
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

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(EnhancedTable));