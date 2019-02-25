import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import cardBodyStyle from 'assets/jss/material-dashboard-react/cardBodyStyle';

function CardBody({ ...props }) {
	const { classes, className, children, ...rest } = props;
	const cardBodyClasses = classNames({
		[classes.cardBody]: true,
		[className]: className !== undefined
	});
	return (
		<div className={cardBodyClasses} {...rest}>
			{children}
		</div>
	);
}

CardBody.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string
};

export default withStyles(cardBodyStyle)(CardBody);
