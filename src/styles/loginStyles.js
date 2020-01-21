import styled from 'styled-components';
import size from './mediaQueries';
import Paper from '@material-ui/core/Paper';
import { CircularLoader, T, TextF, ItemG, Muted } from 'components';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import { ButtonBase } from '@material-ui/core';


export const LoginWrapper = styled.div`
	display: flex;
	overflow: auto;
	@media ${size.up.md} {
		height: 100vh;
	}
`
export const MobileContainer = styled.div`
	width: 100%;
	@media ${size.down.sm} {
		width: calc(100% - 48px);
		padding: 24px;
	}
	@media ${size.down.xs} {
		padding: 10px 16px;
	}
`
export const ImgLogo = styled.img`
	/* height: 100px; */
	width: 100%;
	max-height:100px;
	height: auto;
	margin: 8px;
`
export const LeftPanel = styled(Paper)`
	transition: all 300ms ease;
	width: 100%;
	border-radius: 0px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	@media ${size.up.md} {
		height: 100%;
	}
	@media ${size.down.sm} {
		border-radius: 8px;
	}

`
export const InputContainer = styled.div`
	padding: 24px;
	width: calc(100% - 48px);
	@media ${size.down.md} {
		padding: 24px;
	}
	@media ${size.down.xs} {
		width: calc(100% - 16px);
		padding: 8px;
	}
`
export const LoginLoader = styled(CircularLoader)`
	width: 100%;
	height: 300px;
`

export const NeedAccountT = styled(T)`
	font-size: 1rem;
	margin: 16px;
	@media ${size.down.md} {
		margin: 8px;
	}
`
export const LoginTF = styled(TextF)`
	margin: 16px;
	@media ${size.down.md} {
		margin: 8px;
	}
`
export const SmallActionButton = styled(IconButton)`
	padding: 0 !important;
	&:hover {
		background: initial;
	}
`

export const LoginButton = styled(Button)`
	margin: 16px;
	@media ${size.down.md} {
		margin: 8px 8px;
	}
`
export const Footer = styled(ItemG)`
	flex: 1;
	align-content: flex-end;
	padding: 24px;
	@media ${size.down.md} {
		padding: 8px;
	}
	@media ${size.down.sm} {
		padding: 48px;
	}
`
export const FooterText = styled(Muted)`
	font-family: "Roboto", "Helvetica", "Arial", sans-serif;
	font-weight: 300;
	line-height: 1.5em;
	font-size: 13px;

`

export const MutedButton = styled(ButtonBase)`
	font-family: "Roboto", "Helvetica", "Arial", sans-serif;
	font-weight: 300;
	line-height: 1.5em;
	font-size: 13px;
	margin: 4px;
	text-decoration: underline;
`

// const LoginFooter = styled.