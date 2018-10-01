import { primaryColor, leftIcon } from '../../material-dashboard-react';

export const userStyles = theme => ({
	leftIcon: leftIcon,
	root: {
		backgroundColor: primaryColor,
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
		// [theme.breakpoints.up("sm")]: {
			
		// },
		// [theme.breakpoints.down("sm")]: {
		// 	width: 50,
		// 	height: 50
		// }
	},
	chip: {
		margin: 4
	}
})