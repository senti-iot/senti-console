import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import typographyStyle from 'assets/jss/material-dashboard-react/typographyStyle.js';

function Muted({ ...props }) {
	const { classes, children, className } = props;
	return (
		<div title={props.title} className={classes.defaultFontStyle + ' ' + classes.mutedText + ' ' + className}>
			{children}
		</div>
	);
}

Muted.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(typographyStyle)(Muted);
