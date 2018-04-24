import styled from "styled-components"
import { Cell, ListItemContainer } from '../../../List/ListStyles'


export const HeaderColumnsContainer = styled(ListItemContainer) `
	/* flex: 1;
	display:grid;
	grid-template-columns: repeat(${p => p.columnCount}, 1fr);
	
	height: 100%;
	border-radius: 5px 0px 0px 5px;
	margin: 3px 0px 3px 8px;
	margin-right: 20px; */
	/* margin-left: 4px; */
	margin-right: 30px;
	background: none;
	&:hover {
		background:none;
	}
`
export const DraggableHeader = Cell.extend`
	display:flex;
	
	background: ${p => p.active ? p.theme.tab.hover : ''};
	color: #fff;
	/* margin: 0px;
	padding-left: 8px; */
	border-radius: 4px; 
	
	user-select: none;
	cursor: pointer;
	
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
`
export const LabelHeader = styled.div`
	display:flex;
	justify-content: space-between;
	
	width: 100%;
	
	color: #fff;
	font-weight:${p => p.active ? 700 : 400};
	/* margin: 0px; */
	border-radius: 4px;
	
	&:after{
		${p => p.active ? `
		content: "\u2191";
		font-weight: 700;
		margin-left: auto;
		margin-right: 4px;
		transform: ${p.sorting ? 'rotate(180deg)' : ''};
	` : null};
	}
`