
import { red, green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'

const sensorsStyles = makeStyles(theme => ({
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	},
	tableWrapper: {
		overflowX: 'auto',
	},
	table: {
		minWidth: 0,
	},
	headerCell: {
		color: "inherit",
	},
	paragraphCell: {
		margin: 0,
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis"
	},
	noMargin: {
		whiteSpace: "pre-line",
		marginBottom: 0,
		overflow: 'hidden'
	},
}))

export default sensorsStyles