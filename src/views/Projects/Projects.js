import React, { Component, Fragment } from 'react'
import { getAllProjects, deleteProject } from '../../variables/dataProjects';
import { withStyles } from "@material-ui/core";
import { Switch, Route, Redirect } from 'react-router-dom'
import { ViewList, ViewModule } from 'variables/icons'
import projectStyles from 'assets/jss/views/projects';
import ProjectTable from 'components/Project/ProjectTable';
import CircularLoader from 'components/Loader/CircularLoader';
import GridContainer from 'components/Grid/GridContainer';
import ProjectCards from 'components/Project/ProjectCards';
import Toolbar from 'components/Toolbar/Toolbar'
import { filterItems, handleRequestSort } from '../../variables/functions';

class Projects extends Component {
	constructor(props) {
		super(props)

		this.state = {
			projects: [],
			projectHeader: [],
			loading: true,
			route: 0,
			order: "desc",
			orderBy: "title",
			filters: {
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
	snackBarMessages = () => {
		let msg = this.state.openSnackbar
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
			this.getData()
		})
		this.getData()
		this.snackBarMessages(1)
	}
	renderAllProjects = () => {
		const { t } = this.props
		const { loading, order, orderBy, projects, projectHeader, filters } = this.state
		return loading ? <CircularLoader /> : <ProjectTable
			data={ this.filterItems(projects) }
			tableHead={ projectHeader }
			handleFilterEndDate={ this.handleFilterEndDate }
			handleFilterKeyword={ this.handleFilterKeyword }
			handleFilterStartDate={ this.handleFilterStartDate }
			handleRequestSort={ this.handleRequestSort }
			order={ order }
			orderBy={ orderBy }
			filters={ filters }
			deleteProjects={ this.deleteProjects }
			t={ t }
		/>
	}
	renderList = () => {
		return <GridContainer justify={ 'center' }>
			{ this.renderAllProjects() }
		</GridContainer>
	}
	renderCards = () => {
		const { loading } = this.state
		const { t } = this.props
		return loading ? <CircularLoader /> : <GridContainer>
			<ProjectCards t={ t } projects={ this.filterItems(this.state.projects) } />
		</GridContainer>
	}
	tabs = [
		{ id: 0, title: this.props.t("projects.tabs.listView"), label: <ViewList />, url: `${this.props.match.path}/list` },
		{ id: 1, title: this.props.t("projects.tabs.cardView"), label: <ViewModule />, url: `${this.props.match.path}/grid` },
	]
	render () {
		const { projects, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={ projects }
					filters={ filters }
					history={ this.props.history }
					match={ this.props.match }
					handleFilterKeyword={ this.handleFilterKeyword }
					tabs={ this.tabs }
				/>
				<Switch>
					<Route path={ `${this.props.match.path}/grid` } render={ () => this.renderCards() } />
					<Route path={ `${this.props.match.path}/list` } render={ () => this.renderList() } />
					<Redirect path={ `${this.props.match.path}` } to={ `${this.props.match.path}/list` } />
				</Switch>
			</Fragment>
		)
	}
}

export default withStyles(projectStyles)(Projects)