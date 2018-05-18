import styled from "styled-components"
import posed from 'react-pose'
// import tween from 'popmotion'

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
export const SmallLoaderContainer = styled.div`
	position:absolute;
	top:0;
	left:0;

	display:flex;
	justify-content:center;
	align-items:center;

	background:#e3e5e5;

	width:100%;
	height:100%;
	&:hover {
		background: #e9e9e9;
	}
`
export const ListCardItem = styled.div`
	display:flex;
	flex-flow:row nowrap;
	align-items:center;

	margin: 4px;
	overflow:hidden;
	height:30px;
	border: 1px solid transparent;
	border-radius: 5px;
`

export const ImgText = styled(Text) `
	position:relative;
	height:100%;
	width:100%;
`

export const ListItemContainer = styled.div`
	display:grid;
	grid-template-columns: repeat(${p => p.columnCount}, 1fr);
	align-content: center;
	
	height: 30px;
	width: 100%;
	
	background: ${p => p.selected ? p.theme.tab.selected : p.theme.tab.unselected};
	color: ${p => p.selected ? "#FFFFFF" : "#000000"};
	
	border-radius: 5px 0px 0px 5px;
	margin: 3px 0px 3px 8px;
	cursor: default;
	
	&:hover {
		background: #e9e9e9;
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
	color: ${p => p.selected ? '#fff' : '#000'};
	border-radius: 0px 5px 5px 0px;
	z-index: 1;
	cursor:pointer;
	
	&:hover{
		/* background: #e9e9e9; */
		background: ${p => p.theme.tab.selected};
		color: white;

	}
`

const buttonContainerProps = {
	open: {
		x: '115px',
		// scaleX: 0
	},
	close: {
		// scaleX: 1,
		x: '15px'
	}
}
const buttonContainer = posed.div({ ...buttonContainerProps })

export const ButtonContainer = styled(buttonContainer) `
	position:absolute;
	top:0;
	right:100%;
	/* transform-origin:right; */
	align-self: bottom;
	padding-right: 15px;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-around;
	
	min-height: 30px;
	width: 100px;

	background: #d5d5d5;
	border-radius: 3px;
`
export const ControlsContainer = styled.div`
	justify-self: end;
	position:relative;
	/* position:absolute; */
	display:flex;
	flex-flow:row nowrap;
	justify-content: right;
	width: 15px;
	/* left:100%; */
`
export const Button = styled.div`
	opacity: ${p => p.horizOpen ? '1' : '0'};
	border-radius: 4px;
	
	transition: all 300ms ease;
	cursor: pointer;
	
	&:hover{
		background: ${p => p.theme.tab.hover};
	}
`
