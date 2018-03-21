import React from 'react'
import { SortableElement } from 'react-sortable-hoc'
import { DraggableHeader, LabelHeader } from './HeaderStyles'
import { Text } from '../../../List/ListStyles'

const HeaderItem = SortableElement(({ c, index, onClick, activeColumnSorting, sortDirection }) => {

	var column = c.column.replace('_', ' ')
	column = column.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase()) 
	var str = 'some space'
	console.log(str.indexOf(' '))
	return <DraggableHeader>
		<LabelHeader onClick={onClick} active={activeColumnSorting(c.column)} sorting={sortDirection}>
			<Text title={column}>{column.charAt(0).toUpperCase() + column.slice(1)}</Text>
		</LabelHeader>
	</DraggableHeader>
}
)

export default HeaderItem
