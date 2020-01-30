import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import PropTypes from 'prop-types'
import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import ProjectHover from 'components/Hover/ProjectHover';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
// 	hoverTime: state.settings.hoverTime
// })

const ProjectTable = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	const hoverTime = useSelector(state => state.settings.hoverTime)
	const [page, setPage] = useState(0)
	const [rowHover, setRowHover] = useState(null) // added
	const [hoverProject, setHoverProject] = useState(null) // added
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		page: 0,
	// 	}
	// }

	let timer = null

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page });
	}

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	const setHover = (e, n) => {
		e.persist()
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover) {
					setRowHover(null)
					// this.setState({
					// 	rowHover: null
					// })
					setTimeout(() => {
						setRowHover(e.target)
						setHoverProject(n)
						// this.setState({ rowHover: e.target, hoverProject: n })
					}, 200);
				}
				else {
					setRowHover(e.target)
					setHoverProject(n)
					// this.setState({ rowHover: e.target, hoverProject: n })
				}
			}, hoverTime);
	}
	const unsetTimeout = () => {
		clearTimeout(timer)
	}
	const unsetHover = () => {
		setRowHover(null)
		// this.setState({
		// 	rowHover: null
		// })
	}
	const renderHover = () => {
		return <ProjectHover anchorEl={rowHover} handleClose={unsetHover} project={hoverProject} />
	}
	const { classes, handleClick, selected, order, data, orderBy, handleCheckboxClick } = props
	let emptyRows;
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

	return (
		<Fragment>
			<div className={classes.tableWrapper} onMouseLeave={unsetHover}>
				{renderHover()}
				<Table className={classes.table} aria-labelledby='tableTitle'>
					<TableHeader
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={props.handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						t={t}
						classes={classes}
						customColumn={[
							{
								id: 'title',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('collections.fields.project')}
								</Typography>
							}
						]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.id);
							return (
								<TableRow
									// onMouseEnter={e => { this.setHover(e, n) }}
									// onMouseLeave={this.unsetTimeout}
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
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.title}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${n.org ? n.org.name : t('users.fields.noOrg')}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											FirstC label={n.title} />
										<TC label={dateFormatter(n.startDate)} />
										<TC label={dateFormatter(n.endDate)} />
										<TC label={dateFormatter(n.created)} />
										<TC label={dateFormatter(n.modified)} />
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
				page={page}
				t={t}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}

ProjectTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(devicetableStyles, { withTheme: true })(ProjectTable))