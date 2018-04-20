import styled from "styled-components"
import { Cell } from '../../../List/ListStyles'


export const HeaderColumnsContainer = styled.div`
	flex: 1;
	display:grid;
	grid-template-columns: repeat(${p => p.columnCount}, 150px);
	
	height: 100%;
	
	margin-right: 35px;
	margin-left: 4px;
`
export const DraggableHeader = Cell.extend`
	display:flex;
	
	background: ${p => p.active ? p.theme.tab.hover : ''};
	color: #fff;
	margin: 0px;
	padding-left: 8px;
	border-radius: 4px;
	
	user-select: none;
	cursor: pointer;
	
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
`
export const LabelHeader = Cell.extend`
	display:flex;
	justify-content: space-between;
	
	width: 100%;
	
	color: #fff;
	font-weight:${p => p.active ? 700 : 400};
	margin: 0px;
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