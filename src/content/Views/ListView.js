import React, { Component } from 'react'
import ListItem from '../List/ListItem'
import { ListContainer, HeaderListContainer } from './ViewStyles'
import Checkbox from './Components/CheckBox/CheckBox'
import SortableList from './Components/HeaderList/HeaderContainer'

export default class ListView extends Component {
	constructor(props) {
		super(props)

		this.state = {
			// pageOfItems: [],
			checkedItems: [],
			dragging: false,
			checkBox: false,
			drawer: {
				id: -1,
				isOpen: false
			}
		}
	}

	handleSort = (column) => e => {
		this.props.handleSort(column)(e)
	}

	componentWillUpdate = (nextProps, nextState) => {
		if (nextProps.items !== this.props.items) {
			if (nextProps.items.filter(c => nextState.checkedItems.includes(c.id)).length === nextProps.items.length)
				this.setState({ checkBox: true })
			else
				this.setState({ checkBox: false })
		}
	}


	onCheckedItem = (id, add) => {
		var newArr = this.state.checkedItems
		if (add)
			newArr.push(id)
		else
			newArr = newArr.filter(c => c !== id)
		this.setState({ checkedItems: newArr })
		this.props.onCheckedItems(newArr)

	}
	onHeaderCheckBox = (add) => {
		var newArr = this.state.checkedItems
		var Items = this.props.items.map(c => c.id)
		if (add) {
			Items = Items.filter(c => !newArr.includes(c))
			newArr.push(...Items)
		}
		else
			newArr = newArr.filter(c => !Items.includes(c))
		this.setState({ checkedItems: newArr, checkBox: add })
		this.props.onCheckedItems(newArr)
	}
	activeColumnSorting = (col) => {
		return col === this.props.sortColumn ? true : false
	}
	handleActiveColumnCount = () => {
		var x = 0
		this.props.columns.map(c => c.visible === true ? x = x + 1 : null)
		return x
	}
	handleActiveListDrawer = (id, open) => {
		this.setState({
			drawer: {
				id: id,
				isOpen: open
			}
		})
	}
	handleSortStart = () => {
		this.setState({ dragging: true })
	}
	handleSortEnd = ({ oldIndex, newIndex }) => {
		this.props.onSortEnd({ oldIndex, newIndex })
		this.setState({ dragging: false })
	}
	render() {
		return (
			<React.Fragment>
				<HeaderListContainer >
					<Checkbox size={'medium'} isChecked={this.state.checkBox} onChange={this.onHeaderCheckBox} />
					<SortableList
						lockAxis={'x'}
						hideSortableGhost={true}
						helperClass={'dragged'}
						pressDelay={150} axis={'x'}
						onSortStart={this.handleSortStart}
						onSortEnd={this.handleSortEnd}
						columns={this.props.columns}
						handleSort={this.handleSort}
						handleActiveColumnCount={this.handleActiveColumnCount}
						activeColumnSorting={this.activeColumnSorting}
						sortDirection={this.props.sortDirection}
					/>
				</HeaderListContainer>
				<ListContainer >
					{this.props.items.length !== 0 ?
						this.props.items.map((c, i) =>
							<ListItem
								column={this.props.columns}
								columnCount={this.handleActiveColumnCount}
								item={c}
								key={i}
								onChecked={this.onCheckedItem}
								isChecked={this.state.checkedItems.findIndex(o => o === c.id) !== -1 ? true : false}
								drawer={this.state.drawer}
								handleActiveListDrawer={this.handleActiveListDrawer}
							/>)
						: <div>No Items</div>}
				</ListContainer>
			</React.Fragment>
		)
	}
}
