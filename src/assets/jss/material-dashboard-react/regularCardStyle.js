// ##############################
// // // RegularCard styles
// #############################

import {
	card,
	cardHeader,
	defaultFont,
	orangeCardHeader,
	greenCardHeader,
	redCardHeader,
	blueCardHeader,
	purpleCardHeader,
	primaryCardHeader,
	sentiCardHeader,
} from "assets/jss/material-dashboard-react.js";
import teal from '@material-ui/core/colors/teal';

const regularCardStyle = theme => ({
	root: {
		paddingTop: 0,
		marginTop: 0
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	actions: {
		display: 'flex',
		padding: "4px"
	},
	expandPosition: {
		marginLeft: 'auto',
		textTransform: 'initial'
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
		// marginLeft: 'auto',
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: teal[600],
	},
	card: {
		...card,
		// display: 'flex'
	},
	cardPlain: {
		background: "transparent",
		boxShadow: "none"
	},
	cardHeader: {
		...cardHeader,
		...defaultFont
	},
	cardPlainHeader: {
		marginLeft: 0,
		marginRight: 0
	},
	orangeCardHeader,
	greenCardHeader,
	redCardHeader,
	blueCardHeader,
	purpleCardHeader,
	primaryCardHeader,
	sentiCardHeader,
	cardTitle: {
		color: "#FFFFFF",
		marginTop: "0",
		marginBottom: "5px",
		...defaultFont,
		fontSize: "1.125em"
	},
	cardSubtitle: {
		...defaultFont,
		marginBottom: "0",
		color: "rgba(255, 255, 255, 0.62)",
		margin: "0 0 10px"
	},
	cardActions: {
		padding: "14px",
		display: "block",
		height: "auto"
	}
});

export default regularCardStyle;
