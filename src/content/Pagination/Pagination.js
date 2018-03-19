import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageButton, PageNumberButton, PageNumberContainer, PaginationContainer } from './PaginationStyles'
import { isEqual } from '../../utils/func'
var _ = require('lodash')

const propTypes = {
	onChangePage: PropTypes.func.isRequired,
	initialPage: PropTypes.number
}

const defaultProps = {
	initialPage: 1
}

class Pagination extends Component {
	constructor(props) {
		super(props)
		this.state = { pager: {} }
	}

	componentWillMount() {
		if (this.props.items && this.props.items.length) {
			this.setPage(this.props.initialPage)
		}
	}
	componentWillUpdate = (nextProps, nextState) => {
		if (this.state.pager.currentPage > nextState.pager.endPage && nextState.pager.currentPage !== 1) {
			this.setPage(nextState.pager.endPage)
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.pageSize !== prevProps.pageSize) {
			if (this.state.pager.currentPage < this.state.pager.endPage) {
				this.setPage(this.state.pager.currentPage)
			}
			else {
				this.setPage(this.state.pager.endPage)
			}
		}

		if (!isEqual(this.props.items, prevProps.items)) {
			this.setPage(this.props.initialPage)
		}
	}

	setPage(page) {
		var items = this.props.items
		var pager = this.state.pager

		pager = this.getPager(items.length, page, this.props.pageSize)
		var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1)

		this.setState({ pager: pager })
		this.props.onChangePage(pageOfItems)
	}

	getPager(totalItems, currentPage, pageSize) {

		currentPage = currentPage || 1
		pageSize = pageSize || this.props.pageSize || 10
		var totalPages = Math.ceil(totalItems / pageSize)
		var startPage, endPage

		if (totalPages <= 10) {
			startPage = 1
			endPage = totalPages
		} else {
			if (currentPage <= 6) {
				startPage = 1
				endPage = 10
			} else if (currentPage + 4 >= totalPages) {
				startPage = totalPages - 9
				endPage = totalPages
			} else {
				startPage = currentPage - 5
				endPage = currentPage + 4
			}
		}

		var startIndex = (currentPage - 1) * pageSize
		var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)
		var pages = _.range(startPage, endPage + 1)

		return {
			totalItems: totalItems,
			currentPage: currentPage,
			pageSize: pageSize,
			totalPages: totalPages,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			pages: pages
		}
	}

	render() {
		var pager = this.state.pager
		return (
			<PaginationContainer>
				{pager.totalPages >= 1 ? <React.Fragment>
					<PageButton onClick={() => this.setPage(1)}>First</PageButton>
					<PageButton onClick={() => this.setPage(pager.currentPage - 1)}>Previous</PageButton>
					<PageNumberContainer>
						{pager.pages.map((page, index) =>
							<PageNumberButton key={index} active={pager.currentPage === page ? true : false} onClick={() => this.setPage(page)}>{page}</PageNumberButton>
						)}
					</PageNumberContainer>
					<PageButton onClick={() => this.setPage(pager.currentPage + 1)}>Next</PageButton>
					<PageButton onClick={() => this.setPage(pager.totalPages)}>Last</PageButton>
				</React.Fragment> : null}
			</PaginationContainer>
		)
	}
}

Pagination.propTypes = propTypes
Pagination.defaultProps = defaultProps
export default Pagination