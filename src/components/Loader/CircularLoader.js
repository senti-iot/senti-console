import React, { Component } from 'react'
import { withStyles, Grid, CircularProgress, Fade } from '@material-ui/core';
import PropTypes from 'prop-types'

const styles = theme => ({
	grid: {
		minHeight: 'calc(100vh - 300px)'
	}
})

/**
* @augments {Component<{	notCentered:boolean>}
*/
class CircularLoader extends Component {
	render() {
		const { classes, notCentered, className } = this.props
		return (
			<Grid container justify={'center'} alignItems='center' className={ (notCentered ? '' : classes.grid) + ' ' + className}>
				<Fade in={true}>
					<CircularProgress />
				</Fade>
			</Grid>
		)
	}
}
CircularLoader.propTypes = {
	notCentered: PropTypes.bool
}
export default withStyles(styles)(CircularLoader)