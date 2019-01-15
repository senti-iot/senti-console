import teal from '@material-ui/core/colors/teal'
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { primaryColor } from '../material-dashboard-react';

const toolbarStyles = theme => ({
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	open: {
		marginTop: 24
	},

	textField: {
		paddingBottom: 8,
		width: '100%'
	},
	root: {
		display: 'flex',
		justifyContent: 'center',
		paddingRight: theme.spacing.unit,
		// margin: `4px 0px`,
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
		width: '100%'
	},
	headerFilter: {
		width: '100%'
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

export default toolbarStyles