import React, { Component } from 'react'
import { CardListContainer/*  HeaderListContainer, CellHeaderContainer, LabelHeader, CellHeader, ResponsibleHeader  */ } from './ViewStyles'
// import Pagination from '../Pagination/Pagination'
import CardItem from '../Card/CardItem'

export default class CardView extends Component {
	constructor(props) {
		super(props)

		this.state = {
			pageOfItems: [],
		}
	}
	// renderChildren = () => {
	// 	const arr = this.props.items.map((c, i) => {
	// 		console.log(c)
	// 		return <FormCard
	// 			key={i}
	// 			item={c}
	// 		/>
	// 	})
	// 	return arr
	// }
	handleSort = (column) => e => {
		e.preventDefault()
		this.props.handleSort(column)
	}
	onChangePage = (pageOfItems) => {
		// console.log('onChangePage', pageOfItems)
		// update state with new page of items
		if (this.state.pageOfItems !== pageOfItems)
			this.setState({ pageOfItems: pageOfItems })
	}
	activeColumnSorting = (col) => {
		// e.preventDefault()
		return col === this.props.sortColumn ? true : false
	}
	render() {
		// console.log('CardView', this.props.pageSize)
		// const arr = this.renderChildren()
		return (

			this.props.items.length !== 0 ?
				<React.Fragment>
					<CardListContainer pageSize={this.props.pageSize}>
						{this.props.items.map((c, i) =>
							<CardItem
								key={i}
								item={c}
								column={this.props.columns}
							/>
						)}</CardListContainer>
					{/* <Pagination items={this.props.items} onChangePage={this.onChangePage} pageSize={this.props.pageSize} /> */}
				</React.Fragment>
				:
				<div>No Items</div>

		)
	}
}