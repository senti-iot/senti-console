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
		const { classes, title, content, noAvatar, topAction } = this.props;
		return (
			<Card className={classes.smallCard}>
				<CardHeader
					action={topAction}
					avatar={
						noAvatar ? null : <Avatar aria-label="Avatar" className={classes.avatar}>
							<LibraryBooks/>
						</Avatar>
					}
					title={title}/>
				<CardContent>
					<Typography component="p" classes={{ root: classes.fade }}>
						{content}
					</Typography>
				</CardContent>
				<CardActions>
					{/* <Button size="small" color="primary">
						Share
						</Button>
						<Button size="small" color="primary">
						Learn More
					</Button> */}
				</CardActions>
			</Card>
		)
	}
}

SimpleMediaCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(regularCardStyle)(SimpleMediaCard);