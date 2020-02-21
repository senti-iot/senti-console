import { makeStyles } from '@material-ui/core';

const gaugeStyles = makeStyles(theme => ({
	smallSubheader: {
		paddingBottom: 0
	},
	subheader: {
		[theme.breakpoints.down('sm')]: {
			paddingBottom: 0
		}
	},
	smallBody: {
		paddingTop: 0
	},

	body: {
		[theme.breakpoints.down('sm')]: {
			paddingTop: 0
		}
	},
	smallTitle: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		paddingLeft: 8,
		[theme.breakpoints.down('sm')]: {
			paddingBottom: 8,
			paddingTop: 8
		},
		[theme.breakpoints.up('xs')]: {
			paddingBottom: 16,
			paddingTop: 16
		}
	}
}))

export default gaugeStyles