import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import cx from 'classnames'
import { colors, IconButton } from '@material-ui/core';
import { Muted } from 'components';
import { MoreVert, Visibility, Airplay, Star, LocalOffer } from 'variables/icons';

const styles = theme => ({
	smallButton: {
		padding: 4
	},
	menuButton: {
		position: 'absolute',
		top: 0,
		right: 0
	},
	header: {
		fontSize: '1rem',
	},
	content: {
		fontSize: '0.875rem'
	},
	card: {
		// width: 250,
		// height: 300,
		margin: 8,
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

class DashboardCard extends Component {
	render() {
		const { classes, header, content, c, handleOpenDashboard } = this.props;
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
					<IconButton className={classes.menuButton}>
						<MoreVert/>
					</IconButton>

				</CardMedia>
				<CardContent classes={{ root: classes.cardContent }}>
					<Typography gutterBottom className={classes.header}>
						{header}
					</Typography>
					<Muted className={classes.content}>
						{content}
					</Muted>
				</CardContent>
				<CardActions>
					<IconButton className={classes.smallButton}>
						<Visibility/>
					</IconButton>
					<IconButton className={classes.smallButton} onClick={handleOpenDashboard}>
						<Airplay/>
					</IconButton>
					<IconButton className={classes.smallButton}>
						<Star/>
					</IconButton>
					<div style={{ marginLeft: 'auto' }}/>
					<IconButton className={classes.smallButton}>
						<LocalOffer/>
					</IconButton>
				</CardActions>
			</Card>
		);
	}
}



export default withStyles(styles)(DashboardCard);