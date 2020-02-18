import { leftIcon } from '../../material-dashboard-react';
import { makeStyles } from '@material-ui/core';

const userStyles = makeStyles(theme => ({
	leftIcon: leftIcon,
	root: {
		backgroundColor: theme.palette.primary.main,
		width: "100%",
		height: "150px",
		[theme.breakpoints.down("sm")]: {
			height: "auto"
		}
	},
	textColor: {
		color: "white"
	},
	img: {
		borderRadius: "250px",
		[theme.breakpoints.up("sm")]: {
			width: 175,
			height: 175
		},
		[theme.breakpoints.down("md")]: {
			width: 250,
			height: 250
		}
	},
	chip: {
		margin: 4
	}
}))

export default userStyles