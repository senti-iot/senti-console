import styled from "styled-components"



export const Text = styled.div`
	display:inline-block;
	text-overflow: ellipsis;
	white-space:nowrap;
	overflow:hidden;
	max-width: 200px;
	max-height: 30px;
`

export const FormCardContainer = styled.div`
	position:relative;
	display:flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items:center;
	border-radius: 4px;
	width: 250px;
	height: 270px;
	margin: 10px;
	margin-bottom: 50px;
	margin-right: 30px;

`
export const Shadow = FormCardContainer.extend`
	margin:0;
	z-index: 2;
	min-height: 270px;
	min-width: 250px;
	box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.3);
`
export const ExpandedShadow = Shadow.extend`
	width:100%;
	height: 100%;
`
export const ExpandedSection = styled.div`
	padding: 5px 10px;
	border-radius: 5px;
	background: #e3e3e3;

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
	
	/* box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.3); */
`

export const ProjectInfoContainer = styled.div`
	flex: 1;
	
	display:flex;
	flex-flow:row wrap;
	align-items: flex-start;
	justify-content: space-evenly;
	
	width:100%;
	border-radius: 0px 0px 4px 4px;
    z-index: 3;
	
	/* box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.3); */
`

export const ExpandedProjectInfoContainer = ProjectInfoContainer.extend`
	margin-top: 30px;
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
	
	margin-top:1px;

	transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44);
	position:absolute;
	top: 100%;
	z-index:${p => p.expand ? 5 : 1};
`

export const HorizontalButton = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	
	min-height:${p => p.expand ? '10px' : '20px'};
	height:${p => p.expand ? '10px' : '20px'};
	width: 40%;
	
	background:#D5D5D5;
	color: #34495D;
	
	border-radius: 0px 0px 4px 4px;
	${p => p.expand ? `margin-top: -1px;` : ''};
	
	transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44);
	transform: perspective(40px) rotateX(-20deg);
	
	user-select: none;
	cursor: pointer;
`
export const ControlButton = styled.div`
	border-radius: 4px;
	
	&:hover{
		background: ${p => p.theme.tab.hover};
	}
`

export const HorizontalControlsDrawer = styled.div`
	display:flex;
	flex-flow:row nowrap;
	justify-content:space-around;
	align-items:center;
	
	width: 90%;
	height: ${p => p.expand ? '40px' : '0px'};
	
	background:#D5D5D5;
	
	border-radius: 0px 0px 4px 4px;
	overflow:hidden;

	transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44);
`