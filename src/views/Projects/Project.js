import { Button, Grid, withStyles, Collapse } from '@material-ui/core';
import { Devices, AssignmentTurnedIn, Person } from '@material-ui/icons'
import projectStyles from 'assets/jss/views/projects';
import { ItemGrid, Info } from 'components';
import DeviceSimpleList from 'components/List/DeviceSimpleList/DeviceSimpleList';
import RegSimpleList from 'components/List/RegSimpleList/RegSimpleList';
import moment from "moment";
import React, { Component } from 'react';
import { getProject } from 'variables/dataProjects';
// import { dateFormatter } from 'variables/functions';
import InfoCard from 'components/Cards/InfoCard';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import { Map, ExpandMore } from '@material-ui/icons'
import { Maps } from 'components/Map/Maps';
import classNames from 'classnames'
import Caption from 'components/Typography/Caption';
import ProjectDetails from './ProjectCards/ProjectDetails';
import { getWifiDaily, getWifiHourly, getWifiSummary } from 'variables/dataDevices';

class Project extends Component {
	constructor(props) {
		super(props)

		this.state = {
			project: {},
			mapExpanded: false,
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
			{await getProject(this.props.match.params.id).then(async rs => {
				if (rs === null)
					this.props.history.push('/404')
				else {
					this.props.setHeader(rs.title, true)
					this.setState({
						project: rs, loading: false, facts: {
							deviceMostCounts: this.deviceMostCount(rs.devices),
							regMostCounts: this.regMostCount(rs.registrations)
						}
					})
					let dataArr = [] 
					for (let i = 0; i < rs.devices.length; i++) { 
						dataArr.push({
							id: rs.devices[i].device_id,
							wifiDaily: await getWifiDaily(rs.devices[i].device_id, '2018-06-15+09:00', '2018-06-16+23:00').then(rs => { console.log(rs); return rs; }),
							wifiHourly: await getWifiHourly(rs.devices[i].device_id, '2018-06-15+09:00', '2018-06-16+23:00').then(rs => { console.log(rs); return rs; }),
							wifiSummary: await getWifiSummary(rs.devices[i].device_id, '2018-06-15+09:00', '2018-06-16+23:00').then(rs => { console.log(rs); return rs; }),
						})
					}
					console.log(dataArr)
					// getWifiDaily(rs.devices[0].device_id, '2018-06-15+09:00', '2018-06-16+23:00').then(rs => console.log(rs))
					// getWifiHourly(rs.devices[0].device_id, '2018-06-15+09:00', '2018-06-16+23:00').then(rs => console.log(rs))
					// getWifiSummary(rs.devices[0].device_id, '2018-06-15+09:00', '2018-06-16+23:00').then(rs => console.log(rs))

				}
			})
			
			}
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
		return <CircularLoader />
	}
	render() {
		const { project, loading } = this.state
		const { regMostCounts, deviceMostCounts } = this.state.facts
		const { classes } = this.props
		const rp = { history: this.props.history, match: this.props.match }
		return (
			!loading ?
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectDetails project={project} {...rp }/>
						{/* <InfoCard
							title={project.title} avatar={<LibraryBooks />}
							subheader={project.description}
							noExpand
							content={}
							topAction={

							}
						/> */}
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<InfoCard title={"Devices"} avatar={<Devices />} subheader={"Number of devices:" + project.devices.length}
							// hideFacts
							leftActions={
								<Button className={classes.leftActionButton} onClick={() => this.setState({ mapExpanded: !this.state.mapExpanded })}>
									<Map className={classes.leftIcon} />
									<Caption>
										{this.state.mapExpanded ? "Hide Map" : "See Map"}
									</Caption>
									<ExpandMore className={classNames(classes.expand, {
										[classes.expandOpen]: this.state.mapExpanded,
									})} />
								</Button>
							}
							leftActionContent={
								<Collapse in={this.state.mapExpanded} timeout="auto" unmountOnExit>
									<Maps markers={project.devices} />
								</Collapse>
							}
							content={
								<Grid container>
									<ItemGrid>
										<Caption>
												Most active device:
										</Caption>
										<Info>
											{deviceMostCounts ? deviceMostCounts.device_name ? deviceMostCounts.device_name : deviceMostCounts.device_id : "-"}
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
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<InfoCard title={"Data"} avatar={<AssignmentTurnedIn />} subheader={project.registrations.length}
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
											{regMostCounts ? regMostCounts.device_name + " - " + regMostCounts.count : "-"}
										</Info>
									</ItemGrid>
								</Grid>
							}
							hiddenContent={
								<RegSimpleList handleFilterKeyword={this.handleFilterRegKeyword} filters={this.state.regFilters} data={this.filterItems(project.registrations, this.state.regFilters.keyword)} />
							}
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<InfoCard title={"Contact"} avatar={<Person />} subheader={""}
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
				</GridContainer>
				: this.renderLoader())
	}
}
	
export default withStyles(projectStyles)(Project)