import { Snackbar, Button, DialogActions, DialogContentText, DialogContent, Dialog, DialogTitle, IconButton, withStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ItemGrid, GridContainer, CircularLoader } from 'components';
import moment from "moment";
import React, { Component, Fragment } from 'react';
import { getProject, deleteProject } from 'variables/dataProjects';
import ProjectData from './ProjectCards/ProjectData';
import ProjectDetails from './ProjectCards/ProjectDetails';
import ProjectDevices from './ProjectCards/ProjectDevices';
import { ProjectContact } from './ProjectCards/ProjectContact';
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
		props.setHeader('')

	}
	componentDidMount = async () => {
		if (this.props.match)
			if (this.props.match.params.id)
			{this.timer = setTimeout(async () => await getProject(this.props.match.params.id).then(async rs => {
				if (rs === null)
					this.props.history.push('/404')
				else {
					this.props.setHeader(rs.title, true)
					this.setState({
						project: rs, loading: false
					})
				}
			}), 2e3)
			
			}
			else {
				this.props.history.push('/404')
			}
	}
	componentWillUnmount = () => {
	   clearTimeout(this.timer)
	}
	
	snackBarMessages = () => {
		const { classes, t } = this.props
		let msg = this.state.openSnackbar
		switch (msg) {
			case 1:
				return <Fragment>
					{t("projects.projectDeleted")}
					<IconButton
						key="close"
						aria-label="Close"
						color="inherit"
						className={classes.close}
						onClick={this.closeSnackBar}
					>
						<Close />
					</IconButton>
				</Fragment>
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
		setTimeout(() => {
			this.setState({ openSnackbar: 3 })
			setTimeout(() => this.props.history.push('/projects/list'), 2e3)
		}, 2e3)
	
	}
	closeSnackBar = () => {
		if (this.state.openSnackbar === 1)
		{
			this.setState({ openSnackbar: 0 }, () => this.redirect())
		}
		else
			this.setState({ openSnackbar: 0 })
		
	
	}
	// deviceMostCount = (devices) => {
	// 	let max = devices[0]
	// 	for (let i = 1, len = devices.length; i < len; i++) {
	// 		let v = devices[i];
	// 		max = (v.totalCount > max.totalCount) ? v : max;
	// 	}
	// 	return max;
	// }
	// regMostCount = (regs) => {
	// 	let max = regs[0]
	// 	for (let i = 1, len = regs.length; i < len; i++) {
	// 		let v = regs[i];
	// 		max = (v.count > max.count) ? v : max;
	// 	}
	// 	return max;
	// }
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
						<ProjectDetails t={t} project={project} {...rp} deleteProject={this.handleOpenDeleteDialog}/>
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectDevices t={t} project={project}/>
					</ItemGrid >
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectData t={t} project={project}/>
					</ItemGrid>
					<ItemGrid xs={12} sm={12} md={12} noMargin>
						<ProjectContact t={t} project={project}/>
					</ItemGrid>
					{this.renderDeleteDialog()}
					<Snackbar
						autoHideDuration={3000}
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						open={this.state.openSnackbar !== 0 ? true : false}
						onClose={() => { 
							if (this.state.openSnackbar === 1)
								this.closeSnackBar()
							else
								this.setState({ openSnackbar: 0 })
						}}
						message={
							<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
								{this.snackBarMessages()}
							</ItemGrid>
						}
					/>
				</GridContainer>
				: this.renderLoader())
	}
}
	
export default withStyles(projectStyles)(Project)