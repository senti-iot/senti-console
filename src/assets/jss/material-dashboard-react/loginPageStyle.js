// import { container, primaryColor } from "assets/jss/material-dashboard-react";
// import teal from '@material-ui/core/colors/teal'


const loginPageStyles = theme => ({
	wrapper: {
		display: 'flex',
		height: '100vh',
	},
	logo: {
		height: 100,
		margin: 8,
	},
	footer: {
		flex: 1,
	},
	footerText: {
		padding: "24px",
		[theme.breakpoints.down('md')]: {
			padding: 24
		},
		[theme.breakpoints.down('sm')]: {
			padding: 48
		},
		[theme.breakpoints.down('xs')]: {
			padding: 8,
		},
		[theme.breakpoints.down('md')]: {
			margin: 8
		}
	},
	paperContainer: {
		padding: "24px",
		[theme.breakpoints.down('lg')]: {
			padding: 0
		},
		[theme.breakpoints.down('md')]: {
			padding: 24
		},
		[theme.breakpoints.down('sm')]: {
			padding: 48
		},
		[theme.breakpoints.down('xs')]: {
			padding: 8,
		},

	},
	paper: {
		transition: 'all 300ms ease',
		width: '100%',
		borderRadius: 0,
		height: '100%',
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		[theme.breakpoints.down('sm')]: {
			borderRadius: 8,
		},
		[theme.breakpoints.down('xs')]: {
			borderRadius: 8
		}
	},
	needAccount: {
		fontSize: '1rem',
	},
	loginButton: {
		margin: "16px",
		[theme.breakpoints.down('md')]: {
			margin: "8px 8px",
		}
	},
	container: {
		width: "100%",
		height: "100%",
	},
	mobileContainer: {
		[theme.breakpoints.down('sm')]: {
			height: 'calc(100% - 48px)',
			padding: 24
		},
		[theme.breakpoints.down('xs')]: {
			height: 'calc(100% - 32px)',
			padding: 16,
		}
	},
	loader: {
		width: '100%',
		height: 300
	},
})

export default loginPageStyles;
