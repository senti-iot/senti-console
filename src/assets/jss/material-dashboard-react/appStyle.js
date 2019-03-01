// ##############################
// // // App styles
// #############################

import { transition, container } from "assets/jss/material-dashboard-react.js";

const appStyle = theme => ({
	darkBackground: {
		background: "#2e2e2e"
	},

	wrapper: {
		position: "relative",
		top: "0",
	},
	mainPanelDrawerClosed: {
		width: 'calc(100% - 60px)'
	},
	mainPanelDrawerOpen: {
		width: 'calc(100% - 260px + 16px)'
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
		// maxHeight: "calc(100vh - 70px)",	
		// overflow: 'auto',
		// overflowScrolling: 'touch',
		padding: 0,
		marginTop: 70,
		[theme.breakpoints.down('xs')]: {
			marginTop: 48
		},
		[theme.breakpoints.up("lg")]: {
			...container
		},
		// [theme.breakpoints.down("md")]: {
		// 	paddingRight: "3px",
		// 	paddingLeft: "3px",
		// 	marginRight: "auto",
		// 	marginLeft: "auto"
		// }
	},
	map: {
		marginTop: "70px"
	}
});

export default appStyle;
