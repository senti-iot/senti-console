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
	const { classes, children, ...rest } = props;
	return (
		<Grid item {...rest} className={(props.noPadding ? '' : classes.grid) + " " + props.extraClass}>
			{children}
		</Grid>
	);
}

export default withStyles(style)(ItemGrid);
