// ##############################
// // // App styles
// #############################

import { drawerWidth, transition, container } from "assets/jss/material-dashboard-react.js";

const appStyle = theme => ({
	wrapper: {
		position: "relative",
		top: "0",
		height: "100vh"
	},
	mainPanel: {
		[theme.breakpoints.up("md")]: {
			width: `calc(100% - ${drawerWidth}px)`
		},
		overflow: "auto",
		position: "relative",
		float: "right",
		...transition,
		maxHeight: "100%",
		width: "100%",
		overflowScrolling: 'touch'
	},
	content: {
		[theme.breakpoints.up("md")]: {
			marginTop: "70px",
			padding: "30px 15px",
			minHeight: "calc(100% - 123px)"
		},
		[theme.breakpoints.down("md")]: {
			marginTop: "40px",
			padding: "0px 0px 30px 0px",
			minHeight: "calc(100% - 123px)"
		}
	},
	container: {
		[theme.breakpoints.up("md")]: {
			...container
		},
		[theme.breakpoints.down("md")]: {
			paddingRight: "3px",
			paddingLeft: "3px",
			marginRight: "auto",
			marginLeft: "auto"
		}
	},
	map: {
		marginTop: "70px"
	}
});

export default appStyle;
