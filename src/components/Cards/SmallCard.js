import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardHeader, Avatar } from '@material-ui/core';
import { LibraryBooks } from '@material-ui/icons'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';

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