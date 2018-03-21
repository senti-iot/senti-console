import React, { PureComponent } from 'react'
import ListItem from '../List/ListItem'
import { ListContainer, HeaderListContainer } from './ViewStyles'
import Checkbox from './Components/CheckBox/CheckBox'
import SortableList from './Components/HeaderList/HeaderContainer'

export default class ListView extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			// pageOfItems: [],
			checkedItems: [],
			dragging: false
		}
	}

	handleSort = (column) => e => {
		this.props.handleSort(column)(e)
	}

	onCheckedItem = (id, add) => {
		var newArr = this.state.checkedItems
		if (add)
			newArr.push(id)
		else
			newArr = newArr.filter(c => c !== id)
		this.setState({ checkedItems: newArr })

	}

	activeColumnSorting = (col) => {
		return col === this.props.sortColumn ? true : false
	}
	handleActiveColumnCount = () => {
		var x = 0
		this.props.columns.map(c => c.visible === true ? x = x + 1 : null)
		return x
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
					<Checkbox size={'medium'} style={{ marginLeft: 4 }} />
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
							/>
						) : <div>No Items</div>}
				</ListContainer>
			</React.Fragment>
		)
	}
}
