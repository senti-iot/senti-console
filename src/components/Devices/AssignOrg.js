import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles } from "@material-ui/core";
import { Close } from 'variables/icons';
import { headerColor, hoverColor, primaryColor } from 'assets/jss/material-dashboard-react';
import cx from "classnames";
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getAllOrgs } from 'variables/dataOrgs';
import { updateDevice } from 'variables/dataDevices'
import { updateCollection } from 'variables/dataCollections';

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

class AssignOrg extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			Orgs: [],
			selectedOrg: null
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
		await getAllOrgs().then(rs => this._isMounted ? this.setState({ Orgs: rs }) : null)
	}
	componentWillUnmount = () => {
	  this._isMounted = 0
	}
	

	selectOrg = pId => e => {
		e.preventDefault()
		if (this.state.selectedOrg === pId)
			this.setState({ selectedOrg: null })
		else { this.setState({ selectedOrg: pId }) }
		
	}
	assignOrg = async () => {
		if (this.props.devices)
			this.props.deviceId.forEach(async element => {
				await updateDevice({ ...element, org: { id: this.state.selectedOrg } }).then(rs => rs)
			});
		if (this.props.collections)
			this.props.collectionId.forEach(async e => {
				await updateCollection({ ...e, org: { id: this.state.selectedOrg } }).then(rs => rs)
			})
		// if (Array.isArray(this.props.deviceId))
		// {
		// 	this.props.deviceId.map(async id => await assignOrgToDevice({ Org_id: this.state.selectedOrg, id: id }))
		// }
		// else {
		// 	await assignOrgToDevice({ Org_id: this.state.selectedOrg, id: this.props.id });
		// }
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
								{t("orgs.pageTitle")}
  						</Typography>
							<Button color="inherit" onClick={this.assignOrg}>
								{t("actions.save")}
  						</Button>
						</Toolbar>
					</AppBar>
					<List>
						{this.state.Orgs ? this.state.Orgs.map((p, i) => (
							<Fragment key={i}>
								<ListItem button onClick={this.selectOrg(p.id)} value={p.id}
									classes={{
										root: this.state.selectedOrg === p.id ? classes.selectedItem : null
									}}
								>
									<ListItemText primaryTypographyProps={{
										className: this.state.selectedOrg === p.id ? classes.selectedItemText : null }}
									secondaryTypographyProps={{
										classes: { root: this.state.selectedOrg === p.id ? classes.selectedItemText : null } }}
									primary={p.name} /* secondary={p.user.organisation} */ />
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

AssignOrg.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssignOrg);