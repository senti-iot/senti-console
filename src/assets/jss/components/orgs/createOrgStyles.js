import { makeStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { getContrast } from 'variables/functions'


const createOrgStyles = makeStyles(theme => ({
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
		backgroundColor: theme.palette.primary.main,
		'&:hover': {
			backgroundColor: getContrast(theme.palette.primary.main),
		},
	},
}))


export default createOrgStyles