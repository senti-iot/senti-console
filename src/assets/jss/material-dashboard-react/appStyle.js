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

		marginTop: "70px",
		padding: "30px 15px",
		minHeight: "calc(100% - 123px)",

		[theme.breakpoints.down("md")]: {
			padding: "10px 10px 30px 10px",
		},
		[theme.breakpoints.down("sm")]: {
			padding: "8px 8px 30px 8px"
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
