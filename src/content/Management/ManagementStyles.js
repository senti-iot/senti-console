import styled from 'styled-components'
import { TitleInput as InputCont } from '../Views/Components/Functions/NewProject/NewProjectStyles'
import { Input } from '../Views/ViewStyles'

export const Select = styled.select`
	margin: 0.3rem 0.4rem 0.3rem 0.4rem;
	background: ${p => p.theme.header.background};
	color: white;
	padding: 4px;
	border: none;
	border-radius: 4px;
	max-width: 284px;
`
export const CreateButtonContainer = styled.div`
	display:flex;
	justify-content:center;
	margin-top: 100px;
`
export const TableContainer = styled.div`
	/* border : 1px solid ${p => p.theme.header.background}; */
	border-radius: 4px;
	overflow:hidden;
	width:100%;
`

// table {
// 	border - collapse: separate;
// 	border - spacing: 0 10px;
// 	margin - top: -10px; /* correct offset on first border spacing if desired */
// }
// td {
// 	border: solid 1px #000;
// 	border - style: solid none;
// 	padding: 10px;
// 	background - color: cyan;
// }
// td: first - child {
// 	border - left - style: solid;
// 	border - top - left - radius: 10px;
// 	border - bottom - left - radius: 10px;
// }

// td: last - child {
// 	border - right - style: solid;
// 	border - bottom - right - radius: 10px;
// 	border - top - right - radius: 10px;
// }
export const Tr = styled.tr`
	&:hover{
		> td {
			background:#e9e9e9;
		}
	}
`
export const Table = styled.table`
 	border-collapse: separate;
 	border-spacing: 0 4px;
 	margin-top: -4px; 
`
export const Th = styled.th`
	text-align:left;
	color:white;
	padding: 2px 10px;
	min-width: 100px;
	height: 30px;
	background-color: ${p => p.theme.header.background};
	&:first-child {
		/* border-left-style: solid; */
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
	&:last-child {
		/* border-right-style: solid; */
		border-bottom-right-radius: 4px;
		border-top-right-radius: 4px;
	}
	cursor:default;
`
export const Td = styled.td`
	padding:0px 10px;
	
	border-style: none;
	
	line-height:14px;
	height:30px;
	background-color: #e3e5e5;
	border-left: 1px solid lightgrey;
	cursor:default;
	&:first-child {
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		border-left:none;

	}
	&:last-child {
		border-bottom-right-radius: 4px;
		border-top-right-radius: 4px;
	}
`
export const FormInputCont = styled(InputCont) `
	height:35px;
	margin: 0.3rem 0.4rem 0.3rem 0.4rem;
	max-width: 300px;
`
export const FormInput = styled(Input) `
	width: 100%;
	padding: 0px 4px;
	font-size: 18px;
	color: #2c3e50;
`

export const FormContainer = styled.div`
	/* margin: 5;
	display:flex;
	flex-flow: column nowrap;
	justify-content:center; */
	margin: 30px;
`

export const Header = styled.h3`
	margin: 0.3rem 0.4rem 0.3rem 0.4rem;
`

export const Container = styled.div`
	width:100%;
	height:100%;
	overflow:auto;
`
export const SuccessContainer = styled.div`
	margin: 5px;
	border: ${p => "1px solid" + p.theme.tab.selected};
	padding: 2px;
	border-radius: 5px;
	color: ${p => p.theme.tab.selected}; 
`
export const ErrorContainer = styled(SuccessContainer) `
	 border: 1px solid crimson;
	 color: crimson
`