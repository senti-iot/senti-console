import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles } from "@material-ui/core";
import { Close } from '@material-ui/icons';
import { headerColor, hoverColor, primaryColor } from 'assets/jss/material-dashboard-react';
import cx from "classnames";
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { assignProjectToDevice } from 'variables/dataDevices';
import { getAllProjects } from 'variables/dataProjects';

const styles = {
	appBar: {
		position: 'relative',
		backgroundColor: headerColor,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		width: "100%",
		paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// borderRadius: "3px",
		padding: "10px 0",
		transition: "all 150ms ease 0s",
		minHeight: "50px",
		display: "block"
	},
	flex: {
		flex: 1,
	},
	selectedItem: {
		background: primaryColor,
		"&:hover": {
			background: hoverColor
		}
		// color: "#fff"
	},
	selectedItemText: {
		color: "#FFF"
	}
};

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class AssignProject extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			projects: [],
			selectedProject: null
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
		await getAllProjects().then(rs => this._isMounted ? this.setState({ projects: rs }) : null)
	}
	componentWillUnmount = () => {
	  this._isMounted = 0
	}
	

	selectProject = pId => e => {
		e.preventDefault()
		if (this.state.selectedProject === pId)
			this.setState({ selectedProject: null })
		else { this.setState({ selectedProject: pId }) }
		
	}
	assignProject = async () => {
		//Todo Snackbar success
		if (Array.isArray(this.props.deviceId))
		{
			this.props.deviceId.map(async id => await assignProjectToDevice({ project_id: this.state.selectedProject, id: id }))
		}
		else {
			await assignProjectToDevice({ project_id: this.state.selectedProject, id: this.props.id });
		}
		this.props.handleClose(true)
	}
	closeDialog = () => {
		this.props.handleClose(false)
	}
	render() {
		const { classes, open, t } = this.props;
		const appBarClasses = cx({
			[" " + classes['primary']]: 'primary'
		});
		return (
			<div>
				<Dialog
					fullScreen
					open={open}
					onClose={this.handleClose}
					TransitionComponent={Transition}
				>
					<AppBar className={classes.appBar + appBarClasses}>
						<Toolbar>
							<IconButton color="inherit" onClick={this.closeDialog} aria-label="Close">
								<Close />
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>
								{t("projects.pageTitle")}
  						</Typography>
							<Button color="inherit" onClick={this.assignProject}>
								{t("actions.save")}
  						</Button>
						</Toolbar>
					</AppBar>
					<List>
						{this.state.projects ? this.state.projects.map((p, i) => (
							<Fragment key={i}>
								<ListItem button onClick={this.selectProject(p.id)} value={p.id}
									classes={{
										root: this.state.selectedProject === p.id ? classes.selectedItem : null
									}}
								>
									<ListItemText primaryTypographyProps={{
										className: this.state.selectedProject === p.id ? classes.selectedItemText : null }}
									secondaryTypographyProps={{
										classes: { root: this.state.selectedProject === p.id ? classes.selectedItemText : null } }}
									primary={p.title} secondary={p.user.organisation} />
								</ListItem>
								<Divider />
							</Fragment>
						)
						) : null}
					</List>
				</Dialog>
			</div>
		);
	}
}

AssignProject.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssignProject);