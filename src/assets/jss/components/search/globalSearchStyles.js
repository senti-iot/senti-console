
const globalSearchStyles = theme => ({
	autosuggestContainer: {
		display: 'flex',
		alignItems: "center",
		justifyContent: "center",
		position: 'relative'
	},
	suggestionTextContainer: {
		[theme.breakpoints.up('md')]: {
			maxWidth: "calc(100% - 170px)",
		},
		padding: 16, paddingTop: 8
	},
	suggestionText: {
		maxWidth: 300,
		[theme.breakpoints.down('md')]: {
			maxWidth: 200
		},
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	containerActive: {
		[theme.breakpoints.down('md')]: {
			width: "calc(100vw - 16px) !important",
			left: 0,
			zIndex: 9999,
			position: "fixed !important",
			background: '#8a8a8a !important'
		},
		[theme.breakpoints.between('sm', 'md')]: {
			left: 0,
			zIndex: 9999,
			position: "fixed !important",
			width: "calc(100vw - 32px) !important",
			background: '#8a8a8a !important'
		},
	},
	container: {
		position: 'relative',
		background: 'rgba(255, 255, 255, 0.15)',
		marginLeft: 8,
		marginRight: 16,
		borderRadius: 4,
		display: 'flex',
		[theme.breakpoints.down('md')]: {
			width: 72
		},
		"&:hover": {
			background: 'rgba(255, 255, 255, 0.25)',
			// background: teal[500] + 19
			// background: 'rgba(11,198,100,0.25)'
		}
	},
	suggestionsContainer: {
		// height: 0,
		transition: 'height 300ms ease',
		maxHeight: 500,
		[theme.breakpoints.down('md')]: {
			height: 'calc(100vh - 30vh)'
		},
		maxWidth: 700,
		overflow: 'auto',
		zIndex: 5000,
		position: "absolute",
		marginTop: 32,
		top: 30,
	},
	suggestionsContainerOpen: {
		maxHeight: 500,
		[theme.breakpoints.up('sm')]: {
			maxHeight: 500,
		},
		minWidth: 300,
		maxWidth: 700,
		overflow: 'auto',
		zIndex: 5000,
		position: "absolute",
		marginTop: 32,
		top: 30,
		transition: 'height 300ms ease',
		[theme.breakpoints.down('md')]: {
			maxWidth: '100%',
			width: 'calc(100vw - 24px)',
			position: 'fixed',
			height: 'calc(70% - 64)',
			left: 0,
			margin: 12,
			marginTop: 32,
			top: 32
		}
		// marginTop: theme.spacing.unit * 4,
		// maxWidth: 'calc(100vw - 100px)'
		// left: 0,
	},
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	searchIcon: {
		width: 72,
		height: "100%",
		display: "flex",
		position: "absolute",
		alignItems: "center",
		pointerEvents: "none",
		justifyContent: "center",
	},
	input: {
		color: '#fff',
		[theme.breakpoints.down('md')]: {
			width: '0%',
			"&:focus": {
				width: '100%'
			},
			transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		},
		[theme.breakpoints.up('sm')]: {
			width: 120,
			"&:focus": {
				width: 170
			},
			transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		},
		padding: '8px 8px 8px 72px'
	},
	adornment: {
		[theme.breakpoints.down('md')]: {
			position: "fixed",
			height: 48,
			left: 'calc(100vw - 70px)',
		},
		transition: 'all 300ms ease'
	}
})

export default globalSearchStyles