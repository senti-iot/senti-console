import React, { Component } from 'react'
import { getAllProjects } from '../../variables/data';
import { Grid, CircularProgress, withStyles } from "@material-ui/core";

import { RegularCard, /* Table, */ ItemGrid } from "components";
import ProjectList from 'components/List/ProjectList';
import projectStyles from 'assets/jss/views/projects';

class Projects extends Component {
	constructor(props) {
		super(props)

		this.state = {
			projects: [],
			projectHeader: [],
			loading: true
		}
	}
	getProjects = () => {
		getAllProjects().then(rs => this.setState({
			projects: rs,
			projectHeader: ['Title', 'Description', 'Open Date', 'Close Date', 'Progress', 'Created', 'Last Modified'],
			loading: false
		}))
	}
	componentDidMount = () => {
		/* var projects =  */
		this.getProjects()
		// var proje = projects.map(p => {
		// 	delete p.user
		// 	delete p.id
		// 	delete p.img
		// 	return Object.values(p)
		// })
		// this.setState({ projects: projects, projectHeader: ['Title', 'Description', 'Open Date', 'Close Date', 'Progress', 'Created', 'Last Modified'] })
	}

	render() {
		const { loading } = this.state
		const { classes } = this.props
		return (
			<Grid container>
				<ItemGrid xs={12} sm={12} md={12}>
					<RegularCard
						cardTitle="All projects"
						cardSubtitle=""
						content={
							loading ? <Grid container><CircularProgress className={classes.loader} /></Grid> : <ProjectList
								items={this.state.projects}
							/>
						}
					/>
				</ItemGrid>
			</Grid>
		)
	}
}

export default withStyles(projectStyles)(Projects)