import { red, yellow, green } from "@material-ui/core/colors";
import { boxShadow, headerColor, primaryColor, hoverColor } from '../../material-dashboard-react';
import { makeStyles } from "@material-ui/styles";

const deviceStyles = makeStyles(theme => ({

	smallBody: {
		paddingTop: 0
	},
	smallSubheader: {
		paddingBottom: 0
	},
	body: {
		[theme.breakpoints.down('sm')]: {
			paddingTop: 0
		}
	},
	smallTitleNP: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	smallTitle: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		paddingLeft: 8,
		[theme.breakpoints.down('sm')]: {
			paddingBottom: 8,
			paddingTop: 8
		},
		[theme.breakpoints.up('xs')]: {
			paddingBottom: 16,
			paddingTop: 16
		}
	},
	subheader: {
		[theme.breakpoints.down('sm')]: {
			paddingBottom: 0
		}
	},
	scrollbar: {
		background: theme.palette.type === "light" ? "rgba(128,128,128,0.3)" : "rgba(255,255,255,0.3)",
		borderRadius: 8,
		transition: "all 100ms ease",
		"&:hover": {
			background: theme.palette.type === "light" ? "rgba(128,128,128,0.7)" : "rgba(255,255,255, 0.7)"
		},
		cursor: "drag"
	},
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	},
	captionPading: {
		paddingBottom: 20
	},
	noPadding: {
		padding: 0
	},
	table: {
		background: "#fff",
		boxShadow: boxShadow,
		borderRadius: 4
	},
	bigCaption2: {
		fontWeight: 500,
		fontSize: "1.1em",
		paddingTop: 0,
		paddingBottom: 5,
		padding: 30,
	},
	bigCaption1: {
		fontWeight: 500,
		fontSize: "1.1em",
		padding: 30
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		// flexFlow: "row nowrap",
		justifyContent: "center",
		alignItems: "center"
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	modal: {
		[theme.breakpoints.up('md')]: {
			width: theme.spacing(50),
			height: theme.spacing(50),
			maxHeight: 'calc(100vh - 60px)'
		},
		[theme.breakpoints.down('sm')]: {
			width: 'calc(100vw - 10px)',
			height: 'calc(100vh - 30px)',
			padding: 0,
			maxHeight: 'calc(100vh - 60px)'
		},
		display: "flex",
		justifyContent: "center",
		position: 'absolute',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
	},
	typoNoMargin: {
		margin: 0,
		padding: "0 !important",
		maxHeight: 24
	},
	redSignal: {
		color: red[500],
		// background: theme.palette.type === 'light' ? '#fff' : '#424242',
		// borderRadius: 100,
		padding: 4,
		width: 30,
		height: 30
		// marginRight: 4
	},
	greenSignal: {
		color: green[500],
		// background: theme.palette.type === 'light' ? '#fff' : '#424242',
		// borderRadius: 100,
		padding: 4,
		width: 30,
		height: 30
		// margin: 4
	},
	yellowSignal: {
		color: yellow[600],
		// background: theme.palette.type === 'light' ? '#fff' : '#424242',
		// borderRadius: 100,
		padding: 4,
		width: 30,
		height: 30
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	InfoSignal: {
		marginBottom: '16px',
		marginTop: '4px',
		marginLeft: '4px'
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
	img: {
		borderRadius: "50px",
		height: "40px",
		width: "40px",
		display: 'flex'
	},
	selectedItem: {
		background: primaryColor,
		"&:hover": {
			background: hoverColor
		}
		// color: "#fff"
	},
	selectedItemText: {
		color: "#FFF"
	},
	appBar: {
		position: 'sticky',
		backgroundColor: headerColor,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		width: "100%",
		paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		padding: "10px 0",
		transition: "all 150ms ease 0s",
		minHeight: "50px",
		display: "block"
	},
}))
export default deviceStyles