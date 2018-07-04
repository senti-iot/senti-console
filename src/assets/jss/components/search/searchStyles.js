import teal from '@material-ui/core/colors/teal'

const searchStyles = theme => ({
	label: {
		// color: "#fff",
		'&$focused': {
			color: teal[500],
		},
	},
	focused: {},
	underline: {
		// color: "#fff",
		// borderBottomColor: "#fff",
		'&:before': {
			// borderBottomColor: '#fff'
		},
		'&:after': {
			borderBottomColor: teal[500],
		},
	},
	container: {
		flexGrow: 1,
		position: 'relative',
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
	},
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	input: {

		color: "#000000"
	}
});


export default searchStyles