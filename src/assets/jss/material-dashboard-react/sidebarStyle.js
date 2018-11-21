// ##############################
// // // Sidebar styles
// #############################

import {
	drawerWidth,
	transition,
	boxShadow,
	defaultFont,
	primaryColor,
	hoverColor
} from "assets/jss/material-dashboard-react.js";

const sidebarStyle = theme => ({
	drawerPaper: {
		border: "none",
		position: "fixed",
		top: "0",
		bottom: "0",
		left: "0",
		zIndex: "1",
		...boxShadow,
		width: drawerWidth,
		[theme.breakpoints.up("lg")]: {
			width: drawerWidth,
			position: "fixed",
			height: "100%"
		},
		[theme.breakpoints.down("md")]: {
			width: drawerWidth,
			...boxShadow,
			position: "fixed",
			display: "block",
			top: "0",
			height: "100vh",
			right: "0",
			left: "auto",
			zIndex: "1032",
			visibility: "visible",
			overflowY: "visible",
			borderTop: "none",
			textAlign: "left",
			paddingRight: "0px",
			paddingLeft: "0",
			transform: `translate3d(${drawerWidth}px, 0, 0)`,
			...transition
		}
	},
	logo: {
		backgroundColor: '#1a1b32',
		position: "relative",
		padding: "15px 15px",
		minHeight: "40px",
		zIndex: "4",
		display: 'flex',
		"&:after": {
			content: '""',
			position: "absolute",
			bottom: "0",

			height: "0px",
			right: "15px",
			width: "calc(100% - 30px)",
			backgroundColor: "rgba(180, 180, 180, 0.3)"
		}
	},
	logoLink: {
		...defaultFont,
		textTransform: "uppercase",
		padding: "5px 0",
		display: "block",
		fontSize: "18px",
		textAlign: "left",
		fontWeight: "400",
		lineHeight: "30px",
		textDecoration: "none",
		backgroundColor: "transparent",
		"&,&:hover": {
			color: "#FFFFFF"
		}
	},
	logoImage: {
		// width: "50px",
		display: "inline-block",
		maxHeight: "50px",
		marginLeft: "50px",
		[theme.breakpoints.down("md")]: {
			marginLeft: "18px"
		},
		marginRight: "15px"
	},
	img: {
		// width: "35px",
		top: "10px",
		height: "50px",
		position: "absolute",
		verticalAlign: "middle",
		border: "0"
	},
	background: {
		position: "absolute",
		zIndex: "1",
		height: "100%",
		width: "100%",
		display: "block",
		top: "0",
		left: "0",
		backgroundSize: "cover",
		backgroundPosition: "center center",
		"&:after": {
			position: "absolute",
			zIndex: "3",
			width: "100%",
			height: "100%",
			content: '""',
			display: "block",
			background: "#000",
			opacity: ".8"
		}
	},
	list: {
		marginTop: "20px",
		paddingLeft: "0",
		paddingTop: "0",
		paddingBottom: "0",
		marginBottom: "0",
		listStyle: "none"
	},
	item: {
		position: "relative",
		display: "block",
		textDecoration: "none",
	},
	itemLink: {
		width: 'auto',
		transition: "all 300ms linear",
		margin: "10px 15px 0",
		borderRadius: "3px",
		position: "relative",
		display: "block",
		padding: "10px 15px",
		backgroundColor: "transparent",
		...defaultFont
	},
	itemIcon: {
		width: "24px",
		height: "30px",
		float: "left",
		marginRight: "15px",
		textAlign: "center",
		verticalAlign: "middle",
		color: "rgba(255, 255, 255, 0.8)"
	},
	itemText: {
		...defaultFont,
		margin: "0",
		lineHeight: "30px",
		fontSize: "14px",
		color: "#FFFFFF"
	},
	whiteFont: {
		color: "#FFFFFF"
	},

	senti: {
		backgroundColor: primaryColor,
		boxShadow:
			"0 12px 20px -10px rgba(55, 168, 145, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(55, 168, 145, 0.28)",
		"&:hover": {
			backgroundColor: hoverColor,
			boxShadow:
				"0 12px 20px -10px rgba(55, 168, 145, 0.4), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(55, 168, 145, 0.4)"
		}
	},
	sidebarWrapper: {
		position: "relative",
		height: "calc(100vh - 70px)",
		overflowY: 'auto',
		overflowX: 'hidden',
		width: "260px",
		zIndex: "4",
		overflowScrolling: 'touch',
		backgroundColor: "#434351"
		// "#767684"
	},
	appBarWrapper: {
		backgroundColor: "#767684"	
	}
});

export default sidebarStyle;
