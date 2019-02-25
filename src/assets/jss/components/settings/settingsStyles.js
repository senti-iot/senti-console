export const settingsStyles = theme => ({
	list: {
		width: "100%"
	},
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 208,
	},
	iconColor: {
		fill: "rgba(0, 0, 0, 0.54)",
		cursor: "pointer"
	},
	p: {
		marginBottom: theme.spacing.unit
	},
	title: {
		fontWeight: 500
	},
	icon: {
		color: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : '#fff',
		marginRight: 4
	}
})