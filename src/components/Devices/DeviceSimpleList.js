import React, { Fragment, useState } from 'react';
import { Checkbox, Table, TableBody, TableCell, TablePagination, TableRow } from '@material-ui/core';
import EnhancedTableHead from 'components/Table/TableHeader';
import EnhancedTableToolbar from 'components/Table/TableToolbar'
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
// import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import { ItemGrid, Info, Caption, AssignProject } from 'components';
import { useLocalization, useHistory } from 'hooks';

const DeviceSimpleList = props => {
	const t = useLocalization()
	const classes = devicetableStyles()
	const history = useHistory()

	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('')
	const [selected, setSelected] = useState([])
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [anchorElMenu, setAnchorElMenu] = useState(null)
	// const [keyword, setKeyword] = useState('')
	const [openAssignProject, setOpenAssignProject] = useState(null) // added
	const [, setStateData] = useState(null)
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		order: 'asc',
	// 		orderBy: '',
	// 		selected: [],
	// 		page: 0,
	// 		rowsPerPage: 5,
	// 		anchorElMenu: null,
	// 		keyword: ''
	// 	};
	// }
	const handleToolbarMenuOpen = e => {
		e.stopPropagation()
		setAnchorElMenu(e.currentTarget)
		// this.setState({ anchorElMenu: e.currentTarget });
	};
	const handleToolbarMenuClose = e => {
		e.stopPropagation();
		setAnchorElMenu(null)
		// this.setState({ anchorElMenu: null })
	}
	const handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (orderBy === property && order === 'desc') {
			order = 'asc';
		}

		const data =
			order === 'desc'
				? props.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
				: props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

		setStateData(data)
		setOrder(order)
		setOrderBy(orderBy)
		// this.setState({ data, order, orderBy });
	};

	const handleSelectAllClick = (event, checked) => {
		if (checked) {
			setSelected(props.data.map(n => n.id))
			// this.setState({ selected: this.props.data.map(n => n.id) });
			return;
		}
		setSelected([])
		// this.setState({ selected: [] });
	};

	const handleClick = (event, id) => {
		event.stopPropagation()
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
		setSelected(newSelected)
		// this.setState({ selected: newSelected });
	};
	const options = () => {
		return [
			{ label: t('menus.edit'), func: handleDeviceEdit, single: true },
			{ label: t('menus.assign'), func: handleAssignToProject, single: false },
			// eslint-disable-next-line no-undef
			{ label: t('menus.calibrate'), func: handleCalibrateFlow, single: true },
			// eslint-disable-next-line no-undef
			{ label: t('menus.delete'), func: handleDeleteProjects, single: false },
		]
	}
	const handleDeviceEdit = () => {
		history.push(`/device/${selected[0]}/edit`)
	}
	const handleAssignToProject = () => {
		setOpenAssignProject(true)
		// this.setState({ openAssignProject: true })
	}
	const handleCloseAssignToProject = reload => {
		setOpenAssignProject(false)
		// this.setState({ openAssignProject: false })
	}
	const handleChangePage = (event, newPage) => {
		setPage(newPage)
		// this.setState({ page });
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(event.target.value)
		// this.setState({ rowsPerPage: event.target.value });
	};

	const isSelectedFunc = id => selected.indexOf(id) !== -1;

	// TODO

	// const renderIcon = (status) => {
	// 	const { classes } = props
	// 	switch (status) {
	// 		case 1:
	// 			return <SignalWifi2Bar className={classes.yellowSignal} />
	// 		case 2:
	// 			return <SignalWifi2Bar className={classes.greenSignal} />
	// 		case 0:
	// 			return <SignalWifi2Bar className={classes.redSignal} />
	// 		case null:
	// 			return <SignalWifi2BarLock className={classes.redSignal} />
	// 		default:
	// 			break;
	// 	}
	// }
	const { data } = props
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
	const tableHead = [
		{ id: 'id', label: t('devices.pageTitle') }
	]

	return (
		<Fragment>
			<AssignProject
				open={openAssignProject}
				handleClose={handleCloseAssignToProject}
				deviceId={selected.map(s => data[data.findIndex(d => d.id === s)])}
				t={t} />
			<EnhancedTableToolbar
				noFilterIcon
				noAdd
				noDatePickers
				anchorElMenu={anchorElMenu}
				handleToolbarMenuClose={handleToolbarMenuClose}
				handleToolbarMenuOpen={handleToolbarMenuOpen}
				filters={props.filters}
				numSelected={selected.length}
				options={options}
				t={t}
			/>
			{/* <div className={classes.tableWrapper}> */}
			<Table className={classes.table} aria-labelledby='tableTitle'>
				<EnhancedTableHead
					numSelected={selected.length}
					order={order}
					orderBy={orderBy}
					onSelectAllClick={handleSelectAllClick}
					onRequestSort={handleRequestSort}
					rowCount={data.length}
					columnData={tableHead}
					classes={classes}
					mdDown={[0]}
					t={t}
				/>
				<TableBody>
					{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
						const isSelected = isSelectedFunc(n.id)
						return (
							<TableRow
								hover
								onClick={e => { e.stopPropagation(); history.push('/device/' + n.id) }}
								role='checkbox'
								aria-checked={isSelected}
								tabIndex={-1}
								key={i}
								selected={isSelected}
								style={{ cursor: 'pointer' }}
							>
								<TableCell padding='checkbox' className={classes.tablecellcheckbox} onClick={e => handleClick(e, n.id)}>
									<Checkbox checked={isSelected} />
								</TableCell>
								<TableCell classes={{ root: classes.tableCell }}>
									<ItemGrid container zeroMargin noPadding alignItems={'center'}>
										<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
											<Info noWrap paragraphCell={classes.noMargin}>
												{n.name ? n.name : n.id}
											</Info>
										</ItemGrid>
										<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
											<Caption noWrap className={classes.noMargin}>
												{`${n.name ? n.id : t('devices.noName')} - ${n.org ? n.org.name : ''}`}
											</Caption>
										</ItemGrid>
									</ItemGrid>
								</TableCell>
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
				component='div'
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
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
				labelRowsPerPage={t('tables.rowsPerPage')}
				SelectProps={{
					classes: {
						select: classes.SelectIcon
					}
				}}
			/>
		</Fragment>
	);
}

DeviceSimpleList.propTypes = {
	classes: PropTypes.object.isRequired,
	data: PropTypes.array.isRequired
};

export default DeviceSimpleList