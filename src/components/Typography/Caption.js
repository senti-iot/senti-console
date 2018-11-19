import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

import typographyStyle from 'assets/jss/material-dashboard-react/typographyStyle.js';

function Caption({ ...props }) {
	const { children } = props;
	return (
		<Typography noWrap={props.noWrap ? true : false} variant={'caption'} className={props.className ? props.className : ''}>
			{children}
		</Typography>
	);
}

export default withStyles(typographyStyle)(Caption);
