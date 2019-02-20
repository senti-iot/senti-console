import teal from '@material-ui/core/colors/teal'

export const graphStyles = theme => ({
	largeIcon: {
		color: theme.palette.type === 'dark' ? '#fff' : teal[500],
		width: 28,
		height: 28
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