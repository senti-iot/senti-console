import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { Card, CardHeader, CardContent, CardActions, Collapse, Avatar, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import { Typography } from '@material-ui/core';
import Caption from '../Typography/Caption';


class InfoCard extends React.Component {
	state = { expanded: false, leftActions: false };

	handleExpandClick = () => {
		this.setState({ expanded: !this.state.expanded });
	};
	hasSubheader = (subheader) => subheader ? subheader.toString().length < 200 ? subheader ? subheader : null : null : null
	renderSubHeader = () => {
		const { subheader } = this.props
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
		const { classes, title, subheader,
			content, hiddenContent, avatar,
			noAvatar, leftActions, leftActionContent } = this.props;

		return (
			<Card className={classes.card + classes.plainCardClasses}>
				<CardHeader
					action={this.props.topAction}
					avatar={
						noAvatar ? null : <Avatar aria-label="Avatar" className={classes.avatar}>
							{avatar}
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
						{/* <Collapse in={this.state.leftActions} timeout={'auto'} unmountOnExit> */}
						{leftActionContent ? <CardContent classes={{ root: classes.root }}>
							{leftActionContent}
						</CardContent>
							: null}
						{/* </Collapse> */}
						<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
							<CardContent classes={{ root: classes.root }}>
								{hiddenContent ? hiddenContent : null}
							</CardContent>
						</Collapse>
						<CardActions className={classes.actions} disableActionSpacing>
							{leftActions ? leftActions : null}
							<Button
								onClick={this.handleExpandClick}
								aria-expanded={this.state.expanded}
								aria-label="Show more"
								className={classes.expandPosition}
							>
								<Caption>
									{this.state.expanded ? "See Less" : "See More"}
								</Caption><ExpandMoreIcon className={classnames(classes.expand, {
									[classes.expandOpen]: this.state.expanded,
								})}/>
							</Button>
						</CardActions>
					</React.Fragment>
					: null}
			</Card>
		);
	}
}

InfoCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(regularCardStyle)(InfoCard);