import styled from "styled-components"
import { FormImg, Shadow, ProjectInfoContainer, Text, ProjectInfoTitle, ProjectInfo } from './CardItemStyles'

export const ExpProjectInfo = ProjectInfo.extend`
	display:flex;
	flex-flow:column;
`

export const ExpProjectInfoItem = styled.div`
	background: #dfdfdf;
	padding: 4px;
	margin-top:4px;
	border-radius: 4px;
`

export const ExpProjectInfoTitle = ProjectInfoTitle.extend`
	display:flex;
	justify-content:center;
	
	width: 100%;
	font-size: 22px;
	font-weight: 700;
`


export const ExpSection = styled.div`
	flex: 1;
	display:flex;
	flex-flow:column;

	height:90%;
	background: #fbfbfb;
	
	margin-left:20px;
	padding: 5px 10px;
	border-radius: 5px;
`

export const ExpandedShadow = Shadow.extend`
	width:100%;
	height: 100%;
`

export const ExpandedProjectInfoContainer = ProjectInfoContainer.extend`
	display:flex;
	justify-content:space-between;
	margin-top: 30px;
	width: 80%;
	height: 80%;

`

export const ExpFormImg = FormImg.extend`
	height: 40%;
`

export const Overlay = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;

	width: 100%;
	height: 100%;

	background: #FFFFFF99;

	top:0;
	left:0;
	position: absolute;
	z-index:3;
`

export const OverlayPreventPropagation = styled.div`
	width: 80%;
	height: 80%;
	background: white;
`

export const ExpHeader = styled.div`
	display:flex;
	align-items:flex-start;
	justify-content:flex-start;
	flex-flow: row nowrap;

	height:50px;
	width: 100%;

	font-size: 26px;
	margin:4px;
`

export const ExpTitle = styled.div`
	display:flex;
	flex-flow: column;
	
	margin-left: 8px;
`
export const ExpAddress = styled.div`
	font-size: 12px;
`
export const UserContainer = styled.div`
	display:flex;
	align-items:center;
	
	margin-left: auto;
	overflow:visible;

	position:relative;
`

export const Username = Text.extend`
	margin-right:8px;
`

export const Avatar = styled.img`
	border-radius: 50%;
	height: 30px;
`