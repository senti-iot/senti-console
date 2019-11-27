import React from 'react'
import { Grid, CircularProgress } from '@material-ui/core';
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
	},
	fillView: {
		height: '100vh',
		width: '100vw'
	}
}))


const CircularLoader = (props) => {
	const { notCentered, className, fill, fillView } = props
	const classes = clStyles()
	const gridClasses = cx({
		[classes.grid]: notCentered,
		[classes.fillView]: fillView,
		[classes.fill]: fill,
		[className]: className ? true : false
	})
	return (
		<Grid container justify={'center'} alignItems='center' className={gridClasses} style={props.style}>
			<CircularProgress />
		</Grid>
	)

}
CircularLoader.propTypes = {
	notCentered: PropTypes.bool,
	style: PropTypes.object
}
export default CircularLoader