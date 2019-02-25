import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import cardHeaderStyle from 'assets/jss/material-dashboard-react/cardHeaderStyle.js';

function CardHeader({ ...props }) {
	const { classes, className, children, color, plainCard, ...rest } = props;
	const cardHeaderClasses = classNames({
		[classes.cardHeader]: true,
		[classes[color + 'CardHeader']]: color,
		[classes.cardHeaderPlain]: plainCard,
		[className]: className !== undefined
	});
	return (
		<div className={cardHeaderClasses} {...rest}>
			{children}
		</div>
	);
}

CardHeader.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	color: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary']),
	plainCard: PropTypes.bool
};

export default withStyles(cardHeaderStyle)(CardHeader);
