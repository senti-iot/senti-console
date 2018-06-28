import React from "react";
import { withStyles, Grid } from "@material-ui/core";

const style = {
	grid: {
		padding: "0 8px",
		margin: "8px",
		// justifyContent: 'center',
		// alignItems: 'center'
	}
};

function ItemGrid({ ...props }) {
	const { classes, children, noPadding, extraClass, ...rest } = props;
	return (
		<Grid item {...rest} className={(noPadding ? '' : classes.grid) + " " + extraClass}>
			{children}
		</Grid>
	);
}

export default withStyles(style)(ItemGrid);
