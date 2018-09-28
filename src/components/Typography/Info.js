import React from "react";
import {  Typography } from "@material-ui/core";

// import typographyStyle from "assets/jss/material-dashboard-react/typographyStyle.js";

function Info({ ...props }) {
	// const { classes, children } = props;
	return (
		<Typography {...props} noWrap={props.noWrap ? true : false} paragraph classes={{ root: props.paragraphCell }}>{props.children}</Typography>
	);
}

export default Info;
