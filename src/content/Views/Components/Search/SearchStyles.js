import styled from 'styled-components'
import { transparentize } from 'polished'
export const SearchContainer = styled.div`
	display:flex;
	align-items:center;
	
	height: 35px;
    
	color: ${(props) => props.color ? props.color : '#2C3E50'};
    background: #ECF0F1;
	margin: 0px 5px;
    /* padding: 5px; */
    border: none;
	border-radius: 4px;
	overflow:hidden;
	outline: none;
	box-sizing: border-box;
	box-shadow: ${(props) => props.active ? `0 0 0 3px ` + props.theme.tab.selected : ``};
    
	&:hover {
        border-color: ${p => transparentize(0.7, p.theme.tab.hover)};
		box-shadow: ${p => `0 0 0 4px ${transparentize(0.7, p.theme.tab.hover)}`};
		cursor: ${(props) => props.isDisabled ? 'not-allowed' : 'pointer'};
    }
    &:focus {
		box-shadow: ${(props) => `0 0 0 3px ` + props.theme.tab.selected};
    }
`
export const Input = styled.input`
	height:100%;
	
	border: none;
	background: inherit;
	outline:none;
	
	-moz-appearance: none;
	-webkit-appearance: none;
`
