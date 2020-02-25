import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TablePagination, withWidth } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'
import { changeCardsPerPage } from 'redux/appState'
import { useLocalization, useWidth } from 'hooks'
import tpStyles from 'assets/jss/components/table/tpStyles'

const CP = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	const classes = tpStyles()
	const width = useWidth()
	//Redux

	const cardsPerPageOptions = useSelector(state => state.settings.cardsPerPageOptions)
	const rowsPerPage = useSelector(state => state.appState.CPP)

	//State

	//Const
	const { count, page } = props

	//Handlers
	const handleChangeRowsPerPage = e => {
		dispatch(changeCardsPerPage(e.target.value))
	}
	const handleChangePage = (e, page) => {
		props.handleChangePage(e, page)
	}

	return (
		<TablePagination
			component='div'
			count={count}
			rowsPerPage={rowsPerPage}
			page={page}
			backIconButtonProps={{
				'aria-label': t('actions.nextPage'),
			}}
			nextIconButtonProps={{
				'aria-label': t('actions.previousPage'),
			}}
			classes={{
				spacer: classes.spacer,
				input: classes.spaceBetween,
				caption: classes.tablePaginationCaption
			}}
			labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('tables.of')} ${count}`}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={handleChangeRowsPerPage}
			labelRowsPerPage={isWidthUp('sm', width) ? t('tables.cardsPerPage') : ''}
			rowsPerPageOptions={cardsPerPageOptions}
			SelectProps={{
				classes: {
					select: classes.selectIcon
				}
			}}
		/>
	)
}

export default withWidth()(CP)
