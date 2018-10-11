import React, { Component } from 'react'
import { IconButton, Menu, MenuItem, withStyles, Button, Typography } from '@material-ui/core'
import { ItemGrid, SmallCard } from 'components'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle'
import { MoreVert, Edit, PictureAsPdf, Devices, Delete, LibraryBooks } from 'variables/icons'
import { withRouter } from 'react-router-dom'
import { getProjectImage } from 'variables/dataProjects'

class ProjectCard extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 actionAnchor: null,
		 img: null
	  }
	}

	componentDidMount = async () => {
		this._isMounted = 1
		const { p } = this.props
		let img = await getProjectImage(p.id).then(rs => rs)
		if (this._isMounted)
		{
			if (img)
				this.setState({ img: URL.createObjectURL(img) })
		}
	}

	componentWillUnmount = () => {
	  this._isMounted = 0 
	}
	
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	handleEdit = () => {
	}

	handleDeleteProject = () => {
	}

	render() {
		const { p, classes, t } = this.props
		const { actionAnchor } = this.state
		return (
			<ItemGrid noPadding extraClass={classes.smallCardGrid} noMargin md={4}>
				<div style={{
					margin: 8, /* width: '100%', */ height: "100%" }}>
					<SmallCard
						avatar={<LibraryBooks />}
						key={p.id}
						title={p.title}
						img={this.state.img}
						topAction={
							<ItemGrid noMargin noPadding>
								<IconButton
									aria-label="More"
									aria-owns={actionAnchor ? 'long-menu' : null}
									aria-haspopup="true"
									onClick={this.handleOpenActionsDetails}>
									<MoreVert />
								</IconButton>
								<Menu
									id="long-menu"
									anchorEl={actionAnchor}
									open={Boolean(actionAnchor)}
									onClose={this.handleCloseActionsDetails}
									PaperProps={{
										style: {
											// maxHeight: 200,
											minWidth: 200
										}
									}}>
									<MenuItem onClick={() => this.props.history.push(`/project/${p.id}/edit`)}>
										<Edit className={classes.leftIcon} />{t("menus.editProject")}									
									</MenuItem>
									<MenuItem onClick={() => alert(t("dialogs.warnings.wip"))}>
										<Devices className={classes.leftIcon} />{t("menus.assignDevices")}
									</MenuItem>
									<MenuItem onClick={() => alert(t("dialogs.warnings.wip"))}>
										<PictureAsPdf className={classes.leftIcon} />{t("menus.exportPDF")}
									</MenuItem>
									<MenuItem onClick={() => alert(t("dialogs.warnings.wip"))}>
										<Delete className={classes.leftIcon} />{t("menus.deleteProject")}
									</MenuItem>
									))}
								</Menu>
							</ItemGrid>
						}
						content={<Typography noWrap>{p.description}</Typography>}
						rightActions={
							<Button variant={'flat'} color={'primary'} onClick={() => this.props.history.push(`/project/${p.id}`)}>
								{t("menus.seeMore")}
							</Button>
						}
					/>
				</div>
			</ItemGrid>
		)
	}
}

export default withRouter(withStyles(regularCardStyle)(ProjectCard))
