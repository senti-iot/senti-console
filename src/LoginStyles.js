import { Input } from './content/Views/ViewStyles'
import { TitleInput } from 'content/Views/Components/Functions/NewProject/NewProjectStyles'
import styled, { keyframes } from 'styled-components'

export const LoginContainer = styled.div`
	width:100vw;
	height:100vh;
	background:${p => p.theme.header.background};
`

export const SentiLogo = styled.img`
	background:${p => p.theme.header.background};
	border-radius: 4px;
	margin: 5px;
	padding:10px;
	margin-bottom: auto;
	margin-top:auto;
`
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`
export const LoaderSmall = styled.div`
	border: 5px solid #f3f3f3;
	animation: ${spin} 1s linear infinite;
	border-top: 5px solid ${p => p.theme.tab.selected};
	border-radius: 50%;
	width: 50px;
	height: 50px;
	margin:auto;
`

export const LoginInputContainer = styled.div`
	display:flex;
	flex-flow: column nowrap;
	justify-content:space-between;
	align-items:center;

	height: 250px;
	margin: 5px;
`

export const LoginFormContainer = styled.div`
	display:flex;
	flex-flow: column nowrap;
	align-items:center;

	width:100%;
	margin-bottom:auto;
`
export const OrgInput = styled(TitleInput) `
	height: 40px;
	margin: 4px;
	border-radius:4px;
`

export const UserInput = styled(OrgInput) ``
export const PassInput = styled(OrgInput) ``

export const FormInput = styled(Input) `
	padding: 0px 4px;
	font-size: 18px;
	color: #2c3e50;
`

export const CheckBoxText = styled.p`
	margin-left: 5px;
`
export const CheckboxContainer = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
`

export const ErrorModalContainer = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	flex-flow: column nowrap;
	margin:4px;
`
export const ErrorHeader = styled.h3`
	margin:3px;
`
export const ErrorText = styled.div`
	margin:3px;
`