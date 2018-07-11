import React, { Component, Fragment } from 'react'
import { getAllProjects, deleteProject } from '../../variables/dataProjects';
import { /* Grid, */ withStyles, AppBar, Tabs, Tab } from "@material-ui/core";
import { Switch, Route, Redirect } from 'react-router-dom'
import { ViewList, ViewModule } from '@material-ui/icons'
import projectStyles from 'assets/jss/views/projects';
import ProjectTable from 'components/Project/ProjectTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import Search from 'components/Search/Search';
var moment = require('moment');
class Projects extends Component {
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
		props.setHeader("Projects", false)
	}
	filterByDate = (items) => {
		const { startDate, endDate } = this.state.filters
		var arr = items
		var keys = Object.keys(arr[0])
		var filteredByDate = arr.filter(c => {
			var contains = keys.map(key => {
				var openDate = moment(c['open_date'])
				var closeDate = moment(c['close_date'])
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
		await getAllProjects().then(rs => this._isMounted ? this.setState({
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
		}) : null)
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getProjects()
		if (this.props.location.pathname.includes('/cards')) {
			this.setState({ route: 1 })
		}
		else {
			this.setState({ route: 0 })	
		}
	}
	componentWillUnmount = () => {
	  	this._isMounted = 0
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
	deleteProjects = async (projects) => {
		await deleteProject(projects).then(() => {
			this.getProjects()
		})
	}
	handleTabsChange = (e, value) => {
		this.setState({ route: value })
	}
	renderAllProjects = () => {
		const { loading } = this.state
		return loading ? <CircularLoader /> : <ProjectTable
			data={this.filterItems(this.state.projects)}
			tableHead={this.state.projectHeader}
			handleFilterEndDate={this.handleFilterEndDate}
			handleFilterKeyword={this.handleFilterKeyword}
			handleFilterStartDate={this.handleFilterStartDate}
			filters={this.state.filters}
			deleteProjects={this.deleteProjects}
		/>
	}
	renderList = () => {
		return <GridContainer justify={'center'}>
			{this.renderAllProjects()}
		</GridContainer>
	}
	renderCards = () => {
		return <GridContainer>
			<div>Not implemented</div>
		</GridContainer>
	}
	render() {
		const { classes } = this.props
		const { projects } = this.state
		return (
			<Fragment>
				<AppBar position={'sticky'} classes={{ root: classes.appBar }}>
					<Tabs value={this.state.route} onChange={this.handleTabsChange} classes={{ fixed: classes.noOverflow, root: classes.noOverflow }}>
						<Tab title={'List View'} id={0} label={<ViewList />} onClick={() => { this.props.history.push(`${this.props.match.path}/list`) }} />
						<Tab title={'Cards View'} id={1} label={<ViewModule />} onClick={() => { this.props.history.push(`${this.props.match.path}/cards`) }} />
						<Search
							right
							suggestions={projects ? this.suggestionGen(projects) : [] }
							handleFilterKeyword={this.handleFilterKeyword}
							searchValue={this.state.filters.keyword} />
					</Tabs>
				</AppBar>
				{projects ? <Switch>
					<Route path={`${this.props.match.path}/cards`} render={() => this.renderCards()} />
					<Route path={`${this.props.match.path}/list`} render={() => this.renderList()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch> : <CircularLoader />}
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Projects)