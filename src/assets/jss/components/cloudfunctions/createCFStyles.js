import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core';

const createCFStyles = makeStyles(theme => ({
	paper: {
		// overflow: 'visible',
		width: '100%',
		margin: '8px',
		// overflow: 'hidden',
		borderRadius: '3px'
	},
	form: {
		margin: theme.spacing(1),
		padding: theme.spacing(1),
		display: 'flex',
		flexWrap: 'wrap',
	},
	editor: {
		width: 'calc(100% - 16px)',
		border: '1px solid rgba(100, 100, 100, 0.25)',
		padding: 4,
		borderRadius: 4,
		"&:hover": {
			boder: '1px solid #000'
		}
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

export default createCFStyles