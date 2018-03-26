import styled from 'styled-components'


export const Input = styled.input`
	display:none;
	&:checked{
		background-color: ${p => p.theme.tab.selected};
		display:block;
	}
	&:after{
		left: 9px;
		top: 5px;
		width: ${({ size }) => sizes[size].checkmarkWidth};
		height: ${({ size }) => sizes[size].checkmarkHeight};
		border: solid white;
		border-width: 0 3px 3px 0;
		transform: rotate(45deg);
	}
`
export const CheckMarkIco = styled.span`
	position:absolute;
	top: 0;
	left: 0;
	width: ${({ size }) => sizes[size].width};
	height:  ${({ size }) => sizes[size].height};
	background-color: #D5d5d5;
	border-radius: 4px;
	&:after{
		content: "";
	    position: absolute;
	    display: none;
	}

	&:hover{
		background-color: ${p => p.theme.tab.hover};
	}
`
export const StyledCheckbox = styled.label`
    display: flex;
    position: relative;
	width: ${({ size }) => sizes[size].width};
 	height: ${({ size }) => sizes[size].height};
    cursor: pointer;
    font-size: 22px;
    user-select: none;

 	> input {
 		display: none;
 	}

 	> .checkmark {
     	position: absolute;
     	top: 0;
     	left: 0;
 		width: ${({ size }) => sizes[size].width};
 		height: ${({ size }) => sizes[size].height};
     	background-color: ${p => p.theme.tab.unselected};
     	border-radius: 4px;
 	}

 	> .checkmark:hover {
     	background-color: ${p => p.theme.tab.hover};
 	}

 	> input:checked + .checkmark {
 		background-color: ${p => p.theme.tab.selected};
 	}

 	> .checkmark:after {
 		content: "";
     	position: absolute;
     	display: none;
 	}

 	> input:checked + .checkmark:after {
     	display: block;
 }

 	> input + .checkmark:after {
     	left: 6px;
 		top: 6px;
 		width: ${({ size }) => sizes[size].checkmarkWidth};
 		height: ${({ size }) => sizes[size].checkmarkHeight};
		background: white;
 		border: solid white;
		border-radius:4px;
 		border-width: 0;
}
`

const sizes = {
	small: {
		width: '25px',
		height: '25px',
		checkmarkWidth: '17px',
		checkmarkHeight: '17px',
	},
	medium: {
		width: '30px',
		height: '30px',
		checkmarkWidth: '18px',
		checkmarkHeight: '18px',
	},
}