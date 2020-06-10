import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography,
} from '@material-ui/core'
import React, { Fragment, useState, useEffect } from 'react'
// import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import RegistryHover from 'components/Hover/RegistryHover';
import { dateFormatter } from 'variables/functions';
import { useLocalization } from 'hooks'
import registryTableStyles from 'assets/jss/components/registries/registryTableStyles'

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
// 	hoverTime: state.settings.hoverTime
// })

const RegistryTable = props => {
	//Hooks
	const t = useLocalization()
	const classes = registryTableStyles()
	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	const hoverTime = useSelector(state => state.settings.hoverTime)

	//State
	const [page, setPage] = useState(0)
	const [hoverRegistry, setHoverRegistry] = useState(null)
	const [rowHover, setRowHover] = useState(null)

	//Const
	const { handleClick, selected, order, data, orderBy, handleCheckboxClick } = props
	let timer = null

	useEffect(() => {
		return () => {
			clearTimeout(timer)
		};
	}, [timer])

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
	}

	const handleSelectAllClick = (event, checked) => {
		const { data } = props
		let selected = data.map(d => d.uuid)
		props.handleSelectAllClick(selected, checked)
	}

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	const setHover = (e, n) => {
		e.persist()
		if (hoverTime > 0)
			timer = setTimeout(() => {
				if (rowHover) {
					setRowHover(null)

					setTimeout(() => {
						setHoverRegistry(n)
						setRowHover(e.target)
					}, 200);
				}
				else {
					setHoverRegistry(n)
					setRowHover(e.target)
				}
			}, hoverTime);
	}
	const unsetTimeout = () => {
		clearTimeout(timer)
	}
	const unsetHover = () => {
		setRowHover(null)
	}
	const renderHover = () => {
		return <RegistryHover anchorEl={rowHover} handleClose={unsetHover} registry={hoverRegistry} />
	}
	const renderProtocol = (id) => {
		switch (id) {
			case 0:
				return t('registries.fields.protocols.none')
			case 1:
				return t('registries.fields.protocols.mqtt')
			case 2:
				return t('registries.fields.protocols.http')
			case 3:
				return `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}`
			default:
				break;
		}
	}

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
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						t={t}
						customColumn={[
							{
								id: 'name',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('registries.fields.name')}
								</Typography>
							}
						]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.uuid);
							return (
								<TableRow
									hover
									onClick={handleClick(n.uuid)}
									role='checkbox'
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.uuid}
									selected={isSelected}
									style={{ cursor: 'pointer' }}
								>
									<Hidden lgUp>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.uuid)} />} />
										<TC content={
											<ItemGrid container zeroMargin noPadding alignItems={'center'}>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${renderProtocol(n.protocol)}`}
													</Caption>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{`${n.customer_name ? n.customer_name : t('users.fields.noOrg')}`}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.uuid)} />} />
										<TC
											onMouseEnter={e => { setHover(e, n) }}
											onMouseLeave={unsetTimeout}
											FirstC label={n.name} />
										<TC label={n.region} />
										<TC label={renderProtocol(n.protocol)} />
										<TC label={dateFormatter(n.created)} />
										<TC label={n.customer_name} />
										{/* <TC label={dateFormatter(n.endDate)}/> */}
										{/* <TC label={dateFormatter(n.created)}/> */}
										{/* <TC label={dateFormatter(n.modified)}/> */}
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
				page={page}
				t={t}
				handleChangePage={handleChangePage}
			/>
		</Fragment>
	)
}


export default RegistryTable