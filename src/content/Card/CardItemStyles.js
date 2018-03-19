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
export const FormImg = styled.div`
	width: 100%;
	height: 150px;
	display: flex;
	align-items: flex-start;
	justify-content:center;
	background: url(${p => p.img});
	background-size: cover;
    overflow: hidden;
    border-radius: 4px 4px 0px 0px;
	/* box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.3); */
	z-index: 2;
`

export const ProjectInfoContainer = styled.div`
	display:flex;
	flex-flow:row wrap;
	flex: 1;
	align-items: flex-start;
	justify-content: space-evenly;
	/* box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.3); */
    z-index: 3;
	border-radius: 0px 0px 4px 4px;
	width:100%;
`

export const ProjectInfoCategory = styled.div`
	margin: 4px;
	display:flex;
	align-items:center;
	justify-content:center;
	flex-flow:column nowrap;

`
export const ProjectInfoTitle = styled.div`
`
export const ProjectInfo = styled.div`

`
export const ProjectBarContainer = styled.div`
	display:flex;
	flex-flow:row;
	width: 70%;
	height: 20px;
	min-height: 20px;
	background: #DEDEDE;
	overflow: hidden;
	border-radius: 4px;
	margin: 10px;
	justify-content:center;
	position:relative;
`

export const ProjectBarLabel = styled.div`
	z-index: 4;
	color: ${p => p.progress < 50 ? '#000' : '#fff'};
`
export const ProjectBar = styled.div`
	position:absolute;
	height:100%;
	left: 0;
	display:flex;
	justify-content:center;
	width: ${p => p.progress + '%'};
	background: ${p => p.theme.tab.selected};
`
export const VerticalControls = styled.div`
	position: absolute;
	left: 100%;
	display:flex;
	align-items:center;
	justify-content:center;
	flex-flow:column nowrap;
	width:13px;
	height: 40%;
	background:#D5D5D5;
	border: 1px solid #D5D5D5;
	border-radius: 0px 4px 4px 0px;
	color: #34495D;
	z-index:1;
	transform: perspective(40px) rotateY(20deg);
	cursor: pointer;
	user-select: none;
`

export const VerticalButton = styled.div`
	height: 10px;
	cursor: pointer;
	user-select: none;
	transform: perspective(40px) rotateY(-20deg);

`

export const HorizontalControls = styled.div`
	position:absolute;
	top: 100%;
	display:flex;
	align-items:center;
	/* justify-content:center; */
	flex-flow:column;
	height: 60px;
	width: 100%;
	transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44);
	margin-top:1px;
	z-index:${p => p.expand ? 5 : 1};
`

export const HorizontalButton = styled.div`
	cursor: pointer;
	min-height:${p => p.expand ? '10px' : '20px'};
	height:${p => p.expand ? '10px' : '20px'};
	background:#D5D5D5;
	border-radius: 0px 0px 4px 4px;
	color: #34495D;
	/* width:  ${p => p.expand ? '99%' : '40%'} ; */
	width: 40%;
	display:flex;
	align-items:center;
	justify-content:center;
	transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44);
	user-select: none;
	transform: perspective(40px) rotateX(-20deg);
	${p => p.expand ? `margin-top: -1px;` : ''};
`
export const ControlButton = styled.div`
	border-radius: 4px;
	&:hover{
		background: ${p => p.theme.tab.hover};
	}
`

export const HorizontalControlsDrawer = styled.div`
	overflow:hidden;
	background:#D5D5D5;
	width: 90%;
	height: ${p => p.expand ? '40px' : '0px'};
	transition: all 0.3s cubic-bezier(.87,-.41,.19,1.44);
	display:flex;
	flex-flow:row nowrap;
	justify-content:space-around;
	align-items:center;
	border-radius: 0px 0px 4px 4px;
`