import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TablePagination, withWidth } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'
import { changeCardsPerPage } from 'redux/appState';

class CP extends Component {
	
	handleChangeRowsPerPage = e => {
		this.props.changeCardsPerPage(e.target.value)
	}
	handleChangePage = (e, page) => {
		this.props.handleChangePage(e, page)
	}
	render() {
		const { count, rowsPerPage, cardsPerPageOptions, t, classes, page, width } = this.props
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
				labelRowsPerPage={isWidthUp('sm', width) ?  t('tables.cardsPerPage') : ''}
				rowsPerPageOptions={cardsPerPageOptions}
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
	cardsPerPageOptions: state.settings.cardsPerPageOptions,
	rowsPerPage: state.appState.CPP
})

const mapDispatchToProps = (dispatch) => ({
	changeCardsPerPage: (value) => dispatch(changeCardsPerPage(value)),
})

export default withWidth()(connect(mapStateToProps, mapDispatchToProps)(CP))
