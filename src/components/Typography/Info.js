import React from "react";
import {  Typography } from "@material-ui/core";

// import typographyStyle from "assets/jss/material-dashboard-react/typographyStyle.js";

function Info({ ...props }) {
	// const { classes, children } = props;
	return (
		<Typography paragraph classes={props.classes}>{props.children}</Typography>
	);
}

export default Info;
