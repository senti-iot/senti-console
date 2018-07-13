import { red, yellow, green } from "@material-ui/core/colors";

const deviceStyles = theme => ({
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
	}
})
export default deviceStyles