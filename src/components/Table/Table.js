// import React, { Component } from 'react'

// export class Table extends Component {
// 	render() {
// 		return (
// 			<div className={classes.tableWrapper}>
// 				<Table className={classes.table} aria-labelledby="tableTitle">
// 					<EnhancedTableHead
// 						numSelected={selected.length}
// 						order={order}
// 						orderBy={orderBy}
// 						onSelectAllClick={this.handleSelectAllClick}
// 						onRequestSort={this.handleRequestSort}
// 						rowCount={data.length}
// 						columnData={this.props.tableHead}
// 						classes={classes}
// 					/>
// 					<TableBody>
// 						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
// 							const isSelected = this.isSelected(n.id);
// 							return (
// 								<TableRow
// 									hover
// 									onClick={e => { e.stopPropagation(); this.props.history.push('/device/' + n.id) }}
// 									role="checkbox"
// 									aria-checked={isSelected}
// 									tabIndex={-1}
// 									key={n.id}
// 									selected={isSelected}
// 									style={{ cursor: 'pointer' }}
// 								>
// 									<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
// 										<Checkbox checked={isSelected} />
// 									</TableCell>
// 									<Hidden mdDown>
// 										<TableCell className={classes.tableCell}>
// 											<Typography paragraph classes={{ root: classes.paragraphCell }}>
// 												{n.name ? n.name : t("devices.noName")}
// 											</Typography>
// 										</TableCell>
// 										<TableCell className={classes.tableCell}>
// 											<Typography paragraph classes={{ root: classes.paragraphCell }}>
// 												{n.id}
// 											</Typography>
// 										</TableCell>
// 										<TableCell className={classes.tableCell}>
// 											<div className={classes.paragraphCell}>
// 												{this.renderIcon(n.liveStatus)}
// 											</div>
// 										</TableCell>
// 										<TableCell className={classes.tableCell}>
// 											<Typography paragraph classes={{ root: classes.paragraphCell }}>
// 												{n.address ? n.address : t("devices.noAddress")}
// 											</Typography>
// 										</TableCell>
// 										<TableCell className={classes.tableCell}>
// 											<Typography paragraph classes={{ root: classes.paragraphCell }}>
// 												{n.organisation ? n.organisation.vcName : t("devices.noProject")}
// 											</Typography>
// 										</TableCell>
// 									</Hidden>
// 									<Hidden lgUp>
// 										<TableCell className={classes.tableCellID}>
// 											<Typography paragraph classes={{ root: classes.paragraphCell }}>
// 												{n.id}
// 											</Typography>
// 										</TableCell>
// 										<TableCell className={classes.tableCell}>
// 											<Typography paragraph classes={{ root: classes.paragraphCell }}>
// 												{n.name ? n.name : t("devices.noName")}
// 											</Typography>
// 										</TableCell>
// 										<TableCell className={classes.tableCellID}>
// 											<div className={classes.paragraphCell}>
// 												{this.renderIcon(n.liveStatus)}
// 											</div>
// 										</TableCell>
// 									</Hidden>
// 								</TableRow>
// 							);
// 						})}
// 						{emptyRows > 0 && (
// 							<TableRow style={{ height: 49 * emptyRows }}>
// 								<TableCell colSpan={8} />
// 							</TableRow>
// 						)}
// 					</TableBody>
// 				</Table>
// 			</div>
// 		)
// 	}
// }

// export default Table
