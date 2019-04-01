
const globalSearchStyles = theme => ({
	autosuggestContainer: {
		display: 'flex',
		alignItems: "center",
		justifyContent: "center",
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
	suggestionsContainerOpen: {
		// position: 'absolute',
		// right: "30px",
		
		zIndex: 5000,
		position: "absolute",
		marginTop: 32,
		top: 30,
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
			width: 170
		},
		transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		padding: '8px 8px 8px 72px'
	}
})

export default globalSearchStyles