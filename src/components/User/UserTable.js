import {
	Checkbox, Hidden, Paper, Table, TableBody, TableCell,
	TableRow, withStyles, DialogTitle, Dialog, DialogContent,
	DialogContentText, DialogActions, Button, Typography, IconButton,
} from '@material-ui/core'
import TC from 'components/Table/TC'
import { Delete, Edit, PictureAsPdf, Add, StarBorder, Star } from 'variables/icons'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import EnhancedTableHead from 'components/Table/TableHeader'
import EnhancedTableToolbar from 'components/Table/TableToolbar'
import { ItemGrid, Info, Caption } from 'components'
import { connect } from 'react-redux'
import { pF, dateFormat } from 'variables/functions';
import Gravatar from 'react-gravatar'
import TP from 'components/Table/TP';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import withSnackbar from 'components/Localization/S';
var moment = require('moment')

class UserTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: [],
			data: [],
			page: 0,
			rowsPerPage: props.rowsPerPage,
			anchorElMenu: null,
			anchorFilterMenu: null,
			openDelete: false
		}
	}
	
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			const { data } = this.props
			const { selected } = this.state
			let user = data[data.findIndex(d => d.id === selected[0])]
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
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}

	handleSearch = value => {
		this.setState({
			searchFilter: value
		})
	}

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	handleSelectAllPage = (event, checked) => {
		if (checked) {
			const { data } = this.props
			const { rowsPerPage, page } = this.state
			this.setState({ selected: data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => n.id) })
			return;
		}
	}

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.data.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id)
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected })
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value })
	}

	handleDeleteUsers = async () => {
		await this.props.handleDeleteUsers(this.state.selected)
		this.setState({
			selected: [],
			anchorElMenu: null,
			openDelete: false
		})
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	isSelected = id => this.state.selected.indexOf(id) !== -1

	handleEdit = () => {
		this.props.history.push(`/management/user/${this.state.selected[0]}/edit`)
	}
	addToFav = (favObj) => {
		this.props.addToFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	removeFromFav = (favObj) => {
		this.props.removeFromFav(favObj)
		this.setState({ anchorElMenu: null })
	}
	options = () => {
		const { t, isFav, data } = this.props
		const { selected } = this.state
		let user = data[data.findIndex(d => d.id === selected[0])]
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.id}`
		}
		let isFavorite = isFav(favObj)
		return [
			{ label: t('menus.edit'), func: this.handleEdit, single: true, icon: Edit },
			{ label: isFavorite ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFavorite ? Star : StarBorder, func: isFavorite ? () => this.removeFromFav(favObj) : () => this.addToFav(favObj) },
			{ label: t('menus.exportPDF'), func: () => { }, icon: PictureAsPdf },
			{ label: t('menus.delete'), func: this.handleOpenDeleteDialog, icon: Delete }
		]
	}

	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { data, t } = this.props

		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.delete.title.users')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.users')}
				</DialogContentText>
				<div>
					{selected.map(s => {
						let u = data[data.findIndex(d => d.id === s)]
						return <Info key={s}>&bull;{u.firstName + ' ' + u.lastName}</Info>})
					}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={this.handleDeleteUsers} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	addNewUser = () => { this.props.history.push('/management/users/new') }

	renderTableToolBarContent = () => {
		const { accessLevel } = this.props
		let access = accessLevel.apiorg ? accessLevel.apiorg.edit ? true : false : false
		return <Fragment>
			{access ? <IconButton aria-label='Add new user' onClick={this.addNewUser}>
				<Add />
			</IconButton> : null
			}
		</Fragment>
	}
	render() {
		const { order, orderBy, data, classes, t } = this.props
		const {  selected, rowsPerPage, page } = this.state
		let emptyRows;
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
		return (
			<Paper className={classes.root}>

				<EnhancedTableToolbar
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby='tableTitle'>
						<EnhancedTableHead // ./ProjectTableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							t={t}
							classes={classes}
							customColumn={[ {
								id: 'avatar', label: <div style={{ width: 40 }}/>
							}, {
								id: 'firstName', label: <Typography variant={'body1'}>Users</Typography>
							}]}
						/>
						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? dateFormat(n.lastLoggedIn) : t('users.fields.neverLoggedIn')
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/management/user/' + n.id) }}
										role='checkbox'
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => this.handleClick(e, n.id)} />} />
											<TC checkbox content={n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />}/>

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
											}/>
										</Hidden>
										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => this.handleClick(e, n.id)}/>} />
											<TC checkbox content={n.img ? <img src={n.img} alt='brken' className={classes.img} /> : <Gravatar default='mp' email={n.email} className={classes.img} />} />
											<TC FirstC label={`${n.firstName} ${n.lastName}`} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone, this.props.language) : n.phone}</a>} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</a>} />
											<TC label={n.org ? n.org.name : t('users.noOrg')} />
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
					count={ data ? data.length : 0 }
					classes={ classes }
					rowsPerPage={ rowsPerPage }
					page={ page }
					t={ t }
					handleChangePage={ this.handleChangePage }
					handleChangeRowsPerPage={ this.handleChangeRowsPerPage }
				/>
				{this.renderConfirmDelete()}

			</Paper>
		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.settings.trp,
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	favorites: state.favorites.favorites,
	saved: state.favorites.saved
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