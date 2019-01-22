import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import cardFooterStyle from 'assets/jss/material-dashboard-react/cardFooterStyle';

function CardFooter({ ...props }) {
	const { classes, className, children, ...rest } = props;
	const cardFooterClasses = classNames({
		[classes.cardFooter]: true,
		[className]: className !== undefined
	});
	return (
		<div className={cardFooterClasses} {...rest}>
			{children}
		</div>
	);
}

CardFooter.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string
};

export default withStyles(cardFooterStyle)(CardFooter);
