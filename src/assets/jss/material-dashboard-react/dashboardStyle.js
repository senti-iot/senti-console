// ##############################
// // // Dashboard styles
// #############################

import { successColor, headerColor, transition, drawerWidth } from "assets/jss/material-dashboard-react.js";
import { bgColors } from './backgroundColors';

const dashboardStyle = theme => ({
	...bgColors,
	drawerPaper: {
		color: '#fff',
		backgroundColor: "#434351",
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
	logo: {
		minWidth: 120,
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
	centerGrid: {
		margin: "0 auto",
	},
	// appBar: {
	// 	position: 'sticky',
	// 	backgroundColor: headerColor,
	// 	boxShadow: "none",
	// 	borderBottom: "0",
	// 	marginBottom: "0",
	// 	width: "100%",
	// 	paddingTop: "10px",
	// 	zIndex: "1029",
	// 	color: "#ffffff",
	// 	border: "0",
	// 	// borderRadius: "3px",
	// 	padding: "10px 0",
	// 	transition: "all 150ms ease 0s",
	// 	minHeight: "50px",
	// 	display: "block"
	// },
	appBar: {
		WebkitOverflowScrolling: "touch",
		backgroundColor: headerColor,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		position: 'fixed',
		padding: "0 !important",
		[theme.breakpoints.down('xs')]: {
			height: 48
		},
		height: "70px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		transition: "all 150ms ease 0s",
		minHeight: "48px",
		display: "block",
	},
	successText: {
		color: successColor
	},
	upArrowCardCategory: {
		width: 14,
		height: 14
	},
	typo: {
		marginBottom: "40px",
		position: "relative"
	},
	note: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		bottom: "10px",
		color: "#c0c1c2",
		display: "block",
		fontWeight: "400",
		fontSize: "13px",
		lineHeight: "13px",
		left: "0",
		marginLeft: "20px",
		position: "absolute",
		width: "260px"
	},
	section: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		marginTop: '10px'
	}
});

export default dashboardStyle;
