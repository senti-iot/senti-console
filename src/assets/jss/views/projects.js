// ##############################
// // // Projects View Styles
// #############################

import { primaryColor } from "assets/jss/material-dashboard-react.js";
// import regularCardStyle from "../material-dashboard-react/regularCardStyle";

const projectStyles = theme => ({
	root: {
		width: '100%',
		margin: theme.spacing.unit,
		borderRadius: "3px",
	},
	noOverflow: {
		overflow: 'visible'
	},
	appBar: {
		top: "70px",
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
	leftActionButton: {
		// marginLeft: 'auto',
		textTransform: 'initial'
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	leftIcon: {
		marginRight: 8
	},
	
});

export default projectStyles;
