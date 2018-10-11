import React, { Component, Fragment } from 'react'
import { getAllProjects, deleteProject } from 'variables/dataProjects';
import { withStyles } from "@material-ui/core";
import { Switch, Route, Redirect } from 'react-router-dom'
import { ViewList, ViewModule, Add, FilterList } from 'variables/icons'
import projectStyles from 'assets/jss/views/projects';
import ProjectTable from 'components/Project/ProjectTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import ProjectCards from 'components/Project/ProjectCards';
import Toolbar from 'components/Toolbar/Toolbar'
import { filterItems, handleRequestSort } from 'variables/functions';
import EnhancedTableToolbar from 'components/Table/TableToolbar'
import {
	/* Checkbox, Hidden, */ Paper, /* DialogTitle, Dialog, DialogContent, */
	/* DialogContentText, DialogActions,  */IconButton, Menu, MenuItem
} from "@material-ui/core"
import { boxShadow } from 'assets/jss/material-dashboard-react';

class Projects extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			projects: [],
			projectHeader: [],
			loading: true,
			route: 0,
			order: "desc",
			orderBy: "title",
			filters: {
				name: false,
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader("projects.pageTitle", false, '', "projects")
	}

	componentDidMount = async () => {
		this._isMounted = 1
		await this.getData()
		if (this._isMounted) {
			if (this.props.location.pathname.includes('/grid')) {
				this.setState({ route: 1 })
			}
			else {
				this.setState({ route: 0 })
			}
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	filter = (s) => {
		console.log(s)
	}
	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}
	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.projects)
		this.setState({ projects: newData, order, orderBy: property })
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
	getData = async () => {
		const { t } = this.props
		await getAllProjects().then(rs => this._isMounted ? this.setState({
			projects: rs ? rs : [],
			projectHeader: [
				{ id: 'title', label: t("projects.projectsColumnTitle"), },
				{ id: 'description', label: t("projects.projectsColumnDescription"), },
				{ id: 'startDate', label: t("projects.projectsColumnStartDate"), },
				{ id: 'endDate', label: t("projects.projectsColumnEndDate"), },
				{ id: 'created', label: t("projects.projectsColumnCreated"), },
				{ id: 'modified', label: t("projects.projectsColumnLastMod"), },
			],
			loading: false
		}, () => this.handleRequestSort(null, "title")) : null)
	}
	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s("snackbars.deletedSuccess")
				break;
			case 2:
				s("snackbars.exported")
				break;
			default:
				break;
		}
	}
	deleteProjects = async (projects) => {
		await deleteProject(projects).then(() => {
			this.snackBarMessages(1)
			this.getData()
		})
	}
	renderTableToolBarContent = () => {
		const { classes, t } = this.props
		const { anchorFilterMenu, projectHeader } = this.state

		return <Fragment>
			<IconButton aria-label="Add new project" onClick={this.AddNewProject}>
				<Add />
			</IconButton>
			<IconButton
				className={classes.secondAction}
				aria-label={t("tables.filter")}
				aria-owns={anchorFilterMenu ? "filter-menu" : null}
				onClick={this.handleFilterMenuOpen}>
				<FilterList />
			</IconButton>
			<Menu
				id="filter-menu"
				anchorEl={anchorFilterMenu}
				open={Boolean(anchorFilterMenu)}
				onClose={this.handleFilterMenuClose}
				PaperProps={{ style: { width: 200, boxShadow: boxShadow } }}>

				{projectHeader.map(option => {
					return <MenuItem key={option.id} onClick={this.handleFilter}>
						{option.label}
					</MenuItem>
				})}
			</Menu>
		</Fragment>
	}
	ft = () => {
		const { t } = this.props
		return [{ id: 'title', name: t("projects.fields.name"), func: this.filter, type: "text" },
			{ id: 'startDate', name: t("projects.fields.startDate"), func: this.filter, type: "date" }
		]

	}
	renderAllProjects = () => {
		const { t, classes } = this.props
		const { loading, order, orderBy, projects, projectHeader, filters, selected } = this.state
		return loading ? <CircularLoader /> :
			<Paper className={classes.root}>
				<EnhancedTableToolbar
					ft={this.ft()}
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/><ProjectTable
					filter={this.filter}
					data={this.filterItems(projects)}
					tableHead={projectHeader}
					handleFilterEndDate={this.handleFilterEndDate}
					handleFilterKeyword={this.handleFilterKeyword}
					handleFilterStartDate={this.handleFilterStartDate}
					handleRequestSort={this.handleRequestSort}
					order={order}
					orderBy={orderBy}
					filters={filters}
					deleteProjects={this.deleteProjects}
					t={t}
				/>
			</Paper>
	}
	renderList = () => {
		return <GridContainer justify={'center'}>
			{this.renderAllProjects()}
		</GridContainer>
	}
	renderCards = () => {
		const { loading } = this.state
		const { t } = this.props
		return loading ? <CircularLoader /> : <GridContainer>
			<ProjectCards t={t} projects={this.filterItems(this.state.projects)} />
		</GridContainer>
	}
	tabs = [
		{ id: 0, title: this.props.t("projects.tabs.listView"), label: <ViewList />, url: `${this.props.match.path}/list` },
		{ id: 1, title: this.props.t("projects.tabs.cardView"), label: <ViewModule />, url: `${this.props.match.path}/grid` },
	]
	render() {
		const { projects, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={projects}
					filters={filters}
					history={this.props.history}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs}
				/>
				<Switch>
					<Route path={`${this.props.match.path}/grid`} render={() => this.renderCards()} />
					<Route path={`${this.props.match.path}/list`} render={() => this.renderList()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch>
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Projects)