import styled from "styled-components"
import { transparentize } from 'polished'

export const DropDownButton = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	
	height: 25px;
	width: 25px;
	
	background: ${p => p.theme.tab.selected};
	color: ${p => p.theme.tab.activeColor};
	
	padding: 5px 10px;
	border-radius: 4px;
	cursor:pointer;
	
	&:hover {
		border-color: ${p => transparentize(0.7, p.theme.tab.hover)};
		box-shadow: ${p => `0 0 0 3px ${transparentize(0.7, p.theme.tab.hover)}`};
		background: ${p => p.theme.tab.hover};
		color: ${p => p.theme.tab.activeColor};
	}
`
export const Margin = styled.div`
	height: 5px;
	width: 100%;
	
	background:transparent;
`

export const DropDown = styled.div`
	display:flex;
	flex-flow: column nowrap;
	
	min-width: 45px;
	
	background:${p => p.theme.header.background};
	border-radius: 4px;
	overflow:hidden;
	
	position:absolute;
	z-index: 3;
`

export const DropDownContainer = styled.div`
	height:100%;
	min-width:30px;

	margin:5px;
	margin-top: 15px;
	
	position:relative;
`

export const DropDownItem = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	
	min-width:30px;
	
	background: ${p => p.active ? p.theme.tab.selected : ''};
	color: #FFFFFF;
	font-weight: ${p => p.active ? 700 : 300};
	padding:5px;
	
	cursor:pointer;
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
`

export const DropDownSection = styled.div`
	display:flex;
	flex-flow:column nowrap;
	
	min-height:30px;
	
	background: ${p => p.active ? p.theme.tab.selected : ''};
	font-weight: ${p => p.active ? 700 : 300};

	cursor:pointer;
`

export const DropDownSubSection = DropDownSection.extend`
	flex-flow: row nowrap;
	
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
`

export const DropDownIcon = styled.div`
	display:flex;
	align-items:center;
	
	min-height: 30px;
	
	margin-right: 4px;
	margin-left: 4px;
`

export const DropDownSubItem = styled.div`
	display:flex;
	align-items:center;
	
	color: #FFF;
	background: ${p => p.active ? p.theme.tab.hover : p.theme.menu.background};
	padding-left: 30px;
	
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
`

export const DropDownText = styled.div`
	flex:1;
	display: flex;
	align-items:center;
	
	min-height: 30px;
	
	color: #FFFFFF;
	font-weight: ${p => p.active ? 700 : 300};
	margin-right:4px;
	
	&:after {
		${p => p.active ? `
		content: "\u2191";
		font-weight: 700;
		margin-right: 4px;
		margin-left: auto;
		transform: ${p.sorting ? 'rotate(180deg)' : ''};
	` : null}
`