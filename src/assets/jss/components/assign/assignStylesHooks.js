import { makeStyles } from '@material-ui/styles';

const assignStylesH = makeStyles(theme => ({
	appBar: {
		position: 'sticky',
		backgroundColor: () => { console.log(theme); return theme.header },
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		width: "100%",
		paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// borderRadius: "3px",
		padding: "10px 0",
		transition: "all 150ms ease 0s",
		minHeight: "50px",
	},
	flex: {
		flex: 1,
	},
	selectedItem: {
		background: theme.palette.primary.main,
		"&:hover": {
			background: theme.hover
		}
		// color: "#fff"
	},
	selectedItemText: {
		color: "#FFF"
	}
}))

export default assignStylesH