import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, Tooltip,
} from '@material-ui/core';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import React, { Fragment, useState } from 'react';
import FavoriteTableHead from 'components/Table/TableHeader'
import { useSelector } from 'react-redux'
import { Info, Caption, ItemG } from 'components';
import TC from 'components/Table/TC'
import TP from 'components/Table/TP';
import { LibraryBooks, DeviceHub, Person, Business, DataUsage, Memory, InputIcon, CloudDownload } from 'variables/icons';
import { useLocalization } from 'hooks';


const FavoriteTable = props => {
	//Hooks
	const t = useLocalization()
	const classes = devicetableStyles()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)

	//State
	const [page, setPage] = useState(0)

	//Const
	const { selected, data, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick } = props;
	let emptyRows
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

	//useCallbacks

	//useEffects

	//Handlers

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
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
			case 'cloudfunction':
				return <Tooltip title={t('tooltips.function')}>
					<CloudDownload />
				</Tooltip>
			default:
				break;
		}
	}


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
				rowsPerPage={rowsPerPage}
				page={page}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	);
}

export default FavoriteTable;