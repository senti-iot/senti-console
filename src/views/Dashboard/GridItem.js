import React from 'react'

const GridItem = ({ i, children, onDrop }) => {
	// const [{ canDrop, isOver }, drop] = useDrop({
	// 	accept: ItemTypes.BOX,
	// 	drop: (item) => onDrop({ item, i: i }),
	// 	collect: monitor => ({
	// 		isOver: monitor.isOver(),
	// 		canDrop: monitor.canDrop(),
	// 	}),
	// })
	// const isActive = canDrop && isOver
	// let backgroundColor = 'inherit'
	// if (isActive) {
	// 	backgroundColor = 'darkgreen'
	// } else if (canDrop) {
	// 	backgroundColor = 'darkkhaki'
	// }
	return (
		<div /*  style={Object.assign({}, style, { backgroundColor })} */>
			{/* {isActive ? 'Release to drop' : null} */}
			{children}
		</div>
	)
}

export default GridItem