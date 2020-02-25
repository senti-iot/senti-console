import { makeStyles } from '@material-ui/core'

const tokentableStyles = makeStyles(theme => ({
	tableWrapper: {
		overflowX: 'auto',
	},
	table: {
		minWidth: 0,
	},
	paragraphCell: {
		margin: 0,
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis"
	},
	headerCell: {
		color: "inherit",
	},
	noMargin: {
		whiteSpace: "pre-line",
		marginBottom: 0,
		overflow: 'hidden'
	}
}));

export default tokentableStyles