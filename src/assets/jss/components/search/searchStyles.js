import teal from '@material-ui/core/colors/teal'
import { transition, primaryColor } from '../../material-dashboard-react';

const searchStyles = theme => ({
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	disabled: {},
	focused: {},
	underline: {
		'&:before': {
			borderBottom: "1px solid transparent",
		},
		'&:after': {
			borderBottomColor: teal[500],
		},
		'&:hover:$disabled:before': {
			borderBottomColor: "#fff"
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
		display: "flex"
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
	},
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	input: {
		// background: "white",
		padding: 8,
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
	inputContainerUnfocused: {
		width: 24,
		padding: "0px 8px"	
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