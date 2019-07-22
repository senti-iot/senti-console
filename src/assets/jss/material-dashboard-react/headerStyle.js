// ##############################
// // // Header styles
// #############################

import {
	// defaultFont,
	// primaryColor,
	// defaultBoxShadow,
	// infoColor,
	// successColor,
	// warningColor,
	// dangerColor,
	headerColor,
} from "assets/jss/material-dashboard-react.js";

const headerStyle = theme => ({
	drawerButton: {
		color: '#fff',
		'&:hover': {
			background: '#FFFFFF22'
		}
	},
	logoContainer: {
		width: 195,
		display: "flex",
		paddingLeft: '12px',
		borderRadius: 4,
		height: 48,
		[theme.breakpoints.down('xs')]: {
			width: 48
		},
	},
	appBar: {
		backgroundColor: headerColor,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		position: 'fixed',
		// padding: "0 !important",
		[theme.breakpoints.down('xs')]: {
			height: 48
		},
		height: "70px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// transition: "all 150ms ease 0s",
		minHeight: "48px",
		display: "block",
	},
	image: {
		position: "relative",
		height: 48,
		borderRadius: 4,
		[theme.breakpoints.down("xs")]: {
			height: 48
		},
		"&:hover, &$focusVisible": {
			zIndex: 1
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
	container: {
		paddingLeft: 4,
		height: "100%",
		minHeight: "50px",
	},
	flex: {
		flex: 1,
		display: 'flex',
		flexFlow: 'row',
		alignItems: 'center',
		marginLeft: 16
	},
	goBackButton: {
		color: "inherit",
		background: "transparent",
		boxShadow: "none",
		"&:hover,&:focus": {
			background: "transparent"
		},
		width: 50,
		height: 50
	},
	title: {
		maxWidth: "calc(100vw - 130px)",
		fontWeight: 500,
		[theme.breakpoints.down('sm')]: {
			fontSize: "1rem",
		},
		lineHeight: "1.16667em",
		fontSize: "1.3125rem",
		borderRadius: "3px",
		textTransform: "none",
		color: "inherit",
		"&:hover,&:focus": {
			background: "transparent"
		}
	},
	// primary: {
	// 	backgroundColor: primaryColor,
	// 	color: "#FFFFFF",
	// 	...defaultBoxShadow
	// },
	// info: {
	// 	backgroundColor: infoColor,
	// 	color: "#FFFFFF",
	// 	...defaultBoxShadow
	// },
	// success: {
	// 	backgroundColor: successColor,
	// 	color: "#FFFFFF",
	// 	...defaultBoxShadow
	// },
	// warning: {
	// 	backgroundColor: warningColor,
	// 	color: "#FFFFFF",
	// 	...defaultBoxShadow
	// },
	// danger: {
	// 	backgroundColor: dangerColor,
	// 	color: "#FFFFFF",
	// 	...defaultBoxShadow
	// }
});

export default headerStyle;
