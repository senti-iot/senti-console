import { makeStyles } from '@material-ui/core'
import { red, teal } from '@material-ui/core/colors'


const createUserStyles = makeStyles(theme => ({
	wrapper: {
		marginRight: theme.spacing(1),
		position: 'relative',
	},
	redButton: {
		color: red[700],
		border: '1px solid rgb(211,47,47, 0.5)',
		"&:hover": {
			borderColor: red[700],
			color: red[800]
		}
	},
	form: {
		margin: theme.spacing(1),
		padding: theme.spacing(1),
		display: 'flex',
		flexWrap: 'wrap',
	},
	paper: {
		width: '100%',
		margin: '8px',
		borderRadius: '3px'
	},
	buttonSuccess: {
		backgroundColor: teal[500],
		'&:hover': {
			backgroundColor: teal[700],
		},
	},
}))


export default createUserStyles