import React, { Component } from 'react'
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

class SB extends Component {
	renderThumb = ({ style, ...props }) => {
		const { classes } = this.props
		return (
			<div
				className={classes.scrollbar}
				style={{ ...style, right: 4 }}
				{...props} />
		);
	}
	renderContainer = ({ style, ...props }) => {
		const viewStyle = {
			display: 'inline-flex'
		}
		return (
			<div
				style={{ ...style, ...viewStyle }}
			/>)
	}
	render() {
		return (
			<Scrollbars
				renderThumbHorizontal={this.renderThumb}
				renderThumbVertical={this.renderThumb}
				renderView={this.renderContainer}
			// style={{ maxWidth: '100%' }}
			>
				{this.props.children}
			</Scrollbars>
		)
	}
}

export default withStyles(styles)(SB)
