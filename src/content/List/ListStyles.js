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
	z-index: 1;
	cursor:pointer;
	
	&:hover{
		background: #BDBDBD;
	}
`

const poseProps = {
	open: {
		x: '100px',
		// opacity: '1'
		// transition: (props) => tween({ ...props, duration: 1000 })
	},
	close: { x: '-15px' }
}
export const Poser = posed.div({ ...poseProps })

export const ButtonContainer = styled(Poser) `
	position:absolute;
	/* visibility: ${p => p.horizOpen ? 'visible' : 'hidden'}; */
	align-self: bottom;
	
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-around;
	
	min-height: 30px;
	/* width: ${p => p.horizOpen ? '100px' : '0px'}; */
	width: 100px;
	background: #d5d5d5;
	border-radius: 3px;
	/* overflow:hidden; */
	/* z-index: 3; */
	/* transition: all 100ms ease; */
`
export const ControlsContainer = styled.div`
	justify-self: end;
	/* overflow:${p => !p.horizOpen ? 'hidden' : 'visible'}; */
	display:flex;
	flex-flow:row nowrap;
	justify-content: right;
	position:relative;
	/* width:100%; */
	/* width: ${p => p.horizOpen ? '115px' : '15px'}; */

	/* transition: all 250ms cubic-bezier(.87,-.41,.19,1.44); */
	/* transition: all 300ms ease; */
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
