import styled from "styled-components"
import { transparentize } from 'polished'

export const DropDownButton = styled.div`
	display:flex;
	align-items:center;
	background: ${p => p.theme.tab.selected};
	padding: 5px 10px;
	color: ${p => p.theme.tab.activeColor};
	cursor:pointer;
	border-radius: 4px;
	height: 25px;
	width: 25px;
	justify-content:center;
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
	position:absolute;
	background:${p => p.theme.header.background};
	z-index: 3;
	display:flex;
	flex-flow: column nowrap;
	min-width: 45px;
	border-radius: 4px;
	overflow:hidden;
`

export const DropDownContainer = styled.div`
	position:relative;
	height:100%;
	min-width:30px;
	margin:5px;
	margin-top: 15px;
`

export const DropDownItem = styled.div`
	display:flex;
	align-items:center;
	min-width:30px;
	justify-content:center;
	padding:5px;
	color: #FFFFFF;
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
	cursor:pointer;
	font-weight: ${p => p.active ? 700 : 300};
	background: ${p => p.active ? p.theme.tab.selected : ''};
`

export const DropDownSection = styled.div`
	display:flex;
	flex-flow:column nowrap;
	min-height:30px;
	font-weight: ${p => p.active ? 700 : 300};
	background: ${p => p.active ? p.theme.tab.selected : ''};

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
	color: #FFF;
	align-items:center;
	padding-left: 30px;
	background: ${p => p.active ? p.theme.tab.hover : p.theme.menu.background};
	&:hover {
		background: ${p => p.theme.tab.hover};
	}
`

export const DropDownText = styled.div`
	color: #FFFFFF;
	display: flex;
	align-items:center;
	flex:1;
	min-height: 30px;
	margin-right:4px;
	font-weight: ${p => p.active ? 700 : 300};
	&:after {
		${p => p.active ? `
		font-weight: 700;
		content: "\u2191";
		transform: ${p.sorting ? 'rotate(180deg)' : ''};
		margin-right: 4px;
		margin-left: auto;
	` : null}
`