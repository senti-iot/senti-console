import styled from "styled-components"
import { transparentize } from 'polished'

export const HeaderListContainer = styled.div`
	display:flex;
	flex-flow: row nowrap;
	align-items:center;
	background: ${p => p.theme.header.background};
	color: #FFFFFF;
	padding: 5px;
	border-radius: 4px;
	margin: 10px 5px;
	min-height:30px;
`

export const Input = styled.input`
	-moz-appearance: none;
	-webkit-appearance: none;
	border: none;
	background: inherit;
	outline:none;
	height:100%;
`

export const SearchContainer = styled.div`
	display:flex;
	align-items:center;
    padding: 5px;
	height: 35px;
    color: ${(props) => props.color ? props.color : '#2C3E50'};
    background: #ECF0F1;
    border: none;
	border-radius: 4px;
    box-sizing: border-box;
	outline: none;
	margin: 0px 5px;
	box-shadow: ${(props) => props.active ? `0 0 0 3px ` + props.theme.tab.selected : ``};
    &:hover {
        border-color: ${p => transparentize(0.7, p.theme.tab.hover)};
		box-shadow: ${p => `0 0 0 3px ${transparentize(0.7, p.theme.tab.hover)}`};
		cursor: ${(props) => props.isDisabled ? 'not-allowed' : 'pointer'};
    }

    &:focus {
		box-shadow: ${(props) => `0 0 0 3px ` + props.theme.tab.selected};
    }
`
export const DatePickerInput = SearchContainer.extend`
	padding: 0px 10px;
`
export const View = styled.div`
	height:100%;
	width:100%;
	display:flex;
	flex-flow:column nowrap;
`
export const CardsContainer = styled.div`
	display:grid;
	grid-template-columns: repeat( auto-fit,minmax(270px,1fr) );
	grid-auto-rows: auto;
	grid-gap:10px;
	overflow-x: auto;
`

export const ListContainer = styled.div`
	display:grid;
	margin: 5px;
	grid-template-columns: 1fr;
	overflow-y:auto;
`

export const FunctionBar = styled.div`
	display:flex;
	flex-flow:row nowrap;
	align-items:center;
	height: 45px;
	min-height: 45px;
`
export const ChangeViewButtonContainer = styled.div`
	display:flex;
	flex:1;
	justify-content:flex-end;
	flex-flow: row nowrap;
	align-items:center;
	/* margin: 4px; */
`

export const ChangeViewButton = styled.div`
	background: ${p => p.theme.tab.selected};
	padding: 5px 10px;
	color: ${p => p.theme.tab.activeColor};
	border-radius: 5px;
	margin:5px;
	cursor:pointer;
	&:hover {
		border-color: ${p => transparentize(0.7, p.theme.tab.hover)};
		box-shadow: ${p => `0 0 0 3px ${transparentize(0.7, p.theme.tab.hover)}`};
	}
`

export const ChangeViewButtonList = ChangeViewButton.extend`
	background: ${p => p.view === 1 ? p.theme.tab.selected : p.theme.tab.unselected};
`
export const ChangeViewButtonCard = ChangeViewButton.extend`
	background: ${p => p.view === 0 ? p.theme.tab.selected : p.theme.tab.unselected};
`
export const ChangeViewButtonMap = ChangeViewButton.extend`
	background: ${p => p.view === 2 ? p.theme.tab.selected : p.theme.tab.unselected};
`
