import React from "react";
import { withStyles, Typography } from "@material-ui/core";

import typographyStyle from "assets/jss/material-dashboard-react/typographyStyle.js";

function Caption({ ...props }) {
	const { children } = props;
	return (
		<Typography variant={'caption'}>
			{children}
		</Typography>
	);
}

export default withStyles(typographyStyle)(Caption);
