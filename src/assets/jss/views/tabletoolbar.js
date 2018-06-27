import { lighten } from '@material-ui/core/styles/colorManipulator';
import { primaryColor } from 'assets/jss/material-dashboard-react';
import teal from '@material-ui/core/colors/teal'

export const toolbarStyles = theme => ({
	open: {
		marginTop: 24
	},

	textField: {
		paddingBottom: 8,
		width: '100%'
	},
	root: {
		paddingRight: theme.spacing.unit,
		paddingLeft: "16px",
		[theme.breakpoints.down('sm')]: {
			flexFlow: 'column nowrap'
		}
	},
	highlight:
		theme.palette.type === 'light'
			? {
				color: primaryColor,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark,
			},
	spacer: {
		flex: '1 1 33%',
	},
	actions: {
		color: theme.palette.text.secondary,
	},
	title: {
		flex: 1,
		width: '100%'
		// flex: '1 1 33%',
	},
	headerFilter: {
		flex: '1 1 33%'
	},
	froot: {
		opacity: 0.42
	},
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	focused: {},
	underline: {
		'&:after': {
			borderBottomColor: teal[500],
		},
	},
});