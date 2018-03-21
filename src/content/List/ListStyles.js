import styled from "styled-components"

export const Cell = styled.div`
	display:flex;
	align-items:center;
	overflow: hidden;
	margin: 0px 4px;
	padding-left: 4px;
	height: 30px;
`

export const Text = styled.div`
	display:inline-block;
	text-overflow: ellipsis;
	white-space:nowrap;
	overflow:hidden;
	max-width: 200px;
`

export const ListCardItem = styled.div`
	display:flex;
	flex-flow:row nowrap;
	align-items:center;
	margin: 0px 4px;
`

export const ListItemContainer = styled.div`
	display:grid;
	grid-template-columns: repeat(${p => p.columnCount}, 1fr);
	background: ${p => p.selected ? p.theme.tab.selected : p.theme.tab.unselected};
	border-radius: 5px 0px 0px 5px;
	margin: 3px 0px 3px 8px;
	height: 30px;
	align-content: center;
	width: 100%;
	cursor: default;
	&:hover {
		background: #BDBDBD;
	}
`


export const ExpandButtonContainer = styled.div`
	cursor:pointer;
	align-self: bottom;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-around;
	background: ${p => p.selected ? p.theme.tab.selected : p.theme.tab.unselected};
	border-radius: 0px 5px 5px 0px;
	width: 15px;
	height:30px;
	justify-self:end;
	&:hover{
		background: #BDBDBD;
	}
`
export const ButtonContainer = styled.div`
	width: ${p => p.horizOpen ? '100px' : '0px'};
	visibility: ${p => p.horizOpen ? 'visible' : 'hidden'};
	align-self: bottom;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-around;
	background: #d5d5d5;
	height: 100%;
	transition: all 250ms cubic-bezier(.87,-.41,.19,1.44);
	border-radius: 3px;
	overflow:hidden;
`
export const ControlsContainer = styled.div`
	display:flex;
	flex-flow:row nowrap;
	justify-self: end;
	justify-content: right;
`
export const Button = styled.div`
	opacity: ${p => p.horizOpen ? '1' : '0'};
	border-radius: 100px;
	cursor: pointer;
	&:hover{
		background: #E6E6E6;
		border: 1px solid #E6E6E6;
	}
	transition: opacity 0.1s cubic-bezier(.87,-.41,.19,1.44);
`
// export const VerticalButtonContainer = ExpandButtonContainer.extend`
// 	/* max-height:200px; */
// 	/* border-radius: ${p => p.vertOpen ? '0px 0px 10px 10px' : '0px 50px 50px 0px'}; */
// 	width: 15px;
// 	height: 80%;
// `