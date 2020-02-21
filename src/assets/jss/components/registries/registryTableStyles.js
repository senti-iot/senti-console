
import { makeStyles } from '@material-ui/styles'

const registryTableStyles = makeStyles(theme => ({
	tableWrapper: {
		overflowX: 'auto',
	},
	noMargin: {
		whiteSpace: "pre-line",
		marginBottom: 0,
		overflow: 'hidden'
	},
	paragraphCell: {
		margin: 0,
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis"
	},
	table: {
		minWidth: 0,
	},
	headerCell: {
		color: "inherit",
	}
}))

export default registryTableStyles