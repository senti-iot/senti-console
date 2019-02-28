import React, { Component } from 'react'
import classNames from 'classnames'
import { Drawer, IconButton } from '@material-ui/core';
import { drawerWidth, transition } from 'assets/jss/material-dashboard-react';
import { withStyles } from '@material-ui/core/styles';


import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { connect } from 'react-redux'
import { changeSmallMenu } from 'redux/appState';
const styles = theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		...transition,
		// transition: theme.transitions.create(['width', 'margin'], {
		// 	easing: theme.transitions.easing.sharp,
		// 	duration: theme.transitions.duration.leavingScreen,
		// }),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		...transition,
		// transition: theme.transitions.create(['width', 'margin'], {
		// 	easing: theme.transitions.easing.sharp,
		// 	duration: theme.transitions.duration.enteringScreen,
		// }),
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawerPaper: {
		top: 70,
	},
	drawer: {
		top: 70,
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		...transition
		// transition: theme.transitions.create('width', {
		// 	easing: theme.transitions.easing.sharp,
		// 	duration: theme.transitions.duration.enteringScreen,
		// }),
	},
	drawerClose: {
		// transition: theme.transitions.create('width', {
		// 	easing: theme.transitions.easing.sharp,
		// 	duration: theme.transitions.duration.leavingScreen,
		// }),
		...transition,
		overflowX: 'hidden',
		width: theme.spacing.unit * 7 + 1,
		// [theme.breakpoints.up('sm')]: {
		// 	width: theme.spacing.unit * 9 + 1,
		// },
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
	},
});
class NewSidebar extends Component {

	handleDrawerClose = () => {
		this.props.changeSmallMenu(!this.props.smallMenu)
	};

	render() {
		const { classes, theme, smallMenu } = this.props;
		return (
			<Drawer
				variant="permanent"
				className={classNames(classes.drawer, {
					[classes.drawerOpen]: smallMenu,
					[classes.drawerClose]: !smallMenu,
				})}
				classes={{
					paper: classNames({
						[classes.drawerOpen]: smallMenu,
						[classes.drawerPaper]: true,
						[classes.drawerClose]: !smallMenu,
					}),
				}}
				open={smallMenu}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={this.handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{['All mail', 'Trash', 'Spam'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Drawer>
		);
	}
}
const mapStateToProps = (state) => ({
	smallMenu: state.appState.smallMenu
})

const mapDispatchToProps = dispatch => ({
	changeSmallMenu: val => dispatch(changeSmallMenu(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NewSidebar))
