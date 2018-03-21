import styled from "styled-components"
import { transparentize } from 'polished'
import { Label, Cell, Responsible } from '../List/ListStyles'


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
	/* width: 200px; */
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

// export const DropDownItemWithArrow = DropDownItem.extend`
// 	width: 200px;
// 	&:after{
// 		${p => p.active ? `
// 		font-weight: 700;
// 		content: "\u2191";
// 		transform: ${p.sorting ? 'rotate(180deg)' : ''};
// 		margin-right: 4px;
// 		margin-left: auto;
// 	` : null};
// 	}
// `

export const DropDownItemWithDot = DropDownItem.extend`
	&:after{
		${p => p.active ? `
		font-weight: 700;
		content: "\u2714";
		transform: ${p.sorting ? 'rotate(180deg)' : ''};
		margin-right: 4px;
		margin-left:auto;
	` : null};
	}
`
export const HeaderListContainer = styled.div`
	display:flex;
	flex-flow: row nowrap;
	align-items:center;
	background: ${p => p.theme.header.background};
	color: #FFFFFF;
	padding: 5px;
	border-radius: 4px;
	margin: 10px 0px;
	min-height:30px;
`
export const CellHeaderContainer = styled.div`
	height: 100%;
	display:grid;
	grid-template-columns: repeat(${p => p.columnCount}, 1fr);
	flex: 1;
	margin-right: 25px;
	margin-left: 4px;
`
export const DraggableHeader = Label.extend`
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
export const LabelHeader = Label.extend`
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
export const CellHeader = Cell.extend`
	font-weight:${p => p.active ? 700 : 400};
	padding-left: 8px;
	border-radius: 4px;
	margin: 0px;
	display:flex;
	justify-content: space-between;
	cursor: pointer;
	&:hover {
		color: #FFFFFF;
		background: ${p => p.theme.tab.hover};
	}
	&:after{
		${p => p.active ? `
		font-weight: 700;
		content: "\u2191";
		transform: ${p.sorting ? 'rotate(180deg)' : ''};
		margin-right: 4px;
	` : null};
	}
`

export const ResponsibleHeader = Responsible.extend`
	font-weight:${p => p.active ? 700 : 400};
	padding-left: 8px;
	font-style: normal;
	border-radius: 4px;
	margin: 0px 4px;
	display:flex;
	justify-content: space-between;
	cursor: pointer;
	&:hover {
		color: #fff;
		background: ${p => p.theme.tab.hover};
	}
	&:after{
		${p => p.active ? `
		font-weight: 700;
		content: "\u2191";
		transform: ${p.sorting ? 'rotate(180deg)' : ''};
		margin-right: 4px;
	` : null};
	}
`

export const Select = styled.select`
	height: 30px;
	padding: 5px;
    -webkit-appearance: none;
    -moz-appearance: none;
	&:-ms-expand {
    display: none;
	}
    text-indent: 1px;
    text-overflow: '';	background: #ECF0F1;
	border:none;
	border-radius: 4px;
	box-sizing: border-box;
	outline: none;
	margin: 0px 5px;
	&:hover {
		border-color: ${p => transparentize(0.7, p.theme.tab.hover)};
		box-shadow: ${p => `0 0 0 3px ${transparentize(0.7, p.theme.tab.hover)}`};
	}
	&:focus {
		box-shadow: ${p => `0 0 0 3px` + p.theme.tab.selected};
	}
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
export const CardListContainer = styled.div`
	display:grid;
	/* display:-ms-grid; */
	/* grid-template-columns: ${p => 'repeat(' + Math.round(p.pageSize / 2) + ',1fr)'}; */
	grid-template-columns: repeat( auto-fit,minmax(270px,1fr) );
	/* grid-template-rows: 1fr 1fr; */
	/* grid-auto-columns: max-content; */
	grid-auto-rows: auto;
	grid-gap:10px;
	/* grid-template-rows: 1fr 1fr; */
	/* position: relative; */
	overflow-x: auto;
`

export const ListContainer = styled.div`
	display:grid;
	margin: 5px;
	grid-template-columns: 1fr;
	overflow-y:auto;
	/* width: 70%; */
`

export const HeaderContainer = styled.div`
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
	margin: 4px;
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