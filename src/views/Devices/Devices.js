import React, { Component, Fragment } from 'react'
import { getAllDevices } from '../../variables/dataDevices';
import { /* Grid, */ withStyles, AppBar, Tabs, Tab, Paper } from "@material-ui/core";
import { Switch, Route, Redirect } from 'react-router-dom'
import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
import CircularLoader from 'components/Loader/CircularLoader';
import { Maps } from 'components/Map/Maps';
import GridContainer from 'components/Grid/GridContainer';
import { ViewList, ViewModule, Map  } from '@material-ui/icons'
var moment = require('moment');

class Devices extends Component {
	constructor(props) {
		super(props)

		this.state = {
			projects: [],
			projectHeader: [],
			loading: true,
			route: 0,
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
		if (this.props.location.pathname.includes('/map'))
			this.setState({ route: 1 })
		else {
			if (this.props.location.pathname.includes('/cards'))
				this.setState({ route: 2 })
		}
		this.props.setHeader("Devices", false)
	}
	componentWillUnmount = () => {
	  this._isMounted = 0
	}
	
	componentWillUnmount = () => {
	  window.clearInterval(this.liveStatus)
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
		/>
	}
	renderList = () => {
		// const { classes } = this.props
		// this.setState({ route: 0 })
		return <GridContainer container justify={'center'} /* className={classes.grid} */>
			{this.renderAllDevices()}
		</GridContainer>

	}
	renderMap = () => {
		// this.setState({ route: 1 })

		const { devices } = this.state
		const { classes } = this.props
		return <GridContainer container justify={'center'} >
			<Paper className={classes.paper}>
				<Maps isMarkerShown markers={devices} zoom={10}/> 
			</Paper>
		</GridContainer>
	}
	handleTabsChange = (e, value) => { 
		this.setState({ route: value })
	}
	render() {
		const { devices } = this.state
		// console.log(this.props)
		return (
			<Fragment>
				<AppBar position="static">
					<Tabs value={this.state.route} onChange={this.handleTabsChange}>
						<Tab title={'List View'} id={0} label={<ViewList />} onClick={() => { this.props.history.push(`${this.props.match.path}/list`) }}/>
						<Tab title={'Map View'} id={1} label={<Map/>} onClick={() => { this.props.history.push(`${this.props.match.path}/map`)}}/>
						<Tab title={'Cards View'} id={2} label={<ViewModule/>} onClick={() => { this.props.history.push(`${this.props.match.path}/cards`)}}/>
					</Tabs>
				</AppBar>
				{devices ? <Switch>
					<Route path={`${this.props.match.path}/map`} render={() => this.renderMap()} />
					<Route path={`${this.props.match.path}/list`} render={() => this.renderList()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch> : <CircularLoader/>}
			</Fragment>


		)
	}
}

export default withStyles(projectStyles)(Devices)