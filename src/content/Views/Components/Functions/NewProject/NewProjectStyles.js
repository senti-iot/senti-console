import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { SearchContainer } from '../../../ViewStyles'

export const StyledDropzone = styled(Dropzone) `
	display: flex;
	align-items: flex-start;
	justify-content:center;

	width: ${p => p.img === undefined ? 'calc(100% - 20px)' : '100%'};
	height: 40%;
	
	background: url(${p => p.img});
	background-color: #dedede;
	background-size: cover;
    border-radius: ${p => p.img === undefined ? '4px' : '4px 4px 0px 0px'};
	border: ${p => p.img === undefined ? '10px dashed #cecece' : ''};
	overflow: hidden;
	z-index: 2;
	
`
export const TitleInput = SearchContainer.extend`

`