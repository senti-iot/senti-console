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
import Search from 'components/Search/Search';

var moment = require('moment');

class Devices extends Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: null,
			deviceHeaders: [],
			loading: true,
			route: 0,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader(props.t("devices.pageTitle"), false)
	}

	suggestionSlicer = (obj) => {
		var arr = [];

		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				var innerObj = {};
				if (typeof obj[prop] === 'object') {
					arr.push(...this.suggestionSlicer(obj[prop]))
				}
				else {
					innerObj = {
						id: prop.toString().toLowerCase(),
						label: obj[prop] ? obj[prop].toString() : ''
					};
					arr.push(innerObj)
				}
			}
		}
		return arr;
	}
	suggestionGen = (arrayOfObjs) => {
		let arr = [];
		arrayOfObjs.map(obj => {
			arr.push(...this.suggestionSlicer(obj))
			return ''
		})
		return arr;
	}

	isObject = (obj) => {
		return obj === Object(obj);
	}
	keyTester = (obj) => {
		let searchStr = this.state.filters.keyword.toLowerCase()
		let found = false
		if (this.isObject(obj)) {
			for (var k in obj) {
				if (!found) {
					if (k instanceof Date) {
						let date = moment(obj[k]).format("DD.MM.YYYY")
						found = date.toLowerCase().includes(searchStr)
					}
					else {
						if (this.isObject(obj[k])) {
							found = this.keyTester(obj[k])
						}
						else {
							found = obj[k] ? obj[k].toString().toLowerCase().includes(searchStr) : false
						}
					}
				}
				else {
					break
				}
			}
		}
		else {
			found = obj ? obj.toString().toLowerCase().includes(searchStr) : null
		}
		return found
	}
	filterItems = (projects) => {
		const { activeDateFilter } = this.state.filters
		var arr = projects
		if (activeDateFilter)
			arr = this.filterByDate(arr)
		if (arr) {
			if (arr[0] === undefined)
				return []
			var keys = Object.keys(arr[0])
			var filtered = arr.filter(c => {
				var contains = keys.map(key => {
					return this.keyTester(c[key])

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
		const { t } = this.props
		await getAllDevices().then(rs => this._isMounted ? this.setState({
			devices: rs ? rs : [],
			deviceHeader: [
				{ id: "name", label: t("devices.fields.name") },
				{ id: "id", label: t("devices.fields.id") },
				{ id: "liveStatus", label: t("devices.fields.status") },
				{ id: "address", label: t("devices.fields.address") },
				{ id: "org", label: t("devices.fields.org") }
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
			if (this.props.location.pathname.includes('/grid'))
				this.setState({ route: 2 })
			else { 
				this.setState({ route: 0 })
			}
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {	
			if (this.props.location.pathname.includes('/map'))
				this.setState({ route: 1 })
			else {
				if (this.props.location.pathname.includes('/grid'))
					this.setState({ route: 2 })
				else {
					this.setState({ route: 0 })
				}
			}
		}
	}
	
	componentWillUnmount = () => {
		this._isMounted = 0
		clearInterval(this.liveStatus)
		
		// this.liveStatus= null
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
			t={this.props.t}
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

		const { devices, loading } = this.state
		const { classes } = this.props
		return loading ? <CircularLoader /> : <GridContainer container justify={'center'} >
			<Paper className={classes.paper}>
				<Maps t={this.props.t} isMarkerShown centerDenmark markers={this.filterItems(devices)} /* zoom={10} *//> 
			</Paper>
		</GridContainer>
	}
	handleTabsChange = (e, value) => { 
		this.setState({ route: value })
	}
	render() {
		const { devices } = this.state
		const { classes } = this.props
		return (
			<Fragment>
				<AppBar position="sticky" classes={{ root: classes.appBar }}>
					<Tabs value={this.state.route} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
						<Tab title={'List View'} id={0} label={<ViewList />} onClick={() => { this.props.history.push(`${this.props.match.path}/list`) }}/>
						<Tab title={'Map View'} id={1} label={<Map/>} onClick={() => { this.props.history.push(`${this.props.match.path}/map`)}}/>
						<Tab title={'Cards View'} id={2} label={<ViewModule/>} onClick={() => { this.props.history.push(`${this.props.match.path}/grid`)}}/>
						<Search
							right
							suggestions={devices ? this.suggestionGen(devices) : []}
							handleFilterKeyword={this.handleFilterKeyword}
							searchValue={this.state.filters.keyword} />
					</Tabs>
				</AppBar>
				<Switch>
					<Route path={`${this.props.match.path}/map`} render={() => this.renderMap()} />
					<Route path={`${this.props.match.path}/list`} render={() => this.renderList()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch>
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Devices)