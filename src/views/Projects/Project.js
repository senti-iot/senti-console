import React, { Component } from 'react'
import { RegularCard, ItemGrid } from 'components';
import { Grid, CircularProgress, withStyles } from '@material-ui/core';
import ProjectDetails from './ProjectDetails';
import { getProject } from 'variables/data';
import projectStyles from 'assets/jss/views/projects';

class Project extends Component {
	constructor(props) {
		super(props)

		this.state = {
			project: {},
			loading: true
		}
	}
	componentDidMount = async () => {
		if (this.props.match)
			if (this.props.match.params.id)
				getProject(this.props.match.params.id).then(rs => {
					this.props.setHeader(rs.title)
					this.setState({ project: rs, loading: false })
				})
			else {
				this.props.history.push('/projects')
			}
	}
	renderLoader = () => {
		const { classes } = this.props

		return <Grid container><CircularProgress className={classes.loader} /></Grid>
	}
	renderProject = () => {
		const { loading, project } = this.state
		return loading ? this.renderLoader() : <ProjectDetails project={project} />
	}
	render() {
		const { project } = this.state
		return (
			<React.Fragment>

				<Grid container>
					<ItemGrid xs={12} sm={12} md={12}>
						<RegularCard
							cardTitle={project ? project.title : ''}
							cardSubtitle={project ? project.description : ''}
							content={
								this.renderProject()
							}

						/>
					</ItemGrid>
				</Grid>
			</React.Fragment>
		)
	}
}

export default withStyles(projectStyles)(Project)