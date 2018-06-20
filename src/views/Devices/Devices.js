import React, { Component } from 'react'
import { getAllDevices, deleteProject } from '../../variables/data';
import { Grid, CircularProgress, withStyles } from "@material-ui/core";

import { /* RegularCard */ /* Table, */ ItemGrid } from "components";
import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
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
	// filterByDate = (items) => {
	// 	const { startDate, endDate } = this.state.filters
	// 	var arr = items
	// 	var keys = Object.keys(arr[0])
	// 	var filteredByDate = arr.filter(c => {
	// 		var contains = keys.map(key => {
	// 			var openDate = moment(c['open_date'])
	// 			var closeDate = moment(c['close_date'])
	// 			// console.log(openDate, closeDate)
	// 			if (openDate > startDate
	// 				&& closeDate < (endDate ? endDate : moment())) {
	// 				return true
	// 			}
	// 			else
	// 				return false
	// 		})
	// 		return contains.indexOf(true) !== -1 ? true : false
	// 	})
	// 	return filteredByDate
	// }

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
		await getAllDevices().then(rs => this.setState({
			devices: rs,
			deviceHeader: [
				{ id: "device_id", label: "Device ID" },
				{ id: "device_name", label: "Device Name" },
				{ id: "address", label: "Address" },
				{ id: "wifiModule", label: "Wifi Module" },
				{ id: "modemModel", label: "Modem model" },
				{ id: "modemIMEI", label: "Modem IMEI" },
				{ id: "RPImodel", label: "Raspberry Pi Model" },
				{ id: "memory", label: "Memory" },
				{ id: "memoryModel", label: "Memory Model" },
				{ id: "adapter", label: "Adapter" },
				{ id: "cellNumber", label: "Cell Number" },
				{ id: "SIMID", label: "SIM-Card Number" },
				{ id: "description", label: "Description" },
				{ id: "liveStatus", label: "Status" },
				{ id: "project_id", label: "Project" },
				{ id: "iOrgID", label: "Organisation" }
			],
			loading: false
		}))
	}
	componentDidMount = async () => {
		await this.getDevices()
		// this.props.setHeader("Projects")
	}
	deleteProjects = async (projects) => {
		await deleteProject(projects).then(() => {
			this.getDevices()
		})
	}
	renderLoader = () => {
		const { classes } = this.props

		return <Grid container><CircularProgress className={classes.loader} /></Grid>
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
		return (
			<React.Fragment>
				{/* <Paper> */}
				<Grid container justify={'center'}>
					<ItemGrid xs={12} sm={12} md={12}>
						{this.renderAllDevices()}
					</ItemGrid>
				</Grid>
				{/* </Paper> */}
			</React.Fragment>

		)
	}
}

export default withStyles(projectStyles)(Devices)