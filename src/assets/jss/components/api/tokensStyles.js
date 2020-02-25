import { makeStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

const tokensStyles = makeStyles(theme => ({
	closeButton: {
		marginLeft: 'auto',
		color: red[500],
		"&:hover": {
			// borderColor: red[700],
			// color: red[500],
			background: 'rgb(211,47,47, 0.2)'
		}
	},
	root: {
		width: '100%',
		margin: theme.spacing(1),
		borderRadius: "3px",
	},

}));

export default tokensStyles;
