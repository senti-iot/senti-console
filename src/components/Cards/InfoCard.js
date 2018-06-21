import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
// import teal from '@material-ui/core/colors/teal';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import { Typography } from '@material-ui/core';


class InfoCard extends React.Component {
	state = { expanded: false };

	handleExpandClick = () => {
		this.setState({ expanded: !this.state.expanded });
	};
	hasSubheader = (subheader) => subheader ? subheader.toString().length < 200 ? subheader ? subheader : null : null : null
	renderSubHeader = () => {
		const { subheader }  = this.props
		return subheader ? subheader.toString().length > 200 ?
			<Fragment>
				<Typography variant={'caption'}>
					Description
				</Typography>
				<Typography paragraph>
					{subheader ? subheader : null}
				</Typography>
			</Fragment>
			: null : null
		
	}
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
						subheader={this.hasSubheader(subheader)}
					>
					
					</CardHeader>

					<Collapse in={this.props.hideFacts ? !this.state.expanded : true} timeout="auto" unmountOnExit>
						<CardContent>
							{this.renderSubHeader()}
							{content ? content : null}
						</CardContent>
					</Collapse>
					{!this.props.noExpand ?
						<React.Fragment>
						
							<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
								<CardContent classes={{
									root: classes.root
								}
								}>
									{hiddenContent ? hiddenContent : null}
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
						</React.Fragment>
						: null}
				</Card>
			</div>
		);
	}
}

InfoCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(regularCardStyle)(InfoCard);