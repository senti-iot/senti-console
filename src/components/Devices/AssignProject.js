import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { headerColor } from 'assets/jss/material-dashboard-react';
import cx from "classnames";
import { getAllProjects } from 'variables/data';

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
};

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class AssignProject extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 projects: []
	  }
	}

	componentDidMount = async () => {
		await getAllProjects().then(rs => { console.log(rs); return this.setState({ projects: rs })})
	}
	

	render() {
		const { classes, open } = this.props;
		const appBarClasses = cx({
			[" " + classes['primary']]: 'primary'
		});
		return (
			<div>
				{/* <Button onClick={this.handleClickOpen}>Open full-screen dialog</Button> */}
				<Dialog
					fullScreen
					open={open}
					onClose={this.handleClose}
					TransitionComponent={Transition}
				>
					<AppBar className={classes.appBar + appBarClasses}>
						<Toolbar>
							<IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
								<CloseIcon />
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>
								Projects
  						</Typography>
							<Button color="inherit" onClick={this.props.handleClose}>
								save
  						</Button>
						</Toolbar>
					</AppBar>
					<List>
						{this.state.projects ? this.state.projects.map((p, i) => (
							<Fragment key={i}>
								<ListItem button>
									<ListItemText primary={p.title} secondary={p.user.organisation}/>
								</ListItem>
								<Divider/>
							</Fragment>
						)
						) : null}
						{/* <ListItem button> */}
						{/* <ListItemText primary="Phone ringtone" secondary="Titania" /> */}
						{/* </ListItem> */}
						{/* <Divider /> */}
						{/* <ListItem button> */}
						{/* <ListItemText primary="Default notification ringtone" secondary="Tethys" /> */}
						{/* </ListItem> */}
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