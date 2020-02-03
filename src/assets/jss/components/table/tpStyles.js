import { makeStyles } from '@material-ui/styles';

const tpStyles = makeStyles(theme => ({
	selectIcon: {
		marginLeft: 4,
		paddingLeft: 4,
		paddingRight: 18,
	},
	noRows: {
		display: 'none'
	},
	spacer: {
		flex: 0,
	},
	spaceBetween: {
		marginRight: "auto",
		fontSize: "0.875rem"
	},
	tablePaginationCaption: {
		fontSize: "0.875rem"
	},
}))

export default tpStyles