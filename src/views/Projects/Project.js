import { Button, DialogActions, DialogContentText, DialogContent, Dialog, DialogTitle, /* IconButton, */ withStyles } from '@material-ui/core'
import { ItemGrid, GridContainer, CircularLoader } from 'components'
import React, { Component } from 'react'
import { getProject, deleteProject } from 'variables/dataProjects'
import ProjectData from './ProjectCards/ProjectData'
import ProjectDetails from './ProjectCards/ProjectDetails'
import ProjectCollections from './ProjectCards/ProjectCollections'
import { ProjectContact } from './ProjectCards/ProjectContact'
import AssignDCs from 'components/AssignComponents/AssignDCs';
import { colors } from 'variables/colors';
import ProjectMap from './ProjectCards/ProjectMap';

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
			openAssignDC: false,
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
			timeType: 2,
			loading: true,
			openSnackbar: 0,
			openDelete: false,
			hoverID: 0,
		}
		props.setHeader('', false, '', "projects")

	}
	timeTypes = [
		{ id: 0, format: "HH:mm", chart: "minute" },
		{ id: 1, format: "HH:mm", chart: "hour" },
		{ id: 2, format: "ll", chart: "day" },
		{ id: 3, format: "ll", chart: "day" },
	]
	componentDidMount = async () => {
		const { history, location, match, setHeader } = this.props
		if (match)
			if (match.params.id) {
				await getProject(match.params.id).then(async rs => {
					if (rs === null)
						history.push('/404')
					else {
						let prevURL = location.prevURL ? location.prevURL : '/projects/list'
						setHeader(rs.title, true, prevURL, "projects")
						this.setState({
							project: {
								...rs,
								dataCollections: rs.dataCollections.map((dc, i) => ({ ...dc, color: colors[i] })),
								devices: rs.dataCollections.filter(dc => dc.activeDevice ? true : false).map((dc, i) => dc.activeDevice ? { ...dc.activeDevice, color: colors[i] } : null)
							}, loading: false
						}, () => window.state = this.state)
					}
				})
			}
			else {
				history.push('/404')
			}
	}

	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s("snackbars.projectDeleted")
				break
			case 2:
				s("snackbars.projectExported")
				break
			case 3:
				s("snackbars.assign.collectionsToProject")
				break
			default:
				break
		}
	}

	handleDeleteProject = async () => {
		await deleteProject([this.state.project.id]).then(() => {
			this.setState({ openDelete: false })
			this.snackBarMessages(1)
			this.props.history.push('/projects/list')
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
				<Button onClick={this.handleDeleteProject} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}

	renderLoader = () => {
		return <CircularLoader />
	}
	handleOpenAssignCollection = () => {
		this.setState({ openAssignDC: true, anchorElMenu: null })
	}
	handleCloseAssignCollection = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignDC: false })
			await this.componentDidMount().then(rs => {
				this.snackBarMessages(3)
			})
		}
		else {
			this.setState({ openAssignDC: false })
		}
	}
	setHoverID = (id) => {
		// 
		if (id !== this.state.hoverID)
			this.setState({ hoverID: id })
	}
	render() {
		const { project, loading, openAssignDC } = this.state
		const { t } = this.props
		const rp = { history: this.props.history, match: this.props.match }
		
		return (
			!loading ?
				<GridContainer justify={'center'} alignContent={'space-between'}>

					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectDetails t={t}
							project={project} {...rp}
							deleteProject={this.handleOpenDeleteDialog}
							handleOpenAssignCollection={this.handleOpenAssignCollection}
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectData
							setTimeType={(e) => this.setState({ timeType: e })}
							timeTypes={this.timeTypes}
							timeType={this.state.timeType}
							setHoverID={this.setHoverID}
							hoverID={this.state.hoverID}
							t={t}
							project={project} />
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectCollections setHoverID={this.setHoverID} t={t} project={project} {...rp} />
					</ItemGrid >
					{project.devices ? <ItemGrid xs={12} noMargin>
						<ProjectMap
							devices={project.devices}
							t={t}
						/>
					</ItemGrid> : null
					}
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectContact history={this.props.history} t={t} project={project} />
					</ItemGrid>
					{this.renderDeleteDialog()}
					<AssignDCs
						open={openAssignDC}
						handleClose={this.handleCloseAssignCollection}
						project={project.id}
						t={t}
					/>
				</GridContainer>
				: this.renderLoader())
	}
}

export default withStyles(projectStyles)(Project)