import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles, Tooltip,
} from '@material-ui/core';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import FavoriteTableHead from 'components/Table/TableHeader'
import { useSelector } from 'react-redux'
import { Info, Caption, ItemG } from 'components';
import TC from 'components/Table/TC'
import TP from 'components/Table/TP';
import { LibraryBooks, DeviceHub, Person, Business, DataUsage, Memory, InputIcon, CloudDownload } from 'variables/icons';
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
// 	accessLevel: state.settings.user.privileges
// })

const FavoriteTable = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	// const accessLevel = useSelector(state => state.settings.user.privileges)

	// const [stateSelected, setStateSelected] = useState([])
	const [page, setPage] = useState(0)
	const [, setStateRowsPerPage] = useState(props.rowsPerPage)
	// const [anchorElMenu, setAnchorElMenu] = useState(null)
	// const [, setAnchorFilterMenu] = useState(null)
	// const [, setSearchFilter] = useState(null) // added
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		selected: [],
	// 		page: 0,
	// 		rowsPerPage: props.rowsPerPage,
	// 		anchorElMenu: null,
	// 		anchorFilterMenu: null,
	// 	};
	// 	// props.setBC(props.t('sidebar.favorites'), 'favorites')
	// }

	// const handleFilterMenuOpen = e => {
	// 	e.stopPropagation()
	// 	setAnchorFilterMenu(e.currentTarget)
	// 	// this.setState({ anchorFilterMenu: e.currentTarget })
	// }
	// const handleFilterMenuClose = e => {
	// 	e.stopPropagation()
	// 	setAnchorFilterMenu(null)
	// 	// this.setState({ anchorFilterMenu: null })
	// }
	// const handleSearch = value => {
	// 	setSearchFilter(value)
	// 	// this.setState({
	// 	// 	searchFilter: value
	// 	// })
	// }
	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
		// this.setState({ page });
	};

	const handleChangeRowsPerPage = event => {
		setStateRowsPerPage(event.target.value)
		// this.setState({ rowsPerPage: event.target.value });
	};


	const isSelectedFunc = id => props.selected.indexOf(id) !== -1;
	const renderIcon = (type) => {
		switch (type) {
			case 'project':
				return <Tooltip title={t('tooltips.project')}>
					<LibraryBooks />
				</Tooltip>
			case 'sensor':
			case 'device':
				return <Tooltip title={t('tooltips.device')}>
					<DeviceHub />
				</Tooltip>
			case 'user':
				return <Tooltip title={t('tooltips.user')}>
					<Person />
				</Tooltip>
			case 'org':
				return <Tooltip title={t('tooltips.org')}>
					<Business />
				</Tooltip>
			case 'collection':
				return <Tooltip title={t('tooltips.collection')}>
					<DataUsage />
				</Tooltip>
			case 'devicetype':
				return <Tooltip title={t('tooltips.devicetype')}>
					<Memory />
				</Tooltip>
			case 'registry':
				return <Tooltip title={t('tooltips.registry')}>
					<InputIcon />
				</Tooltip>
			case 'function':
				return <Tooltip title={t('tooltips.function')}>
					<CloudDownload />
				</Tooltip>
			default:
				break;
		}
	}

	const { selected, classes, data, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick } = props;
	let emptyRows
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
	return (
		<Fragment>
			<div className={classes.tableWrapper}>
				<Table className={classes.table} aria-labelledby='tableTitle'>
					<FavoriteTableHead
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						classes={classes}
						customColumn={[
							{
								id: 'type',
								label: <div style={{ width: 40 }} />
							},
							{
								id: 'id',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t("sidebar.favorites")}
								</Typography>
							}

						]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.id);
							return (
								<TableRow
									hover
									onClick={handleClick(n.path)}
									role='checkbox'
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.id}
									selected={isSelected}
									style={{ cursor: 'pointer' }}
								>
									<Hidden lgUp>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC checkbox content={<ItemG container>{renderIcon(n.type)}</ItemG>} />
										<TC content={
											<ItemG container alignItems={'center'}>
												<ItemG xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
												</ItemG>
												<ItemG xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${t(`favorites.types.${n.type}`)}`}
													</Caption>
												</ItemG>
											</ItemG>} />
									</Hidden>
									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC checkbox content={<ItemG container>{renderIcon(n.type)}</ItemG>} />
										<TC label={n.name ? n.name : t('devices.noName')} />
										<TC label={t(`favorites.types.${n.type}`)} />
									</Hidden>
								</TableRow>
							);
						}) : null}
						{emptyRows > 0 && (
							<TableRow style={{ height: 49/*  * emptyRows */ }}>
								<TableCell colSpan={8} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<TP
				count={data ? data.length : 0}
				classes={classes}
				rowsPerPage={rowsPerPage}
				page={page}
				t={t}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Fragment>
	);
}

FavoriteTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(devicetableStyles, { withTheme: true })(FavoriteTable));