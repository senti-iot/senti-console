import React, { Component } from 'react'
import breadcrumbs from 'routes/breadcrumbs';
import { Link } from 'react-router-dom'
import { Typography, withStyles } from '@material-ui/core';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';

const styles = theme => ({
	breadcrumbs: {
		margin: "134px 24px 0px 24px"
	},
})

class BC extends Component {
	render() {
		const { defaultRoute, bc, t, classes } = this.props
		const bcs = breadcrumbs(t, bc.name)[bc.id]
		console.log(bc)
		return (
			<Breadcrumbs separator="›" arial-label="Breadcrumb" className={classes.breadcrumbs}>
				<Link color="inherit" to={defaultRoute}>
					{t(`sidebar.home`)}
				</Link>}
				{bcs && bcs.map((bc, index) => {
					const last = bcs.length - 1 === index
					return last ? (
						<Typography color="textPrimary" key={index}>
							{bc.label}
						</Typography>
					) : (
						<Link color="inherit" to={bc.path} key={index}>
							{bc.label}
						</Link>
					);
				})}
			</Breadcrumbs>
		)
	}
}

export default withStyles(styles)(BC)
