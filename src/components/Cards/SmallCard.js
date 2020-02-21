import { Avatar, Card, CardActions, CardContent, CardHeader, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const styles = theme => ({
	title: {
		fontSize: '1em',
		fontWeight: 500
	},
	avatar: {
		borderRadius: 0,
		backgroundColor: 'transparent',
		color: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : '#fff',
	},
	card: {
		margin: 8,
		display: 'flex',
		flexFlow: 'column',
		flexGrow: 1
	},
	cardContent: {
		flexGrow: 1
	},
	media: {
		height: 0,
		paddingTop: '56.25%',
	},
	rightAction: {
		marginLeft: 'auto'
	},
	whiteAvatar: {
		background: '#FFF'
	}
})

const SimpleMediaCard = props => {
	const { classes, title, content, noAvatar, topAction, leftActions, rightActions, avatar, whiteAvatar, subheader } = props;

	return (
		<Card className={classes.card}>
			<CardHeader
				action={topAction}
				avatar={noAvatar ? null : <Avatar aria-label='Avatar' className={whiteAvatar ? classes.whiteAvatar : classes.avatar}>{avatar}</Avatar>}
				title={title}
				subheader={subheader}
				classes={{
					title: classes.title
				}}
			/>
			<CardContent classes={{ root: classes.cardContent }}>
				{content}
			</CardContent>
			<CardActions className={classes.actions}>
				{leftActions}
				<div className={classes.rightAction}>
					{rightActions}
				</div>
			</CardActions>
		</Card>
	)
}

SimpleMediaCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleMediaCard);