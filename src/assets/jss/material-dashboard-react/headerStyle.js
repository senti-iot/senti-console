// ##############################
// // // Header styles
// #############################

import {
	container,
	defaultFont,
	primaryColor,
	defaultBoxShadow,
	infoColor,
	successColor,
	warningColor,
	dangerColor,
	headerColor
} from "assets/jss/material-dashboard-react.js";

const headerStyle = theme => ({
	appBar: {
		backgroundColor: headerColor,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// borderRadius: "3px",
		padding: "10px 0",
		transition: "all 150ms ease 0s",
		minHeight: "48px",
		display: "block",
		position: "inherit",
		width: '100%'
	},
	container: {
		...container,
		minHeight: "50px",
	},
	flex: {
		flex: 1,
		// whiteSpace: 'nowrap'
	},
	goBackButton: {
		color: "inherit",
		background: "transparent",
		boxShadow: "none",
		"&:hover,&:focus": {
			background: "transparent"
		},
		width: 50,
		height: 50
	},
	title: {
		...defaultFont,
		lineHeight: "30px",
		fontSize: "18px",
		borderRadius: "3px",
		textTransform: "none",
		color: "inherit",
		"&:hover,&:focus": {
			background: "transparent"
		}
	},
	appResponsive: {
		// top: "8px",
	},
	primary: {
		backgroundColor: primaryColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	info: {
		backgroundColor: infoColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	success: {
		backgroundColor: successColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	warning: {
		backgroundColor: warningColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	danger: {
		backgroundColor: dangerColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	}
});

export default headerStyle;
