import { hoverColor, primaryColor } from 'assets/jss/material-dashboard-react';
import { red, green, yellow } from '@material-ui/core/colors'

const hoverStyles = theme => ({
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	},
	copyButton: {
		marginLeft: 6,
		padding: 4,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 20,
		height: 20
	},
	copyIcon: {
		width: 14,
		height: 14,
		color: theme.palette.type === 'light' ? '#000' : '#fff'
	},
	redSignal: {
		color: red[700]
	},
	greenSignal: {
		color: green[700]
	},
	yellowSignal: {
		color: yellow[600]
	},
	smallIcon: {
		width: 20,
		height: 20,
		marginRight: 12
	},
	middleContainer: {
		margin: "0 22px 14px 22px"
	},
	paper: {
		width: 400,
		maxWidth: 450,
		padding: theme.spacing(1),
		// background: "#fff",
	},
	smallText: {
		font: '400 13px/20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
		color: theme.palette.type === 'light' ? '#3c4043' : "#ececec",
		display: 'flex',
		alignItems: 'center'
	},
	img: {
		// borderRadius: "50%",
		height: "50px",
		width: "50px",
		display: 'flex',
		marginRight: 8,
		color: theme.palette.type === 'light' ? '#3c4043' : "#ececec",
	},
	smallAction: {
		padding: '6px 8px',
		color: primaryColor,
		"&:hover": {
			background: 'initial',
			color: theme.palette.hover ? theme.palette.hover : hoverColor
		}
	},
	smallActionLink: {
		display: 'flex',
		color: 'inherit',
		"&:hover": {
			background: 'initial',
		}
	},
})

export default hoverStyles