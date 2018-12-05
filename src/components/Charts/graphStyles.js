import teal from '@material-ui/core/colors/teal'

export const graphStyles = theme => ({
	largeIcon: {

		color: theme.palette.type === 'dark' ? '#fff' : teal[500],
		[theme.breakpoints.down('sm')]: {
			width: 30,
			height: 30
		},
		width: 40,
		height: 40
	},
	antialias: {
		webkitFontSmoothing: 'antialiased',
		'-webkit-font-smoothing': 'antialiased'
	},
	expand: {
		flex: 1,
		width: 'auto',
		textAlign: 'right',
		margin: '0 12px'
	},
	paper: {
		padding: theme.spacing.unit

	},
	popover: {
		pointerEvents: 'none',
	},
})