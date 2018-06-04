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
	height: 100%;
`


export const TableScroll = styled.div`
    border-radius: 4px;
    overflow: auto;
    width: 100%;
    height: calc(100% - 100px);
`
export const Table = styled.table`
 	border-collapse: separate;
 	border-spacing: 0 4px;
 	margin-top: -4px; 
	width:100%;
`
export const Tr = styled.tr`
	&:hover{
		> .tds {
			background:#e9e9e9;
		}
	}
`
export const Trh = styled.tr`
position: sticky;
width: 100%;
z-index: 1;
top: 0px;
`
// export const HeaderSpan = styled.span`
// 	top:-7px;
// 	z-index:2;
// 	height:30px;
// `

export const Th = styled.th`
	text-align:left;
	color:white;
	padding: 2px 10px;
	height: 30px;
	background-color: ${p => p.theme.header.background};
	border-left: 1px solid ${p => p.theme.header.background};
	&:first-child {
		border-left:none;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
	&:last-child {
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
	&:first-child{
		border-left:none;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
	&:nth-child(2) {
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		border-left:none;

	}
	&:last-child {
		border-bottom-right-radius: 4px;
		border-top-right-radius: 4px;
	}
`
export const ClearTd = styled(Td) `
	background: none;
	max-width: 30px;
	width:20px;
`
export const ClearTh = styled(Th) `
	max-width: 30px;
	width:20px;
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