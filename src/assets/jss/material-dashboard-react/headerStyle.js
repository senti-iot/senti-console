// ##############################
// // // Header styles
// #############################

import {
	container,
	// defaultFont,
	primaryColor,
	defaultBoxShadow,
	infoColor,
	successColor,
	warningColor,
	dangerColor,
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
		padding: "0 !important",
		// [theme.breakpoints.up('lg')]: {
		// 	left: 260,
		// 	width: "calc(100vw - 260px)",
		// },
		[theme.breakpoints.down('xs')]: {
			height: 48
		},
		height: "70px",
		// padding: "5px",
		// paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// borderRadius: "3px",
		// padding: "10px 0",
		transition: "all 150ms ease 0s",
		minHeight: "48px",
		display: "block",
		// position: "sticky",
		// [theme.breakpoints.up("lg")]: {
		// 	width: 'calc(100% - 260px)'
		// }
		
	},
	image: {
		position: "relative",
		height: 48,
		borderRadius: 4,
		[theme.breakpoints.down("xs")]: {
			// width: "100% !important", // Overrides inline-style
			height: 48
		},
		"&:hover, &$focusVisible": {
			zIndex: 1,
			"& $imageBackdrop": {
				opacity: 0.15
			},
			"& $imageMarked": {
				opacity: 0
			},
			"& $imageTitle": {
				border: "4px solid currentColor"
			}
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
	imageBackdrop: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: theme.palette.common.black,
		opacity: 0.4,
		transition: theme.transitions.create("opacity")
	},
	imageTitle: {
		position: "relative",
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme
			.spacing.unit + 6}px`
	},
	imageMarked: {
		height: 3,
		width: 18,
		backgroundColor: theme.palette.common.white,
		position: "absolute",
		bottom: -2,
		left: "calc(50% - 9px)",
		transition: theme.transitions.create("opacity")
	},
	container: {
		...container,
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
		// minWidth: 53
		// whiteSpace: 'nowrap'
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
		// ...defaultFont,
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
	appResponsive: {
		// top: "8px",
	},
	primary: {
		backgroundColor: primaryColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	info: {
		backgroundColor: infoColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	success: {
		backgroundColor: successColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	warning: {
		backgroundColor: warningColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	},
	danger: {
		backgroundColor: dangerColor,
		color: "#FFFFFF",
		...defaultBoxShadow
	}
});

export default headerStyle;
