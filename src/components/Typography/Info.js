import React from "react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "@material-ui/core";

import typographyStyle from "assets/jss/material-dashboard-react/typographyStyle.js";

function Info({ ...props }) {
	// const { classes, children } = props;
	return (
		<Typography paragraph>{props.children}</Typography>
	);
}

Info.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(typographyStyle)(Info);
