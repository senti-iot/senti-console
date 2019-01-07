import React from 'react';
import {  Typography } from '@material-ui/core';

// import typographyStyle from 'assets/jss/material-dashboard-react/typographyStyle.js';

function Info({ ...props }) {
	const { paragraphCell, noWrap, children, rest, noParagraph } = props;
	return (
		<Typography {...rest} noWrap={noWrap ? true : false} paragraph={noParagraph ? false : true} classes={{ root: paragraphCell }}>{children}</Typography>
	);
}

export default Info;
