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
		}
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