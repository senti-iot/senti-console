import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, withStyles, Typography,
} from '@material-ui/core'
import TC from 'components/Table/TC'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from 'components'
import { connect } from 'react-redux'
import { pF, dateFormat } from 'variables/functions';
import Gravatar from 'react-gravatar'
import TP from 'components/Table/TP';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';
import UserHover from 'components/Hover/UserHover';
var moment = require('moment')

class UserTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			page: 0,
			openDelete: false,
		}
	}

	timer = null

	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { data, selected } = this.props
			let user = data[data.findIndex(d => d.id === selected[0])]
			if (user) {
				if (this.props.isFav({ id: user.id, type: 'user' })) {
					this.props.s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
					this.props.finishedSaving()
					this.setState({ selected: [] })
				}
				if (!this.props.isFav({ id: user.id, type: 'user' })) {
					this.props.s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: this.props.t('favorites.types.user') })
					this.props.finishedSaving()
					this.setState({ selected: [] })
				}
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
	setHover = (e, n) => {
		e.persist()
		const { hoverTime } = this.props
		const { rowHover } = this.state
		if (hoverTime > 0)
			this.timer = setTimeout(() => {
				if (rowHover) {
					this.setState({
						rowHover: null
					})
					setTimeout(() => {
						this.setState({ rowHover: e.target, hoverUser: n })
					}, 200);
				}
				else {
					this.setState({ rowHover: e.target, hoverUser: n })
				}
			}, hoverTime);
	}
	unsetTimeout = () => {
		clearTimeout(this.timer)
	}
	unsetHover = () => {
		this.setState({
			rowHover: null
		})
	}
	renderHover = () => {
		return <UserHover anchorEl={this.state.rowHover} handleClose={this.unsetHover} user={this.state.hoverUser} />
	}
	render() {
		const { selected, rowsPerPage, order, orderBy, data, classes, t } = this.props
		const { page } = this.state
		let emptyRows;
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
		return (
			<Fragment>
				<div className={classes.tableWrapper} onMouseLeave={this.unsetHover}>
					{this.renderHover()}
					<Table className={classes.table} aria-labelledby='tableTitle' >
						<TableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.props.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							t={t}
							classes={classes}
							customColumn={[{
								id: 'avatar', label: <div style={{ width: 40 }} />
							}, {
								id: 'firstName', label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>Users</Typography>
							}]}
						/>
						<TableBody >
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t('users.fields.neverLoggedIn')
								return (
									<TableRow
										hover
										// onMouseEnter={e => { this.setHover(e, n) }}
										// onMouseLeave={this.unsetTimeout}
										onClick={e => { e.stopPropagation(); this.props.history.push('/management/user/' + n.id) }}
										role='checkbox'
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => this.props.handleCheckboxClick(e, n.id)} />} />
											<TC checkbox content={n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />} />

											<TC content={
												<ItemGrid container zeroMargin noPadding alignItems={'center'}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{`${n.firstName} ${n.lastName}`}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.org ? n.org.name : t('users.fields.noOrg')} - ${n.email}`}
														</Caption>
													</ItemGrid>
												</ItemGrid>
											} />
										</Hidden>
										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => this.props.handleCheckboxClick(e, n.id)} />} />
											<TC checkbox content={n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />} />
											<TC
												onMouseEnter={e => { this.setHover(e, n) }}
												onMouseLeave={this.unsetTimeout}
												FirstC label={`${n.firstName} ${n.lastName}`} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone, this.props.language) : n.phone}</a>} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</a>} />
											<TC label={n.org ? n.org.name : t('users.noOrg')} />
											<TC label={t(n.group)} />
											<TC label={lastLoggedIn} />
										</Hidden>
									</TableRow>

								)
							}) : null}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 }}>
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
				/>
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	favorites: state.data.favorites,
	saved: state.favorites.saved,
	hoverTime: state.settings.hoverTime
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})


UserTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withSnackbar()(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(UserTable))))