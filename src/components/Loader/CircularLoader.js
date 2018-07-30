import React, { Component } from 'react'
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
//
const styles = theme => ({
	grid: {
		minHeight: 'calc(100vh - 130px)'
	}
})
class CircularLoader extends Component {
	render() {
		const { classes, notCentered } = this.props
		return (
			<Grid container justify={'center'} alignItems="center" className={ notCentered ? '' : classes.grid}><CircularProgress /></Grid>
		)
	}
}

export default withStyles(styles)(CircularLoader)