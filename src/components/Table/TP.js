import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TablePagination, withWidth } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'

class TP extends Component {
	handleChangeRowsPerPage = e => {
		this.props.handleChangeRowsPerPage(e)
	}
	handleChangePage = (e, page) => {
		this.props.handleChangePage(e, page)
	}
	render() {
		const { count, rowsPerPage, rowsPerPageOptions, t, classes, page, width } = this.props
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
				onChangePage={this.handleChangePage}
				onChangeRowsPerPage={this.handleChangeRowsPerPage}
				labelRowsPerPage={isWidthUp('sm', width) ?  t('tables.rowsPerPage') : ''}
				rowsPerPageOptions={ rowsPerPageOptions}
				SelectProps={{
					classes: {
						select: classes.SelectIcon
					}
				}}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	rowsPerPageOptions: state.settings.rowsPerPageOptions,
})

const mapDispatchToProps = {

}

export default withWidth()(connect(mapStateToProps, mapDispatchToProps)(TP))
