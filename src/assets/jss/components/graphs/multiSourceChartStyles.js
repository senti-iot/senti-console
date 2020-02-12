import { makeStyles } from '@material-ui/styles';

const multiSourceChartStyles = makeStyles(theme => ({

	smallBody: {
		paddingTop: 0
	},
	smallSubheader: {
		paddingBottom: 0
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
			// paddingBottom: 8,
			paddingTop: 8
		},
		[theme.breakpoints.up('xs')]: {
			// paddingBottom: 16,
			paddingTop: 16
		}
	},
	subheader: {
		[theme.breakpoints.down('sm')]: {
			paddingBottom: 0
		}
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	}
}))
export default multiSourceChartStyles