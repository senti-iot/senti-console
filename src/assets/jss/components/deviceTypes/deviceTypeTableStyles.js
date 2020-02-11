import { makeStyles } from '@material-ui/core'

const deviceTypeTableStyles = makeStyles(theme => ({
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
	}
}));

export default deviceTypeTableStyles