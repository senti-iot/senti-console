import {
	Checkbox, Hidden, Paper, Table, TableBody, TableCell,
	TableRow, Typography, withStyles, Dialog, DialogTitle, DialogContent,
	DialogContentText, DialogActions, Button, IconButton, Menu, MenuItem
} from "@material-ui/core";
import { SignalWifi2Bar, SignalWifi2BarLock, Add, FilterList } from 'variables/icons';
import devicetableStyles from "assets/jss/components/devices/devicetableStyles";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { withRouter } from 'react-router-dom';
import AssignProject from "./AssignProject";
import AssignOrg from "./AssignOrg";
import EnhancedTableHead from '../Table/TableHeader'
import EnhancedTableToolbar from '../Table/TableToolbar';
import { connect } from 'react-redux'
import { ItemGrid, Info, Caption } from '..';
import TC from 'components/Table/TC'
import { updateDevice } from 'variables/dataDevices'
import { boxShadow } from "assets/jss/material-dashboard-react";
import TP from 'components/Table/TP';
class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'desc',
			orderBy: 'id',
			selected: [],
			page: 0,
			rowsPerPage: props.rowsPerPage,
			anchorElMenu: null,
			anchorFilterMenu: null,
			openAssignProject: false,
			openAssignOrg: false,
			openUnassign: false,
		};
	}

	handleCalibrateFlow = () => {
		this.props.history.push(`/device/${this.state.selected[ 0 ]}/calibrate`)
	}
	options = () => {
		const { t, accessLevel } = this.props
		if (accessLevel.apisuperuser)
			return [
				{ label: t("menus.edit"), func: this.handleDeviceEdit, single: true },
				{ label: t("menus.assign"), func: this.handleAssignToProject, single: false },
				{ label: t("menus.assignOrg"), func: this.handleAssignToOrg, single: false },
				{ label: t("menus.unassign"), func: this.handleOpenUnassignDialog, single: false },
				{ label: t("menus.exportPDF"), func: () => { }, single: false },
				{ label: t("menus.calibrate"), func: this.handleCalibrateFlow, single: true },
				{ label: t("menus.delete"), func: this.handleDeleteProjects, single: false }, ]
		else {
			return [
				{ label: t("menus.exportPDF"), func: () => { }, single: false }
			]
		}
	}
	handleDeviceEdit = () => {
		const { selected } = this.state
		this.props.history.push({
			pathname: `/device/${selected[0]}/edit`,
			state: { backUrl: '/404' }
		})
	}
	handleAssignToOrg = () => {
		this.setState({ openAssignOrg: true })
	}
	handleCloseAssignToOrg = reload => {
		this.setState({ openAssignOrg: false })
		this.props.reload()
	}
	handleAssignToProject = () => {
		this.setState({ openAssignProject: true })
	}
	handleCloseAssignToProject = reload => {
		this.setState({ openAssignProject: false })
		this.props.reload()
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
	}
	handleSearch = value => {
		this.setState({
			searchFilter: value
		})
	}
	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

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
	handleUnassignDevices = async () => {
		const { data } = this.props
		const { selected } = this.state
		var devices = selected.map(s => data[ data.findIndex(d => d.id === s) ])

		devices.forEach(async d => {
			await updateDevice({
				...d,
				project: {
					id: 0
				}
			}).then(rs => this.handleCloseAssignToProject())
		})
	}

	handleOpenUnassignDialog = () => {
		this.setState({ openUnassign: true, anchorElMenu: null })
	}

	handleCloseUnassignDialog = () => {
		this.setState({ openUnassign: false })
	}

	isSelected = id => this.state.selected.indexOf(id) !== -1;

	// suggestionSlicer = (obj) => {
	// 	var arr = [];

	// 	for (var prop in obj) {
	// 		if (obj.hasOwnProperty(prop)) {
	// 			var innerObj = {};
	// 			if (typeof obj[ prop ] === 'object') {
	// 				arr.push(...this.suggestionSlicer(obj[ prop ]))
	// 			}
	// 			else {
	// 				innerObj = {
	// 					id: prop.toString().toLowerCase(),
	// 					label: obj[ prop ] ? obj[ prop ].toString() : ''
	// 				};
	// 				arr.push(innerObj)
	// 			}
	// 		}
	// 	}
	// 	return arr;
	// }
	// suggestionGen = (arrayOfObjs) => {
	// 	let arr = [];
	// 	arrayOfObjs.map(obj => {
	// 		arr.push(...this.suggestionSlicer(obj))
	// 		return ''
	// 	})
	// 	return arr;
	// }
	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1:
				return <div title={ t("devices.status.yellow") }><SignalWifi2Bar className={ classes.yellowSignal } /></div>
			case 2:
				return <div title={ t("devices.status.green") }><SignalWifi2Bar className={ classes.greenSignal } /></div>
			case 0:
				return <div title={ t("devices.status.red") }><SignalWifi2Bar className={ classes.redSignal } /></div>
			case null:
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}

	renderTableToolBarContent = () => {
		const { classes, tableHead, t } = this.props
		const { anchorFilterMenu } = this.state
		return <Fragment>
			<IconButton aria-label="Add new organisation" onClick={ this.addNewOrg }>
				<Add />
			</IconButton>
			<IconButton
				className={ classes.secondAction }
				aria-label={ t("tables.filter") }
				aria-owns={ anchorFilterMenu ? "filter-menu" : null }
				onClick={ this.handleFilterMenuOpen }>
				<FilterList />
			</IconButton>
			<Menu
				id="filter-menu"
				anchorEl={ anchorFilterMenu }
				open={ Boolean(anchorFilterMenu) }
				onClose={ this.handleFilterMenuClose }
				PaperProps={ { style: { width: 200, boxShadow: boxShadow } } }>

				{ tableHead.map(option => {
					return <MenuItem key={ option.id } onClick={ this.handleFilter }>
						{ option.label }
					</MenuItem>
				}) }
			</Menu>
		</Fragment>
	}
	renderConfirmUnassign = () => {
		const { openUnassign, selected } = this.state
		const { data, t } = this.props
		return <Dialog
			open={ openUnassign }
			onClose={ this.handleCloseUnassignDialog }
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{ t("devices.confirmUnassignTitle") }</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{ t("devices.confirmUnassignMessage") }
				</DialogContentText>
				<div>
					{ selected.map(s => <Info key={ s }>&bull;{ data[ data.findIndex(d => d.id === s) ].id + " " + data[ data.findIndex(d => d.id === s) ].name }</Info>) }
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={ this.handleCloseUnassignDialog } color="primary">
					{ t("actions.no") }
				</Button>
				<Button onClick={ this.handleUnassignDevices } color="primary" autoFocus>
					{ t("actions.yes") }
				</Button>
			</DialogActions>
		</Dialog>
	}
	render () {
		const { classes, t, data, order, orderBy } = this.props;
		const { selected, rowsPerPage, page, openAssignProject, openAssignOrg } = this.state;
		let emptyRows
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
		return (
			<Paper className={ classes.root }>
				{ this.renderConfirmUnassign() }
				<AssignProject
					open={ openAssignProject }
					handleClose={ this.handleCloseAssignToProject }
					deviceId={ selected.map(s => data[ data.findIndex(d => d.id === s) ]) }
					t={t} />
				<AssignOrg
					devices
					open={openAssignOrg}
					handleClose={this.handleCloseAssignToOrg}
					deviceId={selected.map(s => data[data.findIndex(d => d.id === s)])}
					t={t} />
				<EnhancedTableToolbar
					anchorElMenu={ this.state.anchorElMenu }
					handleToolbarMenuClose={ this.handleToolbarMenuClose }
					handleToolbarMenuOpen={ this.handleToolbarMenuOpen }
					numSelected={ selected.length }
					options={ this.options }
					t={ t }
				// content={this.renderTableToolBarContent()}
				/>
				<div className={ classes.tableWrapper }>
					<Table className={ classes.table } aria-labelledby="tableTitle">
						<EnhancedTableHead
							numSelected={ selected.length }
							order={ order }
							orderBy={ orderBy }
							onSelectAllClick={ this.handleSelectAllClick }
							onRequestSort={ this.handleRequestSort }
							rowCount={ data ? data.length : 0 }
							columnData={ this.props.tableHead }
							classes={ classes }
							customColumn={ [
								{ id: "liveStatus", label: <SignalWifi2Bar />, checkbox: true },
								{
									id: "id",
									label: <Typography paragraph classes={ { root: classes.paragraphCell + " " + classes.headerCell } }>
										Device
									</Typography>
								}
							] }
						/>
						<TableBody>
							{ data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										hover
										onClick={ e => { e.stopPropagation(); this.props.history.push('/device/' + n.id) } }
										role="checkbox"
										aria-checked={ isSelected }
										tabIndex={ -1 }
										key={ n.id }
										selected={ isSelected }
										style={ { cursor: 'pointer' } }
									>
										<Hidden lgUp>
											<TableCell padding="checkbox" className={ classes.tablecellcheckbox } onClick={ e => this.handleClick(e, n.id) }>
												<Checkbox checked={ isSelected } />
											</TableCell>
											<TableCell padding="checkbox" className={ classes.tablecellcheckbox }>
												{ this.renderIcon(n.liveStatus) }
											</TableCell>
											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={ "center" }>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={ 12 }>
														<Info noWrap paragraphCell={ classes.noMargin }>
															{ n.name ? n.name : n.id }
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={ 12 }>
														<Caption noWrap className={ classes.noMargin }>
															{ `${n.name ? n.id : t("devices.noName")} - ${n.org ? n.org.name : ''}` }
														</Caption>
													</ItemGrid>
												</ItemGrid> } />
										</Hidden>
										<Hidden mdDown>
											<TableCell padding="checkbox" className={ classes.tablecellcheckbox } onClick={ e => this.handleClick(e, n.id) }>
												<Checkbox checked={ isSelected } />
											</TableCell>
											<TC label={ n.name ? n.name : t("devices.noName") } />
											<TC label={ n.id } />
											<TC content={ <div className={ classes.paragraphCell }> { this.renderIcon(n.liveStatus) }</div> } />
											<TC label={ n.address ? n.address : t("devices.noAddress") } />
											<TC label={ n.org ? n.org.name : t("devices.noProject") } />
											<TC label={ n.project.id > 0 ? t("devices.fields.notfree") : t("devices.fields.free") } />
										</Hidden>
									</TableRow>
								);
							}) : null }
							{ emptyRows > 0 && (
								<TableRow style={ { height: 49/*  * emptyRows */ } }>
									<TableCell colSpan={ 8 } />
								</TableRow>
							) }
						</TableBody>
					</Table>
				</div>
				<TP
					count={ data ? data.length : 0 }
					classes={ classes }
					rowsPerPage={ rowsPerPage }
					page={ page }
					t={ t }
					handleChangePage={ this.handleChangePage }
					handleChangeRowsPerPage={ this.handleChangeRowsPerPage }
				/>
			</Paper>
		);
	}
}

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
	rowsPerPage: state.settings.trp,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(EnhancedTable)));