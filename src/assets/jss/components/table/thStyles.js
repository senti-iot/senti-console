
import { grey } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'

const thStyles = makeStyles(theme => ({
	noCheckbox: {
		padding: 10
	},
	hideIcon: {
		display: "none",
	},
	centered: {
		textAlign: 'center'
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
	header: {
		[theme.breakpoints.down('sm')]: {
			paddingRight: 4,
			padding: 0,
		},
		backgroundColor: grey[400],
		// color: grey[200]
	},
	checkbox: {
		color: grey[800],
		'&$checked': {
			color: theme.palette.primary.color
		},
	},
	checked: {},
	headerLabelActive: {
		width: "100%",
		color: grey[800],
		"&:hover": {
			color: "black"
		},
		"&:focus": {
			// color: grey[900]
		}
	},
	tableCell: {
		borderTop: "1px solid rgba(224, 224, 224, 1)",
	},
	tablecellcheckbox: {
		[theme.breakpoints.down("sm")]: {
			width: '35px'
		},
		[theme.breakpoints.down("md")]: {
			width: '45px'
		},
		fontSize: '0.875rem',
		borderTop: "1px solid rgba(224, 224, 224, 1)",
		/*padding: 0, */
		width: '50px',
	}
}))

export default thStyles