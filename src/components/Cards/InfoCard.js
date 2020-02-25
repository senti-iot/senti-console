import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Collapse, IconButton } from '@material-ui/core';
import { ExpandMore } from 'variables/icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ItemG } from 'components';
import cx from 'classnames'
import { useLocalization } from 'hooks';
import infoCardStyles from 'assets/jss/components/infocard/infocardStyles';

const InfoCard = React.memo(props => {
	//Hooks
	const t = useLocalization()
	const classes = infoCardStyles()
	//Redux

	//State
	const [expanded, setExpanded] = useState(props.expanded ? props.expanded : false)

	//Const
	const { title, subheader,
		content, hiddenContent, avatar,
		noAvatar, leftActions, leftActionContent, color, noRightExpand,
		whiteAvatar, noHeader, dashboard, headerClasses, bodyClasses } = props;

	const cardClasses = cx({
		[classes.card]: true,
		[classes.plainCardClasses]: true,
		[classes['']]: color,
		[classes.flexPaper]: props.flexPaper,
	})
	const cardContentClasses = cx(
		{ [classes.flexPaper]: props.flexPaper },
		{ [classes.dashboard]: dashboard },
		{ [classes.transition]: true },
		{ [classes.contentMedia]: props.noPadding },
		{ [classes.noMargin]: props.noExpand ? false : props.haveMargin ? false : !expanded })

	//Handlers
	const handleExpandClick = () => {
		setExpanded(!expanded)
	};

	const renderTopAction = () => {
		const { menuExpand, classes } = props
		return <ItemG container justify={'flex-end'}>
			{props.topAction}
			{!menuExpand ? null : <IconButton variant={'text'}
				onClick={handleExpandClick}
				aria-expanded={expanded}
				aria-label='Show more'
			>
				<ExpandMore className={cx(classes.expand, {
					[classes.expandOpen]: expanded,
				})} />
			</IconButton>}
		</ItemG>
	}

	return (
		<Card className={cardClasses}>
			{noHeader ? null : <CardHeader
				action={renderTopAction()}
				avatar={noAvatar ? null : <Avatar aria-label='Avatar' className={classes.avatar + ' ' + (whiteAvatar ? classes.whiteAvatar : "")}>{avatar}</Avatar>}
				title={title}
				disableTypography
				subheader={subheader}
				classes={{
					title: classes.title,
					action: classes.actions,
					subheader: classes.subheader,
					...headerClasses
				}}
			>

			</CardHeader>}
			<CardContent
				classes={{
					...bodyClasses
				}}
				className={cardContentClasses}>
				{/* {this.renderSubHeader()} */}
				{content ? content : null}
			</CardContent>
			{!props.noExpand ?
				<React.Fragment>
					{leftActionContent ? <CardContent classes={{ root: classes.root }}>
						{leftActionContent}
					</CardContent> : null}
					<Collapse in={expanded} timeout='auto' unmountOnExit>
						<CardContent className={cx(
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
							<ExpandMore className={cx(classes.expand, {
								[classes.expandOpen]: expanded,
							})} />
						</Button> : null}
					</CardActions>
				</React.Fragment>
				: null}
		</Card>
	);
})

InfoCard.propTypes = {
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

export default InfoCard;