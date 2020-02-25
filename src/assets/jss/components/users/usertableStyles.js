import { makeStyles } from '@material-ui/core'

const usertableStyles = makeStyles(theme => ({
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
	img: {
		borderRadius: "50px",
		height: "30px",
		width: "30px",
		display: 'flex'
	},
	noMargin: {
		whiteSpace: "pre-line",
		marginBottom: 0,
		overflow: 'hidden'
	},
}));

export default usertableStyles