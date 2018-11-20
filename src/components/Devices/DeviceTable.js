import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core';
import { SignalWifi2Bar, SignalWifi2BarLock, /* Delete, Build, Business, DataUsage, Edit, LayersClear */ } from 'variables/icons';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import EnhancedTableHead from 'components/Table/TableHeader'
import { connect } from 'react-redux'
import { Info, Caption, ItemG } from 'components';
import TC from 'components/Table/TC'
import TP from 'components/Table/TP';

class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: [],
			page: 0,
			rowsPerPage: props.rowsPerPage,
			anchorElMenu: null,
			anchorFilterMenu: null,
		};
	}

	handleFilterMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: e.currentTarget })
	}
	handleFilterMenuClose = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: null })
	}
	handleSearch = value => {
		this.setState({
			searchFilter: value
		})
	}
	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};


	isSelected = id => this.props.selected.indexOf(id) !== -1;

	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1:
				return <ItemG container justify={'center'} title={t('devices.status.yellow')}>
					<SignalWifi2Bar className={classes.yellowSignal} />
				</ItemG>
			case 2:
				return <ItemG container justify={'center'} title={t('devices.status.green')}>
					<SignalWifi2Bar className={classes.greenSignal} />
				</ItemG>
			case 0:
				return <ItemG container justify={'center'} title={t('devices.status.red')}>
					<SignalWifi2Bar className={classes.redSignal} />
				</ItemG>
			case null:
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}
	render() {
		const { selected, classes, t, data, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick  } = this.props;
		const { rowsPerPage, page  } = this.state;
		let emptyRows
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
		return (
			<Fragment>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							classes={classes}
							customColumn={[
								{
									id: 'liveStatus', label: <ItemG container justify={'center'}>
										<SignalWifi2Bar />
									</ItemG>, checkbox: true
								},
								{
									id: 'id',
									label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
										Device
									</Typography>
								}
							]}
						/>
						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										hover
										onClick={handleClick(n.id)}
										role='checkbox'
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)}/>} />
											<TC checkbox content={this.renderIcon(n.liveStatus)}/>
											<TC content={
												<ItemG container alignItems={'center'}>
													<ItemG xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{n.name ? n.name : n.id}
														</Info>
													</ItemG>
													<ItemG xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.name ? n.id : t('devices.noName')} - ${n.org ? n.org.name : ''}`}
														</Caption>
													</ItemG>
												</ItemG>} />
										</Hidden>
										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)}/>}/>
											<TC label={n.name ? n.name : t('devices.noName')} />
											<TC label={n.id} />
											<TC content={this.renderIcon(n.liveStatus)} />
											<TC label={n.address ? n.address : t('devices.noAddress')} />
											<TC label={n.org ? n.org.name : t('devices.noProject')} />
											<TC label={n.project.id > 0 ? t('devices.fields.notfree') : t('devices.fields.free')} />
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
					handleChangePage={this.handleChangePage}
					handleChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</Fragment>
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