// ##############################
// // // RegularCard styles
// #############################

import {
	card,
	// cardHeader,
	// defaultFont,
	// orangeCardHeader,
	// greenCardHeader,
	// redCardHeader,
	// blueCardHeader,
	// purpleCardHeader,
	// primaryCardHeader,
	// sentiCardHeader,
	// transition,
} from "../../material-dashboard-react";
import teal from '@material-ui/core/colors/teal';
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
		backgroundColor: teal[600],
	},
	whiteAvatar: {
		backgroundColor: "inherit",
	},
	card: {
		...card,
		height: "100%",
	},
	// cardPlain: {
	// 	background: "transparent",
	// 	boxShadow: "none"
	// },
	// cardHeader: {
	// 	...cardHeader,
	// 	...defaultFont
	// },
	// cardPlainHeader: {
	// 	marginLeft: 0,
	// 	marginRight: 0
	// },
	// orangeCardHeader,
	// greenCardHeader,
	// redCardHeader,
	// blueCardHeader,
	// purpleCardHeader,
	// primaryCardHeader,
	// sentiCardHeader,
	title: {
		fontSize: "1em",
		fontWeight: 500
	},
	// cardTitle: {
	// 	color: "#FFFFFF",
	// 	marginTop: "0",
	// 	marginBottom: "5px",
	// 	...defaultFont,
	// 	fontSize: "1.125em"
	// },
	// cardSubtitle: {
	// 	...defaultFont,
	// 	marginBottom: "0",
	// 	color: "rgba(255, 255, 255, 0.62)",
	// 	margin: "0 0 10px"
	// },
	// cardActions: {
	// 	padding: "14px",
	// 	display: "block",
	// 	height: "auto"
	// },
	...bgColorsLight(theme),

}))

export default infoCardStyles;
