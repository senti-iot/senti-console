import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography,
} from '@material-ui/core'
import tokentableStyles from 'assets/jss/components/tokens/tokentableStyles'
import React, { Fragment, useState } from 'react'
// import { dateFormatter } from 'variables/functions'
import TableHeader from 'components/Table/TableHeader'
import { ItemGrid, Info, Caption } from 'components'
import { useSelector } from 'react-redux'
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import { dateTimeFormatter } from 'variables/functions';
import { useLocalization } from 'hooks'

const TokensTable = props => {
	//Hooks
	const classes = tokentableStyles() // newly created file for styles
	const t = useLocalization()

	//Redux
	const rowsPerPage = useSelector(state => state.appState.trp > 0 ? state.appState.trp : state.settings.trp)
	const users = useSelector(state => state.data.users)

	//State
	const [page, setPage] = useState(0)

	//Const
	const { handleClick, selected, order, data, orderBy, handleCheckboxClick } = props
	let emptyRows;
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
	//useCallbacks

	//useEffects

	//Handlers

	const handleRequestSort = (event, property) => {
		props.handleRequestSort(event, property)
	}

	const handleChangePage = (event, newpage) => {
		setPage(newpage)
	}

	const isSelectedFunc = id => props.selected.indexOf(id) !== -1

	const handleSelectAllClick = (event, checked) => {
		const { data } = props
		let selected = data.map(d => d.id)
		props.handleSelectAllClick(selected, checked)
	}

	const findUserName = (uuid) => {
		let u = users[users.findIndex(f => f.uuid === uuid)]
		if (u) {
			return u.firstName + " " + u.lastName
		}
		else return uuid
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
						onRequestSort={handleRequestSort}
						rowCount={data ? data.length : 0}
						columnData={props.tableHead}
						t={t}
						classes={classes}
						customColumn={[
							{
								id: 'name',
								label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
									{t('tokens.fields.name')}
								</Typography>
							}
						]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = isSelectedFunc(n.id);
							return (
								<TableRow
									hover
									onClick={handleClick(n)}
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
														{n.name}
													</Info>
												</ItemGrid>
												<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
													<Caption noWrap className={classes.noMargin}>
														{dateTimeFormatter(n.created, true)}
													</Caption>
												</ItemGrid>
											</ItemGrid>
										} />
									</Hidden>

									<Hidden mdDown>
										<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
										{/* <TC
											checkbox
											label={n.id} /> */}
										<TC
											FirstC
											label={n.name}
										/>
										<TC label={n.count}/>
										<TC label={dateTimeFormatter(n.lastCall, true)} />
										<TC label={dateTimeFormatter(n.created, true)} />
										<TC label={findUserName(n.createdBy)} href={{ pathname: `/management/user/${n.createdBy}`, prevURL: '/api/list' }}/>
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

export default TokensTable