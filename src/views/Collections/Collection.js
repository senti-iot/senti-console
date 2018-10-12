import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid } from 'components';
import AssignOrg from 'components/Devices/AssignOrg';
import AssignProject from 'components/Devices/AssignProject';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCollection, updateCollection } from 'variables/dataCollections';
import { dateFormatter } from 'variables/functions';
import CollectionActiveDevice from 'views/Collections/CollectionCards/CollectionActiveDevice';
import CollectionData from 'views/Collections/CollectionCards/CollectionData';
import CollectionDetails from 'views/Collections/CollectionCards/CollectionDetails';
import CollectionHistory from 'views/Collections/CollectionCards/CollectionHistory';
import { getProject } from 'variables/dataProjects';

// import moment from 'moment'
class Collection extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collection: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassign: false,
			openAssignOrg: false,
			img: null,
			filter: {
				startDate: "",
				endDate: ""
			}
		}
		props.setHeader('', true, `/collections/list`, "collections")
	}

	getCollection = async (id) => {
		await getCollection(id).then(async rs => {
			if (rs === null)
				this.props.history.push('/404')
			else {
				this.setState({ collection: rs })
				this.props.setHeader(rs.name ? rs.name : rs.id, true, `/collections/list`, "collections")
				if (rs.project.id) {
					let project = await getProject(rs.project.id)
					console.log(project)
					this.setState({ collection: { ...this.state.collection, project: project }, loading: false })
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
				s("snackbars.unassignCollection", { collection: name + "(" + id + ")", org: this.state.collection.org.name })
				break
			case 2:
				s("snackbars.assignCollection", { collection: name + "(" + id + ")", org: this.state.collection.org.name })
				break
			case 3:
				s("snackbars.failedUnassign")
				break
			default:
				break
		}
	}

	handleOpenAssignOrg = () => {
		this.setState({ openAssignOrg: true, anchorEl: null })
	}

	handleCloseAssignOrg = async (reload) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null })
			await this.getCollection(this.state.collection.id).then(() => {
				this.snackBarMessages(2)
			})
		}
		this.setState({ openAssignOrg: false })
	}
	handleOpenAssignProject = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}

	handleCloseAssignProject = async (reload) => {
		if (reload) {
			this.setState({ loading: true, anchorEl: null })
			this.snackBarMessages(2)
			await this.getCollection(this.state.collection.id)
		}
		this.setState({ openAssign: false })
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

	handleOpenUnassign = () => {
		this.setState({
			openUnassign: true
		})
	}

	handleCloseUnassign = () => {
		this.setState({
			openUnassign: false
		})
	}

	handleUnassignOrg = async () => {
		await updateCollection({ ...this.state.collection, org: { id: 0 } }).then(async rs => {
			if (rs) {
				this.handleCloseUnassign()
				this.setState({ loading: true, anchorEl: null })
				await this.getCollection(this.state.collection.id)
				this.snackBarMessages(1)
			}
			else {
				this.setState({ loading: false, anchorEl: null })
				this.snackBarMessages(3)
			}
		})
	}

	// renderImageLoader = () => {
	// 	return <CircularLoader notCentered />
	// }

	renderLoader = () => {
		return <CircularLoader />
	}

	renderConfirmUnassign = () => {
		const { t } = this.props
		const { collection } = this.state
		return <Dialog
			open={this.state.openUnassign}
			onClose={this.handleCloseUnassign}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("dialogs.unassignTitle", { what: t("collections.fields.organisation") })}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("dialogs.unassign", { id: collection.id, name: collection.name, what: collection.org.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassign} color="primary">
					{t("actions.no")}
				</Button>
				<Button onClick={this.handleUnassignOrg} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}

	render() {
		const { history, t, classes, accessLevel } = this.props
		const { collection, loading, loadingData } = this.state
		return (
			!loading ?
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<AssignProject
						collectionId={[this.state.collection]}
						open={this.state.openAssign}
						handleClose={this.handleCloseAssignProject}
						t={t}
					/>
					<AssignOrg
						collections
						collectionId={[this.state.collection]}
						open={this.state.openAssignOrg}
						handleClose={this.handleCloseAssignOrg}
						t={t}
					/>
					{collection.org.id ? this.renderConfirmUnassign() : null}
					<ItemGrid xs={12} noMargin>
						<CollectionDetails
							collection={collection}
							history={this.props.history}
							match={this.props.match}
							handleOpenAssignProject={this.handleOpenAssignProject}
							handleOpenUnassign={this.handleOpenUnassign}
							handleOpenAssignOrg={this.handleOpenAssignOrg}
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
