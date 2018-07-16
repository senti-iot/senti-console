import { Avatar, Card, CardActions, CardContent, CardHeader, Typography, withStyles } from '@material-ui/core';
import { LibraryBooks } from '@material-ui/icons';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class SimpleMediaCard extends Component {

	render() {
		const { classes, title, content, noAvatar, topAction, leftActions, rightActions } = this.props;
		return (
			<Card className={classes.smallCard + classes.plainCardClasses}>
				<CardHeader
					action={topAction}
					avatar={
						noAvatar ? null : <Avatar aria-label="Avatar" className={classes.avatar}>
							<LibraryBooks/>
						</Avatar>
					}
					title={title}/>
				<CardContent classes={{ root: classes.root + ' ' + classes.smallCardCustomHeight }}>
					<Typography component="p" classes={{ root: classes.textOvrflow }}>
						{content}
					</Typography>
				</CardContent>
				<CardActions className={classes.actions} disableActionSpacing>
					<div className={classes.leftActions}>
						{leftActions}
					</div>
					<div className={classes.rightActions}>
						{rightActions}
					</div>
				</CardActions>
			</Card>
		)
	}
}

SimpleMediaCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(regularCardStyle)(SimpleMediaCard);