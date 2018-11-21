// ##############################
// // // App styles
// #############################

import { drawerWidth, transition, container } from "assets/jss/material-dashboard-react.js";

const appStyle = theme => ({
	darkBackground: {
		background: "#2e2e2e"
	},
	wrapper: {
		position: "relative",
		top: "0",
		height: "100vh"
	},
	mainPanel: {
		// marginTop: 70,
		[theme.breakpoints.up("lg")]: {
			width: `calc(100% - ${drawerWidth}px)`
		},
		// overflow: "auto",
		position: "relative",
		float: "right",
		...transition,
		maxHeight: "100%",
		width: "100%",
		
	},
	content: {
		maxHeight: "calc(100vh - 100px)"
		// marginTop: "70px",
		// padding: "30px 30px",
		// minHeight: "calc(100vh - 130px)",

		// [theme.breakpoints.down("md")]: {
		// 	padding: "10px 10px 30px 10px",
		// },
		// [theme.breakpoints.down("sm")]: {
		// 	padding: "8px 8px 30px 8px"
		// }
	},
	container: {
		maxHeight: "calc(100vh - 70px)",	
		overflow: 'auto',
		overflowScrolling: 'touch',
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
