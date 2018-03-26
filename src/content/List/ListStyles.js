import styled from "styled-components"

export const Cell = styled.div`
	display:flex;
	align-items:center;
	
	height: 30px;
	
	margin: 0px 4px;
	padding-left: 4px;
	overflow: hidden;
`

export const Text = styled.div`
	display:inline-block;
	
	max-width: 200px;
	
	text-overflow: ellipsis;
	white-space:nowrap;
	overflow:hidden;
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
	align-content: center;
	
	height: 30px;
	width: 100%;
	
	background: ${p => p.selected ? p.theme.tab.selected : p.theme.tab.unselected};
	
	border-radius: 5px 0px 0px 5px;
	margin: 3px 0px 3px 8px;
	cursor: default;
	
	&:hover {
		background: #BDBDBD;
	}
`


export const ExpandButtonContainer = styled.div`
	justify-self:end;
	align-self: bottom;

	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-around;

	width: 15px;
	height:30px;

	background: ${p => p.selected ? p.theme.tab.selected : p.theme.tab.unselected};
	border-radius: 0px 5px 5px 0px;
	
	cursor:pointer;
	
	&:hover{
		background: #BDBDBD;
	}
`
export const ButtonContainer = styled.div`
	visibility: ${p => p.horizOpen ? 'visible' : 'hidden'};
	align-self: bottom;
	
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-around;
	
	height: 100%;
	width: ${p => p.horizOpen ? '100px' : '0px'};
	
	background: #d5d5d5;
	border-radius: 3px;
	overflow:hidden;
	
	transition: all 300ms ease;
`
export const ControlsContainer = styled.div`
	justify-self: end;
	
	display:flex;
	flex-flow:row nowrap;
	justify-content: right;
	
	width: ${p => p.horizOpen ? '115px' : '15px'};

	/* transition: all 250ms cubic-bezier(.87,-.41,.19,1.44); */
	transition: all 300ms ease;
`
export const Button = styled.div`
	opacity: ${p => p.horizOpen ? '1' : '0'};
	border-radius: 4px;
	
	/* transition: opacity 0.1s cubic-bezier(.87,-.41,.19,1.44); */
	transition: all 300ms ease;
	cursor: pointer;
	
	&:hover{
		background: ${p => p.theme.tab.hover};
		/* border: 1px solid #E6E6E6; */
	}
`
