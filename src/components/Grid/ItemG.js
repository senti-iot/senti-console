import { Grid, withStyles } from "@material-ui/core";
import React from "react";

const style = {
	justify: {
		display: "flex",
		justifyContent: "center"
	}
};

function ItemG({ ...props }) {
	const { classes, children, ...rest } = props;
	return (
		<Grid item {...rest} /* className={justify ? classes.justify : ""} */>
			{children}
		</Grid>
	);
}

export default withStyles(style)(ItemG);
