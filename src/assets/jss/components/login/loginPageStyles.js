// import { container, primaryColor } from "assets/jss/material-dashboard-react";
// import teal from '@material-ui/core/colors/teal'
import { makeStyles } from '@material-ui/styles'

const loginPageStyles = makeStyles(theme => ({
	smallAction: {
		padding: 0,
		// color: primaryColor,
		'&:hover': {
			background: 'initial',
			// color: hoverColor
		},
	},
	IconEndAd: {
		marginLeft: 12,
	},
	p: {
		marginBottom: theme.spacing(1),
	},
	wrapper: {
		display: 'flex',
		// height: '100vh',
		overflow: 'auto',
		// position: 'fixed',
		[theme.breakpoints.up('md')]: {
			height: '100vh',
		},
	},
	logo: {
		height: 100,
		margin: 8,
	},
	footer: {
		flex: 1,
	},
	footerText: {
		padding: '24px',
		[theme.breakpoints.down('md')]: {
			padding: 24,
		},
		[theme.breakpoints.down('sm')]: {
			padding: 48,
		},
		[theme.breakpoints.down('xs')]: {
			padding: 8,
		},
		[theme.breakpoints.down('md')]: {
			margin: 8,
		},
	},
	paperContainer: {
		padding: '24px',
		[theme.breakpoints.down('lg')]: {
			padding: 0,
		},
		[theme.breakpoints.down('md')]: {
			padding: 24,
		},
		[theme.breakpoints.down('sm')]: {
			padding: 24,
		},
		[theme.breakpoints.down('xs')]: {
			padding: 8,
		},
	},
	paper: {
		transition: 'all 300ms ease',
		width: '100%',
		borderRadius: 0,
		// height: '100%',
		[theme.breakpoints.up('md')]: {
			height: '100%',
		},
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		[theme.breakpoints.down('sm')]: {
			borderRadius: 8,
		},
		[theme.breakpoints.down('xs')]: {
			borderRadius: 8,
		},
	},
	needAccount: {
		fontSize: '1rem',
	},
	loginButton: {
		margin: '16px',
		[theme.breakpoints.down('md')]: {
			margin: '8px 8px',
		},
	},
	container: {
		width: '100%',
		height: '100%',
	},
	mobileContainer: {
		[theme.breakpoints.down('sm')]: {
			// height: 'calc(100% - 48px)',
			padding: 24,
		},
		[theme.breakpoints.down('xs')]: {
			// height: 'calc(100% - 32px)',
			padding: '10px 16px',
		},
	},
	loader: {
		width: '100%',
		height: 300,
	},
}))

export default loginPageStyles
