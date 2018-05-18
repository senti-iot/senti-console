import styled from "styled-components"
import posed from "react-pose"



export const Text = styled.div`
	display:inline-block;
	
	text-overflow: ellipsis;
	white-space:nowrap;
	
	max-width: 200px;
	max-height: 30px;
	
	overflow:hidden;
`

export const VerticalControlsButtons = styled.div`
	display:flex;
	flex-flow: column nowrap;
	transform: perspective(40px) rotateY(-20deg);
`

export const HorizontalButtonText = styled.div`
	transform: perspective(40px) rotateX(20deg);
`

export const FormCardContainer = styled.div`
	display:flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items:center;
	
	width: 250px;
	height: 270px;

	background: white;
	margin: 10px;
	border-radius: 4px;
	margin-bottom: 50px;
	margin-right: 30px;
	
	position:relative;

`
export const Shadow = FormCardContainer.extend`
	box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.3);
	
	min-height: 270px;
	min-width: 250px;
	
	margin:0;
	
	z-index: 2;
`


export const FormImg = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content:center;

	width: 100%;
	height: 150px;
	
	background: url(${p => p.img});
	background-size: cover;
    border-radius: 4px 4px 0px 0px;
    
	overflow: hidden;
	z-index: 2;
	
`

export const ProjectInfoContainer = styled.div`	
	display:flex;
	flex-flow:row wrap;
	align-items: flex-start;
	justify-content: space-evenly;
	
	width:100%;
	border-radius: 0px 0px 4px 4px;
    z-index: 3;
	
`


export const ProjectInfoCategory = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	flex-flow:column nowrap;
	
	margin: 4px;
`

export const ProjectInfoTitle = styled.div`
`

export const ProjectInfo = styled.div`
	overflow: hidden;
	overflow-y:auto;
`

export const ProjectBarContainer = styled.div`
	display:flex;
	flex-flow:row;
	justify-content:center;

	width: 70%;
	height: 20px;
	min-height: 20px;
	
	background: #DEDEDE;
	
	border-radius: 4px;
	margin: 10px;
	
	overflow: hidden;
	position:relative;
`

export const ProjectBarLabel = styled.div`
	
	color: ${p => p.progress < 50 ? '#000' : '#fff'};
	
	z-index: 4;
`
export const ProjectBar = styled.div`
	display:flex;
	justify-content:center;
	
	height:100%;
	width: ${p => p.progress + '%'};
	
	background: ${p => p.theme.tab.selected};
	
	left: 0;
	position:absolute;
`
export const VerticalControls = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	flex-flow:column nowrap;
	
	width:13px;
	height: 40%;
	
	background:#D5D5D5;
	color: #34495D;
	
	border: 1px solid #D5D5D5;
	border-radius: 0px 4px 4px 0px;
	
	position: absolute;
	left: 100%;
	z-index:1;
	
	transform: perspective(40px) rotateY(20deg);
	user-select: none;
	cursor: pointer;
`

export const VerticalButton = styled.div`
	height: 10px;
	
	transform: perspective(40px) rotateY(-20deg);
	user-select: none;
	cursor: pointer;
`

export const HorizontalControls = styled.div`
	display:flex;
	align-items:center;
	flex-flow:column;
	
	height: 60px;
	width: 100%;
	
	transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44);
	position:absolute;
	top: 100%;
	overflow:hidden;
	/* z-index:${p => p.expand ? 3 : 1}; */
`

export const CardImg = styled(FormImg) `
	position: relative;
	background: "#FFF";
`

export const ControlButton = styled.div`
	border-radius: 4px;
	
	&:hover{
		background: ${p => p.theme.tab.hover};
	}
`
const horizontalControlsProps = {
	drawerOpen: {
		y: '0px'
	},
	drawerClosed: {
		y: '-40px'
	}
}
const horizontalcontrolsDrawer = posed.div({ ...horizontalControlsProps })

export const Wheels = styled(horizontalcontrolsDrawer) `
	display:flex;
	/* justify-content:center; */
	flex-flow:column;
	align-items:center;
	width: 80%;
	height:100%;
`

export const HorizontalControlsDrawer = styled.div`
	display:flex;
	flex-flow:row nowrap;
	justify-content:space-around;
	align-items:center;
	
	width: 90%;
	/* height: ${p => p.expand ? '40px' : '0px'}; */
	height: 40px;
	background:#D5D5D5;
	
	border-radius: 0px 0px 4px 4px;
	overflow:hidden;

	/* transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44); */
`
export const HorizontalButton = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	
	/* min-height:${p => p.expand ? '10px' : '20px'};
	height:${p => p.expand ? '10px' : '20px'}; */
	height: 20px;
	width: 40%;
	
	background:#D5D5D5;
	color: #34495D;
	
	border-radius: 0px 0px 4px 4px;
	/* ${p => p.expand ? `margin-top: -1px;` : ''}; */
	
	/* transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44); */
	transform: perspective(40px) rotateX(-20deg);
	
	user-select: none;
	cursor: pointer;
`