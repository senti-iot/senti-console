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
export const Table = styled.div`
	border : 1px solid ${p => p.theme.header.background};
	border-radius: 4px;
	overflow:hidden;
	width:100%;
`
export const Th = styled.th`
	border: 1px solid ${p => p.theme.header.background};
`
export const Td = styled.td`
	border: 1px solid ${p => p.theme.header.background};
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
	overflow: auto;
	margin: 5;
	display:flex;
	flex-flow: column nowrap;
	justify-content:center;
`

export const Header = styled.h3`
	margin: 0.3rem 0.4rem 0.3rem 0.4rem;
`

export const Container = styled.div`
	width:80%;
	height:80%;
`
export const SuccessContainer = styled.div`
	margin: 5;
	border: ${p => "1px solid" + p.theme.tab.selected};
	padding: 2px;
	border-radius: 5px;
	color: ${p => p.theme.tab.selected}; 
`
export const ErrorContainer = styled(SuccessContainer) `
	 border: 1px solid crimson;
	 color: crimson
`