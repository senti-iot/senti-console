import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import typographyStyle from 'assets/jss/material-dashboard-react/typographyStyle.js';

function Success({ ...props }) {
	const { classes, children, className } = props;
	return (
		<div className={classes.defaultFontStyle + ' ' + classes.successText + ' ' + className}>
			{children}
		</div>
	);
}

Success.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(typographyStyle)(Success);
