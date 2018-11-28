import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import FavoriteTableHead from 'components/Table/TableHeader'
import { connect } from 'react-redux'
import { Info, Caption, ItemG } from 'components';
import TC from 'components/Table/TC'
import TP from 'components/Table/TP';
import { LibraryBooks, DeviceHub, Person, Business, DataUsage } from 'variables/icons';

class FavoriteTable extends React.Component {
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
	renderIcon = (type) => {
		switch (type) {
			case 'project':
				return <LibraryBooks />
			case 'device': 
				return <DeviceHub />
			case 'user': 
				return <Person />
			case 'org': 
				return <Business />
			case 'collection': 
				return <DataUsage />
			default:
				break;
		}
	}
	render() {
		const { selected, classes, t, data, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick } = this.props;
		const { rowsPerPage, page } = this.state;
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
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							classes={classes}
							customColumn={[
								{
									id: 'type',
									label: <div style={{ width: 40 }}/>
								},
								{
									id: 'id',
									label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
										{this.props.t("sidebar.favorites")}
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
											<TC checkbox content={<ItemG container>{this.renderIcon(n.type)}</ItemG>} />
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
											<TC checkbox content={<ItemG container>{this.renderIcon(n.type)}</ItemG>} />
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
					handleChangePage={this.handleChangePage}
					handleChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</Fragment>
		);
	}
}

FavoriteTable.propTypes = {
	classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
	rowsPerPage: state.settings.trp,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(FavoriteTable)));