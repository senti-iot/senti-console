// ##############################
// // // App styles
// #############################

import { transition } from "assets/jss/material-dashboard-react.js";

const appStyle = theme => ({
	darkBackground: {
		background: "#2e2e2e"
	},

	wrapper: {
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
		[theme.breakpoints.down('md')]: {
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
		padding: 0,
		marginTop: 70,
		[theme.breakpoints.down('xs')]: {
			marginTop: 48
		},
		// [theme.breakpoints.up("lg")]: {
		// },
	}
});

export default appStyle;
