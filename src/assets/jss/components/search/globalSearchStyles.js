
const globalSearchStyles = theme => ({
	autosuggestContainer: {
		display: 'flex',
		alignItems: "center",
		justifyContent: "center",

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
	container: {
		position: 'relative',
		background: 'rgba(255, 255, 255, 0.15)',	
		marginLeft: 8,
		marginRight: 16,
		borderRadius: 4,
		display: 'flex',
		"&:hover": {
			background: 'rgba(255, 255, 255, 0.25)',	
			// background: teal[500] + 19
			// background: 'rgba(11,198,100,0.25)'
		}
	},
	suggestionsContainer: {
		height: 0,
		transition: 'height 300ms ease',
		maxHeight: 500,
		[theme.breakpoints.down('md')]: {
			height: 'calc(70%)' 
		},
		maxWidth: 700,
		overflow: 'auto',
		zIndex: 5000,
		position: "absolute",
		marginTop: 32,
		top: 30,
	},
	suggestionsContainerOpen: {
		// position: 'absolute',
		// right: "30px",
		maxHeight: 500,
		[theme.breakpoints.down('md')]: {
			height: 'calc(70%)' 
		},
		[theme.breakpoints.up('sm')]: {
			height: 500,
		},
		maxWidth: 700,
		overflow: 'auto',
		zIndex: 5000,
		position: "absolute",
		marginTop: 32,
		top: 30,
		transition: 'height 300ms ease',
		[theme.breakpoints.down('md')]: { 
			maxWidth: '100%'
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
		width: 120,
		"&:focus": {
			[theme.breakpoints.up('md')]: {
				width: 170
			}
		},
		transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		padding: '8px 8px 8px 72px'
	}
})

export default globalSearchStyles