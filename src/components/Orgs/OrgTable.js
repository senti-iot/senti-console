import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, withStyles,
} from '@material-ui/core'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import TableHeader from 'components/Table/TableHeader'
import { Info, ItemG, Caption } from 'components'
import { connect } from 'react-redux'
import TP from 'components/Table/TP'
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';

var countries = require('i18n-iso-countries')

class OrgTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: [],
			page: 0,
			anchorElMenu: null,
			anchorFilterMenu: null,
			openDelete: false,
		}
	}
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { data, selected } = this.props
			let org = data[data.findIndex(d => d.id === selected[0])]
			if (this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.saved', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
			if (!this.props.isFav({ id: org.id, type: 'org' })) {
				this.props.s('snackbars.favorite.removed', { name: org.name, type: this.props.t('favorites.types.org') })
				this.props.finishedSaving()
				this.setState({ selected: [] })
			}
		}
	}

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}


	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	isSelected = id => this.props.selected.indexOf(id) !== -1

	render() {
		const { rowsPerPage, classes, t, order, orderBy, data, handleCheckboxClick, selected, handleSelectAllClick } = this.props
		const { page } = this.state
		let emptyRows;
		if (data) {
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
		}
		return (

			<Fragment>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby='tableTitle'>
						<TableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							t={t}
							classes={classes}
							customColumn={[{ id: 'name', label: t('orgs.fields.org') }]}
						/>
						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/management/org/' + n.id) }}
										role='checkbox'
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
											<TC content={
												<ItemG container alignItems={'center'}>
													<ItemG>
														<Info noWrap paragraphCell={classes.noMargin}>
															{n.name}
														</Info>
														<ItemG>
															<Caption noWrap className={classes.noMargin}>
																{n.address && n.zip && n.city && n.country ?
																	`${n.address}, ${n.zip} ${n.city}, ${countries.getName(n.country, this.props.language)}` : null}
															</Caption>
														</ItemG>
													</ItemG>
												</ItemG>
											} />
										</Hidden>
										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
											<TC FirstC label={n.name} />
											<TC label={n.address} />
											<TC label={`${n.zip} ${n.city}`} />
											<TC label={n.url} />
										</Hidden>
									</TableRow>
								)
							}) : null}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 /* * emptyRows */ }}>
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
		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
	language: state.localization.language,
	accessLevel: state.settings.user.privileges,
	favorites: state.favorites.favorites,
	saved: state.favorites.saved
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

OrgTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withSnackbar()(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(OrgTable))))