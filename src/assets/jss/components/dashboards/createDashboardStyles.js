// ##############################
// // // Dashboard styles
// #############################


import { bgColorsLight } from '../../material-dashboard-react/bgColorsLight';
import { makeStyles } from '@material-ui/styles';

const createDashboardStyles = makeStyles(theme => ({
	...bgColorsLight(theme),

	cAppBar: {
		position: 'sticky',
		backgroundColor: theme.header,
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
		display: "flex",
		justifyContent: 'center',
		height: 70,

	},
	flex: {
		flex: 1,
	},
	editSourceDrawer: {
		height: 'calc(100% - 70px)',
		width: 360,
		top: 70,
		background: theme.palette.type === 'light' ? 'rgba(255,255,255, 0.3)' : 'rgba(0, 0, 0, 0.7)'
	},

	editGraph: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		zIndex: '9999',
		width: '100%',
		height: '100%',
		opacity: 0,

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		fontSize: '24px',
		// padding: '20px',
		borderRadius: 4,
		transition: 'all 300ms ease',
		transformOrigin: 'center',
		transform: 'translate(-50%, -50%)',
		"&:hover": {
			background: 'rgba(128,128,128,0.7)',
			// cursor: 'move',
			opacity: 1
		}
	}

}));

export default createDashboardStyles
