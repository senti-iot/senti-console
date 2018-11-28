import teal from '@material-ui/core/colors/teal'
import { transition, primaryColor } from '../../material-dashboard-react';

const searchStyles = theme => ({
	square: {
		borderRadius: 0,
	},
	suggestContainer: {
		// width: "100%",
		// [theme.breakpoints.down("md")]: {
		// 	width: "auto"
		// },
		[theme.breakpoints.down("xs")]: {
			width: 72,
			marginLeft: 0,
		},
		marginLeft: "auto",
		position: "relative",
		[theme.breakpoints.down('sm')]: {
			position: 'initial'
		}
	},
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	disabled: {},
	focused: {},
	underline: {
		'&:before': {
			borderBottom: "0px solid transparent",
		},
		'&:after': {
			// borderBottomColor: '#4db6ac',
			borderBottom: "0px solid transparent",
		},
		'&:hover:$disabled:before': {
			// borderBottomColor: "#fff",
			borderBottom: "0px solid transparent",

		},

	},
	center: {
		justifyContent: "center"
	},
	right: {
		justifyContent: "flex-end"	
	},
	container: {
		// background: "white",
		margin: 8,
		borderRadius: 4,
		flexGrow: 1,
		// position: 'relative',
		display: "flex",
		// maxWidth: "calc(100vw - 100px)"
	},
	suggestionsContainerOpenNoAbsolute: {
		// position: 'absolute',
		// right: "30px",
		// zIndex: 1,
		marginTop: theme.spacing.unit * 4,
		maxWidth: 'calc(100vw - 100px)'
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		right: "30px",
		zIndex: 1,
		marginTop: theme.spacing.unit * 4,
		maxWidth: 'calc(100vw - 100px)'
		// left: 0,
	},
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	inputRoot: {
		width: "100%"
	},
	input: {
		// background: "white",
		// padding: 8,
		// margin: 8,
		color: "#000",
		borderRadius: 4,
		width: '100%',
		"&:hover": {
			// width: 300
		},
		"&:focus": {
			// width: 300
		},
		...transition
	},
	inputContainerFocused: {
		padding: "0px 0px 0px 8px",
		[theme.breakpoints.up("md")]: {	
			width: '20vw'
		},
		[theme.breakpoints.down("sm")]: {
			width: 'calc(100vw - 48px)',			
		}
	},
	inputContainerFullWidth: {
		padding: "0px 0px 0px 8px",
		width: '100%'
	},	
	inputContainerUnfocused: {
		width: 24,
		padding: "0px 8px"	
	},
	inputContainerNoAbsolute: {
		display: "flex",
		alignItems: "center",
		overflow: "hidden",
		background: 'white',
		// padding: "0 8px",
		borderRadius: 4,
		// margin: 8,
		// marginRight: 18,
		...transition
	},
	inputContainer: {
		display: "flex",
		alignItems: "center",
		overflow: "hidden",
		background: 'white',
		// padding: "0 8px",
		borderRadius: 4,
		// margin: 8,
		marginRight: 18,
		[theme.breakpoints.down("sm")]: {
			position: 'absolute',
			margin: 8,
			marginRight: 18,
			top: 0,
			right: 0,
		},
		...transition
	},
	icon: {
		color: primaryColor,
		marginRight: 8
	},
	iconActive: {
		borderRadius: 50,
		// boxShadow: '0px 0px 5px 1px rgba(55, 168, 145, 0.70)'
		filter: 'drop-shadow(0px 0px 5px rgba(55, 168, 145, 0.70))' 
	}
});


export default searchStyles