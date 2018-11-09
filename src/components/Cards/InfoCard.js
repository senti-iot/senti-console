import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Collapse, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ExpandMore from '@material-ui/icons/ExpandMore';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import withLocalization from 'components/Localization/T';


class InfoCard extends React.Component {
	state = { expanded: false, leftActions: false };

	handleExpandClick = () => {
		this.setState({ expanded: !this.state.expanded });
	};
	hasSubheader = (subheader) => subheader ? subheader.toString().length < 200 ? subheader ? subheader : null : null : null
	renderSubHeader = () => {
		const { subheader, subheaderTitle  } = this.props
		return subheader ? subheader.toString().length > 200 ?
			<Fragment>
				<Typography variant={'caption'}>
					{subheaderTitle ? subheaderTitle : null}
				</Typography>
				<Typography>
					{subheader ? subheader : null}
				</Typography>
			</Fragment>
			: null : null

	}
	render() {
		const { classes, title, subheader,
			content, hiddenContent, avatar,
			noAvatar, leftActions, leftActionContent, noRightExpand, t  } = this.props;

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
					<CardContent className={this.props.noPadding ? classes.contentMedia : ""}>
						{this.renderSubHeader()}
						{content ? content : null}
					</CardContent>
				</Collapse>
				{!this.props.noExpand ?
					<React.Fragment>
						{leftActionContent ? <CardContent classes={{ root: classes.root }}>
							{leftActionContent}
						</CardContent> : null}
						<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
							<CardContent classes={{ root: classes.root }}>
								{hiddenContent ? hiddenContent : null}
							</CardContent>
						</Collapse>
						<CardActions className={classes.actions} disableActionSpacing>
							{leftActions ? leftActions : null}
							{!noRightExpand ? <Button
								variant={'flat'}
								color={'primary'}
								onClick={this.handleExpandClick}
								aria-expanded={this.state.expanded}
								aria-label="Show more"
								className={classes.expandPosition}
							>
								{/* <Caption> */}
								{this.state.expanded ? t("menus.seeLess") : t("menus.seeMore")}
								{/* </Caption> */}<ExpandMore className={classnames(classes.expand, {
									[classes.expandOpen]: this.state.expanded,
								})} />
							</Button> : null}
						</CardActions>
					</React.Fragment>
					: null}
			</Card>
		);
	}
}

InfoCard.propTypes = {
	classes: PropTypes.object.isRequired,
	topAction: PropTypes.any,
	content: PropTypes.any,
	avatar: PropTypes.any,
	leftActions: PropTypes.any,
	leftActionContent: PropTypes.any,
	noExpand: PropTypes.bool,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.object ]),
	subheader: PropTypes.any,
	hiddenContent: PropTypes.any,
	noAvatar: PropTypes.any,
	hideFacts: PropTypes.bool,
};

export default withLocalization()(withStyles(regularCardStyle)(InfoCard));