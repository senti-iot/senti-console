import { red, yellow, green } from "@material-ui/core/colors";

const deviceStyles = theme => ({
	typoNoMargin: {
		margin: 0,
		padding: "0 !important",
		maxHeight: 24
	},
	redSignal: {
		color: red[700],
		marginRight: 4
	},
	greenSignal: {
		color: green[700],
		margin: 4
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	yellowSignal: {
		color: yellow[600]
	},
	InfoSignal: {
		marginBottom: '16px',
		marginTop: '4px',
		marginLeft: '4px'
	}
})
export default deviceStyles