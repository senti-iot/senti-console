// ##############################
// // // Projects View Styles
// #############################

import { primaryColor, deviceStatus } from "assets/jss/material-dashboard-react.js";
// import regularCardStyle from "../material-dashboard-react/regularCardStyle";
import { red, green } from '@material-ui/core/colors'

const projectStyles = theme => ({
	...deviceStatus,
	redButton: {
		color: red[700],
		border: '1px solid rgb(211,47,47, 0.5)',
		"&:hover": {
			borderColor: red[700],
			color: red[800],
			background: 'rgb(211,47,47, 0.2)'
		}
	},
	closeButton: {
		marginLeft: 'auto',
		color: theme.palette.grey[500],
	  },
	editor: {
		width: 'calc(100% - 16px)', 
		border: '1px solid rgba(100, 100, 100, 0.25)', 
		padding: 4, 
		borderRadius: 4,
		"&:hover": {
			boder: '1px solid #000'
		}
	},
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	},
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
