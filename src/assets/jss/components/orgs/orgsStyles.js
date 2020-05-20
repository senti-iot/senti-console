import { makeStyles } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'

const orgsStyles = makeStyles(theme => ({
	closeButton: {
		marginLeft: 'auto',
		color: red[500],
		"&:hover": {
			background: 'rgb(211,47,47, 0.2)'
		}
	},
	deleteListItem: {
		padding: 0
	},
	root: {
		width: '100%',
		margin: theme.spacing(1),
		borderRadius: "3px",
	},
	table: {
		minWidth: 0,
	},
	tableWrapper: {
		overflowX: 'auto',
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

export default orgsStyles
