import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles, DialogTitle, Dialog, DialogContent,
	DialogContentText, DialogActions, Button, List, ListItem, ListItemIcon, ListItemText
} from "@material-ui/core"
// import { Delete, Devices, Edit, PictureAsPdf } from 'variables/icons'
import devicetableStyles from "assets/jss/components/devices/devicetableStyles"
import PropTypes from "prop-types"
import React, { Fragment } from "react"
import { withRouter } from 'react-router-dom'
import { dateFormatter } from "variables/functions"
import EnhancedTableHead from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from "components"
import { connect } from "react-redux"
import TP from 'components/Table/TP';

class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			// selected: [],
			page: 0,
			rowsPerPage: props.rowsPerPage,
			// anchorElMenu: null,
			// anchorFilterMenu: null,
			// openDelete: false
		}
	}



	handleFilterMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: e.currentTarget })
	}

	handleFilterMenuClose = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: null })
	}

	handleFilter = () => {
	}

	handleSearch = value => {
		this.setState({
			searchFilter: value
		})
	}

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	// handleSelectAllPage = (event, checked) => {
	// 	if (checked) {
	// 		const { data } = this.props
	// 		const { rowsPerPage, page } = this.state
	// 		this.setState({ selected: data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => n.id) })
	// 		return;
	// 	}
	// }

	// handleSelectAllClick = (event, checked) => {
	// 	if (checked) {
	// 		this.setState({ selected: this.props.data.map(n => n.id) })
	// 		return;
	// 	}
	// 	this.setState({ selected: [] })
	// }

	// handleClick = (event, id) => {
	// 	event.stopPropagation()
	// 	const { selected } = this.state;
	// 	const selectedIndex = selected.indexOf(id)
	// 	let newSelected = [];

	// 	if (selectedIndex === -1) {
	// 		newSelected = newSelected.concat(selected, id);
	// 	} else if (selectedIndex === 0) {
	// 		newSelected = newSelected.concat(selected.slice(1))
	// 	} else if (selectedIndex === selected.length - 1) {
	// 		newSelected = newSelected.concat(selected.slice(0, -1))
	// 	} else if (selectedIndex > 0) {
	// 		newSelected = newSelected.concat(
	// 			selected.slice(0, selectedIndex),
	// 			selected.slice(selectedIndex + 1),
	// 		);
	// 	}

	// 	this.setState({ selected: newSelected })
	// }

	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value })
	}

	handleDeleteProjects = async () => {
		await this.props.deleteProjects(this.props.selected)
	}



	isSelected = id => this.props.selected.indexOf(id) !== -1

	renderConfirmDelete = () => {
		// const { openDelete } = this.state
		const { data, t, selected, handleCloseDeleteDialog, openDelete } = this.props
		return <Dialog
			open={openDelete}
			onClose={handleCloseDeleteDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("projects.projectDelete")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("projects.projectDeleteConfirm")}
				</DialogContentText>
				<List>
					{selected.map(s => <ListItem key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
						<ListItemText primary={data[data.findIndex(d => d.id === s)].title} /></ListItem>)}

				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color="primary">
					{t("actions.no")}
				</Button>
				<Button onClick={this.handleDeleteProjects} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}

	render() {
		const { classes, selected, t, order, data, orderBy } = this.props
		const { rowsPerPage, page } = this.state
		let emptyRows;
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

		return (
			<Fragment>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead // ./ProjectTableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.props.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							t={t}
							classes={classes}
							// mdDown={[0]}
							customColumn={[
								{
									id: "title",
									label: <Typography paragraph classes={{ root: classes.paragraphCell + " " + classes.headerCell }}>
										Projects
									</Typography>
								}
							]} //Which Columns to display on small Screens
						/>
						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/project/' + n.id) }}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.props.handleClick(e, n.id)}>
												<Checkbox checked={isSelected} />
											</TableCell>
											<TableCell classes={{ root: classes.tableCell }}>
												<ItemGrid container zeroMargin noPadding alignItems={"center"}>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{n.title}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.org ? n.org.name : t("users.fields.noOrg")}` /* ${dateFormatter(n.startDate)} - ${dateFormatter(n.endDate)} */}
														</Caption>
													</ItemGrid>
													{/* </ItemGrid> */}
												</ItemGrid>
											</TableCell>
										</Hidden>

										<Hidden mdDown>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.props.handleClick(e, n.id)}>
												<Checkbox checked={isSelected} />
											</TableCell>
											<TableCell className={classes.tableCell + " " + classes.tableCellNoWidth}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.title}
												</Typography>
											</TableCell>
											{/* <TableCell className={classes.tableCell}>
												<Typography paragraph title={n.description} classes={{ root: classes.paragraphCell }}>
													{n.description}
												</Typography>
											</TableCell> */}
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{dateFormatter(n.startDate)}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{dateFormatter(n.endDate)}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{dateFormatter(n.created)}	</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{dateFormatter(n.modified)}	</Typography>
											</TableCell>
										</Hidden>
									</TableRow>
								)
							}) : null}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49/*  * emptyRows  */ }}>
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
				{this.renderConfirmDelete()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.settings.trp
})

const mapDispatchToProps = {

}

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(EnhancedTable)))