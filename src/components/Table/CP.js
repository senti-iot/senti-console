import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TablePagination, withWidth } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'
import { changeCardsPerPage } from 'redux/appState';
import { useLocalization } from 'hooks';


// const mapStateToProps = (state) => ({
// 	cardsPerPageOptions: state.settings.cardsPerPageOptions,
// 	rowsPerPage: state.appState.CPP
// })

// const mapDispatchToProps = (dispatch) => ({
// 	changeCardsPerPage: (value) => dispatch(changeCardsPerPage(value)),
// })

const CP = props => {
	const t = useLocalization()
	const dispatch = useDispatch()
	const cardsPerPageOptions = useState(state => state.settings.cardsPerPageOptions)
	const rowsPerPage = useSelector(state => state.appState.CPP)

	const handleChangeRowsPerPage = e => {
		dispatch(changeCardsPerPage(e.target.value))
	}
	const handleChangePage = (e, page) => {
		props.handleChangePage(e, page)
	}

	const { count, classes, page, width } = props
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
					select: classes.SelectIcon
				}
			}}
		/>
	)
}

export default withWidth()(CP)
