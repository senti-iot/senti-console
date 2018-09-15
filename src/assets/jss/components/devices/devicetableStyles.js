
import { red, green, yellow, grey } from '@material-ui/core/colors'
import { primaryColor } from 'assets/jss/material-dashboard-react'
const devicetableStyles = theme => ({
	spaceBetween: {
		marginRight: "auto"
	},
	spacer: {
		flex: 0,
	},
	noMargin: {
		marginBottom: 0,
		overflow: 'hidden'
	},
	img: {
		borderRadius: "50px",
		height: "30px",
		width: "30px"
	},
	tableCellID: {
		padding: "4px",
		minWidth: "30px",
		width: "30px"
	},
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
		margin: theme.spacing.unit,
		borderRadius: "3px",
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
		// minWidth: 130,
		maxWidth: 200,
		"&:last-child": {
			paddingRight: 4
		}
	},
	tablecellcheckbox: {
		padding: 0,
		width: '50px'
	}
});

export default devicetableStyles