import React, { Component } from 'react'
import { getAllProjects, deleteProject } from '../../variables/data';
import { Grid, CircularProgress, withStyles } from "@material-ui/core";

import { /* RegularCard */ /* Table, */ ItemGrid } from "components";
import projectStyles from 'assets/jss/views/projects';
import ProjectTable from 'components/Project/ProjectTable';
var moment = require('moment');
class Projects extends Component {
	constructor(props) {
		super(props)

		this.state = {
			projects: [],
			projectHeader: [],
			loading: true,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader("Projects")
	}
	filterByDate = (items) => {
		const { startDate, endDate } = this.state.filters
		var arr = items
		var keys = Object.keys(arr[0])
		var filteredByDate = arr.filter(c => {
			var contains = keys.map(key => {
				var openDate = moment(c['open_date'])
				var closeDate = moment(c['close_date'])
				// console.log(openDate, closeDate)
				if (openDate > startDate
			 		&& closeDate < (endDate ? endDate : moment())) {
					return true
				}
				else
					return false
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filteredByDate
	}

	filterItems = (projects) => {
		const { keyword } = this.state.filters
		const { activeDateFilter } = this.state.filters
		var searchStr = keyword.toLowerCase()
		var arr = projects
		if (activeDateFilter)
			arr = this.filterByDate(arr)
		if (arr) {
			if (arr[0] === undefined)
				return []
			var keys = Object.keys(arr[0])
			var filtered = arr.filter(c => {
				var contains = keys.map(key => {
					if (c[key] instanceof Date)
					{
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
	}

	handleFilterStartDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				startDate: value,
				activeDateFilter: value !== null ? true : false
			} })
	}
	handleFilterEndDate = (value) => { 
		this.setState({
			filters: {
				...this.state.filters,
				endDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}
	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	getProjects = async () => {
		await getAllProjects().then(rs => this.setState({
			projects: rs,
			projectHeader: [
				{ id: 'title', label: 'Title', },
				{ id: 'description', label: 'Description', },
				{ id: 'open_date', label: 'Start Date', },
				{ id: 'close_date', label: 'End Date', },
				// { id: 'progress', label: 'Progress', },
				{ id: 'created', label: 'Created', },
				// { id: 'last_modified', label: 'Last Modified', },
			],
			loading: false
		}))
	}
	componentDidMount = async () => {
		await this.getProjects()
		// this.props.setHeader("Projects")
	}
	deleteProjects = async (projects) => {
		await deleteProject(projects).then(() => {
			this.getProjects()
		})
	}
	renderLoader = () => {
		const { classes } = this.props

		return <Grid container><CircularProgress className={classes.loader} /></Grid>
	}
	renderAllProjects = () => {
		const { loading } = this.state
		return loading ? this.renderLoader() : <ProjectTable
			data={this.filterItems(this.state.projects)}
			tableHead={this.state.projectHeader}
			handleFilterEndDate={this.handleFilterEndDate}
			handleFilterKeyword={this.handleFilterKeyword}
			handleFilterStartDate={this.handleFilterStartDate}
			filters={this.state.filters}
			deleteProjects={this.deleteProjects}
		/>
	}

	render() {
		return (
			<React.Fragment>
				{/* <Paper> */}
				<Grid container justify={'center'}>
					<ItemGrid xs={12} sm={12} md={12}>
						{/* <RegularCard
							cardTitle="All projects"
							cardSubtitle=""
							content={ */}
						{this.renderAllProjects()}
						{/* } */}
						{/* /> */}
					</ItemGrid>
				</Grid>
				{/* </Paper> */}
			</React.Fragment>

		)
	}
}

export default withStyles(projectStyles)(Projects)