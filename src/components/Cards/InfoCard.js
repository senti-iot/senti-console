import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Collapse, Typography, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ExpandMore } from 'variables/icons';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import withLocalization from 'components/Localization/T';
import { ItemG } from 'components';
import { compose } from 'recompose';

class InfoCard extends PureComponent {
	constructor(props) {
	  super(props)
	
	  this.state = {
		  expanded: props.expanded ? props.expanded : false,
		  leftActions: false,
	  }
	}
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
	handleExpandCardClick = () => { 
		this.setState({ cardExpanded: !this.state.cardExpanded })
	}
	renderTopAction = () => {
		const { menuExpand, classes } = this.props
		return <ItemG container justify={'flex-end'}>
			{this.props.topAction}
			{!menuExpand ? null : <IconButton variant={'text'}
				onClick={this.handleExpandClick}
				aria-expanded={this.state.expanded}
				aria-label='Show more'
			>
				<ExpandMore className={classnames(classes.expand, {
					[classes.expandOpen]: this.state.expanded,
				})}/>
			</IconButton>}
		</ItemG>
	}
	render() {
		const { classes, title, subheader,
			content, hiddenContent, avatar,
			noAvatar, leftActions, leftActionContent, noRightExpand, t, whiteAvatar } = this.props;
		return (
			<Card className={classes.card + " " + classes.plainCardClasses}>
				<CardHeader
					action={this.renderTopAction()}
					avatar={noAvatar ? null : <Avatar aria-label='Avatar' className={classes.avatar + ' ' + (whiteAvatar ? classes.whiteAvatar : "")}>{avatar}</Avatar>}
					title={title}
					subheader={this.hasSubheader(subheader)}
					classes={{
						title: classes.title,
						action: classes.actions,
						subheader: classes.subheader
					}}
				>

				</CardHeader>
				<CardContent className={classnames(
					{ [classes.contentMedia]: this.props.noPadding },
					{ [classes.noMargin]: this.props.noExpand ? false : this.props.haveMargin ? false : !this.state.expanded })}>
					{this.renderSubHeader()}
					{content ? content : null}
				</CardContent>
				{!this.props.noExpand ?
					<React.Fragment>
						{leftActionContent ? <CardContent classes={{ root: classes.root }}>
							{leftActionContent}
						</CardContent> : null}
						<Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
							<CardContent className={classnames(
								{ [classes.contentMedia]: this.props.noHiddenPadding },
								{ [classes.noPadding]: this.props.noHiddenPadding ? true : false })} /* classes={{ root: classes.root }} */>
								{hiddenContent ? hiddenContent : null}
							</CardContent>
						</Collapse>
						<CardActions className={classes.actions} disableActionSpacing>
							{leftActions ? leftActions : null}
							{!noRightExpand ? <Button
								variant={'text'}
								color={'primary'}
								onClick={this.handleExpandClick}
								aria-expanded={this.state.expanded}
								aria-label='Show more'
								className={classes.expandPosition}
							>
								{this.state.expanded ? t('menus.seeLess') : t('menus.seeMore')}
								<ExpandMore className={classnames(classes.expand, {
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

let InfoCardComposed = compose(withLocalization(), withStyles(regularCardStyle))(InfoCard)
export default InfoCardComposed;