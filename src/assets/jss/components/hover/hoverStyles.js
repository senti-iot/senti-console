import { hoverColor, primaryColor } from 'assets/jss/material-dashboard-react';
import { red, green, yellow } from '@material-ui/core/colors'

const hoverStyles = theme => ({
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
		width: 24,
		height: 24,
		marginRight: 12
	},
	middleContainer: {
		margin: "0 22px 14px 22px" 
	},
	paper: {
		width: 400,
		maxWidth: 450,
		padding: theme.spacing.unit,
		background: "#fff",
	},
	smallText: {
		font: '400 13px/20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
		color: '#3c4043',
		display: 'flex',
		alignItems: 'center'
	},
	img: {
		borderRadius: "50%",
		height: "50px",
		width: "50px",
		display: 'flex',
		marginRight: 8
	},
	smallAction: {
		padding: '6px 8px',
		color: primaryColor,
		"&:hover": {
			background: 'initial',
			color: hoverColor
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