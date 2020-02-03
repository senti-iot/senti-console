import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
	scrollbar: {
		background: theme.palette.type === "light" ? "rgba(128,128,128,0.5)" : "rgba(255,255,255,0.5)",
		borderRadius: 8,
		transition: "all 100ms ease",
		"&:hover": {
			background: theme.palette.type === "light" ? "rgba(128,128,128,0.9)" : "rgba(255,255,255, 0.9)"
		},
		cursor: "drag"
	}
})

const SB = props => {
	const renderThumb = ({ style, ...props }) => {
		const { classes } = props
		return (
			<div
				className={classes.scrollbar}
				style={{ ...style, right: 4 }}
				{...props} />
		);
	}
	const renderContainer = ({ style, ...other }) => {
		const viewStyle = {
			display: 'inline-flex'
		}
		return (
			<div
				style={{ ...style, ...viewStyle }}
			/>)
	}

	return (
		<Scrollbars
			renderThumbHorizontal={renderThumb}
			renderThumbVertical={renderThumb}
			renderView={renderContainer}
		// style={{ maxWidth: '100%' }}
		>
			{props.children}
		</Scrollbars>
	)
}

export default withStyles(styles)(SB)
