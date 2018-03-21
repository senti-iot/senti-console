import React, { PureComponent } from 'react'
import ListItem from '../List/ListItem'
// import Pagination from '../Pagination/Pagination'
import { ListContainer, LabelHeader, /* CellHeader, ResponsibleHeader, */ HeaderListContainer, CellHeaderContainer, DraggableHeader } from './ViewStyles'
import Checkbox from './Components/CheckBox'
import { Text } from '../List/ListStyles'
import { SortableElement, SortableHandle, SortableContainer } from 'react-sortable-hoc'

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

	// onChangePage = (pageOfItems) => {
	// 	if (this.state.pageOfItems !== pageOfItems)
	// 		this.setState({ pageOfItems: pageOfItems, checkedItems: [] })
	// }
	activeColumnSorting = (col) => {
		// e.preventDefault()
		return col === this.props.sortColumn ? true : false
	}
	handleActiveColumnCount = () => {
		var x = 0
		this.props.columns.map(c => c.visible === true ? x = x + 1 : null)
		return x
	}
	HeaderHandle = SortableHandle(() => {
		return <span>{'<|>'}</span>
	})
	HeaderItem = SortableElement(({ c, index, onClick }) =>
		<DraggableHeader>
			<LabelHeader onClick={onClick} active={this.activeColumnSorting(c.column)} sorting={this.props.sortDirection}>
				<Text title={c.column}>{c.column.charAt(0).toUpperCase() + c.column.slice(1)}</Text>
			</LabelHeader>
		</DraggableHeader>
	)
	SortableList = SortableContainer(({ columns }) => {
		return <CellHeaderContainer columnCount={this.handleActiveColumnCount}>
			{columns ? this.props.columns.map((c, i) => {
				if (c.visible) {

					return <this.HeaderItem c={c} index={i} onClick={this.handleSort(c.column)} />
				}
				else return null
			})
				: null
			}
		</CellHeaderContainer>
	})
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

					<this.SortableList lockAxis={'x'} hideSortableGhost={true} helperClass={'dragged'} pressDelay={150} axis={'x'} onSortStart={this.handleSortStart} onSortEnd={this.handleSortEnd} columns={this.props.columns} />
					{/* <CellHeaderContainer columnCount={this.handleActiveColumnCount}> */}

					{/* {this.props.columns ? this.props.columns.map((c, i) => {
							if (c.visible) {
								const HeaderItem = SortableElement(({ c, i }) =>
									<LabelHeader onClick={this.handleSort(c.column)} active={this.activeColumnSorting(c.column)} sorting={this.props.sortDirection}>
										<Text title={c.column}>{c.column.charAt(0).toUpperCase() + c.column.slice(1)}</Text>
									</LabelHeader>
								)
								return <HeaderItem c={c} i={i} />
							}
							else return null
						}
							// <LabelHeader onClick={this.handleSort(c.column)} active={this.activeColumnSorting(c.column)} sorting={this.props.sortDirection}>
							// 	<Text title={c.column}>{c.column.charAt(0).toUpperCase() + c.column.slice(1)}</Text>
							// </LabelHeader>
						) :
							<React.Fragment>
								<LabelHeader onClick={this.handleSort('name')} active={this.activeColumnSorting('name')} sorting={this.props.sortDirection}>
									<Text>Name</Text>
								</LabelHeader>
								<CellHeader onClick={this.handleSort('progress')} active={this.activeColumnSorting('progress')} sorting={this.props.sortDirection}>
									<Text>Gennemfort</Text>
								</CellHeader>
								<CellHeader onClick={this.handleSort('date')} active={this.activeColumnSorting('date')} sorting={this.props.sortDirection}>
									<Text>Dato</Text>
								</CellHeader>
								<ResponsibleHeader onClick={this.handleSort('responsible')} active={this.activeColumnSorting('responsible')} sorting={this.props.sortDirection}>
									<Text>Responsible</Text>
								</ResponsibleHeader>
							</React.Fragment>} */}
					{/* </CellHeaderContainer> */}
				</HeaderListContainer>
				<ListContainer pageSize={this.props.pageSize} >

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
				{/* <Pagination items={this.props.items} onChangePage={this.onChangePage} pageSize={this.props.pageSize} /> */}
			</React.Fragment>

		)
	}
}
