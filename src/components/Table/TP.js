import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TablePagination, withWidth, withStyles } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'
import { changeTableRows } from 'redux/appState';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import cx from 'classnames'
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	rowsPerPageOptions: state.settings.rowsPerPageOptions,
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp
// })

// const mapDispatchToProps = (dispatch) => ({
// 	handleChangeRowsPerPage: (value) => dispatch(changeTableRows(value)),
// })

const TP = props => {
	const dispatch = useDispatch()
	const t = useLocalization()
	const rowsPerPageOptions = useSelector(state => state.settings.rowsPerPageOptions)
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)

	const handleChangeRowsPerPage = e => {
		dispatch(changeTableRows(e.target.value))
	}
	const handleChangePage = (e, page) => {
		props.handleChangePage(e, page)
	}
	const { count, classes, page, width, disableRowsPerPage } = props
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
			rowsPerPageOptions={rowsPerPageOptions}
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

export default withStyles(devicetableStyles)(withWidth()(TP))
