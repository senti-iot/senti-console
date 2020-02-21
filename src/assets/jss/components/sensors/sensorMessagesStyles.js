import { makeStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

const sensorMessagesStyles = makeStyles(theme => ({
	editor: {
		width: 'calc(100% - 16px)',
		border: '1px solid rgba(100, 100, 100, 0.25)',
		padding: 4,
		borderRadius: 4,
		"&:hover": {
			boder: '1px solid #000'
		}
	},
	closeButton: {
		marginLeft: 'auto',
		color: red[500],
		"&:hover": {
			// borderColor: red[700],
			// color: red[500],
			background: 'rgb(211,47,47, 0.2)'
		}
	}
}));

export default sensorMessagesStyles