import { makeStyles } from '@material-ui/core'

const countermodalStyles = makeStyles(theme => ({
	modalWrapper: {
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
	paper: {
		position: 'absolute',
		width: theme.spacing(50),
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
	},
	text: {
		textAlign: "center"
	},
	wrapper: {
		minHeight: 200,
		display: 'flex',
		alignItems: 'center'
	},
	counterButton: {
		fontSize: '1.5rem',
		minHeight: 100,
		minWidth: 100
	},
	iconButton: {
		marginRight: theme.spacing(1)
	}
}));
export default countermodalStyles