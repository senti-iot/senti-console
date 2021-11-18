// ##############################
// // // App styles
// #############################

import { transition } from "assets/jss/material-dashboard-react.js";
import styled from 'styled-components';
import { Paper } from '@material-ui/core';

export const SnackBarCnt = styled(Paper)`
	color: rgba(0, 0, 0, 0.87);
    display: flex;
    padding: 6px 16px;
    flex-grow: 1;
    flex-wrap: wrap;
    align-items: center;
    border-radius: 4px;
    background-color: rgb(250, 250, 250);
`

const appStyle = theme => ({
	wrapper: {
		background: theme.background,
		position: "relative",
		top: "0",
	},
	mainPanelDrawerPersClosed: {
		width: '100%',
		transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms"
	},
	mainPanelDrawerPermClosed: {
		width: 'calc(100% - 60px)'
	},
	mainPanelDrawerOpen: {
		width: 'calc(100% - 260px)'
	},
	mainPanel: {
		[theme.breakpoints.down('lg')]: {
			width: '100%'
		},
		padding: 0,
		position: "relative",
		float: "right",
		...transition,
	},
	content: {
		maxHeight: "calc(100vh - 100px)"
	},

	container: {
		minHeight: 'calc(100vh - 70px)',
		background: theme.background,
		padding: 0,
		marginTop: 70,
		[theme.breakpoints.down('xs')]: {
			marginTop: 48,
			minHeight: 'calc(100vh - 48px)',

		},
		// [theme.breakpoints.up("lg")]: {
		// },
	}
});

export default appStyle;
