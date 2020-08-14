import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TablePagination } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'
import { changeTableRows } from 'redux/appState'
import cx from 'classnames'
import { useLocalization, useWidth } from 'hooks'
import tpStyles from 'assets/jss/components/table/tpStyles'

const TP = props => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const classes = tpStyles()
	const width = useWidth()
	//Redux
	const rowsPerPageOptions = useSelector(state => state.settings.rowsPerPageOptions)
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)

	//State

	//Const
	const { count, page, disableRowsPerPage } = props


	//Handlers
	const handleChangeRowsPerPage = e => {
		dispatch(changeTableRows(e.target.value))
	}
	const handleChangePage = (e, page) => {
		props.handleChangePage(e, page)
	}
	const handleGenerateAllOptions = () => {
		let all = [...rowsPerPageOptions]
		if (all.findIndex(a => a.value === rowsPerPage) === -1) {
			all.unshift({ value: rowsPerPage, label: rowsPerPage })
		}
		return all
	}
	//Classes
	const selectClasses = cx({
		[classes.SelectIcon]: disableRowsPerPage,
		[classes.noRows]: disableRowsPerPage
	})
	const iconClass = cx({
		[classes.noRows]: disableRowsPerPage
	})

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
			labelDisplayedRows={({ from, to, count }) => disableRowsPerPage ? `` : `${from}-${to} ${t('tables.of')} ${count}`}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={handleChangeRowsPerPage}
			labelRowsPerPage={isWidthUp('sm', width) ? disableRowsPerPage ? `` : t('tables.rowsPerPage') : ''}
			rowsPerPageOptions={handleGenerateAllOptions()}
			SelectProps={{
				renderValue: value => value,
				classes: {
					select: selectClasses,
					icon: iconClass
				}
			}}
		/>
	)
}

export default TP
