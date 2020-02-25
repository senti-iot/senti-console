import React from 'react'
import { Paper, Tooltip } from '@material-ui/core';
import { useDrag } from 'react-dnd';

const ToolbarItem = (props) => {
	const { name, type } = props
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
			<Tooltip title={name}>
				<Paper style={{ padding: '8px', display: 'flex' }}>
					<props.icon />
				</Paper>
			</Tooltip>
		</div>
	)
}

export default ToolbarItem
