// ##############################
// // // RegularCard styles
// #############################

import { red, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core';

const sensorCardStyles = makeStyles(theme => ({
	blocked: {
		color: `${red[500]} !important`,
		marginRight: 8
	},
	allowed: {
		color: `${green[500]} !important`,
		marginRight: 8
	},
	bigIcon: {
		height: "40px",
		width: "40px",
	},
	smallText: {
		font: '400 13px/20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
		color: theme.palette.type === 'light' ? '#3c4043' : "#ececec",
		display: 'flex',
		alignItems: 'center'
	},
	icon: {
		color: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : '#fff',
		marginRight: 4
	}
}))

export default sensorCardStyles;
