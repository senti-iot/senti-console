import React, { Component, Fragment } from 'react'
import withLocalization from 'components/Localization/T';
import { withStyles, Table, TableBody, TableRow, Checkbox } from '@material-ui/core';
import TableHeader from './TableHeader';
import TC from './TC';
import TP from './TP';
import { connect } from 'react-redux'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';

class TableData extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 page: 0
	  }
	}
	
	headers = () => {
		const { t } = this.props
		return [
			{ id: 'id', label: t('charts.fields.id') },
			{ id: 'date', label: t('charts.fields.interval') },
			{ id: 'count', label: t('charts.fields.count') }
		]
	}
	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	isSelected = id => {
		return this.props.selected.indexOf(id) !== -1;
	}

	render() {
		const { page } = this.state
		const { classes, t, data } = this.props
		const { selected, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick, rowsPerPage } = this.props
		console.log(data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
		return (
			<Fragment>
				<div className={classes.tableWrapper}>
					<Table className={classes.table}>
						<TableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.headers()}
							classes={classes}
						/>
						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
								const isSelected = this.isSelected(n.id);
								return (
								
									<TableRow
										hover
										role='checkbox'
										aria-checked={isSelected}
										onClick={handleClick}
										tabIndex={-1}
										key={i}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} /> 
										<TC label={n.id} />
										<TC label={n.interval} />
										<TC label={n.count} />
											
									</TableRow>
								);
							}) : alert('NoData')}

						</TableBody>

							
					</Table>
				</div>
				<TP
					count={data ? data.length : 0}
					classes={classes}
					// rowsPerPage={rowsPerPage}
					page={page}
					t={t}
					handleChangePage={this.handleChangePage}
				/>
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(devicetableStyles)(TableData)))
