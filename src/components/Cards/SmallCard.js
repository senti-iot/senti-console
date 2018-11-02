import { Avatar, Card, CardActions, CardContent, CardHeader, withStyles } from '@material-ui/core';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ExifOrientationImg from 'react-exif-orientation-img';

class SimpleMediaCard extends Component {

	render() {
		const { classes, title, content, noAvatar, topAction, leftActions, rightActions, img, avatar, whiteAvatar, subheader } = this.props;
		return (
			<Card className={classes.smallCard + classes.plainCardClasses}>
				<CardHeader
					action={topAction}
					avatar={
						noAvatar ? null : <Avatar aria-label="Avatar" className={whiteAvatar ? classes.whiteAvatar : classes.avatar}>
							{avatar}
						</Avatar>
					}
					title={title}
					subheader={subheader}
				/>
				{img ? <CardContent classes={{ root: classes.root + ' ' + classes.smallCardCustomHeight + ' ' + classes.contentMedia }}>
					<ExifOrientationImg src={img} width={"100%"} />
				</CardContent> : null}
				<CardContent classes={{ root: classes.root + ' ' + classes.smallCardCustomHeight }}>
					{content}
					{/* <Typography component="p" classes={{ root: classes.textOvrflow }}>
					
					</Typography> */}
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