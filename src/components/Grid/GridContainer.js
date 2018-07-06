import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { withStyles, Grid } from "@material-ui/core";

const style = theme => ({
	grid: {

		[theme.breakpoints.down("md")]: {
			padding: "10px 10px 30px 10px",
		},
		[theme.breakpoints.down("sm")]: {
			padding: "8px 8px 30px 8px"
		},
		padding: "30px",
		width: "auto",
		margin: 0
	}
})

function GridContainer({ ...props }) {
	const { classes, children, className, ...rest } = props;
	return (
		<Grid container {...rest} className={classes.grid + " " + className}>
			{children}
		</Grid>
	);
}

GridContainer.defaultProps = {
	className: ""
};

GridContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.node,
	className: PropTypes.string
};

export default withStyles(style)(GridContainer);
