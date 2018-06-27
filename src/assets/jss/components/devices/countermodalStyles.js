const countermodalStyles = theme => ({
	modalWrapper: {
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
	},
	text: {
		textAlign: "center"
	},
	wrapper: {
		minHeight: 200,
		display: 'flex',
		alignItems: 'center'
	},
	counterButton: {
		minHeight: 100,
		minWidth: 100
	},
	iconButton: {
		marginRight: theme.spacing.unit
	}
});
export default countermodalStyles