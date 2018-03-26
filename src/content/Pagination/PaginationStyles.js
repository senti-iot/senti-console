import styled from "styled-components"
import { transparentize } from 'polished'


export const PageButton = styled.a`
	display: flex;
	align-items: center;

	height: 30px;

	background: ${p => p.theme.tab.selected};
	color: ${p => p.theme.tab.activeColor};

	padding: 5px 10px;
	border-radius: 5px;
	margin:5px;

	cursor:pointer;

	&:hover{
		background: ${p => p.theme.tab.hover};
		color: ${p => p.theme.tab.activeColor};
		border-color: ${p => transparentize(0.7, p.theme.tab.hover)};
		box-shadow: ${p => `0 0 0 3px ${transparentize(0.7, p.theme.tab.hover)}`};
	}
`

export const PageNumberButton = styled.a`
	display: flex;
	align-items: center;
	justify-content: center;
	
	height: 100%;
	padding: 10px;
	
	background: ${p => p.active ? p.theme.tab.selected : p.theme.tab.unselected};
	color: ${p => p.active ? '#fff' : '#000'};
	
	
	cursor:pointer;
	
	&:hover{
		background: ${p => p.theme.tab.hover};
		color: ${p => p.theme.tab.activeColor};
	}
`

export const PageNumberContainer = styled.div`
	display: flex;
	align-items: center;
	
	height: 30px;
	
	background: ${p => p.theme.tab.unselected};
	color: #000;
	border-radius:5px;
	overflow:hidden;
	padding:5px 0px;
	
	&:hover {
		border-color: ${p => transparentize(0.7, p.theme.tab.hover)};
		box-shadow: ${p => `0 0 0 3px ${transparentize(0.7, p.theme.tab.hover)}`};
	}
`

export const PaginationContainer = styled.div`
	display:flex;
	flex-flow:row nowrap;
	justify-content:center;
	align-items:center;
	
	height: 50px;
	min-height:50px;

	margin-top:auto;
`