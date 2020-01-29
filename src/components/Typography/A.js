import React from 'react';
import { withStyles, Link } from '@material-ui/core';
import PropTypes from 'prop-types';

import typographyStyle from 'assets/jss/material-dashboard-react/typographyStyle.js';

function A({ ...props }) {
	const { classes, children, ...rest } = props;
	return (
		<Link {...rest} className={classes.defaultFontStyle + ' ' + classes.aStyle}>
			{children}
		</Link>
	);
}

A.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(typographyStyle)(A);
