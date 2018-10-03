import {  Button, DialogActions, DialogContentText, DialogContent, Dialog, DialogTitle, /* IconButton, */ withStyles } from '@material-ui/core'
import { ItemGrid, GridContainer, CircularLoader } from 'components'
import React, { Component } from 'react'
import { getProject, deleteProject } from 'variables/dataProjects'
import ProjectData from './ProjectCards/ProjectData'
import ProjectDetails from './ProjectCards/ProjectDetails'
import ProjectDevices from './ProjectCards/ProjectDevices'
import { ProjectContact } from './ProjectCards/ProjectContact'
import { dateFormatter } from 'variables/functions';

const projectStyles = theme => ({
	close: {
		width: theme.spacing.unit * 4,
		height: theme.spacing.unit * 4,
		marginLeft: 30
	},

})

class Project extends Component {
	constructor(props) {
		super(props)

		this.state = {
			project: {},
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
			loading: true,
			openSnackbar: 0,
			openDelete: false
		}
		props.setHeader('', false, '', "projects")

	}

	componentDidMount = async () => {
		if (this.props.match)
			if (this.props.match.params.id) {
			 await getProject(this.props.match.params.id).then(async rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.props.setHeader(rs.title, true, '/projects/list', "projects")
						this.setState({
							project: rs, loading: false
						})
					}
				})

			}
			else {
				this.props.history.push('/404')
			}
	}

	componentWillUnmount = () => {
		clearTimeout(this.timer)
	}

	snackBarMessages = () => {
		const { t } = this.props
		let msg = this.state.openSnackbar
		switch (msg) {
			case 1:
				return t("projects.projectDeleted")
			case 2:
				return t("projects.projectExported")
			case 3:
				return t("projects.projectRedirect")
			default:
				break
		}
	}

	handleDeleteProjects = async () => {
		await deleteProject([this.state.project.id]).then(() => {
			this.setState({ openSnackbar: 1, openDelete: false });
		})
	}

	redirect = () => {
		setTimeout(() => this.props.history.push('/projects/list'), 1000)
	}

	closeSnackBar = () => {
		if (this.state.openSnackbar === 1) {
			this.setState({ openSnackbar: 0 }, () => this.redirect())
		}
		else
			this.setState({ openSnackbar: 0 })
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
					let date = dateFormatter(c[key])
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

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	renderDeleteDialog = () => {
		const { openDelete } = this.state
		const { t } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("projects.projectDelete")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("projects.projectDeleteConfirm", { project: this.state.project.title }) + "?"}
				</DialogContentText>

			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color="primary">
					{t("actions.cancel")}
				</Button>
				<Button onClick={this.handleDeleteProjects} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}

	renderLoader = () => {
		return <CircularLoader />
	}

	render() {
		const { project, loading } = this.state
		const { t } = this.props //Localization Provider is HOC'd with withRouter on the Routes Functional Component (See routes/*any*.js) 
		const rp = { history: this.props.history, match: this.props.match }
		return (
			!loading ?
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectDetails t={t} project={project} {...rp} deleteProject={this.handleOpenDeleteDialog} />
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectDevices t={t} project={project} />
					</ItemGrid >
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectData t={t} project={project} />
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectContact history={this.props.history} t={t} project={project} />
					</ItemGrid>
					{this.renderDeleteDialog()}
				</GridContainer>
				: this.renderLoader())
	}
}

export default withStyles(projectStyles)(Project)