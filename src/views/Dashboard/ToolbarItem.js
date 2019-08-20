import React from 'react'
import { Paper } from '@material-ui/core';
import { useDrag } from 'react-dnd';
import { T } from 'components';

const ToolbarItem = ({ name, type }) => {
	const [{ isDragging }, drag] = useDrag({
		item: { name, type: type },
		end: dropResult => {
			if (dropResult) {
			}
		},
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	return (
		<div ref={drag} style={{ margin: '0px 4px', opacity: isDragging ? 0.4 : 1, transition: 'all 300ms ease', cursor: 'move' }}>
			<Paper style={{ padding: '8px' }}>
				<T style={{ textAlign: 'center' }}>
					{name}
				</T>
			</Paper>
		</div>
	)
}

export default ToolbarItem
