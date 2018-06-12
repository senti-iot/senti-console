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
	getProjects = async () => {
		await getAllProjects().then(rs => this.setState({
			projects: rs,
			projectHeader: ['Title', 'Description', 'Open Date', 'Close Date', 'Progress', 'Created', 'Last Modified'],
			loading: false
		}))
	}
	componentDidMount = async () => {
		await this.getProjects()
		this.props.setHeader("Projects")
	}
	renderLoader = () => {
		const { classes } = this.props

		return <Grid container><CircularProgress className={classes.loader} /></Grid>
	}
	renderAllProjects = () => {
		const { loading } = this.state
		return loading ? this.renderLoader() : <ProjectList
			items={this.state.projects}
			history={this.props.history}
			match={this.props.match}
		/>
	}

	render() {
		return (
			<React.Fragment>
				<Grid container>
					<ItemGrid xs={12} sm={12} md={12}>
						<RegularCard
							cardTitle="All projects"
							cardSubtitle=""
							content={
								this.renderAllProjects()
							}
						/>
					</ItemGrid>
				</Grid>
			</React.Fragment>

		)
	}
}

export default withStyles(projectStyles)(Projects)