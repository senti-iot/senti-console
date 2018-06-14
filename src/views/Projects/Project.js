import React, { Component } from 'react'
import { RegularCard, ItemGrid } from 'components';
import { Grid, CircularProgress, withStyles, Typography } from '@material-ui/core';
import ProjectDetails from './ProjectDetails';
import { getProject } from 'variables/data';
import projectStyles from 'assets/jss/views/projects';
import Card from 'components/Card/Card';
import ProjectCard from './ProjectCard';
import CardBody from 'components/Card/CardBody';

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
						<Card>
							<CardBody>
								<Typography>
									{project ? project.title : ''}
								</Typography>
								<Typography>
									{project ? project.description : ''}
								</Typography>
							</CardBody>
						</Card>
					</ItemGrid>
				</Grid>
				<Grid container alignContent={'space-between'} spacing={8}>
					<ItemGrid xs container alignContent={'space-between'}>
						<ProjectCard />
					</ItemGrid >
					<ItemGrid xs container alignContent={'space-between'}>
						<ProjectCard />
					</ItemGrid >
					<ItemGrid xs container alignContent={'space-between'}>
						<ProjectCard />
					</ItemGrid>
				</Grid>
			</React.Fragment >
		)
	}
}

export default withStyles(projectStyles)(Project)