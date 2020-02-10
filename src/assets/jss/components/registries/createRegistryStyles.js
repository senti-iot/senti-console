import red from '@material-ui/core/colors/red';
import { makeStyles } from '@material-ui/styles';

const createRegistryStyles = makeStyles(theme => ({
	form: {
		margin: theme.spacing(1),
		padding: theme.spacing(1),
		display: 'flex',
		flexWrap: 'wrap',
	},
	paper: {
		// overflow: 'visible',
		width: '100%',
		margin: '8px',
		// overflow: 'hidden',
		borderRadius: '3px'
	},
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
	}
}))

export default createRegistryStyles