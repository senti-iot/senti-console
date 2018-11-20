import { Card, CardActions, CardContent, withStyles, ButtonBase } from '@material-ui/core';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ExifOrientationImg from 'react-exif-orientation-img';

class DiscoverSentiCard extends Component {

	render() {
		const { classes, content,  leftActions, rightActions, img } = this.props;
		return (
			<Card className={classes.cardPlain}>
				{img ? <CardContent classes={{ root: classes.root + ' ' + classes.discoverSentiCenter + ' ' + classes.contentMedia }}>
					<ButtonBase className={classes.discoverSentiImg} style={{
						width: img.width,
					}} onClick={this.props.onClick}>
						<ExifOrientationImg src={img} height={'100%'} style={{ maxWidth: '100%' }} />
					</ButtonBase>
				</CardContent> : null}
				<CardContent classes={{ root: classes.root + ' ' + classes.smallCardCustomHeight + ' ' + classes.alignCenter }}>
					{content}
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

DiscoverSentiCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(regularCardStyle)(DiscoverSentiCard);