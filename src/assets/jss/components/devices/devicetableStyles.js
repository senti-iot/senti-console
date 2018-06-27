
import { red, green, yellow, grey } from '@material-ui/core/colors'
import { primaryColor } from 'assets/jss/material-dashboard-react'
const devicetableStyles = theme => ({
	redSignal: {
		color: red[700]
	},
	greenSignal: {
		color: green[700]
	},
	yellowSignal: {
		color: yellow[600]
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
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		borderRadius: "3px"
	},
	table: {
		minWidth: 0,
	},
	tableWrapper: {
		overflowX: 'auto',
	},
	header: {
		backgroundColor: grey[400],
		// color: grey[200]
	},
	checkbox: {
		color: grey[800],
		'&$checked': {
			color: primaryColor
		},
	},
	checked: {},
	HeaderLabelActive: {
		color: grey[800],
		"&:hover": {
			color: "black"
		},
		"&:focus": {
			color: grey[900]
		}
	},
	tableCell: {
		padding: 4,
		minWidth: 130,
		maxWidth: 200
	},
	tablecellcheckbox: {
		padding: 0,
		width: '50px'
	}
});

export default devicetableStyles