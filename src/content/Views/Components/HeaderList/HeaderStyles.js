import styled from "styled-components"
import { Cell } from '../../../List/ListStyles'


export const HeaderColumnsContainer = styled.div`
	height: 100%;
	display:grid;
	grid-template-columns: repeat(${p => p.columnCount}, 1fr);
	flex: 1;
	margin-right: 25px;
	margin-left: 4px;
`
export const DraggableHeader = Cell.extend`
	color: #fff;
	border-radius: 4px;
	background: ${p => p.active ? p.theme.tab.hover : ''};
	margin: 0px;
	display:flex;
	padding-left: 8px;
	cursor: pointer;
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
	user-select: none;
`
export const LabelHeader = Cell.extend`
	font-weight:${p => p.active ? 700 : 400};
	width: 100%;
	border-radius: 4px;
	margin: 0px;
	color: #fff;
	display:flex;
	justify-content: space-between;
	padding-left: 8px;
	&:after{
		${p => p.active ? `
		font-weight: 700;
		content: "\u2191";
		transform: ${p.sorting ? 'rotate(180deg)' : ''};
		margin-left: auto;
		margin-right: 4px;
	` : null};
	}
`