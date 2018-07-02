import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import { LibraryBooks, Devices, AssignmentTurnedIn, Person } from '@material-ui/icons'
import projectStyles from 'assets/jss/views/projects';
import { ItemGrid } from 'components';
import DeviceSimpleList from 'components/List/DeviceSimpleList/DeviceSimpleList';
import RegSimpleList from 'components/List/RegSimpleList/RegSimpleList';
import moment from "moment";
import React, { Component } from 'react';
import { getProject } from 'variables/dataProjects';
import { dateFormatter } from 'variables/functions';
import InfoCard from 'components/Cards/InfoCard';
import CircularLoader from 'components/Loader/CircularLoader';

const Caption = (props) => <Typography variant={"caption"}>{props.children}</Typography>
const Info = (props) => <Typography paragraph classes={props.classes}>{props.children}</Typography>
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
		props.setHeader('')

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
		// const { classes } = this.props
		// return <Grid container><CircularProgress className={classes.loader} /></Grid>
		return <CircularLoader/>
	}
	render() {
		const { project, loading } = this.state
		const { regMostCounts, deviceMostCounts } = this.state.facts
		return (
			!loading ?
				<Grid container justify={'center'} alignContent={'space-between'} spacing={8}>
					<ItemGrid xs={12} sm={12} md={12}>
						<InfoCard title={project.title} avatar={<LibraryBooks/>} subheader={project.description}
							noExpand
							content={
								<Grid container>
									<ItemGrid>
										<Caption>Created:</Caption>
										<Info>{dateFormatter(project.created)}</Info>
									</ItemGrid>
									<ItemGrid>
										<Caption>
												Start Date:
										</Caption>
										<Info>
											{dateFormatter(project.open_date)}
										</Info>
									</ItemGrid>
									<ItemGrid>
										<Caption>
												End Date:
										</Caption>
										<Info>
											{dateFormatter(project.close_date)}
										</Info>
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
						<InfoCard title={"Devices"} avatar={<Devices/>} subheader={"Number of devices:" + project.devices.length}
							// hideFacts
							content={
								<Grid container>
									<ItemGrid>
										<Caption>
												Most active device:
										</Caption>
										<Info>
											{deviceMostCounts ? deviceMostCounts.device_name : "-"}
										</Info>
									</ItemGrid>
									<ItemGrid>
										<Caption>
												Hits by most active device:
										</Caption>
										<Info>
											{deviceMostCounts ? deviceMostCounts.totalCount : "-"}
										</Info>
									</ItemGrid>
								</Grid>
							}
							hiddenContent={
								<DeviceSimpleList filters={this.state.deviceFilters} data={project.devices} />
							}
						/>
					</ItemGrid >
					<ItemGrid xs={12} sm={12} md={12}>
						<InfoCard title={"Data"} avatar={<AssignmentTurnedIn/>} subheader={project.registrations.length}
							// hideFacts
							content={
								<Grid container>
									<ItemGrid>
										<Caption>
												Total Hits:
										</Caption>
										<Info>
											{project.totalCount}
										</Info>
									</ItemGrid>
									<ItemGrid>
										<Caption>
												Device with most hits in a dataset:
										</Caption>
										<Info>
											{
												regMostCounts ? regMostCounts.device_name + " - " + regMostCounts.count : "-"
											}
										</Info>
									</ItemGrid>
								</Grid>
							}
							hiddenContent={
								<RegSimpleList handleFilterKeyword={this.handleFilterRegKeyword} filters={this.state.regFilters} data={this.filterItems(project.registrations, this.state.regFilters.keyword)} />
							}
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12}>
						<InfoCard title={"Contact"} avatar={<Person/>} subheader={""}
							noExpand
							content={
								<Grid container>
									<ItemGrid>
										<Caption>
												Contact:
										</Caption>
										<Info>
											{project.user.vcFirstName + " " + project.user.vcLastName}
										</Info>
									</ItemGrid>
									<ItemGrid>
										<Caption>
												E-mail:
										</Caption>
										<Info>
											{project.user.vcEmail}
										</Info>
									</ItemGrid>
									<ItemGrid>
										<Caption>
												Phone:
										</Caption>
										<Info>
											{project.user.vcPhone}
										</Info>
									</ItemGrid>
									<ItemGrid>
										<Caption>
												Organisation:
										</Caption>
										<Info>
											{project.user.organisation}
										</Info>
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