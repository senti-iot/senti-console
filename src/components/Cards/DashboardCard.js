import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import cx from 'classnames'
import { colors } from '@material-ui/core';
import { Muted, Dropdown, ITB } from 'components';
import { Share, Airplay, Edit, /* Star, LocalOffer */ } from 'variables/icons';

const styles = theme => ({
	overlayMedia: {
		width: '100%',
		height: '100%',
		opacity: 0,
		position: 'absolute',
		top: '0',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		transition: 'all 300ms ease',
		background: "rgba(64, 64, 64, 0.4)",
		'&:hover': {
			opacity: 1
		}
	},
	smallButton: {
		padding: 4
	},
	menuButton: {
		color: '#fff',
		position: 'absolute',
		top: 0,
		right: 0
	},
	header: {
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		fontSize: '1rem',
	},
	content: {
		// whiteSpace: 'nowrap',
		lineHeight: '1.2em',
		overflow: 'hidden',
		position: 'relative',
		maxHeight: '3.6em',
		marginRight: '-1em',
		paddingRight: '1em',
		height: '3.6em',
		textOverflow: 'ellipsis',
		fontSize: '0.875rem',
		display: '-webkit-box',
		boxOrient: 'vertical',
		lineClamp: '3',

	},
	card: {
		// width: 250,
		// height: 300,
		minHeight: '100%',
		display: 'flex',
		flexFlow: 'column',
		// flexGrow: 1,
		overflow: 'hidden',
		flex: 1
		// [theme.breakpoints.up('sm')]: {
		// }
	},
	cardContent: {
		flexGrow: 1
	},
	media: {

		paddingTop: '56.25%',
		position: 'relative'
	},
	cardImg: {
		background: '#ccc',

		'&:before': {
			// opacity: 0.3,
			position: "absolute",
			top: 0,
			bottom: 0,
			left: 0,
			content: "\"\"",
			display: "block",
			right: 0,
		}
	},
	lightBlue: {
		'&:before': {
			background: colors.lightBlue[500]
		}
	},
	cyan: {
		'&:before': {
			background: colors.cyan[500]
		}
	},
	teal: {
		'&:before': {
			background: colors.teal[500]
		}
	},
	green: {
		'&:before': {
			background: colors.green[500]
		}
	},
	lightGreen: {
		'&:before': {
			background: colors.lightGreen[500]
		}
	},
	lime: {
		'&:before': {
			background: colors.lime[500]
		}
	},
	yellow: {
		'&:before': {
			background: colors.yellow[500]
		}
	},
	amber: {
		'&:before': {
			background: colors.amber[500]
		}
	},
	orange: {
		'&:before': {
			background: colors.orange[500]
		}
	},
	deepOrange: {
		'&:before': {
			background: colors.deepOrange[500]
		}
	},
	red: {
		'&:before': {
			background: colors.red[500]
		}
	},
	pink: {
		'&:before': {
			background: colors.pink[500]
		}
	},
	purple: {
		'&:before': {
			background: colors.purple[500]
		}
	},
	deepPurple: {
		'&:before': {
			background: colors.deepPurple[500]
		}
	},
	indigo: {
		'&:before': {
			background: colors.indigo[500]
		}
	},
	blue: {
		'&:before': {
			background: colors.blue[500]
		}
	},
})

const DashboardCard = props => {
	const { classes, header, content, c, handleOpenDashboard, t, handleEditDashboard, handleOpenShare } = props;
	return (
		<Card className={classes.card}>

			<CardMedia
				className={cx({
					[classes.media]: true,
					[classes.cardImg]: true,
					[classes[c]]: true
				})}
				// image={null}
				src={'ps'}
				title=''
			>
				<div className={classes.overlayMedia}>
					<ITB
						size={'medium'}
						icon={<Airplay />}
						label={'actions.open'}
						// buttonClass={classes.smallButton}
						style={{ color: '#fff' }}
						onClick={handleOpenDashboard}
					/>
				</div>
				<Dropdown
					buttonClassName={classes.menuButton}
					menuItems={[
						{ label: t('actions.delete'), func: props.deleteDashboard },
					]}>

				</Dropdown>

			</CardMedia>
			<CardContent classes={{ root: classes.cardContent }}>
				<Typography title={header} gutterBottom className={classes.header}>
					{header}
				</Typography>
				<Muted title={content} className={classes.content}>
					<span>
						{content}
					</span>
				</Muted>
			</CardContent>
			<CardActions>
				<ITB
					icon={<Airplay />}
					label={'actions.open'}
					buttonClass={classes.smallButton}
					onClick={handleOpenDashboard}
				/>
				<ITB
					icon={<Share />}
					label={'actions.share'}
					buttonClass={classes.smallButton}
					onClick={handleOpenShare}
				/>
				<div style={{ marginLeft: 'auto' }} />
				<ITB
					icon={<Edit />}
					label={'actions.edit'}
					buttonClass={classes.smallButton}
					onClick={handleEditDashboard} />
			</CardActions>
		</Card>
	);
}



export default withStyles(styles)(DashboardCard);