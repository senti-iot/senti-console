// ##############################
// // // HeaderLinks styles
// #############################

import { getContrast } from 'variables/functions'
import { makeStyles } from '@material-ui/core'

const headerLinksStyle = makeStyles(theme => ({
	iconRoot: {
		color: getContrast(theme.header),
		[theme.breakpoints.down('md')]: {
			justifyContent: 'left',
			width: 260
		}
		// padding: "12px 2px"
	},
	expand: {
		[theme.breakpoints.down('md')]: {
			marginLeft: 0,
			marginRight: 24,
		},
		[theme.breakpoints.down('lg')]: {
			marginLeft: 10,
			marginRight: 24
		},
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	userDropdown: {
		color: getContrast(theme.header),
		textTransform: 'none',
		margin: 8
	},
	img: {
		borderRadius: 50,
		height: 36,
		width: 36,
		color: theme.header
	},
	dropdown: {
		borderRadius: "3px",
		border: "0",
		boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
		top: "100%",
		zIndex: "1000",
		minWidth: "160px",
		padding: "5px 0",
		margin: "2px 0 0",
		fontSize: "14px",
		textAlign: "left",
		listStyle: "none",
		backgroundClip: "padding-box"
	},
	nameAndEmail: {
		height: 60,
		display: 'flex',
		flexFlow: 'column',
		alignItems: 'flex-start',
		"&:hover": {
			background: 'inherit'
		},
		"&:focus": {
			background: 'inherit'
		},
		cursor: 'default'
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	}
}))

export default headerLinksStyle
