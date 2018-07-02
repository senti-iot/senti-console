import React, { Component } from 'react'
import { getAllDevices, deleteProject } from '../../variables/data';
import { Grid, withStyles } from "@material-ui/core";

import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
import CircularLoader from 'components/Loader/CircularLoader';
var moment = require('moment');

class Devices extends Component {
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
		props.setHeader("Devices")
	}

	filterItems = (projects) => {
		const { keyword } = this.state.filters
		// const { activeDateFilter } = this.state.filters
		var searchStr = keyword.toLowerCase()
		var arr = projects
		// if (activeDateFilter)
		// 	arr = this.filterByDate(arr)
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				if (c[key] === null || c[key] === undefined)
					return false
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

	handleFilterStartDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				startDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
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

	getDevices = async () => {
		await getAllDevices().then(rs => this._isMounted ? this.setState({
			devices: rs,
			deviceHeader: [
				{ id: "device_name", label: "Name" },
				{ id: "device_id", label: "ID" },
				{ id: "liveStatus", label: "Status" },
				{ id: "org", label: "Organisation" }
			],
			loading: false
		}) : null)
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getDevices()
		this.liveStatus = setInterval(this.getDevices, 10000);
		// this.props.setHeader("Projects")
	}
	componentWillUnmount = () => {
	  this._isMounted = 0
	}
	
	componentWillUnmount = () => {
	  window.clearInterval(this.liveStatus)
	}
	
	deleteProjects = async (projects) => {
		await deleteProject(projects).then(() => {
			this.getDevices()
		})
	}
	renderLoader = () => {
		// const { classes } = this.props

		return <CircularLoader/>
	}
	renderAllDevices = () => {
		const { loading } = this.state
		return loading ? this.renderLoader() : <DeviceTable
			data={this.filterItems(this.state.devices)}
			tableHead={this.state.deviceHeader}
			handleFilterEndDate={this.handleFilterEndDate}
			handleFilterKeyword={this.handleFilterKeyword}
			handleFilterStartDate={this.handleFilterStartDate}
			filters={this.state.filters}
			deleteProjects={this.deleteProjects}
		/>
	}

	render() {
		const { classes } = this.props
		return (
			<Grid container justify={'center'} className={classes.grid}> 
				{this.renderAllDevices()}
			</Grid>

		)
	}
}

export default withStyles(projectStyles)(Devices)