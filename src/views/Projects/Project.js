import React, { Component } from 'react'
import { ItemGrid } from 'components';
import { Grid, CircularProgress, withStyles, Typography } from '@material-ui/core';
import ProjectDetails from './ProjectDetails';
import { getProject } from 'variables/data';
import projectStyles from 'assets/jss/views/projects';
import ProjectCard from './ProjectCard';
import { dateFormatter } from 'variables/functions';
import RegSimpleList from 'components/List/RegSimpleList/RegSimpleList';

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
					console.log(rs)
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
		const { project, loading } = this.state
		return (
			!loading ?
				<React.Fragment>
					<Grid container justify={'center'} alignContent={'space-between'} spacing={8}>
						<ItemGrid xs={12} sm={12} md={12}>
							<ProjectCard title={project.title} subheader={project.description} content={

								<Grid container>
									<ItemGrid>
										<Typography variant={"caption"}>Created:</Typography>
										<Typography variant={'title'}>{dateFormatter(project.created)}</Typography>
									</ItemGrid>
									<ItemGrid>
										<Typography variant={"caption"}>
											Start Date:
										</Typography>
										<Typography variant={'title'}>
											{dateFormatter(project.open_date)}
										</Typography>
									</ItemGrid>
									<ItemGrid>
										<Typography variant={"caption"}>
											End Date:
										</Typography>
										<Typography variant={'title'}>
											{dateFormatter(project.close_date)}
										</Typography>
									</ItemGrid>
								</Grid>

							}
							/>
						</ItemGrid>
						<ItemGrid xs={12} sm={12} md={12}>
							<ProjectCard title={"Devices"} subheader={project.devices.length}
								content={
									<Grid container>
										<ItemGrid>
											<Typography varian={'caption'}>
												Most active device:
											</Typography>
											<Typography variant={"title"}>
												*device*
											</Typography>
										</ItemGrid>
									</Grid>
								} />
						</ItemGrid >
						<ItemGrid xs={12} sm={12} md={12}>
							<ProjectCard title={"Registrations"} subheader={project.registrations.length}
								content={
									<Grid container>
										<ItemGrid>
											<Typography variant={'caption'}>
												Total Hits:
											</Typography>
											<Typography variant={'title'}>
												{project.totalCount}
											</Typography>
										</ItemGrid>
										<ItemGrid>
											<Typography variant={'caption'}>
												Most hits:
											</Typography>
											<Typography variant={'title'}>
												{
													Math.max.apply(Math, project.registrations.map(function (o) { return o.count; }))
												}
											</Typography>
										</ItemGrid>
									</Grid>
								}
								hiddenContent={
									<RegSimpleList data={project.registrations} />
								}
							/>
						</ItemGrid>
					</Grid>
				</React.Fragment>
				: this.renderLoader())
	}
}

export default withStyles(projectStyles)(Project)