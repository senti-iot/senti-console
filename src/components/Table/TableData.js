import React, { useState, Fragment } from 'react'
import withLocalization from 'components/Localization/T';
import { withStyles, Table, TableBody, TableRow, Checkbox } from '@material-ui/core';
import TableHeader from './TableHeader';
import TC from './TC';
import TP from './TP';
import { useSelector } from 'react-redux'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
// 	accessLevel: state.settings.user.privileges
// })

const TableData = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	// const accessLevel = useSelector(state => state.settings.user.privileges)
	const [page, setPage] = useState(0)
	// constructor(props) {
	//   super(props)

	//   this.state = {
	// 	 page: 0
	//   }
	// }

	const headers = () => {
		return [
			{ id: 'id', label: t('charts.fields.id') },
			{ id: 'date', label: t('charts.fields.interval') },
			{ id: 'count', label: t('charts.fields.count') }
		]
	}
	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	};

	const isSelectedFunc = id => {
		return props.selected.indexOf(id) !== -1;
	}

	const { classes, data } = props
	const { selected, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick } = props
	return (
		<Fragment>
			<div className={classes.tableWrapper}>
				<Table className={classes.table}>
					<TableHeader
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={headers()}
						classes={classes}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
							const isSelected = isSelectedFunc(n.id);
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
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}

export default withLocalization()(withStyles(devicetableStyles)(TableData))
