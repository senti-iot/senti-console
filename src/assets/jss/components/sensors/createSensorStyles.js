import { makeStyles } from '@material-ui/styles';
import { red, green } from '@material-ui/core/colors';

const createSensorStyles = makeStyles(theme => ({
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	},

	IconEndAd: {
		marginLeft: 12
	},
	smallAction: {
		padding: 0,
		"&:hover": {
			background: 'initial',
		}
	},
	redButton: {
		color: red[700],
		border: '1px solid rgb(211,47,47, 0.5)',
		"&:hover": {
			borderColor: red[700],
			color: red[800]
		}
	},
	wrapper: {
		marginRight: theme.spacing(1),
		position: 'relative',
	},

}))

export default createSensorStyles