import React, { Component } from 'react'
import { ItemGrid } from 'components';
import { Grid, CircularProgress, withStyles, Typography } from '@material-ui/core';
import { getProject } from 'variables/data';
import projectStyles from 'assets/jss/views/projects';
import ProjectCard from './ProjectCard';
import { dateFormatter } from 'variables/functions';
import RegSimpleList from 'components/List/RegSimpleList/RegSimpleList';
import DeviceSimpleList from 'components/List/DeviceSimpleList/DeviceSimpleList';

class Project extends Component {
	constructor(props) {
		super(props)

		this.state = {
			project: {},
			facts: {
				deviceMostCounts: null,
				regMostCounts: null
			},
			loading: true
		}
	}
	componentDidMount = async () => {
		if (this.props.match)
			if (this.props.match.params.id)
				getProject(this.props.match.params.id).then(rs => {
					this.props.setHeader(rs.title)
					this.setState({
						project: rs, loading: false, facts: {
							deviceMostCounts: this.deviceMostCount(rs.devices),
							regMostCounts: this.regMostCount(rs.registrations)
						}
					})
					console.log(rs)
				})
			else {
				this.props.history.push('/projects')
			}
	}
	deviceMostCount = (devices) => {
		let max = devices[0]
		for (let i = 1, len = devices.length; i < len; i++) {
			let v = devices[i];
			max = (v.totalCount > max.totalCount) ? v : max;
		}
		return max;
		// return devices.reduce((max, d) => d.totalCount > max ? d.totalCount : max, devices[0].totalCount)
	}
	regMostCount = (regs) => {
		let max = regs[0]
		for (let i = 1, len = regs.length; i < len; i++) {
			let v = regs[i];
			max = (v.count > max.count) ? v : max;
		}
		return max;
		// return regs.reduce((max, r) => r.count > max ? r.count : max, regs[0].count)
	}
	renderLoader = () => {
		const { classes } = this.props

		return <Grid container><CircularProgress className={classes.loader} /></Grid>
	}
	render() {
		const { project, loading } = this.state
		const { regMostCounts, deviceMostCounts } = this.state.facts
		return (
			!loading ?
				<React.Fragment>
					<Grid container justify={'center'} alignContent={'space-between'} spacing={8}>
						<ItemGrid xs={12} sm={12} md={12}>
							<ProjectCard title={project.title} subheader={project.description}

								content={
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
								hideFacts
								content={
									<Grid container>
										<ItemGrid>
											<Typography variant={'caption'}>
												Most active device:
											</Typography>
											<Typography variant={"title"}>
												{deviceMostCounts ? deviceMostCounts.device_name : "-"}
											</Typography>
										</ItemGrid>
									</Grid>
								}
								hiddenContent={
									<DeviceSimpleList data={project.devices} />
								}
							/>
						</ItemGrid >
						<ItemGrid xs={12} sm={12} md={12}>
							<ProjectCard title={"Registrations"} subheader={project.registrations.length}
								hideFacts
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
												Most counts in a registration:
											</Typography>
											<Typography variant={'title'}>
												{
													regMostCounts ? regMostCounts.device_name + " - " + regMostCounts.count : "-"
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
						<ItemGrid xs={12} sm={12} md={12}>
							<ProjectCard title={"Contact"} subheader={""}
								noExpand

								content={
									<Grid container>
										<ItemGrid>
											<Typography variant={"caption"}>
												Contact:
											</Typography>
											<Typography variant={"title"}>
												{project.user.vcFirstName + " " + project.user.vcLastName}
											</Typography>
										</ItemGrid>
										<ItemGrid>
											<Typography variant={"caption"}>
												E-mail:
											</Typography>
											<Typography variant={"title"}>
												{project.user.vcEmail}
											</Typography>
										</ItemGrid>
										<ItemGrid>
											<Typography variant={"caption"}>
												Phone:
											</Typography>
											<Typography variant={"title"}>
												{project.user.vcPhone}
											</Typography>
										</ItemGrid>
										<ItemGrid>
											<Typography variant={"caption"}>
												Organisation:
											</Typography>
											<Typography variant={"title"}>
												{project.user.organisation}
											</Typography>
										</ItemGrid>
									</Grid>
								}
							/>
						</ItemGrid>
					</Grid>
				</React.Fragment>
				: this.renderLoader())
	}
}

export default withStyles(projectStyles)(Project)