import { primaryColor } from '../../material-dashboard-react';

export const userStyles = theme => ({
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
		borderRadius: "50px",
		width: 100,
		height: 100
		// [theme.breakpoints.up("sm")]: {
			
		// },
		// [theme.breakpoints.down("sm")]: {
		// 	width: 50,
		// 	height: 50
		// }
	}
})