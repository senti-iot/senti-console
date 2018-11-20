import React, { Component } from 'react'
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types'

const styles = theme => ({
	grid: {
		minHeight: 'calc(100vh - 130px)'
	}
})

/**
* @augments {Component<{	notCentered:boolean>}
*/
class CircularLoader extends Component {
	render() {
		const { classes, notCentered } = this.props
		return (
			<Grid container justify={'center'} alignItems='center' className={ notCentered ? '' : classes.grid}><CircularProgress /></Grid>
		)
	}
}
CircularLoader.propTypes = {
	notCentered: PropTypes.bool
}
export default withStyles(styles)(CircularLoader)