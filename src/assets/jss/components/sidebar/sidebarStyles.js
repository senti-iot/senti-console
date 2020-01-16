// ##############################
// // // Sidebar styles
// #############################

import {
	drawerWidth,
	transition,
	defaultFont,
	// primaryColor
} from "assets/jss/material-dashboard-react.js";
import { getContrast } from 'variables/functions';
import { makeStyles } from '@material-ui/styles';

const sidebarStyle = makeStyles(theme => ({
	nested: {
		paddingLeft: `${theme.spacing(2)}px !important`,
	},
	appBarWrapper: {
		backgroundColor: theme.sidebar
	},
	root: {
		display: 'flex',
	},
	drawerPaper: {
		color: getContrast(theme.sidebar),
		backgroundColor: theme.sidebar,
		overflowY: 'inherit',
		top: 70,
		[theme.breakpoints.down('md')]: {
			top: 0
		},
		width: drawerWidth,
		border: 'none',
	},
	drawer: {
		top: 70,
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',

	},
	drawerOpen: {
		width: drawerWidth,
		overflowX: "auto",
		...transition
	},
	drawerClose: {
		...transition,
		overflowX: 'hidden',
		width: 60
	},
	drawerPersClose: {
		...transition,
		overflowX: 'hidden',
		width: 0
	},
	whiteFont: {
		color: 'inherit',
		// color: ,
		...defaultFont,
		margin: "0",
		lineHeight: "30px",
		fontSize: "14px",
		// color: "#FFFFFF"
	},
	border: {
		width: '100%',
		background: '#555',
		height: 1
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		minHeight: 48,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	button: {
		color: getContrast(theme.sidebar),
		margin: '8px 0px',
		padding: 10,
		height: 44,
		"&:hover": {
			background: theme.hover,
			color: getContrast(theme.palette.primary.main)
		},
		transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1), background 0.16s cubic-bezier(0.685, 0.0473, 0.346, 1) "
	},
	buttonOpen: {
		borderRadius: 3
	},
	buttonClose: {
		borderRadius: "50%"
	},
	buttonActiveRoute: {
		color: getContrast(theme.palette.primary.main),
		// color: getContrast(theme.palette.primary.main ? theme.palette.primary.main : "#fff"),
		background: theme.palette.primary.main,
		"&:focus": {
			background: theme.palette.primary.main
		}
	},
	logo: {
		backgroundColor: '#1a1b32',
		position: "relative",
		padding: "8px 16px",
		minHeight: "40px",
		zIndex: "4",
		display: 'flex',
		"&:after": {
			content: '""',
			position: "absolute",
			bottom: "0",

			height: "0px",
			right: "15px",
			width: "calc(100% - 30px)",
			backgroundColor: "rgba(180, 180, 180, 0.3)"
		}
	},
	logoLink: {
		// ...defaultFont,
		textTransform: "uppercase",
		padding: "5px 0",
		display: "block",
		fontSize: "18px",
		textAlign: "left",
		fontWeight: "400",
		lineHeight: "30px",
		textDecoration: "none",
		backgroundColor: "transparent",
		"&,&:hover": {
			color: "#FFFFFF"
		}
	},
	logoImage: {
		// width: "50px",
		display: "inline-block",
		maxHeight: "50px",
		marginLeft: "50px",
		[theme.breakpoints.down("md")]: {
			marginLeft: "18px"
		},
		marginRight: "15px"
	},
	img: {
		top: "10px",
		height: "50px",
		verticalAlign: "middle",
		border: "0"
	},
	image: {
		backgroundColor: '#1a1b32',
		position: "relative",
		height: 48,
		// marginLeft: 48,
		borderRadius: 4,
		[theme.breakpoints.down("xs")]: {
			height: 48
		},
		"&:hover, &$focusVisible": {
			zIndex: 1,
		}
	},
	focusVisible: {},
	imageSrc: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundSize: "100px 50px",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "50% 50%",
	},
}))

export default sidebarStyle;
