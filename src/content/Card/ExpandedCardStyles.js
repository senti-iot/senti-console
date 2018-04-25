import styled from "styled-components"
import { FormImg, Shadow, ProjectInfoContainer, Text, ProjectInfoTitle, ProjectInfo } from './CardItemStyles'
import posed from "react-pose"
import { tween, easing } from 'popmotion'

const expandedCardProps = {
	open: {
		opacity: 1,
		scaleY: 1,
		transition: (props) => tween({ ...props, duration: 200, ease: easing.backInOut })
	},
	close: {
		opacity: 0,
		scaleY: 0,
		transition: (props) => tween({ ...props, duration: 200, ease: easing.backInOut })
	}
}
const overlayAnim = posed.div({ ...expandedCardProps })

export const OpenSesame = styled(overlayAnim) `
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height:100%;

	visibility: ${p => p.pose === 'open' ? 'visible' : 'hidden'};
	transition: all 300ms ease; 
`
export const ExpProjectInfo = ProjectInfo.extend`
	display:flex;
	flex-flow:column;
`
export const LEDDiv = styled.div`
	border-radius: 5px;
    width: 10px;
    height: 10px;
    box-shadow: 0px 0px 3px black;
    margin: 5px;
	margin-left: auto;
    zoom: 5;
	&:after {
    	display: block;            
    	content: '';
    	margin-left: 1px;
    	margin-right: 1px;
    	width: 8px;
    	height: 6px;
    	-webkit-border-top-right-radius: 4px 3px;
    	-webkit-border-top-left-radius: 4px 3px;
    	-webkit-border-bottom-right-radius: 4px 3px;
    	-webkit-border-bottom-left-radius: 4px 3px;
    	background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
	}
`
export const GreenLED = styled(LEDDiv) `
	background-image: -webkit-linear-gradient(top, #13fB04 0%, #58e343 50%, #ADED99 100%);
`
export const RedLED = styled(LEDDiv) `
	background-image: -webkit-linear-gradient(top, #fb1304 0%, #e35843 50%, #edad99 100%);
`
export const ExpProjectInfoItem = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	/* background: #dfdfdf; */
	background:#E3E5E5;
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
	display:flex;
	flex-flow:column nowrap;
	/* align-items: flex-start; */
	/* justify-content: flex-start; */

	width: 100%;
	height: 100%;
`

export const ExpandedProjectInfoContainer = ProjectInfoContainer.extend`
	display:flex;
	justify-content:space-between;
	margin-top: 30px;
	width: 80%;
	height: 400px;

`

export const ExpFormImg = FormImg.extend`
	height: 40%;
`

export const Overlay = styled.div`
	/* display:flex; */
	visibility: ${p => p.pose === 'open' ? 'visible' : 'hidden'};
	/* align-items:center; */
	/* justify-content:center; */

	width: 100%;
	height: 100%;

	background: #FFFFFF99;

	top:0;
	left:0;
	position: fixed;
	z-index:3;
	transition: all 500ms ease;
`

export const OverlayPreventPropagation = styled.div`
	width: ${p => p.width};
	height: ${p => p.height};
	background: white;
	border-radius: 4px;
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