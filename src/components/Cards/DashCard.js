import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Collapse, Typography, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ExpandMore } from 'variables/icons';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import withLocalization from 'components/Localization/T';
import { ItemG } from 'components';
import { compose } from 'recompose';
import cx from 'classnames'
import { useLocalization } from 'hooks';

//Unused
// @Andrei
const DashCard = props => {
	const t = useLocalization()
	const [expanded, setExpanded] = useState(props.expanded ? props.expanded : false)
	// const [cardExpanded, setCardExpanded] = useState(false) // added
	// const [stateLeftActions, setStateLeftActions] = useState(false)
	// constructor(props) {
	//   super(props)

	//   this.state = {
	// 	  expanded: props.expanded ? props.expanded : false,
	// 	  leftActions: false,
	//   }
	// }
	const handleExpandClick = () => {
		setExpanded(!expanded)
		// this.setState({ expanded: !this.state.expanded });
	};
	const hasSubheader = (subheader) => subheader ? subheader.toString().length < 200 ? subheader ? subheader : null : null : null
	const renderSubHeader = () => {
		const { subheader, subheaderTitle } = props
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
	// declared but value never used

	// const handleExpandCardClick = () => {
	// 	setCardExpanded(!cardExpanded)
	// 	// this.setState({ cardExpanded: !this.state.cardExpanded })
	// }
	const renderTopAction = () => {
		const { menuExpand, classes } = props
		return <ItemG container justify={'flex-end'}>
			{props.topAction}
			{!menuExpand ? null : <IconButton variant={'text'}
				onClick={handleExpandClick}
				aria-expanded={expanded}
				aria-label='Show more'
			>
				<ExpandMore className={classnames(classes.expand, {
					[classes.expandOpen]: expanded,
				})} />
			</IconButton>}
		</ItemG>
	}

	const { classes, title, subheader,
		content, hiddenContent, avatar,
		noAvatar, leftActions, leftActionContent, background, noRightExpand, whiteAvatar, noHeader, dashboard } = props;
	const cardClasses = cx({
		[classes.card]: true,
		[classes.plainCardCalsses]: true,
		[classes[background]]: background
	})
	return (
		<Card className={cardClasses}>
			{noHeader ? null : <CardHeader
				action={renderTopAction()}
				avatar={noAvatar ? null : <Avatar aria-label='Avatar' className={classes.avatar + ' ' + (whiteAvatar ? classes.whiteAvatar : "")}>{avatar}</Avatar>}
				title={title}
				subheader={hasSubheader(subheader)}
				classes={{
					title: classes.title,
					action: classes.actions,
					subheader: classes.subheader
				}}
			>

			</CardHeader>}
			<CardContent className={classnames(
				{ [classes.dashboard]: dashboard },
				{ [classes.transition]: true },
				{ [classes.contentMedia]: props.noPadding },
				{ [classes.noMargin]: props.noExpand ? false : props.haveMargin ? false : !expanded })}>
				{renderSubHeader()}
				{content ? content : null}
			</CardContent>
			{!props.noExpand ?
				<React.Fragment>
					{leftActionContent ? <CardContent classes={{ root: classes.root }}>
						{leftActionContent}
					</CardContent> : null}
					<Collapse in={expanded} timeout='auto' unmountOnExit>
						<CardContent className={classnames(
							{ [classes.contentMedia]: props.noHiddenPadding },
							{ [classes.noPadding]: props.noHiddenPadding ? true : false })} /* classes={{ root: classes.root }} */>
							{hiddenContent ? hiddenContent : null}
						</CardContent>
					</Collapse>
					<CardActions className={classes.actions}>
						{leftActions ? leftActions : null}
						{!noRightExpand ? <Button
							variant={'text'}
							color={'primary'}
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label='Show more'
							className={classes.expandPosition}
						>
							{expanded ? t('menus.seeLess') : t('menus.seeMore')}
							<ExpandMore className={classnames(classes.expand, {
								[classes.expandOpen]: expanded,
							})} />
						</Button> : null}
					</CardActions>
				</React.Fragment>
				: null}
		</Card>
	);
}

DashCard.propTypes = {
	classes: PropTypes.object.isRequired,
	topAction: PropTypes.any,
	content: PropTypes.any,
	avatar: PropTypes.any,
	leftActions: PropTypes.any,
	leftActionContent: PropTypes.any,
	noExpand: PropTypes.bool,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	subheader: PropTypes.any,
	hiddenContent: PropTypes.any,
	noAvatar: PropTypes.any,
	hideFacts: PropTypes.bool,
};

let DashCardComposed = compose(withLocalization(), withStyles(regularCardStyle))(DashCard)
export default DashCardComposed;