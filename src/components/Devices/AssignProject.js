import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { ListItem, ListItemText, List } from "@material-ui/core"
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItem from '@material-ui/core/ListItem';
// import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { headerColor, primaryColor, hoverColor } from 'assets/jss/material-dashboard-react';
import cx from "classnames";
import { getAllProjects, assignProjectToDevice } from 'variables/data';

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
		await getAllProjects().then(rs => this.setState({ projects: rs }))
	}

	selectProject = pId => e => {
		e.preventDefault()
		if (this.state.selectedProject === pId)
			this.setState({ selectedProject: null })
		else { this.setState({ selectedProject: pId }) }
		
	}
	assignProject = async () => {
		//Todo Snackbar success
		if (Array.isArray(this.props.device_id))
		{
			console.log('Arrayed')	
			this.props.device_id.map(async id => await assignProjectToDevice({ project_id: this.state.selectedProject, id: id }))
		}
		else {
			console.log('crapped');
			await assignProjectToDevice({ project_id: this.state.selectedProject, id: this.props.device_id });
		}
		this.props.handleClose(true)
	}
	closeDialog = () => {
		this.props.handleClose(false)
	}
	render() {
		const { classes, open } = this.props;
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
								<CloseIcon />
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>
								Projects
  						</Typography>
							<Button color="inherit" onClick={this.assignProject}>
								save
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