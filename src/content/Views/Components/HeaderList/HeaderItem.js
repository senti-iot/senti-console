import React from 'react'
import { SortableElement } from 'react-sortable-hoc'
import { DraggableHeader, LabelHeader } from './HeaderStyles'
import { Text } from '../../../List/ListStyles'

const HeaderItem = SortableElement(({ c, index, onClick, activeColumnSorting, sortDirection }) =>
	<DraggableHeader>
		<LabelHeader onClick={onClick} active={activeColumnSorting(c.column)} sorting={sortDirection}>
			<Text title={c.column}>{c.column.charAt(0).toUpperCase() + c.column.slice(1)}</Text>
		</LabelHeader>
	</DraggableHeader>
)

export default HeaderItem
