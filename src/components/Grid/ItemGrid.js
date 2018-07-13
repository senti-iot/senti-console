import React from "react";
import { withStyles, Grid } from "@material-ui/core";

const style = {
	padding: {
		padding: "0 8px"
	},
	margin: {
		margin: "8px"
	},
	noMargin: {
		margin: "8px 0px"
	},
	zeroMargin: {
		margin: 0
	},
	grid: {
		padding: "0 8px",
		margin: "8px",
		// justifyContent: 'center',
		// alignItems: 'center'
	}
};

function ItemGrid({ ...props }) {
	const { classes, children, noPadding, extraClass, noMargin, zeroMargin, ...rest } = props;
	return (
		<Grid item {...rest} className={(zeroMargin ? classes.zeroMargin : '') + " " + (noPadding ? '' : classes.padding) + " " + (noMargin ? classes.noMargin : classes.margin) + " " + (extraClass ? extraClass : '')}>
			{children}
		</Grid>
	);
}

export default withStyles(style)(ItemGrid);
