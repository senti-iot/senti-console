import teal from '@material-ui/core/colors/teal'
import { hoverColor, primaryColor, headerColor } from 'assets/jss/material-dashboard-react';

const createprojectStyles = theme => ({
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
	flex: {
		flex: 1,
	},
	selectedItem: {
		background: primaryColor,
		"&:hover": {
			background: hoverColor
		}
		// color: "#fff"
	},
	selectedItemText: {
		color: "#FFF"
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative',
	},
	buttonSuccess: {
		backgroundColor: teal[500],
		'&:hover': {
			backgroundColor: teal[700],
		},
	},
	buttonProgress: {
		color: teal[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
		width: 24,
		height: 24
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 208,
		// width: 208
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: theme.spacing.unit / 8,
		background: teal[500],
		color: "#fff"
	},
	datepicker: {
		// background: 
		color: teal[500],
		margin: theme.spacing.unit,
		padding: theme.spacing.unit
	},
	textField: {
		margin: theme.spacing.unit * 2
	},
	form: {
		margin: theme.spacing.unit,
		padding: theme.spacing.unit,
		display: 'flex',
		flexWrap: 'wrap',
	},
	paper: {
		width: '100%',
		margin: '8px',
		overflow: 'hidden',
		borderRadius: '3px'
	},
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	focused: {},
	underline: {
		'&:after': {
			borderBottomColor: teal[500],
		},
	},
	button: {
		margin: theme.spacing.unit * 2
	}
})

export default createprojectStyles