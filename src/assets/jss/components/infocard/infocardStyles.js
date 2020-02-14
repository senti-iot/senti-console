

import { card } from "../../material-dashboard-react";
import { bgColorsLight } from '../../material-dashboard-react/bgColorsLight';
import { makeStyles } from '@material-ui/styles';

const infoCardStyles = makeStyles(theme => ({
	flexPaper: {
		display: 'flex !important',
		flexFlow: 'column',
		height: '100%'
	},
	transition: {
		transition: 'all 300ms ease',
	},
	contentMedia: {
		width: "100%",
		padding: 0,
		'&:last-child': {
			padding: 0
		}
	},
	noMargin: {
		margin: 0,
	},
	noPadding: {
		paddingLeft: 0,
		paddingRight: 0
	},
	dashboard: {
		height: 'calc(100% - 128px - 32px)'
	},
	root: {
		paddingTop: 0,
		marginTop: 0,
	},

	actions: {
		alignSelf: 'center',
		padding: "4px"
	},
	expandPosition: {
		marginLeft: 'auto',
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		color: '#fff',
		backgroundColor: theme.palette.primary.main,
	},
	whiteAvatar: {
		backgroundColor: "inherit",
	},
	card: {
		...card,
		height: "100%",
	},

	title: {
		fontSize: "1em",
		fontWeight: 500
	},
	...bgColorsLight(theme),

}))

export default infoCardStyles;
