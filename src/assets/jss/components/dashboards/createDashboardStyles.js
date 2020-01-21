// ##############################
// // // Dashboard styles
// #############################


import { bgColorsLight } from '../../material-dashboard-react/bgColorsLight';
import { makeStyles } from '@material-ui/styles';

const createDashboardStyle = makeStyles(theme => ({
	...bgColorsLight(theme),

	image: {
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
		backgroundSize: "contain",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "50% 50%",
	},
	logo: {
		minWidth: 120,
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
	cAppBar: {
		position: 'sticky',
		backgroundColor: theme.header,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		width: "100%",
		paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// borderRadius: "3px",
		padding: "10px 0",
		transition: "all 150ms ease 0s",
		display: "flex",
		justifyContent: 'center',
		height: 70,

	},
	editGraph: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		zIndex: '9999',
		width: '100%',
		height: '100%',
		opacity: 0,

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		fontSize: '24px',
		// padding: '20px',
		borderRadius: 4,
		transition: 'all 300ms ease',
		transformOrigin: 'center',
		transform: 'translate(-50%, -50%)',
		"&:hover": {
			background: 'rgba(128,128,128,0.7)',
			// cursor: 'move',
			opacity: 1
		}
	}
}));

export default createDashboardStyle;
