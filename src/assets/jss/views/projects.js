// ##############################
// // // Projects View Styles
// #############################

import { primaryColor } from "assets/jss/material-dashboard-react.js";

const projectStyles = ({
	appBar: {
		height: 48,
		zIndex: 1000
		// position: "relative"
	},
	loader: {
		marginRight: 'auto',
		marginLeft: 'auto',
		color: primaryColor
	},
	grid: {
		padding: "0px 8px"
	},
	paper: {
		margin: '8px',
		overflow: 'hidden',
		borderRadius: '3px',
		width: '100%',
		padding: '8px'
	},
});

export default projectStyles;
