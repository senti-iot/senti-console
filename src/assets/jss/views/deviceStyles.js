import { red, yellow, green, teal } from "@material-ui/core/colors";
import { boxShadow } from '../material-dashboard-react';

const deviceStyles = theme => ({
	captionPading: {
		paddingBottom: 20
	},
	noPadding: {
		padding: 0
	},
	table: {
		background: "#fff",
		boxShadow: boxShadow,
		borderRadius: 4
	},
	bigCaption2: {
		fontWeight: 500,
		fontSize: "1.1em",
		paddingTop: 0,
		paddingBottom: 5,
		padding: 30,
	},
	bigCaption1: {
		fontWeight: 500,
		fontSize: "1.1em",
		padding: 30
	},
	checkbox: {
		padding: 8
		// width: 30,
		// height: 30
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
	nested: {
		paddingLeft: theme.spacing.unit * 4,
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		// flexFlow: "row nowrap",
		justifyContent: "center",
		alignItems: "center"
	},
	formControl: {

		margin: theme.spacing.unit,
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
	modal: {
		[theme.breakpoints.up('md')]: {
			width: theme.spacing.unit * 50,
		},
		[theme.breakpoints.down('sm')]: {
			width: 'calc(100vw - 10px)',
			padding: 0,
			maxHeight: 'calc(100vh - 60px)'
		},
		position: 'absolute',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
	},
	typoNoMargin: {
		margin: 0,
		padding: "0 !important",
		maxHeight: 24
	},
	redSignal: {
		color: red[700],
		marginRight: 4
	},
	greenSignal: {
		color: green[700],
		margin: 4
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	yellowSignal: {
		color: yellow[600]
	},
	InfoSignal: {
		marginBottom: '16px',
		marginTop: '4px',
		marginLeft: '4px'
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	}
})
export default deviceStyles