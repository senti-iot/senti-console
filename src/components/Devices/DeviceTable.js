import {
	Hidden, Table, TableBody, TableCell,
	// TableHead,
	TableRow, Typography, withStyles
} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from 'react-router-dom';
import EnhancedTableHead from './DeviceTableHeader';
import EnhancedTableToolbar from './TableToolBar';
import { SignalWifi2Bar, SignalWifi2BarLock } from '@material-ui/icons'
import devicetableStyles from "assets/jss/components/devices/devicetableStyles";
import AssignProject from "./AssignProject";

class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'asc',
			orderBy: 'device_id',
			selected: [],
			page: 0,
			rowsPerPage: 5,
			anchorElMenu: null,
			anchorFilterMenu: null,
			openAssignProject: false
		};
	}
	options = () => {
		return [
			{ label: 'Calibrate', func: this.handleCalibrateFlow, single: true },
			{ label: 'Edit', func: this.handleDeviceEdit, single: true },
			{ label: 'Assign To Project', func: this.handleAssignToProject, single: false },
			{ label: 'Export to PDF', func: () => { }, single: false },
			{ label: 'Delete', func: this.handleDeleteProjects, single: false },
		]
	}
	handleAssignToProject = () => {
		this.setState({ openAssignProject: true })
	}
	handleCloseAssignToProject = reload => {
		this.setState({ openAssignProject: false })
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
		// console.log('not implemented')
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
			this.setState({ selected: this.props.data.map(n => n.device_id) });
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
			return ''
		})
		return arr;
	}
	renderIcon = (status) => {
		const { classes } = this.props
		switch (status) {
			case 1: 
				return <SignalWifi2Bar className={classes.yellowSignal}/>
			case 2: 
				return <SignalWifi2Bar className={classes.greenSignal} />
			case 0:
				return <SignalWifi2Bar className={classes.redSignal} />
			case null:
				return <SignalWifi2BarLock className={classes.redSignal} />
			default:
				break;
		}
	}
	render() {
		const { classes, data } = this.props;
		const { order, orderBy, selected, rowsPerPage, page, openAssignProject } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
		return (
			<Paper className={classes.root}>
				<AssignProject open={openAssignProject} handleClose={this.handleCloseAssignToProject} device_id={selected} />
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
					noAdd
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
											 <TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_name ?  n.device_name : "No Name"} 
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_id}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{this.renderIcon(n.liveStatus)}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.organisation ? n.organisation.vcName  : " Unassigned"}
												</Typography>
											</TableCell>
										</Hidden>
										<Hidden lgUp>
											<TableCell className={classes.tableCellID}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_id}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_name ? n.device_name : "No Name"}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCellID}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{this.renderIcon(n.liveStatus)}
												</Typography>
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

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(devicetableStyles)(EnhancedTable));