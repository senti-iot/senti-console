// ##############################
// // // Dashboard styles
// #############################

import { successColor, headerColor } from "assets/jss/material-dashboard-react.js";

const dashboardStyle = theme => ({
	centerGrid: {
		margin: "0 auto",
	},
	appBar: {
		position: 'sticky',
		backgroundColor: headerColor,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		width: "100%",
		paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// borderRadius: "3px",
		padding: "10px 0",
		transition: "all 150ms ease 0s",
		minHeight: "50px",
		display: "block"
	},
	successText: {
		color: successColor
	},
	upArrowCardCategory: {
		width: 14,
		height: 14
	},
	typo: {
		marginBottom: "40px",
		position: "relative"
	},
	note: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		bottom: "10px",
		color: "#c0c1c2",
		display: "block",
		fontWeight: "400",
		fontSize: "13px",
		lineHeight: "13px",
		left: "0",
		marginLeft: "20px",
		position: "absolute",
		width: "260px"
	},
	section: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		marginTop: '10px'
	}
});

export default dashboardStyle;
