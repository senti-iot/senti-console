import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, AssignOrg, AssignProject, AssignDevice } from 'components';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCollection, deleteCollection, unassignDeviceFromCollection } from 'variables/dataCollections';
import { dateFormatter } from 'variables/functions';
import CollectionActiveDevice from 'views/Collections/CollectionCards/CollectionActiveDevice';
import CollectionData from 'views/Collections/CollectionCards/CollectionData';
import CollectionDetails from 'views/Collections/CollectionCards/CollectionDetails';
import CollectionHistory from 'views/Collections/CollectionCards/CollectionHistory';
import { getProject } from 'variables/dataProjects';
import Search from 'components/Search/Search';

// import moment from 'moment'
class Collection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collection: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassignDevice: false,
			openAssignOrg: false,
			openAssignDevice: false,
			openDelete: false,
			img: null,
			filter: {
				startDate: "",
				endDate: ""
			}
		}
		props.setHeader('', true, `/collections/list`, "collections")
	}
	getCollectionProject = async (rs) => {
		let project = await getProject(rs)
		this.setState({ collection: { ...this.state.collection, project: project }, loadingProject: false })
	}
	getCollection = async (id) => {
		await getCollection(id).then(rs => {
			if (rs === null)
				this.props.history.push('/404')
			else {
				this.setState({ collection: rs, loading: false })
				let prevURL = this.props.location.prevURL ? this.props.location.prevURL : '/collections/list'
				this.props.setHeader(rs.name ? rs.name : rs.id, true, prevURL, "collections")
				if (rs.project.id) {
					this.getCollectionProject(rs.project.id)
				}
			}
		})
	}

	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				await this.getCollection(id)
				// this.getCollectionDataDaily(id)
			}
		}
		else {
			this.props.history.push('/404')
		}
	}

	snackBarMessages = (msg) => {
		const { s, t } = this.props
		let name = this.state.collection.name ? this.state.collection.name : t("collections.noName")
		let id = this.state.collection.id
		switch (msg) {
			case 1:
				s(t("snackbars.unassign.deviceFromCollection", { collection: `${name} (${id})`, device: this.state.collection.activeDeviceStats.id }))
				break
			case 2:
				s(t("snackbars.assignCollection", { collection: `${name} (${id})`, what: this.state.collection.org.name }))
				break
			case 5: 
				s(t("snackbars.assign.collectionToProject", { collection: `${name} (${id})`, what: this.state.collection.project.title }))
				break
			case 6:
				s(t("snackbars.assign.deviceToCollection", { collection: `${name} (${id})`, what: this.state.collection.activeDeviceStats.id }))
				break
			case 4:
				s(t("snackbars.collectionDeleted"))
				break
			default:
				break
		}
	}
	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleDeleteCollection = async () => {
		await deleteCollection(this.state.collection.id).then(rs => {
			this.setState({
				openDelete: false
			})
			// this.close()
			if (rs) { 
				this.props.history.push('/collections/list')
				this.snackBarMessages(4)
			}
			else {
				alert("Delete failed") //todo
			}
				
		})
	}
	handleOpenAssignDevice = () => {
		this.setState({ openAssignDevice: true, anchorEl: null })
	}
	handleCancelAssignDevice = () => {
		this.setState({ openAssignDevice: false })
	}
	handleCloseAssignDevice = async (reload) => {
		if (reload) { 
			this.setState({ loading: true, openAssignDevice: false })
			await this.getCollection(this.state.collection.id).then(rs => { 
				this.snackBarMessages(6)
			})
		}
		else {
			this.setState({ openAssignDevice: false })
		}
	}
	handleOpenAssignOrg = () => {
		this.setState({ openAssignOrg: true, anchorEl: null })
	}
	handleCancelAssignOrg = () => {
		this.setState({ openAssignOrg: false })
	}
	handleCloseAssignOrg = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignOrg: false })
			await this.getCollection(this.state.collection.id).then(rs => {
				this.snackBarMessages(2)
			})
		}
		this.setState({ openAssignOrg: false })
	}
	handleOpenAssignProject = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}
	handleCancelAssignProject = () => {
		this.setState({ openAssign: false })
	}
	handleCloseAssignProject = async (reload, success) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null, openAssign: false })
			await this.getCollection(this.state.collection.id).then(() => {
				this.snackBarMessages(5)
			})
		}
		// this.setState({ openAssign: false })
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

	handleOpenUnassignDevice = () => {
		this.setState({
			openUnassignDevice: true
		})
	}

	handleCloseUnassignDevice = () => {
		this.setState({
			openUnassignDevice: false, anchorEl: null
		})
	}

	handleUnassignDevice = async () => {
		const { collection } = this.state
		await unassignDeviceFromCollection({
			id: collection.id,
			deviceId: collection.activeDeviceStats.id
		}).then(async rs => {
			if (rs) {
				this.handleCloseUnassignDevice()
				this.setState({ loading: true })
				this.snackBarMessages(1)
				await this.getCollection(this.state.collection.id)
			}
		})
	}

	renderLoader = () => {
		return <CircularLoader />
	}

	renderAssignDevice = () => {
		const { t } = this.props
		const { collection, openAssignDevice } = this.state
		return (
			<Dialog
				open={openAssignDevice}
				onClose={this.handleCloseAssignDevice}	
			>
				<DialogTitle>
					<DialogActions>
						<Search />
					</DialogActions>
					<DialogContentText id="alert-dialog-description">
						{t("dialogs.unassign", { id: collection.id, name: collection.name, what: collection.org.name })}
					</DialogContentText>
				</DialogTitle>
			</Dialog>
		)
	}
	renderConfirmUnassign = () => {
		const { t } = this.props
		const { collection } = this.state
		return <Dialog
			open={this.state.openUnassignDevice}
			onClose={this.handleCloseUnassignDevice}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("dialogs.unassignTitle")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("dialogs.unassignDeviceFromCollection", { id: collection.activeDeviceStats.id, collection: collection.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassignDevice} color="primary">
					{t("actions.no")}
				</Button>
				<Button onClick={this.handleUnassignDevice} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderDeleteDialog = () => {
		const { openDelete } = this.state
		const { t } = this.props
		return (
			<Dialog
				open={openDelete}
				onClose={this.handleCloseDeleteDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{t("dialogs.delete.title.collection")}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{t("dialogs.delete.message.collection", { collection: this.state.collection.name })}
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleCloseDeleteDialog} color="primary">
						{t("actions.cancel")}
					</Button>
					<Button onClick={this.handleDeleteCollection} color="primary" autoFocus>
						{t("actions.yes")}
					</Button>
				</DialogActions>
			</Dialog>
		)
	}

	render() {
		const { history, t, classes, accessLevel } = this.props
		const { collection, loading, loadingData } = this.state
		return (
			!loading ?
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<AssignDevice
						collectionId={this.state.collection.id}
						orgId={this.state.collection.org.id}
						handleCancel={this.handleCancelAssignDevice}
						handleClose={this.handleCloseAssignDevice}
						open={this.state.openAssignDevice}
						t={t}
					/>
					<AssignProject
						collectionId={[this.state.collection]}
						open={this.state.openAssign}
						handleClose={this.handleCloseAssignProject}
						handleCancel={this.handleCancelAssignProject}
						t={t}
					/>
					<AssignOrg
						collections
						collectionId={[this.state.collection]}
						open={this.state.openAssignOrg}
						handleClose={this.handleCloseAssignOrg}
						t={t}
					/>
					{collection.activeDeviceStats ? this.renderConfirmUnassign() : null}
					{this.renderDeleteDialog()}
					{/* {this.renderAssignDevice()} */}
					<ItemGrid xs={12} noMargin>
						<CollectionDetails
							collection={collection}
							history={this.props.history}
							match={this.props.match}
							handleOpenAssignProject={this.handleOpenAssignProject}
							handleOpenUnassignDevice={this.handleOpenUnassignDevice}
							handleOpenAssignOrg={this.handleOpenAssignOrg}
							handleOpenDeleteDialog={this.handleOpenDeleteDialog}
							handleOpenAssignDevice={this.handleOpenAssignDevice}
							t={t}
							accessLevel={this.props.accessLevel}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<CollectionData
							loading={loadingData}
							collection={collection}
							classes={classes}
							t={t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<CollectionActiveDevice
							collection={collection}
							history={history}
							device={collection.activeDeviceStats ? collection.activeDeviceStats : null}
							accessLevel={accessLevel}
							classes={classes}
							t={t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin>
						<CollectionHistory
							classes={classes}
							collection={collection}
							history={this.props.history}
							match={this.props.match}
							t={t}
						/>
					</ItemGrid>
				</GridContainer>
				: this.renderLoader()
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(collectionStyles)(Collection))
