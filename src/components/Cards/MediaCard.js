import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
const styles = {
	card: {
		margin: 8,
		display: 'flex',
		flexFlow: 'column',
		flexGrow: 1
	},
	cardContent: {
		minHeight: 150,
		flexGrow: 1
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
};

function MediaCard(props) {
	const { classes, header, content, img, leftAction, rightAction } = props;
	return (
		<Card className={classes.card}>
		
			<CardMedia
				className={classes.media}
				image={img}
				title=''
			/>
			<CardContent classes={{ root: classes.cardContent }}>
				<Typography gutterBottom variant='h5'>
					{header}
				</Typography>
				<Typography component='p'>
					{content}
				</Typography>
			</CardContent>
			<CardActions>
				{leftAction}
				{rightAction}
			</CardActions>
		</Card>
	);
}

MediaCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);