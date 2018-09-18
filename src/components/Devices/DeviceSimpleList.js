import React, { Fragment } from "react";
import { Checkbox, Table, TableBody, TableCell, TablePagination, TableRow, withStyles } from '@material-ui/core';
import EnhancedTableHead from 'components/Table/TableHeader';
import EnhancedTableToolbar from 'components/Table/TableToolbar'
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import devicetableStyles from "assets/jss/components/devices/devicetableStyles";
import { SignalWifi2Bar, SignalWifi2BarLock } from '@material-ui/icons'
import { ItemGrid, Info, Caption } from '..';

class DeviceSimpleList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'asc',
			orderBy: '',
			selected: [],
			page: 0,
			rowsPerPage: 5,
			anchorElMenu: null,
			keyword: ""
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
	
	renderIcon = (status) => {
		const { classes } = this.props
		switch (status) {
			case 1:
				return <SignalWifi2Bar className={classes.yellowSignal} />
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
		const { classes, data, t } = this.props
		const { order, orderBy, selected, rowsPerPage, page } = this.state
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
		const tableHead = [
			{ id: "id", label: t("devices.pageTitle") }, 
			// { id: "id", label: t("devices.simpleList.id") }, 
			// { id: "address", label: t("devices.simpleList.address") }, 
			// { id: "liveStatus", label: t("devices.simpleList.status") }, 
			// { id: "totalCount", label: t("devices.simpleList.totalcount") }
		]
		return (
			<Fragment>
				{/* // <Paper className={classes.root}> */}
				<EnhancedTableToolbar
					noFilterIcon
					noAdd
					noDatePickers
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					filters={this.props.filters}
					numSelected={selected.length}
					options={() => []}
					t={t}
				/>
				{/* <div className={classes.tableWrapper}> */}
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
						mdDown={[0]}
						t={t}
					/>
					<TableBody>
						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
							const isSelected = this.isSelected(n.id)
							const { t } = this.props
							return (
								<TableRow
									hover
									onClick={e => { e.stopPropagation(); this.props.history.push('/device/' + n.id)}}
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
									<TableCell classes={{ root: classes.tableCell }}>
										<ItemGrid container zeroMargin noPadding alignItems={"center"}>
											<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
												<Info noWrap paragraphCell={classes.noMargin}>
													{n.name ? n.name : n.id}
												</Info>
											</ItemGrid>
											<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
												<Caption noWrap className={classes.noMargin}>
													{`${n.name ? n.id : t("devices.noName")} - ${n.org ? n.org.name : ''}`}
												</Caption>
											</ItemGrid>
											{/* </ItemGrid> */}
										</ItemGrid>
									</TableCell>
									{/* <TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
											<Checkbox checked={isSelected} />
										</TableCell>
										<TableCell className={classes.tableCell}>
											{n.name ? n.name : t("devices.simpleList.tableCellDeviceName")}
										</TableCell>
										<TableCell className={classes.tableCellID}>
											{n.id}
										</TableCell>
										<Hidden mdDown>
											<TableCell className={classes.tableCell}>
												{n.address ? n.address : t("devices.simpleList.tableCellAddress")}
											</TableCell>
											<TableCell className={classes.tableCell}>
												{this.renderIcon(n.liveStatus)}
											</TableCell>
											<TableCell className={classes.tableCell}>
												{n.totalCount}
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
				{/* </div> */}
				<TablePagination
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					classes={{
						spacer: classes.spacer,
						input: classes.spaceBetween,
						caption: classes.tablePaginationCaption
					}}
					backIconButtonProps={{
						'aria-label': 'Previous Page',
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page',
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
					labelRowsPerPage={t("tables.rowsPerPage")}
					SelectProps={{
						classes: {
							select: classes.SelectIcon
						}
					}}
				/>
			</Fragment>
		);
	}
}
		
DeviceSimpleList.propTypes = {
	classes: PropTypes.object.isRequired,
	data: PropTypes.array.isRequired
};

export default withRouter(withStyles(devicetableStyles)(DeviceSimpleList));