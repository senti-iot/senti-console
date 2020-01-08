import React from 'react';
import { Typography } from '@material-ui/core';

function Info({ ...props }) {
	const { paragraphCell, noWrap, children, rest, paragraph } = props;
	return (
		<Typography {...rest} noWrap={noWrap ? true : false} paragraph={paragraph} classes={{ root: paragraphCell }}>{children}</Typography>
	);
}

export default Info;
