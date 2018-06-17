import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import teal from '@material-ui/core/colors/teal';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';

//#region old Styles

/*
const styles = theme => ({
	card: {
		// maxWidth: 900,
		borderRadius: "4px"
	},

	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	actions: {
		display: 'flex',
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
		marginLeft: 'auto',
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: teal[600],
	},
});
*/
//#endregion


class ProjectCard extends React.Component {
	state = { expanded: false };

	handleExpandClick = () => {
		this.setState({ expanded: !this.state.expanded });
	};

	render() {
		const { classes, title, subheader, content, hiddenContent } = this.props;

		return (
			<div>
				<Card className={classes.card + classes.plainCardClasses}>
					<CardHeader
						avatar={
							<Avatar aria-label="Avatar" className={classes.avatar}>
								{title.substr(0, 1)}
							</Avatar>
						}
						title={title}
						subheader={subheader}
					/>
					<Collapse in={!this.state.expanded} timeout="auto" unmountOnExit>
						<CardContent>
							{content ? content : null}
						</CardContent>
					</Collapse>

					<CardActions className={classes.actions} disableActionSpacing>
						<IconButton
							className={classnames(classes.expand, {
								[classes.expandOpen]: this.state.expanded,
							})}
							onClick={this.handleExpandClick}
							aria-expanded={this.state.expanded}
							aria-label="Show more"
						>
							<ExpandMoreIcon />
						</IconButton>
					</CardActions>
					<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
						<CardContent classes={{
							root: classes.root
						}
						}>
							{hiddenContent ? hiddenContent : null}
						</CardContent>
					</Collapse>
				</Card>
			</div>
		);
	}
}

ProjectCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(regularCardStyle)(ProjectCard);