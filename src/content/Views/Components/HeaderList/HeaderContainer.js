import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { HeaderColumnsContainer } from './HeaderStyles'
import HeaderItem from './HeaderItem'

const SortableList = SortableContainer(({ columns, handleSort, handleActiveColumnCount, activeColumnSorting, sortDirection }) => {
	return <HeaderColumnsContainer columnCount={handleActiveColumnCount}>
		{columns ? columns.map((c, i) => {
			if (c.visible) {
				return <HeaderItem
					c={c}
					key={i}
					index={i}
					onClick={handleSort(c.column)}
					activeColumnSorting={activeColumnSorting}
					sortDirection={sortDirection}
				/>
			}
			else return null
		})
			: null
		}
	</HeaderColumnsContainer>
})

export default SortableList