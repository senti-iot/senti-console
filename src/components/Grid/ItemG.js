import { Grid, withStyles } from "@material-ui/core";
import React from "react";

const style = {

};

function ItemG({ ...props }) {
	const { classes, children, ...rest } = props;
	return (
		<Grid item {...rest}>
			{children}
		</Grid>
	);
}

export default withStyles(style)(ItemG);
