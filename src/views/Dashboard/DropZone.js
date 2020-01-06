import React from 'react'
import { useDrop } from 'react-dnd';
import { withStyles } from '@material-ui/styles';
import { bgColorsDark } from 'assets/jss/material-dashboard-react/bgColorsDark';

const style = (theme) => ({
	container: {
		height: '100%',
		width: '100%',
		transition: 'background 100ms ease',
		overflow: 'auto'
	},
	...bgColorsDark

})

const ItemTypes = [
	"chart", "gauge", "scorecardAB", "scorecard", "windcard", "map", "msChart"
]

const DropZone = ({ i, children, onDrop, color, classes }) => {
	const [{ canDrop, isOver }, drop] = useDrop({
		accept: ItemTypes,
		drop: (item) => onDrop(item),
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	})
	let background = 'inherit'
	const isActive = canDrop && isOver
	if (isActive) {
		background = '#eee'
	} else if (canDrop) {
		// background = 'darkkhaki'
	}
	return (
		<div ref={drop} className={classes.container} style={{ background: background }}>
			{children}
		</div>
	)
}

export default withStyles(style)(DropZone)
