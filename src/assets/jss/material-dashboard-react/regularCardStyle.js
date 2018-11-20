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
	transition,
	deviceStatus,
} from "../material-dashboard-react";
import teal from '@material-ui/core/colors/teal';

const regularCardStyle = theme => ({
	...deviceStatus,
	contentMedia: {
		width: "100%",
		padding: 0,
	},
	noMargin: {
		margin: 0,
		padding: 0
	},
	leftActions: {
		marginRight: "auto",
	},
	rightActions: {
		marginLeft: "auto"
	},
	textOvrflow: {
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		overflow: "hidden",
		marginTop: theme.spacing.unit
	},
	leftIcon: {
		marginRight: 8
	},
	smallCardGrid: {
		// width: "33%",	
		[theme.breakpoints.down('sm')]: {
			width: '100%'
		}
	},
	smallCard: {
		// maxWidth: 345,
		[theme.breakpoints.up("sm")]: {
			width: "100%"
		},
		height: '100%',
		maxHeight: 500
	},
	smallCardCustomHeight: {
		// height: "calc(100% - 148px)"
		flex: 1
	},
	alignCenter: {
		display: "flex",
		justifyContent: "center"
	},
	discoverSentiCenter: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	discoverSentiImg: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		height: 250,
		width: 250,
		"&:hover": {
			width: 300,
			height: 300
		},
		...transition
	},
	root: {
		// height: "100%",
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
		// textTransform: 'initial'
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
	whiteAvatar: {
		backgroundColor: "inherit",
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
	title: {
		fontSize: "1em",
		fontWeight: 500
	},
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
