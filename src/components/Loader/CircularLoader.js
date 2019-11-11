import React from 'react'
import { Grid, CircularProgress, Fade } from '@material-ui/core';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles';
import cx from 'classnames'
const clStyles = makeStyles(() => ({
	grid: {
		minHeight: 'calc(100vh - 300px)'
	},
	fill: {
		height: '100%',
		width: '100%'
	}
}))


const CircularLoader = (props) => {
	const { notCentered, className, fill } = props
	const classes = clStyles()
	const gridClasses = cx({
		[classes.grid]: notCentered,
		[classes.fill]: fill,
		[className]: className ? true : false
	})
	return (
		<Grid container justify={'center'} alignItems='center' className={gridClasses} style={props.style}>
			<Fade in={true}>
				<CircularProgress />
			</Fade>
		</Grid>
	)

}
CircularLoader.propTypes = {
	notCentered: PropTypes.bool
}
export default CircularLoader