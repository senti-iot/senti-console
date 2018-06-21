import { Button, CircularProgress, Grid, Typography, withStyles } from '@material-ui/core';
import projectStyles from 'assets/jss/views/projects';
import { ItemGrid } from 'components';
import DeviceSimpleList from 'components/List/DeviceSimpleList/DeviceSimpleList';
import RegSimpleList from 'components/List/RegSimpleList/RegSimpleList';
import moment from "moment";
import React, { Component } from 'react';
import { getProject } from 'variables/data';
import { dateFormatter } from 'variables/functions';
import ProjectCard from '../../components/Project/ProjectCard';

class Project extends Component {
	constructor(props) {
		super(props)

		this.state = {
			project: {},
			facts: {
				deviceMostCounts: null,
				regMostCounts: null
			},
			regFilters: {
				keyword: '',
				startDate: '',
				endDate: ''
			},
			deviceFilters: {
				keyword: '',
				startDate: '',
				endDate: ''
			},
			loading: true
		}
		props.setHeader(<CircularProgress size={30}/>)

	}
	componentDidMount = async () => {
		if (this.props.match)
			if (this.props.match.params.id)
				getProject(this.props.match.params.id).then(rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {

						this.props.setHeader(rs.title)
						this.setState({
							project: rs, loading: false, facts: {
								deviceMostCounts: this.deviceMostCount(rs.devices),
								regMostCounts: this.regMostCount(rs.registrations)
							}
						})
					}
				})
			else {
				this.props.history.push('/404')
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
	}
	filterItems = (projects, keyword) => {

		var searchStr = keyword.toLowerCase()
		var arr = projects
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				if (c[key] === null)
					return searchStr === "null" ? true : false
				if (c[key] instanceof Date) {
					let date = moment(c[key]).format("DD.MM.YYYY")
					return date.toLowerCase().includes(searchStr)
				}
				else
					return c[key].toString().toLowerCase().includes(searchStr)
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filtered
	}
	
	handleFilterRegKeyword = (value) => {
		this.setState({
			regFilters: {
				...this.state.regFilters,
				keyword: value
			}
		})
	}
	handleFilterDeviceKeyword = (value) => {
		this.setState({
			deviceFilters: {
				...this.state.deviceFilters,
				keyword: value
			}
		})
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
				<Grid container justify={'center'} alignContent={'space-between'} spacing={8}>
					<ItemGrid xs={12} sm={12} md={12}>
						<ProjectCard title={project.title} subheader={project.description}
							noExpand
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
									<ItemGrid>
										<Button onClick={() => this.props.history.push(this.props.match.url + '/edit')}>
												Edit
										</Button>
									</ItemGrid>
								</Grid>

							}
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12}>
						<ProjectCard title={"Devices"} subheader={"Number of devices:" + project.devices.length}
							// hideFacts
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
									<ItemGrid>
										<Typography variant={'caption'}>
												Hits by most active device:
										</Typography>
										<Typography variant={"title"}>
											{deviceMostCounts ? deviceMostCounts.totalCount : "-"}
										</Typography>
									</ItemGrid>
								</Grid>
							}
							hiddenContent={
								<DeviceSimpleList filters={this.state.deviceFilters} data={project.devices} />
							}
						/>
					</ItemGrid >
					<ItemGrid xs={12} sm={12} md={12}>
						<ProjectCard title={"Registrations"} subheader={project.registrations.length}
							// hideFacts
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
								<RegSimpleList handleFilterKeyword={this.handleFilterRegKeyword} filters={this.state.regFilters} data={this.filterItems(project.registrations, this.state.regFilters.keyword)} />
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
				: this.renderLoader())
	}
}

export default withStyles(projectStyles)(Project)